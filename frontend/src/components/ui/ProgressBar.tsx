import React from 'react';
import { View, ViewProps, StyleSheet, Animated } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, BorderRadius } from '@/constants/Colors';

export interface ProgressBarProps extends ViewProps {
  progress: number; // 0-100
  height?: number;
  showGradient?: boolean;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  height = 8,
  showGradient = true,
  color,
  backgroundColor,
  animated = true,
  style,
  ...props
}: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const animatedWidth = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress, animated]);

  const progressColor = color || colors.primary;
  const bgColor = backgroundColor || colors.neutral200;

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: bgColor,
          borderRadius: height / 2,
        },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
            height,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: showGradient ? colors.primaryLight : progressColor,
              borderRadius: height / 2,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  progressFill: {
    overflow: 'hidden',
  },
});