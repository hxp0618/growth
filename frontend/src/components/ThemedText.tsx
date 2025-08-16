import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useColorScheme';
import { FontSizes, FontWeights } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  comfortColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'secondary';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  comfortColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const colors = useThemeColors();
  
  // 根据文本类型选择合适的颜色
  let textColor = colors.text;
  if (type === 'secondary') {
    textColor = colors.textSecondary;
  } else if (type === 'link') {
    textColor = colors.primary;
  }
  
  // 如果提供了自定义颜色，优先使用
  const color = lightColor || darkColor || comfortColor || textColor;

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'secondary' ? styles.secondary : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    fontWeight: FontWeights.regular,
  },
  defaultSemiBold: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    fontWeight: FontWeights.semibold,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.medium,
    lineHeight: 24,
  },
  link: {
    fontSize: FontSizes.body,
    lineHeight: 30,
    fontWeight: FontWeights.medium,
  },
  secondary: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    fontWeight: FontWeights.regular,
  },
});