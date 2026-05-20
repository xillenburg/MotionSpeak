package com.motionspeak

import android.speech.tts.TextToSpeech
import android.speech.tts.TextToSpeech.OnInitListener
import com.facebook.react.bridge.*
import java.util.Locale

class TTSModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), OnInitListener {

    private var tts: TextToSpeech? = null
    private var isReady = false
    private var pendingText: String? = null
    private var currentLocale: Locale = Locale("fil", "PH")

    init {
        tts = TextToSpeech(reactContext, this)
    }

    override fun getName(): String = "TTSModule"

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(currentLocale)
            isReady = result != TextToSpeech.LANG_MISSING_DATA &&
                      result != TextToSpeech.LANG_NOT_SUPPORTED
            pendingText?.let {
                speakText(it)
                pendingText = null
            }
        }
    }

    @ReactMethod
    fun speak(text: String, language: String = "fil-PH") {
        currentLocale = when (language) {
            "en-US" -> Locale.US
            "fil-PH" -> Locale("fil", "PH")
            else -> Locale("fil", "PH")
        }
        tts?.setLanguage(currentLocale)

        if (isReady) {
            speakText(text)
        } else {
            pendingText = text
        }
    }

    @ReactMethod
    fun stop() {
        tts?.stop()
    }

    @ReactMethod
    fun setRate(rate: Float) {
        tts?.setSpeechRate(rate)
    }

    @ReactMethod
    fun setPitch(pitch: Float) {
        tts?.setPitch(pitch)
    }

    private fun speakText(text: String) {
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "motionspeak_tts")
    }

    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}
}