package com.motionspeak

import android.graphics.Bitmap
import android.os.Handler
import android.os.Looper
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

/**
 * Bridge between the camera view (owned by the UI thread) and the AI
 * pipeline (called from the NativeModules thread).
 *
 * Grabs a bitmap from the currently-rendered CameraView, hopping to the
 * UI thread because TextureView.getBitmap() requires it.
 *
 * Isolated so that swapping the camera implementation (e.g., to CameraX
 * or Vision Camera) only requires changing this file.
 */
object CameraFrameProvider {

    private const val UI_THREAD_TIMEOUT_MS = 500L

    /**
     * Returns the current preview frame as a Bitmap, or null if:
     *   - no CameraView is currently rendered
     *   - the TextureView isn't ready yet
     *   - the UI thread call times out
     */
    fun grabFrame(): Bitmap? {
        val view = CameraView.activeInstance ?: return null

        var result: Bitmap? = null
        val latch = CountDownLatch(1)

        Handler(Looper.getMainLooper()).post {
            try {
                result = view.getCurrentFrame()
            } finally {
                latch.countDown()
            }
        }

        return try {
            if (latch.await(UI_THREAD_TIMEOUT_MS, TimeUnit.MILLISECONDS)) {
                result
            } else {
                null
            }
        } catch (e: InterruptedException) {
            null
        }
    }
}