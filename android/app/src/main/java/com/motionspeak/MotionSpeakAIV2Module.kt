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
                out.putDouble("browInnerUp",   (faceHelper.getBlendshapeByName(result, "browInnerUp")   ?: 0f).toDouble())
                out.putDouble("browDownLeft",  (faceHelper.getBlendshapeByName(result, "browDownLeft")  ?: 0f).toDouble())
                out.putDouble("browDownRight", (faceHelper.getBlendshapeByName(result, "browDownRight") ?: 0f).toDouble())
            } else {
                out.putInt("blendshapeCount", 0)
                out.putDouble("browInnerUp", 0.0)
                out.putDouble("browDownLeft", 0.0)
                out.putDouble("browDownRight", 0.0)
            }

            Log.d(TAG, "[Phase 1 Probe] didInit=true, didDetect=${out.getBoolean("didDetect")}, " +
                    "blendshapeCount=${out.getInt("blendshapeCount")}, " +
                    "browInnerUp=${out.getDouble("browInnerUp")}")

            promise.resolve(out)
        } catch (e: Exception) {
            Log.e(TAG, "[Phase 1 Probe] error: ${e.message}", e)
            promise.reject("PROBE_ERROR", e.message, e)
        }
    }
}