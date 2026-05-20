import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

export interface PermissionStatus {
  camera: boolean;
  allGranted: boolean;
  loading: boolean;
}

export const usePermissions = () => {
  const [status, setStatus] = useState<PermissionStatus>({
    camera: false,
    allGranted: false,
    loading: true,
  });

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'MotionSpeak needs camera access to recognize FSL gestures.',
            buttonPositive: 'Grant',
            buttonNegative: 'Deny',
          }
        );
        const granted = result === PermissionsAndroid.RESULTS.GRANTED;
        setStatus({ camera: granted, allGranted: granted, loading: false });
        if (!granted) {
          Alert.alert('Permission Denied', 'Camera access is required for sign recognition.');
        }
      }
    } catch (error) {
      console.error('Permission error:', error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return { ...status, requestPermissions };
};