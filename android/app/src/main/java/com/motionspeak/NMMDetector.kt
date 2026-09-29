package com.motionspeak

import kotlin.math.abs

/**
 * Converts continuous facial signals into named Non-Manual Marker flags.
 *
 * Inputs (per frame):
 *   - browInnerUp   : Float   (from MediaPipe blendshapes)
 *   - browDownAvg   : Float   (avg of browDownLeft + browDownRight)
 *   - yawProxy      : Float   (head rotation proxy from landmark geometry)
 *
 * Outputs (per frame):
 *   NMMFlags { brow_raise, brow_furrow, head_shake }
 *
 * Design:
 *   - Smoothing: exponential moving average over the last N samples.
 *   - Baseline:  brow_furrow uses a personal baseline captured in the
 *                first BASELINE_FRAMES frames (browDownAvg rest position
 *                varies per-person: 0.10 to 0.40 observed).
 *   - Sticky:    once a flag fires, it stays true for HOLD_MS, then resets.
 *                This matches how NMMs are consumed by the grammar layer.
 *
 * Thresholds derived from calibration on Pixel 7 emulator, 2026-09-30:
 *   Neutral    browInnerUp≈0.001   browDownAvg≈0.23-0.26   yaw -0.03..-0.02
 *   Raised     browInnerUp 0.72-0.84  (zero overlap with neutral)
 *   Furrowed   browDownAvg 0.67-0.72  (neutral baseline 0.23-0.26)
 *   Shake      yaw oscillates -1.24 to +0.42 at ~1 cycle/sec
 */
class NMMDetector {

    data class NMMFlags(
        val brow_raise: Boolean,
        val brow_furrow: Boolean,
        val head_shake: Boolean
    )

    companion object {
        // Smoothing
        private const val SMOOTH_WINDOW = 8

        // brow_raise: fixed threshold, huge margin observed
        private const val BROW_RAISE_THRESHOLD = 0.35f

        // brow_furrow: relative to personal baseline
        private const val BROW_FURROW_DELTA = 0.25f

        // Baseline capture
        private const val BASELINE_FRAMES = 30

        // head_shake: zero-crossing frequency detection
        private const val SHAKE_WINDOW_MS = 1000L
        private const val SHAKE_MIN_CROSSINGS = 3

        // Sticky hold
        private const val HOLD_MS = 500L

        // Require N consecutive above-threshold samples to fire
        private const val CONSECUTIVE_REQUIRED = 3
    }

    // Smoothing buffers (ring buffer via ArrayDeque)
    private val browInnerHistory = ArrayDeque<Float>(SMOOTH_WINDOW)
    private val browDownHistory = ArrayDeque<Float>(SMOOTH_WINDOW)

    // Head-shake detection: recent yaw values with timestamps
    private data class YawSample(val value: Float, val timeMs: Long)
    private val yawHistory = ArrayDeque<YawSample>(64)

    // Baseline calibration
    private var baselineFramesCollected = 0
    private var browDownBaselineSum = 0f
    private var browDownBaseline: Float = 0f
    private var baselineReady = false

    // Consecutive-above counters
    private var browRaiseStreak = 0
    private var browFurrowStreak = 0

    // Sticky hold timestamps (last time each flag fired)
    private var browRaiseUntilMs = 0L
    private var browFurrowUntilMs = 0L
    private var headShakeUntilMs = 0L

    /**
     * Feed one frame's signals. Returns the current NMM flags.
     * Safe to call at any rate; timestamps are internal.
     */
    fun update(
        browInnerUp: Float,
        browDownAvg: Float,
        yawProxy: Float,
        nowMs: Long = System.currentTimeMillis()
    ): NMMFlags {

        // --- Smoothing ---
        push(browInnerHistory, browInnerUp)
        push(browDownHistory, browDownAvg)
        val smoothInner = average(browInnerHistory)
        val smoothDown = average(browDownHistory)

        // --- Baseline capture (brow_furrow reference) ---
        if (!baselineReady) {
            browDownBaselineSum += smoothDown
            baselineFramesCollected++
            if (baselineFramesCollected >= BASELINE_FRAMES) {
                browDownBaseline = browDownBaselineSum / BASELINE_FRAMES
                baselineReady = true
            }
        }

        // --- brow_raise: fixed threshold, 3 consecutive ---
        if (smoothInner > BROW_RAISE_THRESHOLD) {
            browRaiseStreak++
        } else {
            browRaiseStreak = 0
        }
        if (browRaiseStreak >= CONSECUTIVE_REQUIRED) {
            browRaiseUntilMs = nowMs + HOLD_MS
        }

        // --- brow_furrow: baseline-relative, 3 consecutive ---
        val furrowThreshold = browDownBaseline + BROW_FURROW_DELTA
        if (baselineReady && smoothDown > furrowThreshold) {
            browFurrowStreak++
        } else {
            browFurrowStreak = 0
        }
        if (browFurrowStreak >= CONSECUTIVE_REQUIRED) {
            browFurrowUntilMs = nowMs + HOLD_MS
        }

        // --- head_shake: count sign flips in rolling window ---
        yawHistory.addLast(YawSample(yawProxy, nowMs))
        while (yawHistory.isNotEmpty() && nowMs - yawHistory.first().timeMs > SHAKE_WINDOW_MS) {
            yawHistory.removeFirst()
        }
        if (detectShakeInWindow()) {
            headShakeUntilMs = nowMs + HOLD_MS
        }

        // --- Emit sticky flags ---
        return NMMFlags(
            brow_raise = nowMs < browRaiseUntilMs,
            brow_furrow = nowMs < browFurrowUntilMs,
            head_shake = nowMs < headShakeUntilMs
        )
    }

    /**
     * Shake detection by zero-crossing frequency.
     *
     * A natural head shake crosses yaw=0 repeatedly at ~4-6 Hz. Idle
     * head motion and slow turns produce 0-1 crossings per second. We
     * count zero-crossings in a rolling 1-second window and require
     * SHAKE_MIN_CROSSINGS to fire.
     *
     * This is far more robust than amplitude thresholds because fast
     * shakes produce shallow per-frame peaks (MediaPipe samples you
     * mid-motion), so magnitude alone is unreliable.
     */
    private fun detectShakeInWindow(): Boolean {
        if (yawHistory.size < 4) return false

        var crossings = 0
        var prev = yawHistory.first().value
        var prevSign = Math.signum(prev)

        for (sample in yawHistory) {
            val v = sample.value
            val s = Math.signum(v)
            // Sign changed (ignoring zero)
            if (s != 0f && prevSign != 0f && s != prevSign) {
                crossings++
            }
            if (s != 0f) prevSign = s
            prev = v
        }

        return crossings >= SHAKE_MIN_CROSSINGS
    }

    // --- Small helpers ---

    private fun push(buf: ArrayDeque<Float>, v: Float) {
        buf.addLast(v)
        if (buf.size > SMOOTH_WINDOW) buf.removeFirst()
    }

    private fun average(buf: ArrayDeque<Float>): Float {
        if (buf.isEmpty()) return 0f
        var sum = 0f
        for (v in buf) sum += v
        return sum / buf.size
    }

    /** For tests: reset the internal state. */
    fun reset() {
        browInnerHistory.clear()
        browDownHistory.clear()
        yawHistory.clear()
        baselineFramesCollected = 0
        browDownBaselineSum = 0f
        browDownBaseline = 0f
        baselineReady = false
        browRaiseStreak = 0
        browFurrowStreak = 0
        browRaiseUntilMs = 0L
        browFurrowUntilMs = 0L
        headShakeUntilMs = 0L
    }
}