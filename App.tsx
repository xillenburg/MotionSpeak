import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { NativeModules } from 'react-native';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Phase 1 verification test
  useEffect(() => {
    const runPhase1Test = async () => {
      try {
        console.log('[Phase 1] Calling MotionSpeakAIV2.probeBlendshapes...');
        const result = await NativeModules.MotionSpeakAIV2.probeBlendshapes();
        console.log('[Phase 1] Probe result:', JSON.stringify(result, null, 2));
      } catch (e) {
        console.error('[Phase 1] Probe failed:', e);
      }
    };
    runPhase1Test();
  }, []);

  return (
    <SafeAreaProvider>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <AppNavigator />
      )}
    </SafeAreaProvider>
  );
}