import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { NotificationButton } from '@/components/ui/NotificationButton';
import { PregnancyProgress } from '@/components/ui/PregnancyProgress';
import { CompactFamilySelector } from '@/components/ui/CompactFamilySelector';
import { EditNotificationModal } from '@/components/ui/EditNotificationModal';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { useFamily } from '@/contexts/FamilyContext';
import { pregnancyProgressService, notificationService } from '@/services';
import { PregnancyProgressResponse, NotificationTemplate, FamilyNotification } from '@/types/api';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const { families, currentFamily, setCurrentFamily, hasFamily, isLoadingFamilies } = useFamily();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [pregnancyData, setPregnancyData] = useState<PregnancyProgressResponse | undefined>(undefined);
  const [pregnancyLoading, setPregnancyLoading] = useState(false);
  const [pregnancyError, setPregnancyError] = useState<string | undefined>(undefined);
  const [customTemplates, setCustomTemplates] = useState<NotificationTemplate[]>([]);
  const [familyNotifications, setFamilyNotifications] = useState<FamilyNotification[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FamilyNotification | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, []);

  // 获取孕期进度数据
  const fetchPregnancyProgress = async () => {
    if (!user?.id) return;

    setPregnancyLoading(true);
    setPregnancyError(undefined);

    try {
      // 使用家庭孕期进度接口，这样可以获取到家庭成员中孕妇的进度
      const data = await pregnancyProgressService.getFamilyPregnancyProgress();
      setPregnancyData(data || undefined);
    } catch (error) {
      console.error('获取孕期进度失败:', error);
      setPregnancyError(error instanceof Error ? error.message : '获取孕期进度失败');
    } finally {
      setPregnancyLoading(false);
    }
  };

  useEffect(() => {
    fetchPregnancyProgress();
  }, [user?.id, currentFamily?.id]);

  // 当当前家庭改变时，加载自定义通知模板
  useEffect(() => {
    if (currentFamily?.id) {
      fetchCustomTemplates();
    }
  }, [currentFamily?.id]);

  // 获取自定义通知模板
  const fetchCustomTemplates = async () => {
    if (!currentFamily?.id) {
      console.log('没有当前家庭ID，跳过获取模板');
      return;
    }

    try {
      console.log('开始获取自定义通知模板，家庭ID:', currentFamily.id);
      const templates = await notificationService.getFamilyNotificationTemplates(currentFamily.id);
      console.log('获取到的模板数量:', templates.length);
      console.log('模板详情:', templates);
      setCustomTemplates(templates);
      
      // 同时获取原始的FamilyNotification数据用于编辑
      const response = await notificationService.getFamilyNotificationTemplatesRaw(currentFamily.id);
      if (response) {
        setFamilyNotifications(response);
      }
    } catch (error) {
      console.error('获取自定义通知模板失败:', error);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '早安';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const handleNotification = async (type: string) => {
    try {
      // 如果没有当前家庭，提示错误
      if (!currentFamily?.id) {
        Alert.alert('错误', '未找到家庭信息，无法发送通知给家庭成员。');
        return;
      }

      // 1. 发送本地通知
      const localSuccess = await notificationService.sendOneClickNotification(type, user?.nickname);
      
      // 2. 发送到服务器给家庭成员
      const serverRequest = {
        familyId: currentFamily.id,
        title: type,
        content: `${user?.nickname || '用户'}发送了${type}通知`,
        priority: type === '紧急情况' ? 3 : type === '身体不适' ? 2 : 1,
        type: type === '紧急情况' ? 3 : type === '身体不适' ? 2 : 1,
        svgIcon: getNotificationIcon(type),
        scheduledTime: formatDateForServer(new Date()),
      };

      const serverId = await notificationService.sendOneClickNotificationToServer(serverRequest);
      
      if (localSuccess && serverId) {
        Alert.alert(
          '通知已发送',
          `${type}通知已成功发送给家庭成员！`,
          [{ text: '确定', style: 'default' }]
        );
      } else if (localSuccess) {
        Alert.alert(
          '部分成功',
          '本地通知已发送，但发送给家庭成员失败，请检查网络连接。',
          [{ text: '确定', style: 'default' }]
        );
      } else {
        Alert.alert(
          '发送失败',
          '通知发送失败，请检查通知权限设置。',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '检查权限',
              style: 'default',
              onPress: async () => {
                const hasPermission = await notificationService.requestPermissions();
                if (hasPermission) {
                  Alert.alert('权限已获取', '现在可以发送通知了！');
                } else {
                  Alert.alert('权限被拒绝', '请在系统设置中手动开启通知权限。');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('发送通知错误:', error);
      Alert.alert('错误', '发送通知时出现错误，请稍后重试。');
    }
  };

  // 获取通知图标
  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case '产检提醒': return '🏥';
      case '身体不适': return '😷';
      case '分享喜悦': return '😊';
      case '紧急情况': return '🚨';
      default: return '📱';
    }
  };

  // 格式化日期为后端期望的格式 yyyy-MM-dd HH:mm:ss
  const formatDateForServer = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleCustomNotificationSaved = async () => {
    // 刷新自定义模板列表
    console.log('自定义通知已保存，开始刷新模板列表');
    await fetchCustomTemplates();
    console.log('模板列表刷新完成');
  };

  const handleCustomTemplatePress = async (template: NotificationTemplate) => {
    try {
      // 如果没有当前家庭，提示错误
      if (!currentFamily?.id) {
        Alert.alert('错误', '未找到家庭信息，无法发送通知给家庭成员。');
        return;
      }

      // 提取真实的模板ID
      const realTemplateId = template.id.replace('template_', '');
      
      // 发送模板通知
      const success = await notificationService.sendNotificationFromTemplate(parseInt(realTemplateId), currentFamily.id);
      
      if (success) {
        Alert.alert(
          '通知已发送',
          `${template.title}通知已成功发送给家庭成员！`,
          [{ text: '确定', style: 'default' }]
        );
      } else {
        Alert.alert(
          '发送失败',
          '通知发送失败，请检查网络连接。',
          [{ text: '确定', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('发送模板通知错误:', error);
      Alert.alert('错误', '发送通知时出现错误，请稍后重试。');
    }
  };

  const handleCustomTemplateLongPress = (template: NotificationTemplate) => {
    // 找到对应的原始模板数据
    const realTemplateId = template.id.replace('template_', '');
    const originalTemplate = familyNotifications.find(t => t.id === parseInt(realTemplateId));
    
    if (originalTemplate) {
      setEditingTemplate(originalTemplate);
      setShowEditModal(true);
    } else {
      Alert.alert('错误', '无法找到模板数据');
    }
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingTemplate(null);
  };

  const handleEditModalUpdated = async (success: boolean) => {
    if (success) {
      // 刷新模板列表
      await fetchCustomTemplates();
    }
  };

  const handleTaskAction = (task: string) => {
    Alert.alert('任务', `${task}功能正在开发中...`);
  };

  // 处理家庭切换
  const handleFamilyChange = (familyId: number | undefined) => {
    if (familyId) {
      const selectedFamily = families.find(f => f.id === familyId);
      if (selectedFamily) {
        setCurrentFamily(selectedFamily);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 头部问候 */}
        <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerLeft}>
            <View style={styles.greetingRow}>
              <ThemedText style={[styles.greeting, { color: colors.text }]}>
                👋 {getGreeting()}，{user?.nickname || '用户'}
              </ThemedText>
            </View>
            {hasFamily && (
              <View style={styles.familySelectorRow}>
                <CompactFamilySelector
                  selectedFamilyId={currentFamily?.id}
                  onFamilyChange={handleFamilyChange}
                />
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            <Pressable
              style={[styles.iconButton, { backgroundColor: colors.card }]}
              onPress={() => handleNotification('通知')}
            >
              <ThemedText style={{ fontSize: 20 }}>🔔</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.iconButton, { backgroundColor: colors.card }]}
              onPress={() => handleNotification('设置')}
            >
              <ThemedText style={{ fontSize: 20 }}>⚙️</ThemedText>
            </Pressable>
          </View>
        </ThemedView>

        <View style={styles.content}>
          {/* 孕期进度卡片 */}
          <PregnancyProgress
            data={pregnancyData}
            motherName={user?.nickname}
            loading={pregnancyLoading}
            error={pregnancyError}
            style={styles.pregnancyCard}
          />

          {/* 今日任务 */}
          <Card variant="default" style={styles.taskCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                📋 今日任务
              </ThemedText>
            </View>
            
            <View style={styles.taskList}>
              <Pressable 
                style={styles.taskItem}
                onPress={() => handleTaskAction('胎动记录')}
              >
                <View style={styles.taskLeft}>
                  <ThemedText style={styles.taskIcon}>👶</ThemedText>
                  <ThemedText style={[styles.taskText, { color: colors.text }]}>
                    记录胎动 (0/3)
                  </ThemedText>
                </View>
                <ThemedText style={[styles.taskStatus, { color: colors.textSecondary }]}>
                  待完成
                </ThemedText>
              </Pressable>

              <Pressable 
                style={styles.taskItem}
                onPress={() => handleTaskAction('服用叶酸')}
              >
                <View style={styles.taskLeft}>
                  <ThemedText style={styles.taskIcon}>💊</ThemedText>
                  <ThemedText style={[styles.taskText, { color: colors.text }]}>
                    服用叶酸
                  </ThemedText>
                </View>
                <ThemedText style={[styles.taskStatus, { color: colors.success }]}>
                  ✓
                </ThemedText>
              </Pressable>

              <Pressable 
                style={styles.taskItem}
                onPress={() => handleTaskAction('产检预约')}
              >
                <View style={styles.taskLeft}>
                  <ThemedText style={styles.taskIcon}>🏥</ThemedText>
                  <ThemedText style={[styles.taskText, { color: colors.text }]}>
                    产检预约提醒 (明天 9:00)
                  </ThemedText>
                </View>
                <ThemedText style={[styles.taskStatus, { color: colors.warning }]}>
                  提醒
                </ThemedText>
              </Pressable>
            </View>
          </Card>

          {/* 一键通知 */}
          <Card variant="default" style={styles.notificationCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                🚨 一键通知
              </ThemedText>
            </View>
            
            <View style={styles.notificationGrid}>
              {/* 显示自定义模板 */}
              {customTemplates.map((template) => (
                <NotificationButton
                  key={template.id}
                  title={template.title}
                  subtitle={template.description}
                  icon={template.icon}
                  variant="secondary"
                  onPress={() => handleCustomTemplatePress(template)}
                  onLongPress={() => handleCustomTemplateLongPress(template)}
                  style={styles.notificationButton}
                />
              ))}
              
              {/* 自定义通知按钮 */}
              <NotificationButton
                title="自定义通知"
                subtitle="创建个性化通知内容"
                icon="✏️"
                variant="custom"
                onPress={handleCustomNotificationSaved}
                style={styles.notificationButton}
              />
            </View>
          </Card>

          {/* 家庭动态 */}
          <Card variant="default" style={styles.familyCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                👨‍👩‍👧‍👦 家庭动态
              </ThemedText>
            </View>
            
            <View style={styles.familyActivity}>
              <View style={styles.activityItem}>
                <ThemedText style={styles.activityIcon}>👨</ThemedText>
                <View style={styles.activityContent}>
                  <ThemedText style={[styles.activityText, { color: colors.text }]}>
                    老公：已完成&quot;购买孕妇奶粉&quot;
                  </ThemedText>
                  <ThemedText style={[styles.activityTime, { color: colors.textSecondary }]}>
                    2小时前
                  </ThemedText>
                </View>
              </View>

              <View style={styles.activityItem}>
                <ThemedText style={styles.activityIcon}>👵</ThemedText>
                <View style={styles.activityContent}>
                  <ThemedText style={[styles.activityText, { color: colors.text }]}>
                    婆婆：分享了一篇育儿文章
                  </ThemedText>
                  <ThemedText style={[styles.activityTime, { color: colors.textSecondary }]}>
                    4小时前
                  </ThemedText>
                </View>
              </View>

              <Pressable style={styles.viewMoreButton}>
                <ThemedText style={[styles.viewMoreText, { color: colors.primary }]}>
                  查看更多
                </ThemedText>
              </Pressable>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* 编辑通知模板模态框 */}
      <EditNotificationModal
        visible={showEditModal}
        onClose={handleEditModalClose}
        onUpdated={handleEditModalUpdated}
        template={editingTemplate}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familySelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    zIndex: 1000,
    elevation: 1000,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  greeting: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  pregnancyCard: {
    marginBottom: Spacing.md,
  },
  taskCard: {
    marginBottom: Spacing.md,
  },
  notificationCard: {
    marginBottom: Spacing.md,
  },
  familyCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  taskList: {
    gap: Spacing.sm,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  taskText: {
    fontSize: FontSizes.body,
    flex: 1,
  },
  taskStatus: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  notificationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  notificationButton: {
    width: '48%',
    maxWidth: 200,
    minHeight: 120,
  },
  familyActivity: {
    gap: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: FontSizes.body,
    marginBottom: Spacing.xs,
  },
  activityTime: {
    fontSize: FontSizes.bodySmall,
  },
  viewMoreButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
  },
  viewMoreText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
});