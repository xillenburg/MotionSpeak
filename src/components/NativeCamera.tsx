import React, { useEffect, useRef } from 'react';
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  StyleSheet,
  View,
  Text,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';

const { CameraModule } = NativeModules;

let RNCamera: any = null;
try {
  RNCamera = requireNativeComponent('CameraView');
} catch (e) {
  console.warn('CameraView native component not found');
}

interface NativeCameraProps {
  style?: any;
}

export const NativeCamera: React.FC<NativeCameraProps> = ({ style }) => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [checking, setChecking] = React.useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'MotionSpeak needs camera to recognize FSL signs.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
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
        <Text style={styles.text}>Checking camera permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.text}>Camera permission denied</Text>
      </View>
    );
  }

  if (!RNCamera) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.text}>Camera module not available</Text>
      </View>
    );
  }

  return <RNCamera style={[styles.camera, style]} />;
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#050A0E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});