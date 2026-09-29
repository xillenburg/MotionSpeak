package com.motionspeak

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap

/**
 * Phase 1 test module for the research pipeline.
 *
 * Exposes one method: probeBlendshapes() which:
 *   1. Synthesizes a test bitmap
 *   2. Runs FaceLandmarker on it
 *   3. Returns the blendshape status to JS
 *
 * This is a SCAFFOLD. It proves the MediaPipe Tasks pipeline works end-to-end
 * on-device before we build the real camera integration in Phase 2.
 */
class MotionSpeakAIV2Module(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "MotionSpeakAI"
    }

    private val faceHelper = FaceLandmarkerHelper(reactContext)
    private val nmmDetector = NMMDetector()

    override fun getName(): String = "MotionSpeakAIV2"

    @ReactMethod
    fun probeBlendshapes(promise: Promise) {
        try {
            val bitmap = Bitmap.createBitmap(512, 512, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            canvas.drawColor(Color.GRAY)

            val result = faceHelper.detect(bitmap)

            val out: WritableMap = Arguments.createMap()
            out.putBoolean("didInit", true)
            out.putBoolean("didDetect", result != null && result.faceBlendshapes().isPresent)

            if (result != null && result.faceBlendshapes().isPresent) {
                val bs = faceHelper.extractBlendshapes(result)
                out.putInt("blendshapeCount", bs?.size ?: 0)
                out.putDouble(
                    "browInnerUp",
                    (faceHelper.getBlendshapeByName(result, "browInnerUp") ?: 0f).toDouble()
                )
                out.putDouble(
                    "browDownLeft",
                    (faceHelper.getBlendshapeByName(result, "browDownLeft") ?: 0f).toDouble()
                )
                out.putDouble(
                    "browDownRight",
                    (faceHelper.getBlendshapeByName(result, "browDownRight") ?: 0f).toDouble()
                )
            } else {
                out.putInt("blendshapeCount", 0)
                out.putDouble("browInnerUp", 0.0)
                out.putDouble("browDownLeft", 0.0)
                out.putDouble("browDownRight", 0.0)
            }

            Log.d(
                TAG, "[Phase 1 Probe] didInit=true, didDetect=${out.getBoolean("didDetect")}, " +
                        "blendshapeCount=${out.getInt("blendshapeCount")}, " +
                        "browInnerUp=${out.getDouble("browInnerUp")}"
            )

            promise.resolve(out)
        } catch (e: Exception) {
            Log.e(TAG, "[Phase 1 Probe] error: ${e.message}", e)
            promise.reject("PROBE_ERROR", e.message, e)
        }
    }

    /**
     * Grab a live frame from the active camera, run FaceLandmarker on it,
     * and return the blendshape coefficients as a WritableMap.
     *
     * The flow is:
     *   UI thread ─→ CameraView.getCurrentFrame()
     *   → Base64FrameCodec.encode()  [downscale to 256px + PNG base64]
     *   → JS bridge
     *   → Base64FrameCodec.decode()
     *   → FaceLandmarkerHelper.detect()
     *   → BlendshapeExtractor.extract()
     *   → WritableMap to JS
     *
     * Phase 3 will replace base64 with a direct in-native call.
     */
    @ReactMethod
    fun probeLiveFrame(promise: Promise) {
        try {
            val frame = CameraFrameProvider.grabFrame()
            if (frame == null) {
                val out = Arguments.createMap()
                out.putBoolean("didDetect", false)
                out.putString("reason", "no_frame")
                promise.resolve(out)
                return
            }

            val base64 = Base64FrameCodec.encode(frame)
            if (base64 == null) {
                val out = Arguments.createMap()
                out.putBoolean("didDetect", false)
                out.putString("reason", "encode_failed")
                promise.resolve(out)
                return
            }

            val decoded = Base64FrameCodec.decode(base64) ?: frame
            val result = faceHelper.detect(decoded)

            val blendshapes = BlendshapeExtractor.extract(result)
            val keyPoints = FaceLandmarkExtractor.extractKeyPoints(result)

            val out = Arguments.createMap()
            out.putBoolean("didDetect", blendshapes.isNotEmpty())
            out.putInt("blendshapeCount", blendshapes.size)

            if (blendshapes.isNotEmpty()) {
                val bsMap = Arguments.createMap()
                for ((k, v) in blendshapes) bsMap.putDouble(k, v.toDouble())
                out.putMap("blendshapes", bsMap)

                val browInner = blendshapes["browInnerUp"] ?: 0f
                val browDownL = blendshapes["browDownLeft"] ?: 0f
                val browDownR = blendshapes["browDownRight"] ?: 0f
                val browDownAvg = (browDownL + browDownR) / 2f

                val yaw = if (keyPoints != null) FaceLandmarkExtractor.yawProxy(keyPoints) else 0f
                out.putDouble("yawProxy", yaw.toDouble())

                // Feed the NMM detector — it returns sticky flags
                val flags = nmmDetector.update(browInner, browDownAvg, yaw)

                // Put flags into the result map for JS
                val nmmMap = Arguments.createMap()
                nmmMap.putBoolean("brow_raise", flags.brow_raise)
                nmmMap.putBoolean("brow_furrow", flags.brow_furrow)
                nmmMap.putBoolean("head_shake", flags.head_shake)
                out.putMap("nmm", nmmMap)

                Log.d(
                    TAG,
                    "[Calib] inner=%.3f down=%.3f yaw=%+.3f  NMM: raise=%s furrow=%s shake=%s"
                        .format(
                            browInner, browDownAvg, yaw,
                            flags.brow_raise, flags.brow_furrow, flags.head_shake
                        )
                )
            } else {
                Log.d(TAG, "[Live Frame] no face detected")
            }

            if (decoded !== frame) decoded.recycle()

            promise.resolve(out)
        } catch (e: Exception) {
            Log.e(TAG, "[Live Frame] error: ${e.message}", e)
            promise.reject("LIVE_FRAME_ERROR", e.message, e)
        }
    }
}