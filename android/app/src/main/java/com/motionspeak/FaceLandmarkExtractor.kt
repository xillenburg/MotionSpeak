package com.motionspeak

import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult

/**
 * Extract specific face landmark coordinates (normalized [0,1]) from a
 * FaceLandmarkerResult.
 *
 * MediaPipe FaceLandmarker indices we care about:
 *   1    = nose tip
 *   33   = right eye outer corner
 *   263  = left eye outer corner
 */
object FaceLandmarkExtractor {

    data class Landmark(val x: Float, val y: Float, val z: Float)

    data class KeyPoints(
        val nose: Landmark,
        val rightEyeOuter: Landmark,
        val leftEyeOuter: Landmark
    )

    fun extractKeyPoints(result: FaceLandmarkerResult?): KeyPoints? {
        if (result == null) return null

        val faces = result.faceLandmarks()
        if (faces.isEmpty()) return null

        val landmarks = faces[0]
        if (landmarks.size < 264) return null

        val nose = landmarks[1]
        val rightEyeOuter = landmarks[33]
        val leftEyeOuter = landmarks[263]

        return KeyPoints(
            nose = Landmark(nose.x(), nose.y(), nose.z()),
            rightEyeOuter = Landmark(rightEyeOuter.x(), rightEyeOuter.y(), rightEyeOuter.z()),
            leftEyeOuter = Landmark(leftEyeOuter.x(), leftEyeOuter.y(), leftEyeOuter.z())
        )
    }

    fun yawProxy(kp: KeyPoints): Float {
        val eyeMidX = (kp.leftEyeOuter.x + kp.rightEyeOuter.x) / 2f
        val eyeWidth = kotlin.math.abs(kp.leftEyeOuter.x - kp.rightEyeOuter.x)
        if (eyeWidth < 0.001f) return 0f
        return (kp.nose.x - eyeMidX) / eyeWidth
    }
}