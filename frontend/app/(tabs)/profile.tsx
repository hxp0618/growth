import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  dueDate: string;
  currentWeek: number;
  joinDate: string;
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'info';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { logout: authLogout, isLoading } = useAuth();

  const [userProfile] = useState<UserProfile>({
    name: '小雨',
    role: '准妈妈',
    avatar: '👩',
    dueDate: '2025-05-15',
    currentWeek: 24,
    joinDate: '2024-11-01',
  });

  const [notifications, setNotifications] = useState(true);
  const [dataSync, setDataSync] = useState(true);

  const stats = [
    { label: '使用天数', value: '67', color: colors.primary },
    { label: '健康记录', value: '128', color: colors.success },
    { label: '家庭任务', value: '23', color: colors.secondary },
    { label: '知识收藏', value: '15', color: colors.warning },
  ];

  const settingsSections = [
    {
      title: '个人设置',
      items: [
        {
          id: 'profile',
          title: '个人信息',
          subtitle: '编辑个人资料和孕期信息',
          icon: '👤',
          type: 'navigation' as const,
          onPress: () => router.push('/profile/edit'),
        },
        {
          id: 'family',
          title: '家庭成员',
          subtitle: '管理家庭成员和权限',
          icon: '👨‍👩‍👧‍👦',
          type: 'navigation' as const,
          onPress: () => Alert.alert('家庭成员', '家庭成员管理功能正在开发中...'),
        },
        {
          id: 'medical',
          title: '医疗信息',
          subtitle: '医院、医生联系方式',
          icon: '🏥',
          type: 'navigation' as const,
          onPress: () => Alert.alert('医疗信息', '医疗信息管理功能正在开发中...'),
        },
      ],
    },
    {
      title: '应用设置',
      items: [
        {
          id: 'notifications',
          title: '推送通知',
          subtitle: '管理通知提醒',
          icon: '🔔',
          type: 'toggle' as const,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'theme',
          title: '主题设置',
          subtitle: '选择应用主题模式',
          icon: '🎨',
          type: 'navigation' as const,
          onPress: () => router.push('/settings'),
        },
        {
          id: 'dataSync',
          title: '数据同步',
          subtitle: '自动同步健康数据',
          icon: '☁️',
          type: 'toggle' as const,
          value: dataSync,
          onToggle: setDataSync,
        },
        {
          id: 'privacy',
          title: '隐私设置',
          subtitle: '控制数据隐私和安全',
          icon: '🔒',
          type: 'navigation' as const,
          onPress: () => Alert.alert('隐私设置', '隐私设置功能正在开发中...'),
        },
      ],
    },
    {
      title: '帮助与支持',
      items: [
        {
          id: 'help',
          title: '帮助中心',
          subtitle: '常见问题和使用指南',
          icon: '❓',
          type: 'navigation' as const,
          onPress: () => Alert.alert('帮助中心', '帮助中心功能正在开发中...'),
        },
        {
          id: 'feedback',
          title: '意见反馈',
          subtitle: '向我们提出建议',
          icon: '💬',
          type: 'navigation' as const,
          onPress: () => Alert.alert('意见反馈', '意见反馈功能正在开发中...'),
        },
        {
          id: 'about',
          title: '关于我们',
          subtitle: '版本信息和团队介绍',
          icon: 'ℹ️',
          type: 'navigation' as const,
          onPress: () => Alert.alert('关于我们', '家有孕宝 v1.0.0\n陪伴每一个美好时刻'),
        },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await authLogout();
              // AuthGuard会自动重定向到welcome页面
            } catch (error) {
              console.error('退出登录失败:', error);
              Alert.alert('错误', '退出登录失败，请重试');
            }
          }
        },
      ]
    );
  };

  const renderSettingItem = (item: SettingItem) => {
    return (
      <Pressable
        key={item.id}
        style={[styles.settingItem, { borderColor: colors.border }]}
        onPress={item.type === 'navigation' ? item.onPress : undefined}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingLeft}>
          <ThemedText style={styles.settingIcon}>{item.icon}</ThemedText>
          <View style={styles.settingContent}>
            <ThemedText style={[styles.settingTitle, { color: colors.text }]}>
              {item.title}
            </ThemedText>
            {item.subtitle && (
              <ThemedText style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {item.subtitle}
              </ThemedText>
            )}
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: colors.neutral300, true: colors.primary + '50' }}
              thumbColor={item.value ? colors.primary : colors.neutral500}
            />
          ) : (
            <ThemedText style={[styles.settingArrow, { color: colors.textSecondary }]}>
              ›
            </ThemedText>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 页面标题 */}
        <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            我的
          </ThemedText>
        </ThemedView>

        <View style={styles.content}>
          {/* 用户信息卡片 */}
          <Card variant="default" style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <ThemedText style={styles.avatarText}>
                    {userProfile.avatar}
                  </ThemedText>
                </View>
                <View style={[styles.roleIndicator, { backgroundColor: colors.pregnant }]}>
                  <ThemedText style={[styles.roleText, { color: colors.neutral100 }]}>
                    {userProfile.role}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.profileInfo}>
                <ThemedText style={[styles.profileName, { color: colors.text }]}>
                  {userProfile.name}
                </ThemedText>
                <ThemedText style={[styles.profileDetail, { color: colors.textSecondary }]}>
                  孕{userProfile.currentWeek}周 · 预产期 {userProfile.dueDate}
                </ThemedText>
                <ThemedText style={[styles.profileDetail, { color: colors.textSecondary }]}>
                  加入时间 {userProfile.joinDate}
                </ThemedText>
              </View>
              
              <Pressable
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/profile/edit')}
              >
                <ThemedText style={[styles.editButtonText, { color: colors.neutral100 }]}>
                  编辑
                </ThemedText>
              </Pressable>
            </View>
          </Card>

          {/* 数据统计 */}
          <Card variant="default" style={styles.statsCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                📊 我的数据
              </ThemedText>
            </View>
            
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <ThemedText style={[styles.statValue, { color: stat.color }]}>
                    {stat.value}
                  </ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {stat.label}
                  </ThemedText>
                </View>
              ))}
            </View>
          </Card>

          {/* 设置选项 */}
          {settingsSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} variant="default" style={styles.settingsCard}>
              <View style={styles.cardHeader}>
                <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                  {section.title}
                </ThemedText>
              </View>
              
              <View style={styles.settingsList}>
                {section.items.map(renderSettingItem)}
              </View>
            </Card>
          ))}

          {/* 退出登录 */}
          <Card variant="default" style={styles.logoutCard}>
            <Pressable 
              style={[styles.logoutButton, isLoading && styles.logoutButtonDisabled]}
              onPress={handleLogout}
              disabled={isLoading}
            >
              <ThemedText style={styles.logoutIcon}>🚪</ThemedText>
              <ThemedText style={[styles.logoutText, { color: colors.error }]}>
                {isLoading ? '退出中...' : '退出登录'}
              </ThemedText>
            </Pressable>
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
  profileCard: {
    marginBottom: Spacing.md,
  },
  statsCard: {
    marginBottom: Spacing.md,
  },
  settingsCard: {
    marginBottom: Spacing.md,
  },
  logoutCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
  },
  roleIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  roleText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  profileName: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  profileDetail: {
    fontSize: FontSizes.bodySmall,
  },
  editButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  editButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '22%',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
  },
  statLabel: {
    fontSize: FontSizes.bodySmall,
    textAlign: 'center',
  },
  settingsList: {
    gap: Spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  settingTitle: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  settingSubtitle: {
    fontSize: FontSizes.bodySmall,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingArrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
});