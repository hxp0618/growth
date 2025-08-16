import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HealthScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [fetalMovementCount, setFetalMovementCount] = useState(2);

  const handleFetalMovement = () => {
    setFetalMovementCount(prev => prev + 1);
    Alert.alert('胎动记录', `已记录第${fetalMovementCount + 1}次胎动`);
  };

  const handleAction = (action: string) => {
    Alert.alert('功能', `${action}功能正在开发中...`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 页面标题 */}
        <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            健康管理
          </ThemedText>
        </ThemedView>

        <View style={styles.content}>
          {/* 本周数据概览 */}
          <Card variant="default" style={styles.overviewCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                📊 本周数据概览
              </ThemedText>
            </View>
            
            <View style={styles.healthStats}>
              <View style={styles.statItem}>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  体重
                </ThemedText>
                <View style={styles.statValueContainer}>
                  <ThemedText style={[styles.statValue, { color: colors.text }]}>
                    65.2kg
                  </ThemedText>
                  <ThemedText style={[styles.statChange, { color: colors.success }]}>
                    +0.5kg
                  </ThemedText>
                </View>
              </View>

              <View style={styles.statItem}>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  血压
                </ThemedText>
                <View style={styles.statValueContainer}>
                  <ThemedText style={[styles.statValue, { color: colors.text }]}>
                    120/80 mmHg
                  </ThemedText>
                  <ThemedText style={[styles.statStatus, { color: colors.success }]}>
                    ✓
                  </ThemedText>
                </View>
              </View>

              <View style={styles.statItem}>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  胎动
                </ThemedText>
                <View style={styles.statValueContainer}>
                  <ThemedText style={[styles.statValue, { color: colors.text }]}>
                    平均 15次/小时
                  </ThemedText>
                  <ThemedText style={[styles.statStatus, { color: colors.success }]}>
                    ✓
                  </ThemedText>
                </View>
              </View>
            </View>
          </Card>

          {/* 产检记录 */}
          <Card variant="default" style={styles.checkupCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                📅 产检记录
              </ThemedText>
            </View>
            
            <View style={styles.checkupInfo}>
              <View style={styles.nextCheckup}>
                <ThemedText style={[styles.nextCheckupLabel, { color: colors.textSecondary }]}>
                  下次产检
                </ThemedText>
                <ThemedText style={[styles.nextCheckupDate, { color: colors.text }]}>
                  2025-01-15 09:00
                </ThemedText>
                <ThemedText style={[styles.nextCheckupLocation, { color: colors.textSecondary }]}>
                  北京妇产医院 - 李医生
                </ThemedText>
              </View>
              
              <View style={styles.checkupActions}>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleAction('设置提醒')}
                >
                  <ThemedText style={[styles.actionButtonText, { color: colors.neutral100 }]}>
                    设置提醒
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                  onPress={() => handleAction('查看历史')}
                >
                  <ThemedText style={[styles.actionButtonText, { color: colors.neutral100 }]}>
                    查看历史
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </Card>

          {/* 营养管理 */}
          <Card variant="default" style={styles.nutritionCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                🍎 营养管理
              </ThemedText>
            </View>
            
            <View style={styles.nutritionInfo}>
              <View style={styles.calorieProgress}>
                <View style={styles.calorieHeader}>
                  <ThemedText style={[styles.calorieLabel, { color: colors.textSecondary }]}>
                    今日摄入
                  </ThemedText>
                  <ThemedText style={[styles.calorieValue, { color: colors.text }]}>
                    1850/2200 卡路里
                  </ThemedText>
                </View>
                <ProgressBar
                  progress={84}
                  height={8}
                  style={styles.progressBar}
                />
              </View>

              <View style={styles.nutritionStatus}>
                <View style={styles.nutritionItem}>
                  <ThemedText style={styles.nutritionIcon}>🥩</ThemedText>
                  <ThemedText style={[styles.nutritionName, { color: colors.text }]}>
                    蛋白质
                  </ThemedText>
                  <ThemedText style={[styles.nutritionStatusIcon, { color: colors.success }]}>
                    ✓
                  </ThemedText>
                </View>

                <View style={styles.nutritionItem}>
                  <ThemedText style={styles.nutritionIcon}>🦴</ThemedText>
                  <ThemedText style={[styles.nutritionName, { color: colors.text }]}>
                    钙质
                  </ThemedText>
                  <ThemedText style={[styles.nutritionStatusIcon, { color: colors.warning }]}>
                    ⚠️
                  </ThemedText>
                </View>

                <View style={styles.nutritionItem}>
                  <ThemedText style={styles.nutritionIcon}>🌿</ThemedText>
                  <ThemedText style={[styles.nutritionName, { color: colors.text }]}>
                    叶酸
                  </ThemedText>
                  <ThemedText style={[styles.nutritionStatusIcon, { color: colors.success }]}>
                    ✓
                  </ThemedText>
                </View>
              </View>

              <Pressable
                style={[styles.recordButton, { backgroundColor: colors.primary }]}
                onPress={() => handleAction('记录饮食')}
              >
                <ThemedText style={[styles.recordButtonText, { color: colors.neutral100 }]}>
                  记录饮食
                </ThemedText>
              </Pressable>
            </View>
          </Card>

          {/* 胎动记录 */}
          <Card variant="default" style={styles.fetalMovementCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                👶 胎动记录
              </ThemedText>
            </View>
            
            <View style={styles.fetalMovementInfo}>
              <View style={styles.movementStatus}>
                <ThemedText style={[styles.movementLabel, { color: colors.textSecondary }]}>
                  今日胎动
                </ThemedText>
                <ThemedText style={[styles.movementCount, { color: colors.text }]}>
                  {fetalMovementCount}次
                </ThemedText>
                <ThemedText style={[styles.movementTarget, { color: colors.textSecondary }]}>
                  (目标3次)
                </ThemedText>
              </View>

              <Pressable
                style={[styles.movementButton, { backgroundColor: colors.primary }]}
                onPress={handleFetalMovement}
              >
                <ThemedText style={styles.movementButtonIcon}>👶</ThemedText>
                <ThemedText style={[styles.movementButtonText, { color: colors.neutral100 }]}>
                  开始计数
                </ThemedText>
              </Pressable>

              <View style={styles.movementProgress}>
                <ProgressBar
                  progress={(fetalMovementCount / 3) * 100}
                  height={6}
                  color={colors.success}
                />
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  overviewCard: {
    marginBottom: Spacing.md,
  },
  checkupCard: {
    marginBottom: Spacing.md,
  },
  nutritionCard: {
    marginBottom: Spacing.md,
  },
  fetalMovementCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  healthStats: {
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSizes.body,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statValue: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  statChange: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  statStatus: {
    fontSize: 16,
  },
  checkupInfo: {
    gap: Spacing.md,
  },
  nextCheckup: {
    gap: Spacing.xs,
  },
  nextCheckupLabel: {
    fontSize: FontSizes.bodySmall,
  },
  nextCheckupDate: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  nextCheckupLocation: {
    fontSize: FontSizes.body,
  },
  checkupActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  nutritionInfo: {
    gap: Spacing.md,
  },
  calorieProgress: {
    gap: Spacing.sm,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calorieLabel: {
    fontSize: FontSizes.body,
  },
  calorieValue: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  progressBar: {
    marginTop: Spacing.xs,
  },
  nutritionStatus: {
    gap: Spacing.sm,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nutritionIcon: {
    fontSize: 20,
  },
  nutritionName: {
    fontSize: FontSizes.body,
    flex: 1,
  },
  nutritionStatusIcon: {
    fontSize: 16,
  },
  recordButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  recordButtonText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  fetalMovementInfo: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  movementStatus: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  movementLabel: {
    fontSize: FontSizes.body,
  },
  movementCount: {
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.bold,
  },
  movementTarget: {
    fontSize: FontSizes.bodySmall,
  },
  movementButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    minWidth: 120,
  },
  movementButtonIcon: {
    fontSize: 32,
  },
  movementButtonText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
  },
  movementProgress: {
    width: '100%',
  },
});