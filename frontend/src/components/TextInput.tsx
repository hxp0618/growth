import React from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet, TextInputProps, ViewStyle, TextStyle, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  style?: ViewStyle;
}

export function TextInput({
  label,
  error,
  leftIcon,
  rightIcon,
  variant = 'outline',
  size = 'medium',
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  style,
  ...props
}: CustomTextInputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = Spacing.md;
        baseStyle.paddingVertical = Spacing.sm;
        baseStyle.minHeight = 40;
        break;
      case 'large':
        baseStyle.paddingHorizontal = Spacing.lg;
        baseStyle.paddingVertical = Spacing.md;
        baseStyle.minHeight = 56;
        break;
      default:
        baseStyle.paddingHorizontal = Spacing.lg;
        baseStyle.paddingVertical = Spacing.md;
        baseStyle.minHeight = 48;
    }

    // Variant styles
    switch (variant) {
      case 'filled':
        baseStyle.backgroundColor = colors.backgroundSecondary;
        baseStyle.borderColor = 'transparent';
        break;
      case 'default':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderColor = 'transparent';
        break;
      default:
        baseStyle.backgroundColor = colors.background;
        baseStyle.borderColor = error ? colors.error : colors.border;
    }

    if (error) {
      baseStyle.borderColor = colors.error;
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      color: colors.text,
      fontSize: size === 'small' ? FontSizes.sm : size === 'large' ? FontSizes.lg : FontSizes.md,
      padding: 0,
      margin: 0,
      // 针对Web平台的特殊处理
      ...(Platform.OS === 'web' && {
        outline: 'none',
        border: 'none',
        backgroundColor: 'transparent',
      }),
    };

    return baseStyle;
  };

  // 渲染图标的辅助函数
  const renderIcon = (icon: string, isLeft: boolean = true) => {
    if (!icon) return null;
    
    return (
      <View style={[styles.iconContainer, isLeft ? styles.leftIcon : styles.rightIcon]}>
        <Text style={[styles.icon, { color: colors.textSecondary }]} selectable={false}>
          {icon}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: colors.text }, labelStyle]} selectable={false}>
          {label}
        </Text>
      ) : null}
      
      <View style={[getContainerStyle(), style]}>
        {leftIcon ? renderIcon(leftIcon, true) : null}
        
        <RNTextInput
          style={[getInputStyle(), inputStyle]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        
        {rightIcon ? renderIcon(rightIcon, false) : null}
      </View>
      
      {error ? (
        <Text style={[styles.error, { color: colors.error }, errorStyle]} selectable={false}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
    minHeight: 24,
  },
  leftIcon: {
    marginRight: Spacing.xs,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
  icon: {
    fontSize: 16,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  error: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
});