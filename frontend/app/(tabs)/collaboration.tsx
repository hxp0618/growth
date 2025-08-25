import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { FamilyMembers } from '@/components/family';
import { TaskList, TaskForm } from '@/components/task';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, EmotionalColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { useFamily } from '@/contexts/FamilyContext';

// 移除旧的FamilyMember接口，使用API类型

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  type: 'text' | 'task_completion' | 'sharing';
}

export default function CollaborationScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const { currentFamily } = useFamily();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [refreshTasks, setRefreshTasks] = useState(0);

  // 移除静态任务数据，使用TaskList组件

  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: {
        id: '2',
        name: '老公',
        role: '准爸爸',
        avatar: '👨',
      },
      content: '奶粉已经买好了 ❤️',
      timestamp: '2小时前',
      type: 'task_completion',
    },
    {
      id: '2',
      sender: {
        id: '4',
        name: '妈妈',
        role: '祖母',
        avatar: '👵',
      },
      content: '产检已预约，周三上午',
      timestamp: '4小时前',
      type: 'task_completion',
    },
  ]);

  const handleTaskPress = (task: any) => {
    // 点击任务可以查看详情或编辑
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleAddTask = () => {
    // 添加新任务
    setSelectedTask(null);
    setShowTaskForm(true);
  };

  const handleTaskSuccess = () => {
    // 任务操作成功后关闭表单
    setShowTaskForm(false);
    setSelectedTask(null);
    // 强制刷新任务列表
    setRefreshTasks(prev => prev + 1);
  };

  // 移除handleInviteMember，由FamilyMembers组件处理



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.neutral200 }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 页面标题 */}
        <ThemedView style={[styles.header, { backgroundColor: colors.primary }]}>
          <ThemedText style={[styles.title, { color: '#FFFFFF', fontWeight: '600' }]}>
            🏠 家庭协作
          </ThemedText>
        </ThemedView>

        <View style={styles.content}>
          {/* 调试信息 */}
          {__DEV__ && (
            <Card variant="default" style={[styles.debugCard, { backgroundColor: colors.neutral100, borderColor: colors.neutral300 }]}>
              <ThemedText style={[styles.debugText, { color: colors.textSecondary }]}>
                调试信息：用户ID={user?.id}, 家庭ID={currentFamily?.id}
              </ThemedText>
            </Card>
          )}

          {/* 家庭成员 */}
          <View style={[styles.sectionCard, { backgroundColor: colors.neutral100, borderColor: colors.primaryLight }]}>
            <FamilyMembers />
          </View>

          {/* 待办任务 */}
          {currentFamily && user ? (
            <View style={[styles.sectionCard, { backgroundColor: colors.neutral100, borderColor: colors.primaryLight }]}>
              <View style={[styles.cardHeader, { backgroundColor: EmotionalColors.love, borderBottomColor: colors.primaryLight }]}>
                <ThemedText style={[styles.cardTitle, { color: colors.primary }]}>
                  📋 家庭任务
                </ThemedText>
              </View>
              <View style={styles.cardContent}>
                <TaskList
                  key={refreshTasks}
                  familyId={currentFamily.id}
                  currentUserId={user.id}
                  onTaskPress={handleTaskPress}
                  onAddTask={handleAddTask}
                />
              </View>
            </View>
          ) : (
            <View style={[styles.sectionCard, { backgroundColor: colors.neutral100, borderColor: colors.primaryLight }]}>
              <View style={styles.emptyState}>
                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                  请先加入家庭以查看任务
                </ThemedText>
              </View>
            </View>
          )}

          {/* 家庭消息 */}
          <View style={[styles.sectionCard, { backgroundColor: colors.neutral100, borderColor: colors.primaryLight }]}>
            <View style={[styles.cardHeader, { backgroundColor: EmotionalColors.calm, borderBottomColor: colors.primaryLight }]}>
              <ThemedText style={[styles.cardTitle, { color: colors.secondary }]}>
                💬 家庭消息
              </ThemedText>
            </View>
            
            <View style={[styles.cardContent, styles.messagesList]}>
              {messages.map((message) => (
                <View key={message.id} style={[styles.messageItem, { backgroundColor: EmotionalColors.warm, borderColor: colors.primaryLight }]}>
                  <ThemedText style={styles.messageAvatar}>
                    {message.sender.avatar}
                  </ThemedText>
                  <View style={styles.messageContent}>
                    <View style={styles.messageHeader}>
                      <ThemedText style={[styles.messageSender, { color: colors.primary }]}>
                        {message.sender.name}
                      </ThemedText>
                      <ThemedText style={[styles.messageTime, { color: colors.textSecondary }]}>
                        {message.timestamp}
                      </ThemedText>
                    </View>
                    <ThemedText style={[styles.messageText, { color: colors.text }]}>
                      {message.content}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>

            <Pressable style={[styles.viewAllButton, { backgroundColor: EmotionalColors.hope }]}>
              <ThemedText style={[styles.viewAllText, { color: colors.secondary }]}>
                查看全部 →
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* 悬浮添加按钮 */}
      {currentFamily && (
        <Pressable 
          style={[styles.floatingButton, { backgroundColor: colors.primary }]}
          onPress={handleAddTask}
        >
          <ThemedText style={styles.floatingButtonText}>+ 新建任务</ThemedText>
        </Pressable>
      )}

      {/* 任务表单 */}
      {currentFamily && showTaskForm && (
        <TaskForm
          visible={showTaskForm}
          familyId={currentFamily.id}
          onClose={() => setShowTaskForm(false)}
          onSuccess={handleTaskSuccess}
          initialData={selectedTask}
        />
      )}
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  sectionCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tasksCard: {
    marginBottom: Spacing.md,
  },
  messagesCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  cardTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  cardContent: {
    padding: Spacing.md,
  },
  messagesList: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  messageItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  messageAvatar: {
    fontSize: 20,
  },
  messageContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageSender: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  messageTime: {
    fontSize: FontSizes.bodySmall,
  },
  messageText: {
    fontSize: FontSizes.body,
  },
  viewAllButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  viewAllText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
  emptyState: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FontSizes.body,
    textAlign: 'center',
  },
  debugCard: {
    marginBottom: Spacing.sm,
  },
  debugText: {
    fontSize: FontSizes.bodySmall,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
  },
});