import { View, type ViewProps } from 'react-native';
import { useThemeColors } from '@/hooks/useColorScheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  comfortColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  comfortColor,
  ...otherProps
}: ThemedViewProps) {
  const colors = useThemeColors();
  
  // 如果提供了自定义颜色，使用默认背景色
  // 否则使用当前主题的背景色
  const backgroundColor = lightColor || darkColor || comfortColor
    ? colors.background
    : colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}