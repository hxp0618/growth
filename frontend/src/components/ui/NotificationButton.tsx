import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, Shadows } from '@/constants/Colors';
import { CustomNotificationModal } from './CustomNotificationModal';

export interface NotificationButtonProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress: () => void;
  onLongPress?: () => void;
  variant?: 'primary' | 'emergency' | 'secondary' | 'custom';
  disabled?: boolean;
  style?: ViewStyle;
}

export function NotificationButton({
  title,
  subtitle,
  icon,
  onPress,
  onLongPress,
  variant = 'primary',
  disabled = false,
  style,
}: NotificationButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showCustomModal, setShowCustomModal] = useState(false);

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 80,
      ...Shadows.md,
    };

    switch (variant) {
      case 'emergency':
        return {
          ...baseStyle,
          backgroundColor: colors.error,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
        };
      case 'custom':
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
          borderWidth: 2,
          borderColor: colors.primary,
          borderStyle: 'dashed',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
    }
  };

  const getTextColor = (): string => {
    return '#FFFFFF'; // 所有变体都使用白色文字
  };

  const handlePress = () => {
    if (variant === 'custom') {
      setShowCustomModal(true);
    } else {
      onPress();
    }
  };

  const handleCustomNotificationSent = (success: boolean) => {
    if (success) {
      // 对于自定义通知，我们需要特殊处理来刷新模板列表
      onPress(); // 调用原始的onPress回调来通知父组件
      setShowCustomModal(false); // 关闭模态框
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          getButtonStyle(),
          disabled && styles.disabled,
          style,
        ]}
        onPress={handlePress}
        onLongPress={onLongPress}
        disabled={disabled}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={subtitle}
      >
      {icon && (
        <Text style={[styles.icon, { color: getTextColor() }]}>
          {icon}
        </Text>
      )}
      <Text style={[styles.title, { color: getTextColor() }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: getTextColor() }]}>
          {subtitle}
        </Text>
      )}
      </TouchableOpacity>

      {variant === 'custom' && (
        <CustomNotificationModal
          visible={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          onSent={handleCustomNotificationSent}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.regular,
    textAlign: 'center',
    opacity: 0.9,
  },
});