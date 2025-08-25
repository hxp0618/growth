import { Platform } from 'react-native';

// 字体系统配置
export const FontConfig = {
  // 中文主字体
  chinese: {
    regular: Platform.select({
      ios: 'PingFang SC',
      android: 'sans-serif',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'PingFang SC',
      android: 'sans-serif-medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'PingFang SC',
      android: 'sans-serif',
      default: 'System',
    }),
  },
  
  // 英文字体
  english: {
    regular: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },
  
  // 数字字体
  mono: {
    regular: Platform.select({
      ios: 'SF Mono',
      android: 'monospace',
      default: 'monospace',
    }),
  },
};

// 字体样式工具函数
export const getFontFamily = (weight: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' = 'regular') => {
  const baseFont = Platform.select({
    ios: 'PingFang SC',
    android: 'sans-serif',
    default: 'System',
  });

  // iOS 使用 fontWeight，Android 使用不同的字体名称
  if (Platform.OS === 'ios') {
    return baseFont;
  }

  // Android 字体映射
  switch (weight) {
    case 'light':
      return 'sans-serif-light';
    case 'medium':
      return 'sans-serif-medium';
    case 'semibold':
    case 'bold':
      return 'sans-serif';
    default:
      return 'sans-serif';
  }
};

// 字体权重映射
export const getFontWeight = (weight: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' = 'regular') => {
  const weightMap = {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  };

  return weightMap[weight] as '300' | '400' | '500' | '600' | '700';
};

// 创建文本样式的工具函数
export const createTextStyle = (
  fontSize: number,
  weight: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' = 'regular',
  lineHeight?: number
) => ({
  fontFamily: getFontFamily(weight),
  fontSize,
  fontWeight: getFontWeight(weight),
  ...(lineHeight && { lineHeight }),
});

// 导出Fonts对象，供组件使用
export const Fonts = {
  light: getFontFamily('light'),
  regular: getFontFamily('regular'),
  medium: getFontFamily('medium'),
  semiBold: getFontFamily('semibold'),
  bold: getFontFamily('bold'),
};