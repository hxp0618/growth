import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/Colors';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof Spacing;
}

export function Card({ 
  children, 
  style, 
  variant = 'default',
  padding = 'md',
  ...props 
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing[padding],
    };

    switch (variant) {
      case 'elevated':
        return [baseStyle, Shadows.md];
      case 'outlined':
        return [baseStyle, { borderWidth: 1, borderColor: colors.border }];
      default:
        return [baseStyle, Shadows.sm];
    }
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // 可以添加额外的样式
});