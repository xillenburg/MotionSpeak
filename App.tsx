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


Phase 2 - live blendshape polling
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

  // Phase 3 — calibration logging
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      try {
        const r = await NativeModules.MotionSpeakAIV2.probeLiveFrame();
        if (r.didDetect) {
          const bs = r.blendshapes ?? {};
          const browInner = bs.browInnerUp ?? 0;
          const browDownL = bs.browDownLeft ?? 0;
          const browDownR = bs.browDownRight ?? 0;
          const browDownAvg = (browDownL + browDownR) / 2;
          const yaw = r.yawProxy ?? 0;
          console.log(
            `[Calib JS] inner=${browInner.toFixed(3)} downAvg=${browDownAvg.toFixed(3)} yaw=${yaw.toFixed(3)}`
          );
        }
      } catch (e) {
        console.warn('[Phase 3] probeLiveFrame failed:', e);
      }
    };
    const id = setInterval(tick, 300);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);
*/
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      try {
        const r = await NativeModules.MotionSpeakAIV2.probeLiveFrame();
        if (r.didDetect && r.nmm) {
          console.log(
            `[NMM] raise=${r.nmm.brow_raise} furrow=${r.nmm.brow_furrow} shake=${r.nmm.head_shake}`
          );
        }
      } catch (e) {
        console.warn('[Phase 3] probeLiveFrame failed:', e);
      }
    };
    const id = setInterval(tick, 100);
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