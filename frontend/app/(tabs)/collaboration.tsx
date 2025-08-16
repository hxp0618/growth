import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { FamilyMembers } from '@/components/family';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// 移除旧的FamilyMember接口，使用API类型

interface Task {
  id: string;
  title: string;
  assignee?: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

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

  // 移除静态家庭成员数据，使用FamilyMembers组件

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '购买孕妇奶粉',
      assignee: {
        id: '2',
        name: '老公',
        role: '准爸爸',
        avatar: '👨',
      },
      status: 'in_progress',
      priority: 'medium',
    },
    {
      id: '2',
      title: '预约下次产检',
      assignee: {
        id: '4',
        name: '妈妈',
        role: '祖母',
        avatar: '👵',
      },
      status: 'completed',
      priority: 'high',
    },
    {
      id: '3',
      title: '准备待产包',
      status: 'pending',
      priority: 'medium',
    },
  ]);

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

  const handleTaskAction = (taskId: string, action: string) => {
    Alert.alert('任务操作', `${action}功能正在开发中...`);
  };

  const handleAddTask = () => {
    Alert.alert('添加任务', '添加新任务功能正在开发中...');
  };

  // 移除handleInviteMember，由FamilyMembers组件处理

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'in_progress':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '已完成 ✓';
      case 'in_progress':
        return '进行中';
      default:
        return '待开始';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 页面标题 */}
        <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            家庭协作
          </ThemedText>
        </ThemedView>

        <View style={styles.content}>
          {/* 家庭成员 */}
          <FamilyMembers />

          {/* 待办任务 */}
          <Card variant="default" style={styles.tasksCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                📋 待办任务 ({tasks.filter(t => t.status !== 'completed').length}项)
              </ThemedText>
            </View>
            
            <View style={styles.tasksList}>
              {tasks.map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={styles.taskContent}>
                    <View style={styles.taskHeader}>
                      <ThemedText style={[styles.taskTitle, { color: colors.text }]}>
                        {task.title}
                      </ThemedText>
                      <ThemedText style={[styles.taskStatus, { color: getStatusColor(task.status) }]}>
                        {getStatusText(task.status)}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.taskMeta}>
                      {task.assignee ? (
                        <View style={styles.assigneeInfo}>
                          <ThemedText style={styles.assigneeAvatar}>
                            {task.assignee.avatar}
                          </ThemedText>
                          <ThemedText style={[styles.assigneeName, { color: colors.textSecondary }]}>
                            {task.assignee.name}
                          </ThemedText>
                        </View>
                      ) : (
                        <Pressable
                          style={[styles.claimButton, { backgroundColor: colors.secondary }]}
                          onPress={() => handleTaskAction(task.id, '认领任务')}
                        >
                          <ThemedText style={[styles.claimButtonText, { color: colors.neutral100 }]}>
                            认领
                          </ThemedText>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <Pressable
              style={[styles.addTaskButton, { backgroundColor: colors.primary }]}
              onPress={handleAddTask}
            >
              <ThemedText style={[styles.addTaskButtonText, { color: colors.neutral100 }]}>
                + 添加新任务
              </ThemedText>
            </Pressable>
          </Card>

          {/* 家庭消息 */}
          <Card variant="default" style={styles.messagesCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                💬 家庭消息
              </ThemedText>
            </View>
            
            <View style={styles.messagesList}>
              {messages.map((message) => (
                <View key={message.id} style={styles.messageItem}>
                  <ThemedText style={styles.messageAvatar}>
                    {message.sender.avatar}
                  </ThemedText>
                  <View style={styles.messageContent}>
                    <View style={styles.messageHeader}>
                      <ThemedText style={[styles.messageSender, { color: colors.text }]}>
                        {message.sender.name}
                      </ThemedText>
                      <ThemedText style={[styles.messageTime, { color: colors.textSecondary }]}>
                        {message.timestamp}
                      </ThemedText>
                    </View>
                    <ThemedText style={[styles.messageText, { color: colors.textSecondary }]}>
                      {message.content}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>

            <Pressable style={styles.viewAllButton}>
              <ThemedText style={[styles.viewAllText, { color: colors.primary }]}>
                查看全部
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
  tasksCard: {
    marginBottom: Spacing.md,
  },
  messagesCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  tasksList: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  taskItem: {
    paddingVertical: Spacing.sm,
  },
  taskContent: {
    gap: Spacing.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    flex: 1,
    marginRight: Spacing.sm,
  },
  taskStatus: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  assigneeAvatar: {
    fontSize: 16,
  },
  assigneeName: {
    fontSize: FontSizes.bodySmall,
  },
  claimButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  claimButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  addTaskButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  addTaskButtonText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  messagesList: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  messageItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
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
  },
  viewAllText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
});