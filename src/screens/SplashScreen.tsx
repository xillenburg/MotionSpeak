import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Props { onFinish: () => void; }

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setHidden(true);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        speed: 6,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(exitOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          StatusBar.setHidden(false);
          StatusBar.setBarStyle('dark-content');
          onFinish();
        });
      }, 1000);
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: exitOpacity }]}>
      <Animated.View style={[
        styles.logoWrap,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.65,
    height: width * 0.65,
  },
});