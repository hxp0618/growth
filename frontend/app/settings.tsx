import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Spacing, FontSizes, BorderRadius } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import ThemeSelector from '@/components/ui/ThemeSelector';

export default function SettingsScreen() {
  const colors = useThemeColors();
  const { currentTheme } = useTheme();
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: true,
    locationServices: false,
    analytics: true,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsItems = [
    {
      title: '推送通知',
      description: '接收重要事件的推送通知',
      key: 'notifications',
      type: 'switch' as const,
    },
    {
      title: '自动同步',
      description: '自动同步数据到云端',
      key: 'autoSync',
      type: 'switch' as const,
    },
    {
      title: '位置服务',
      description: '允许应用访问位置信息',
      key: 'locationServices',
      type: 'switch' as const,
    },
    {
      title: '数据分析',
      description: '帮助改进应用体验',
      key: 'analytics',
      type: 'switch' as const,
    },
  ];

  const accountItems = [
    {
      title: '修改密码',
      description: '更改登录密码',
      onPress: () => console.log('修改密码'),
    },
    {
      title: '隐私设置',
      description: '管理隐私和数据使用',
      onPress: () => console.log('隐私设置'),
    },
    {
      title: '清除缓存',
      description: '清除应用缓存数据',
      onPress: () => console.log('清除缓存'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: colors.primary }]}>‹ 返回</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>设置</Text>
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>主题设置</Text>
          <ThemeSelector />
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>通用设置</Text>
          {settingsItems.map((item, index) => (
            <View
              key={index}
              style={[
                styles.settingItem,
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
            >
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.icon }]}>
                  {item.description}
                </Text>
              </View>
              <Switch
                value={settings[item.key as keyof typeof settings]}
                onValueChange={(value) => updateSetting(item.key, value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          ))}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>账户设置</Text>
          {accountItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.settingItem,
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.icon }]}>
                  {item.description}
                </Text>
              </View>
              <Text style={[styles.arrow, { color: colors.icon }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="保存设置"
            onPress={() => {
              console.log('保存设置:', settings);
              router.back();
            }}
            style={styles.saveButton}
          />
        </View>

        {/* App Info */}
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.icon }]}>
            应用版本: 1.0.0
          </Text>
          <Text style={[styles.infoText, { color: colors.icon }]}>
            构建版本: 2024.01.15
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    fontSize: FontSizes.xl,
    fontWeight: '300',
    marginRight: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  settingContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: FontSizes.sm,
  },
  arrow: {
    fontSize: FontSizes.xl,
    fontWeight: '300',
  },
  actionsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  saveButton: {
    marginBottom: Spacing.md,
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  infoText: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
});