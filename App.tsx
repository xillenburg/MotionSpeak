import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { NativeModules } from 'react-native';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

/**  useEffect(() => {
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
*/

//Phase 2 - live blendshape polling
useEffect(() => {
    let cancelled = false;
    const tick = async() => {
        if (cancelled) return;
        try {
            const r = await NativeModules.MotionSpeakAIV2.probeLiveFrame();
            if (r.didDetect) {
                console.log('[Phase 2] blenshapes:', JSON.stringify(r.blendshapes));
                } else {
                    console.log('[Phase 2] no face -', r.reason ?? 'not detected');
                    }
            } catch (e) {
                console.warn('[Phase 2] probeLiveFrame failed:', e);
                }
        };
    const id = setInterval(tick, 500);
    return () => {
        cancelled = true;
        clearInterval(id);
        };
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