import { create } from 'zustand';

export interface TranslationResult {
  label: string;
  labelFil: string;
  confidence: number;
  timestamp: number;
}

interface AppState {
  // Camera
  isCameraActive: boolean;
  setCameraActive: (val: boolean) => void;

  // Translation
  currentTranslation: TranslationResult | null;
  translationHistory: TranslationResult[];
  setCurrentTranslation: (result: TranslationResult | null) => void;
  clearHistory: () => void;

  // Settings
  confidenceThreshold: number;
  setConfidenceThreshold: (val: number) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (val: boolean) => void;
  ttsLanguage: 'en' | 'fil';
  setTtsLanguage: (val: 'en' | 'fil') => void;
  showLandmarks: boolean;
  setShowLandmarks: (val: boolean) => void;
  displayLanguage: 'en' | 'fil' | 'both';
  setDisplayLanguage: (val: 'en' | 'fil' | 'both') => void;

  // UI
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Camera
  isCameraActive: false,
  setCameraActive: (val) => set({ isCameraActive: val }),

  // Translation
  currentTranslation: null,
  translationHistory: [],
  setCurrentTranslation: (result) => {
    if (result) {
      set((state) => ({
        currentTranslation: result,
        translationHistory: [result, ...state.translationHistory].slice(0, 50), // Keep last 50
      }));
    } else {
      set({ currentTranslation: null });
    }
  },
  clearHistory: () => set({ translationHistory: [], currentTranslation: null }),

  // Settings
  confidenceThreshold: 0.85,
  setConfidenceThreshold: (val) => set({ confidenceThreshold: val }),
  ttsEnabled: true,
  setTtsEnabled: (val) => set({ ttsEnabled: val }),
  ttsLanguage: 'en',
  setTtsLanguage: (val) => set({ ttsLanguage: val }),
  showLandmarks: true,
  setShowLandmarks: (val) => set({ showLandmarks: val }),
  displayLanguage: 'both',
  setDisplayLanguage: (val) => set({ displayLanguage: val }),

  // UI
  isProcessing: false,
  setIsProcessing: (val) => set({ isProcessing: val }),
}));