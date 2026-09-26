import { create } from 'zustand';

export interface TranslationResult {
  label: string;
  labelFil: string;
  confidence: number;
  timestamp: number;
}

interface AppState {
  isCameraActive: boolean;
  setCameraActive: (val: boolean) => void;

  currentTranslation: TranslationResult | null;
  translationHistory: TranslationResult[];
  setCurrentTranslation: (result: TranslationResult | null) => void;
  clearHistory: () => void;

  // Sentence builder
  sentence: string;
  sentenceFil: string;
  // LLM-processed versions — populated when AI converts raw words to proper sentence
  processedSentence: string;
  processedSentenceFil: string;
  isLLMProcessed: boolean;
  appendToSentence: (label: string, labelFil: string) => void;
  clearSentence: () => void;
  setProcessedSentence: (en: string, fil: string) => void;

  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  fontScale: number;
  setFontScale: (val: number) => void;

  ttsEnabled: boolean;
  setTtsEnabled: (val: boolean) => void;
  ttsSpeed: number;
  setTtsSpeed: (val: number) => void;
  ttsLanguage: 'en' | 'fil';
  setTtsLanguage: (val: 'en' | 'fil') => void;

  displayLanguage: 'en' | 'fil';
  setDisplayLanguage: (val: 'en' | 'fil') => void;
  showLandmarks: boolean;
  setShowLandmarks: (val: boolean) => void;
  confidenceThreshold: number;
  setConfidenceThreshold: (val: number) => void;

  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isCameraActive: false,
  setCameraActive: (val) => set({ isCameraActive: val }),

  currentTranslation: null,
  translationHistory: [],
  setCurrentTranslation: (result) => {
    if (result) {
      set((state) => ({
        currentTranslation: result,
        translationHistory: [result, ...state.translationHistory].slice(0, 50),
      }));
    } else {
      set({ currentTranslation: null });
    }
  },
  clearHistory: () => set({ translationHistory: [], currentTranslation: null }),

  // Sentence builder
  sentence: '',
  sentenceFil: '',
  processedSentence: '',
  processedSentenceFil: '',
  isLLMProcessed: false,
  appendToSentence: (label, labelFil) =>
    set((state) => ({
      sentence: state.sentence ? state.sentence + ' ' + label : label,
      sentenceFil: state.sentenceFil ? state.sentenceFil + ' ' + labelFil : labelFil,
      // Reset LLM state when new word is added
      isLLMProcessed: false,
      processedSentence: '',
      processedSentenceFil: '',
    })),
  clearSentence: () =>
    set({
      sentence: '',
      sentenceFil: '',
      processedSentence: '',
      processedSentenceFil: '',
      isLLMProcessed: false,
    }),
  setProcessedSentence: (en, fil) =>
    set({
      processedSentence: en,
      processedSentenceFil: fil,
      isLLMProcessed: true,
    }),

  darkMode: false,
  setDarkMode: (val) => set({ darkMode: val }),
  fontScale: 1.0,
  setFontScale: (val) => set({ fontScale: val }),

  ttsEnabled: true,
  setTtsEnabled: (val) => set({ ttsEnabled: val }),
  ttsSpeed: 0.5,
  setTtsSpeed: (val) => set({ ttsSpeed: val }),
  ttsLanguage: 'fil',
  setTtsLanguage: (val) => set({ ttsLanguage: val }),

  displayLanguage: 'fil',
  setDisplayLanguage: (val) => set({ displayLanguage: val }),
  showLandmarks: true,
  setShowLandmarks: (val) => set({ showLandmarks: val }),
  confidenceThreshold: 0.85,
  setConfidenceThreshold: (val) => set({ confidenceThreshold: val }),

  isProcessing: false,
  setIsProcessing: (val) => set({ isProcessing: val }),
}));