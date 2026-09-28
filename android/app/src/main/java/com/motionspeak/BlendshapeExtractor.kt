package com.motionspeak

import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult

object BlendshapeExtractor {

    fun extract(result: FaceLandmarkerResult?): Map<String, Float> {
        if (result == null) return emptyMap()
        if (result.faceBlendshapes().isEmpty) return emptyMap()
        val categories = result.faceBlendshapes().get().getOrNull(0) ?: return emptyMap()
        val out = LinkedHashMap<String, Float>(categories.size)
        for (i in 0 until categories.size) {
            val cat = categories.get(i)
            out[cat.categoryName()] = cat.score()
        }
        return out
    }

    fun subset(map: Map<String, Float>, keys: List<String>): Map<String, Float> {
        val out = LinkedHashMap<String, Float>(keys.size)
        for (k in keys) out[k] = map[k] ?: 0f
        return out
    }

    val NMM_RELEVANT_KEYS = listOf(
        "browInnerUp",
        "browDownLeft",
        "browDownRight"
    )
}