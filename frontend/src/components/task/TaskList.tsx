import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Button } from '../Button';
import TaskReassignModal from './TaskReassignModal';
import TaskDetailModal from './TaskDetailModal';
import TaskStats from './TaskStats';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { familyTaskService } from '../../services/familyTaskService';
import { useThemeColors } from '../../hooks/useColorScheme';
import { Spacing, BorderRadius, Shadows } from '../../constants/Colors';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: number;
  statusText: string;
  assignedUserIds: number[];
  assignedUserNicknames: string; // 逗号分隔的字符串
  creatorId: number;
  creatorNickname: string;
  priority: number;
  priorityText: string;
  expectedCompletionTime?: string;
  actualCompletionTime?: string;
  remark?: string;
  createTime: string;
  updateTime: string;
}

interface TaskListProps {
  familyId: number;
  currentUserId: number;
  onTaskPress?: (task: Task) => void;
  onAddTask?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  familyId,
  currentUserId,
  onTaskPress,
  onAddTask,
}) => {
  const colors = useThemeColors();
  
  // 测试 familyTaskService 是否可用
  console.log('TaskList 组件初始化');
  console.log('familyTaskService 类型:', typeof familyTaskService);
  console.log('familyTaskService 实例:', familyTaskService);
  console.log('familyTaskService.getTaskList 类型:', typeof familyTaskService?.getTaskList);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedTaskForReassign, setSelectedTaskForReassign] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);

  const loadTasks = async () => {
    try {
      console.log('开始加载任务，familyId:', familyId);
      console.log('familyTaskService:', familyTaskService);
      console.log('familyTaskService.getTaskList:', familyTaskService?.getTaskList);
      
      if (!familyTaskService) {
        console.error('familyTaskService 是 undefined');
        Alert.alert('错误', '服务未初始化');
        return;
      }
      
      if (!familyTaskService.getTaskList) {
        console.error('familyTaskService.getTaskList 是 undefined');
        Alert.alert('错误', '服务方法未找到');
        return;
      }
      
      setLoading(true);
      const response = await familyTaskService.getTaskList({ familyId });
      console.log('任务加载响应:', response);
      setTasks(response || []);
    } catch (error) {
      console.error('加载任务失败:', error);
      console.error('错误详情:', {
        message: error instanceof Error ? error.message : '未知错误',
        stack: error instanceof Error ? error.stack : undefined
      });
      Alert.alert('错误', '加载任务失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  useEffect(() => {
    loadTasks();
  }, [familyId]);

  const handleTaskPress = (task: Task) => {
    // 显示任务详情
    setSelectedTaskForDetail(task);
    setShowDetailModal(true);
  };

  const handleEditTask = () => {
    if (selectedTaskForDetail) {
      onTaskPress?.(selectedTaskForDetail);
    }
    setShowDetailModal(false);
  };

  const handleTaskFormSuccess = () => {
    // 任务创建或更新成功后刷新列表
    loadTasks();
  };

  const handleLongPress = (task: Task) => {
    // 如果是未指派的任务，显示认领选项
    if (!task.assignedUserIds || task.assignedUserIds.length === 0) {
      Alert.alert(
        '任务操作',
        '选择操作',
        [
          {
            text: '认领任务',
            onPress: () => claimTask(task.id),
          },
          {
            text: '取消',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    // 如果是指派给当前用户的任务
    if (task.assignedUserIds.includes(currentUserId)) {
      if (task.status === 1) {
        Alert.alert(
          '任务操作',
          '选择操作',
          [
            {
              text: '开始任务',
              onPress: () => startTask(task.id),
            },
            {
              text: '转派任务',
              onPress: () => reassignTask(task),
            },
            {
              text: '取消',
              style: 'cancel',
            },
          ]
        );
      } else if (task.status === 2) {
        Alert.alert(
          '任务操作',
          '选择操作',
          [
            {
              text: '完成任务',
              onPress: () => completeTask(task.id),
            },
            {
              text: '转派任务',
              onPress: () => reassignTask(task),
            },
            {
              text: '取消',
              style: 'cancel',
            },
          ]
        );
      }
    }
  };

  const startTask = async (taskId: number) => {
    try {
      await familyTaskService.startTask(taskId);
      Alert.alert('成功', '任务已开始');
      loadTasks();
    } catch (error) {
      console.error('开始任务失败:', error);
      Alert.alert('错误', '开始任务失败，请重试');
    }
  };

  const completeTask = async (taskId: number) => {
    try {
      await familyTaskService.completeTask(taskId);
      Alert.alert('成功', '任务已完成');
      loadTasks();
    } catch (error) {
      console.error('完成任务失败:', error);
      Alert.alert('错误', '完成任务失败，请重试');
    }
  };

  const claimTask = async (taskId: number) => {
    try {
      await familyTaskService.updateTask({
        id: taskId,
        assignedUserIds: [currentUserId],
      });
      Alert.alert('成功', '任务认领成功');
      loadTasks();
    } catch (error) {
      console.error('认领任务失败:', error);
      Alert.alert('错误', '认领任务失败，请重试');
    }
  };

  const reassignTask = (task: Task) => {
    setSelectedTaskForReassign(task);
    setShowReassignModal(true);
  };

  const handleReassignSuccess = () => {
    loadTasks();
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return colors.textSecondary;
      case 2: return colors.warning;
      case 3: return colors.success;
      case 4: return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return colors.textSecondary;
      case 2: return colors.info;
      case 3: return colors.warning;
      case 4: return colors.error;
      default: return colors.info;
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...Shadows.md
        },
        item.status === 3 && { 
          opacity: 0.6,
          backgroundColor: colors.backgroundSecondary 
        }, // 已完成任务样式
        item.status === 4 && { 
          opacity: 0.5,
          backgroundColor: colors.backgroundSecondary 
        }, // 已取消任务样式
      ]}
      onPress={() => handleTaskPress(item)}
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.taskHeader}>
        <ThemedText style={[styles.taskTitle, { color: colors.text }]}>{item.title}</ThemedText>
        <View style={styles.taskStatus}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.statusText}
          </Text>
        </View>
      </View>

      {item.description && (
        <ThemedText style={[styles.taskDescription, { color: colors.textSecondary }]}>
          {item.description}
        </ThemedText>
      )}

      <View style={styles.taskInfo}>
        <View style={styles.taskInfoRow}>
          <ThemedText style={[styles.taskInfoLabel, { color: colors.textSecondary }]}>指定人：</ThemedText>
          {item.assignedUserIds && item.assignedUserIds.length > 0 ? (
            <View style={styles.assignedUsersContainer}>
              {item.assignedUserNicknames && item.assignedUserNicknames.trim() ? (
                <ThemedText style={[styles.taskInfoValue, { color: colors.text }]}>
                  {item.assignedUserNicknames}
                </ThemedText>
              ) : (
                <ThemedText style={[styles.taskInfoValue, { color: colors.textSecondary }]}>
                  用户ID: {item.assignedUserIds.join(', ')}
                </ThemedText>
              )}
            </View>
          ) : (
            <View style={[styles.claimButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.claimButtonText}>认领</Text>
            </View>
          )}
        </View>
        <View style={styles.taskInfoRow}>
          <ThemedText style={[styles.taskInfoLabel, { color: colors.textSecondary }]}>优先级：</ThemedText>
          <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
            {item.priorityText}
          </Text>
        </View>
      </View>

      {item.expectedCompletionTime && (
        <View style={styles.taskInfoRow}>
          <ThemedText style={[styles.taskInfoLabel, { color: colors.textSecondary }]}>预计完成：</ThemedText>
          <ThemedText style={[styles.taskInfoValue, { color: colors.text }]}>
            {new Date(item.expectedCompletionTime).toLocaleDateString()}
          </ThemedText>
        </View>
      )}

      <View style={[styles.taskFooter, { borderTopColor: colors.border }]}>
        <ThemedText style={[styles.taskCreator, { color: colors.textSecondary }]}>
          创建者：{item.creatorNickname}
        </ThemedText>
        <ThemedText style={[styles.taskTime, { color: colors.textSecondary }]}>
          {new Date(item.createTime).toLocaleDateString()}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* 任务统计 */}
      {tasks.length > 0 && (
        <TaskStats tasks={tasks} currentUserId={currentUserId} />
      )}

      <View style={styles.header}>
        <ThemedText style={[styles.headerTitle, { color: colors.text }]}>待办任务 ({tasks.length}项)</ThemedText>
        <Button
          title="+ 添加新任务"
          onPress={onAddTask}
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          textStyle={styles.addButtonText}
        />
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.taskList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>暂无任务</ThemedText>
          </View>
        }
      />

      {/* 转派任务模态框 */}
      {selectedTaskForReassign && (
        <TaskReassignModal
          visible={showReassignModal}
          task={selectedTaskForReassign}
          familyId={familyId}
          onClose={() => {
            setShowReassignModal(false);
            setSelectedTaskForReassign(null);
          }}
          onSuccess={handleReassignSuccess}
        />
      )}

      {/* 任务详情模态框 */}
      <TaskDetailModal
        visible={showDetailModal}
        task={selectedTaskForDetail}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTaskForDetail(null);
        }}
        onEdit={handleEditTask}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
  },
  addButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    flex: 1,
  },
  taskStatus: {
    marginLeft: Spacing.sm,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  taskInfo: {
    marginBottom: Spacing.sm,
  },
  taskInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskInfoLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  taskInfoValue: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  assignedUsersContainer: {
    flex: 1,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: 16,
  },
  claimButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  taskCreator: {
    fontSize: 12,
  },
  taskTime: {
    fontSize: 12,
  },
});

export default TaskList;
