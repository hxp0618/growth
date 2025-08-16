import React from 'react';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useSystemColorScheme } from '@/hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useSystemColorScheme();
  
  return (
    <BlurView
      tint={colorScheme as 'light' | 'dark'}
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}