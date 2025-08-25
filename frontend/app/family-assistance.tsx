import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../src/components/ThemedText';
import { ThemedView } from '../src/components/ThemedView';
import { FamilyMembers } from '../src/components/family';
import { Colors, FontSizes, FontWeights, Spacing } from '../src/constants/Colors';
import { useColorScheme } from '../src/hooks/useColorScheme';

export default function FamilyAssistanceScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 页面标题 */}
        <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            家庭协助
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            管理家庭成员，共同关注孕期健康
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          {/* 家庭成员管理 */}
          <FamilyMembers />
          
          {/* 功能说明 */}
          <ThemedView style={[styles.infoCard, { backgroundColor: colors.background }]}>
            <ThemedText style={[styles.infoTitle, { color: colors.text }]}>
              💡 功能说明
            </ThemedText>
            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
              • 只显示当前在线的家庭成员{'\n'}
              • 点击&quot;邀请更多成员&quot;可查看家庭邀请码{'\n'}
              • 邀请码可以分享给其他家庭成员{'\n'}
              • 新成员可以通过邀请码加入家庭
            </ThemedText>
          </ThemedView>
        </ThemedView>
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
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.body,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  infoCard: {
    padding: Spacing.lg,
    borderRadius: 12,
    marginTop: Spacing.md,
  },
  infoTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: FontSizes.body,
    lineHeight: 24,
  },
});
