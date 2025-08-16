import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/Colors';

export function useColorScheme() {
  const { currentTheme } = useTheme();
  return currentTheme;
}

// 获取当前主题的颜色配置
export function useThemeColors() {
  const { currentTheme } = useTheme();
  return Colors[currentTheme];
}

// 向后兼容的 hook
export function useSystemColorScheme() {
  const { isDarkMode } = useTheme();
  return isDarkMode ? 'dark' : 'light';
}