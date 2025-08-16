import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Button } from '@/components/Button';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.closeButton, { color: colors.primary }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.icon}>🚀</Text>
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>
          欢迎使用 Growth
        </Text>
        
        <Text style={[styles.description, { color: colors.icon }]}>
          这是一个示例模态页面。在实际应用中，你可以在这里展示重要信息、收集用户输入或显示详细内容。
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={[styles.featureIcon, { color: colors.success }]}>✓</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>
              跨平台支持 (Web, iOS, Android)
            </Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={[styles.featureIcon, { color: colors.success }]}>✓</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>
              现代化的 UI 设计
            </Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={[styles.featureIcon, { color: colors.success }]}>✓</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>
              丰富的功能模块
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="了解更多"
            onPress={() => console.log('了解更多')}
            style={styles.primaryButton}
          />
          
          <Button
            title="关闭"
            onPress={() => router.back()}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  closeButton: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  features: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginRight: Spacing.md,
    width: 24,
  },
  featureText: {
    fontSize: FontSizes.md,
    flex: 1,
  },
  actions: {
    width: '100%',
    gap: Spacing.md,
  },
  primaryButton: {
    marginBottom: Spacing.sm,
  },
  secondaryButton: {
    marginBottom: Spacing.lg,
  },
});