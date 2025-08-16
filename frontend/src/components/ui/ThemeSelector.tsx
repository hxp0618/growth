import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemeColors } from '../../hooks/useColorScheme';
import { FontSizes, FontWeights, Spacing, BorderRadius } from '../../constants/Colors';

interface ThemeOptionProps {
  icon: string;
  title: string;
  subtitle: string;
  value: 'light' | 'comfort' | 'dark' | 'auto';
  isSelected: boolean;
  onPress: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  icon,
  title,
  subtitle,
  value,
  isSelected,
  onPress,
}) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[
        styles.optionContainer,
        {
          backgroundColor: colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionContent}>
        <Text style={styles.optionIcon}>{icon}</Text>
        <View style={styles.optionText}>
          <Text style={[styles.optionTitle, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const ThemeSelector: React.FC = () => {
  const { themeMode, setThemeMode, getRecommendedTheme } = useTheme();
  const colors = useThemeColors();

  const themeOptions = [
    {
      icon: '☀️',
      title: '明亮模式',
      subtitle: '白天使用，清晰明亮',
      value: 'light' as const,
    },
    {
      icon: '🌅',
      title: '护眼模式',
      subtitle: '傍晚使用，温暖舒适',
      value: 'comfort' as const,
    },
    {
      icon: '🌙',
      title: '夜间模式',
      subtitle: '夜晚使用，柔和护眼',
      value: 'dark' as const,
    },
    {
      icon: '🤖',
      title: '智能切换',
      subtitle: `根据时间自动调整 (当前推荐: ${getThemeNames()[getRecommendedTheme()]})`,
      value: 'auto' as const,
    },
  ];

  function getThemeNames() {
    return {
      light: '明亮',
      comfort: '护眼',
      dark: '夜间',
    };
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        选择主题模式
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        为你和宝宝选择最舒适的视觉体验
      </Text>

      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <ThemeOption
            key={option.value}
            icon={option.icon}
            title={option.title}
            subtitle={option.subtitle}
            value={option.value}
            isSelected={themeMode === option.value}
            onPress={() => setThemeMode(option.value)}
          />
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          💡 贴心提示
        </Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          • 智能切换会根据时间自动调节主题{'\n'}
          • 护眼模式减少蓝光刺激，保护眼睛健康{'\n'}
          • 你可以随时手动切换到喜欢的主题
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.body,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  optionContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FontSizes.bodyLarge,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  optionSubtitle: {
    fontSize: FontSizes.bodySmall,
    lineHeight: 16,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: FontWeights.bold,
  },
  infoCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: FontSizes.bodyLarge,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSizes.bodySmall,
    lineHeight: 18,
  },
});

export default ThemeSelector;