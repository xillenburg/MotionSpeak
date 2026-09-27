package com.motionspeak

import android.content.Context
import android.graphics.Bitmap
import android.util.Log
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult

/**
 * Thin wrapper around MediaPipe FaceLandmarker.
 *
 * Loads face_landmarker.task from assets and exposes a per-frame detect() call.
 * Also unpacks the 52 blendshape coefficients that MediaPipe FaceLandmarker
 * produces — these are the numbers the NMM detector will consume in Phase 2.
 */
class FaceLandmarkerHelper(context: Context) {

    companion object {
        private const val TAG = "MotionSpeakAI"
        private const val MODEL_ASSET = "face_landmarker.task"
    }

    private var faceLandmarker: FaceLandmarker? = null

    init {
        try {
            val baseOptions = BaseOptions.builder()
                .setModelAssetPath(MODEL_ASSET)
                .build()

            val options = FaceLandmarker.FaceLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setRunningMode(RunningMode.IMAGE)
                .setOutputFaceBlendshapes(true)
                .setOutputFacialTransformationMatrixes(false)
                .setNumFaces(1)
                .build()

            faceLandmarker = FaceLandmarker.createFromOptions(context, options)
            Log.d(TAG, "FaceLandmarker initialized with $MODEL_ASSET")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize FaceLandmarker: ${e.message}", e)
        }
    }

    fun detect(bitmap: Bitmap): FaceLandmarkerResult? {
        val landmarker = faceLandmarker ?: return null
        return try {
            val mpImage = BitmapImageBuilder(bitmap).build()
            landmarker.detect(mpImage)
        } catch (e: Exception) {
            Log.e(TAG, "FaceLandmarker detect error: ${e.message}", e)
            null
        }
    }

    fun extractBlendshapes(result: FaceLandmarkerResult): FloatArray? {
        if (result.faceBlendshapes().isEmpty) return null
        val categories = result.faceBlendshapes().get().get(0)
        val out = FloatArray(categories.size)
        for (i in 0 until categories.size) {
            out[i] = categories.get(i).score()
        }
        return out
    }

    fun getBlendshapeByName(result: FaceLandmarkerResult, name: String): Float? {
        if (result.faceBlendshapes().isEmpty) return null
        val categories = result.faceBlendshapes().get().get(0)
        for (i in 0 until categories.size) {
            if (categories.get(i).categoryName() == name) {
                return categories.get(i).score()
            }
        }
        return null
    }

    fun close() {
        faceLandmarker?.close()
        faceLandmarker = null
    }
}