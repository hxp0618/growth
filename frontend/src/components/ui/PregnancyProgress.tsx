import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '@/constants/Colors';
import { ProgressBar } from './ProgressBar';
import { PregnancyProgressResponse } from '@/types/api';

export interface PregnancyProgressProps extends ViewProps {
  data?: PregnancyProgressResponse;
  motherName?: string;
  loading?: boolean;
  error?: string;
  // 兼容旧版本属性
  currentWeek?: number;
  totalWeeks?: number;
  daysRemaining?: number;
  babyWeight?: string;
  babyComparison?: string;
}

export function PregnancyProgress({
  data,
  motherName,
  loading,
  error,
  // 兼容旧版本属性
  currentWeek,
  totalWeeks = 40,
  daysRemaining,
  babyWeight,
  babyComparison,
  style,
  ...props
}: PregnancyProgressProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // 优先使用API数据，如果没有则使用传入的属性
  const week = data?.pregnancyWeek ?? currentWeek ?? 0;
  const progressPercentage = data?.progressPercentage ?? (week / totalWeeks) * 100;
  const daysToDelivery = data?.daysToDelivery ?? daysRemaining ?? 0;
  const weight = data?.babyWeight ? `${data.babyWeight}g` : babyWeight;
  const comparison = data?.fruitComparison ?? babyComparison;
  const encouragement = data?.encouragementMessage;
  const stage = data?.pregnancyStage;
  const tips = data?.pregnancyTips;

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
          },
          style,
        ]}
        {...props}
      >
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          正在加载孕期进度...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
          },
          style,
        ]}
        {...props}
      >
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      </View>
    );
  }

  if (!week) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
          },
          style,
        ]}
        {...props}
      >
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          暂无孕期数据
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
        },
        style,
      ]}
      {...props}
    >
      {/* 头部信息 */}
      <View style={styles.header}>
        <Text style={[styles.emoji, { color: colors.text }]}>🤱</Text>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            孕期进度 - 第{week}周
          </Text>
          {stage && (
            <Text style={[styles.stage, { color: colors.primary }]}>
              {stage}
            </Text>
          )}
        </View>
      </View>

      {/* 进度条 */}
      <View style={styles.progressSection}>
        <ProgressBar
          progress={progressPercentage}
          height={12}
          showGradient={true}
          style={styles.progressBar}
        />
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      {/* 详细信息 */}
      <View style={styles.detailsSection}>
        <Text style={[styles.daysRemaining, { color: colors.text }]}>
          距离预产期还有 {daysToDelivery} 天
        </Text>
        
        {weight && comparison && (
          <Text style={[styles.babyInfo, { color: colors.textSecondary }]}>
            宝宝现在约 {weight}，像个{comparison}
          </Text>
        )}

        {tips && (
          <Text style={[styles.tips, { color: colors.textSecondary }]}>
            💡 {tips}
          </Text>
        )}
      </View>

      {/* 鼓励信息 */}
      <View style={[styles.encouragement, { backgroundColor: colors.primaryLight + '20' }]}>
        <Text style={[styles.encouragementText, { color: colors.primary }]}>
          {encouragement || `${motherName ? `${motherName}，` : ''}加油！每一天都在见证奇迹的发生 ✨`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  emoji: {
    fontSize: 24,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  stage: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressBar: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  progressText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    minWidth: 35,
    textAlign: 'right',
  },
  detailsSection: {
    marginBottom: Spacing.md,
  },
  daysRemaining: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  babyInfo: {
    fontSize: FontSizes.bodySmall,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  tips: {
    fontSize: FontSizes.bodySmall,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  encouragement: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  encouragementText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
    lineHeight: 18,
  },
  loadingText: {
    fontSize: FontSizes.body,
    textAlign: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: FontSizes.body,
    textAlign: 'center',
    padding: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSizes.body,
    textAlign: 'center',
    padding: Spacing.lg,
  },
});