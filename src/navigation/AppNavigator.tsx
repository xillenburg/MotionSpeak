import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeScreen } from '../screens/HomeScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { DictionaryScreen } from '../screens/DictionaryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { useTheme } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type RootStackParamList = {
  Main: undefined;
  Camera: undefined;
  About: undefined;
};

export type TabParamList = {
  Home: undefined;
  Dictionary: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { colors, fs } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 8,
          elevation: 8,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: fs(11),
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, string> = {
            Home: focused ? 'home' : 'home-outline',
            Dictionary: focused ? 'book-open' : 'book-open-outline',
            Settings: focused ? 'cog' : 'cog-outline',
          };
          return (
            <Icon name={icons[route.name] ?? 'circle'} size={22} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Dictionary" component={DictionaryScreen} options={{ tabBarLabel: 'Signs' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { colors, darkMode } = useTheme();

  const navTheme = {
    ...DefaultTheme,
    dark: darkMode,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};