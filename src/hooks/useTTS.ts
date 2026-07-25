import { useCallback } from 'react';
import { NativeModules } from 'react-native';
import { useAppStore } from '../store/useAppStore';

const { TTSModule } = NativeModules;

export const useTTS = () => {
  const { ttsEnabled, ttsLanguage, ttsSpeed } = useAppStore();

  const speak = useCallback(
    (englishText: string, filipinoText?: string) => {
      if (!ttsEnabled) return;
      const textToSpeak =
        ttsLanguage === 'fil' && filipinoText ? filipinoText : englishText;
      const lang = ttsLanguage === 'fil' ? 'fil-PH' : 'en-US';
      try {
        TTSModule?.setRate?.(ttsSpeed);
        TTSModule?.speak?.(textToSpeak, lang);
      } catch (e) {
        console.warn('TTS error:', e);
      }
    },
    [ttsEnabled, ttsLanguage, ttsSpeed]
  );

  const stop = useCallback(() => {
    try { TTSModule?.stop?.(); } catch (e) {}
  }, []);

  return { speak, stop };
};