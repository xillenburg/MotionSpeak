import React, { useEffect, useState } from 'react';
import {
  requireNativeComponent,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useTheme } from '../constants/theme';

interface RNCameraProps {
  style: any;
  facingFront?: boolean;
}

let RNCamera: React.ComponentType<RNCameraProps> | null = null;
try {
  RNCamera = requireNativeComponent<RNCameraProps>('CameraView');
} catch (e) {
  console.warn('CameraView native component not found');
}

interface NativeCameraProps {
  style?: any;
  facingFront?: boolean;
}

export const NativeCamera: React.FC<NativeCameraProps> = ({
  style,
  facingFront = true,
}) => {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'MotionSpeak needs camera access to recognize FSL signs.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        setHasPermission(result === PermissionsAndroid.RESULTS.GRANTED);
      }
    } catch (e) {
      console.warn('Permission error:', e);
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          Requesting camera access...
        </Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          Camera permission required
        </Text>
      </View>
    );
  }

  if (!RNCamera) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          Camera module unavailable
        </Text>
      </View>
    );
  }

  return <RNCamera style={[styles.camera, style]} facingFront={facingFront} />;
};

const styles = StyleSheet.create({
  camera: { flex: 1 },
  placeholder: {
    flex: 1,
    backgroundColor: '#050A0E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 14 },
});