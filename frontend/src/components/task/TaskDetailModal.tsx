import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { Button } from '../Button';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { useThemeColors } from '../../hooks/useColorScheme';
import { Spacing, BorderRadius, Shadows } from '../../constants/Colors';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: number;
  statusText: string;
  assignedUserIds: number[];
  assignedUserNicknames: string[];
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

interface TaskDetailModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit?: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  visible,
  task,
  onClose,
  onEdit,
}) => {
  const colors = useThemeColors();
  
  if (!task) return null;

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

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAssignedUsersText = () => {
    if (!task.assignedUserIds || task.assignedUserIds.length === 0) {
      return '未指派';
    }
    if (task.assignedUserNicknames) {
      return task.assignedUserNicknames;
    }
    return `${task.assignedUserIds.length}人`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            ...Shadows.lg
          }
        ]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>任务详情</ThemedText>
            <Button
              title="关闭"
              onPress={onClose}
              style={styles.closeButton}
              textStyle={[styles.closeButtonText, { color: colors.textSecondary }]}
            />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 任务标题 */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>任务标题</ThemedText>
              <ThemedText style={[styles.taskTitle, { color: colors.text }]}>{task.title}</ThemedText>
            </View>

            {/* 任务说明 */}
            {task.description && (
              <View style={styles.section}>
                <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>任务说明</ThemedText>
                <ThemedText style={[styles.taskDescription, { color: colors.textSecondary }]}>{task.description}</ThemedText>
              </View>
            )}

            {/* 任务状态 */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>任务状态</ThemedText>
              <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                  <ThemedText style={styles.statusText}>{task.statusText}</ThemedText>
                </View>
              </View>
            </View>

            {/* 任务信息 */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>任务信息</ThemedText>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>指定人</ThemedText>
                  <ThemedText style={[styles.infoValue, { color: colors.text }]}>{getAssignedUsersText()}</ThemedText>
                </View>
                <View style={styles.infoItem}>
                  <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>创建者</ThemedText>
                  <ThemedText style={[styles.infoValue, { color: colors.text }]}>{task.creatorNickname}</ThemedText>
                </View>
                <View style={styles.infoItem}>
                  <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>优先级</ThemedText>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                    <ThemedText style={styles.priorityText}>{task.priorityText}</ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {/* 时间信息 */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>时间信息</ThemedText>
              <View style={styles.timeInfo}>
                <View style={styles.timeItem}>
                  <ThemedText style={[styles.timeLabel, { color: colors.textSecondary }]}>创建时间</ThemedText>
                  <ThemedText style={[styles.timeValue, { color: colors.text }]}>{formatDateTime(task.createTime)}</ThemedText>
                </View>
                <View style={styles.timeItem}>
                  <ThemedText style={[styles.timeLabel, { color: colors.textSecondary }]}>更新时间</ThemedText>
                  <ThemedText style={[styles.timeValue, { color: colors.text }]}>{formatDateTime(task.updateTime)}</ThemedText>
                </View>
                {task.expectedCompletionTime && (
                  <View style={styles.timeItem}>
                    <ThemedText style={[styles.timeLabel, { color: colors.textSecondary }]}>预计完成</ThemedText>
                    <ThemedText style={[styles.timeValue, { color: colors.text }]}>{formatDateTime(task.expectedCompletionTime)}</ThemedText>
                  </View>
                )}
                {task.actualCompletionTime && (
                  <View style={styles.timeItem}>
                    <ThemedText style={[styles.timeLabel, { color: colors.textSecondary }]}>实际完成</ThemedText>
                    <ThemedText style={[styles.timeValue, { color: colors.text }]}>{formatDateTime(task.actualCompletionTime)}</ThemedText>
                  </View>
                )}
              </View>
            </View>

            {/* 备注信息 */}
            {task.remark && (
              <View style={styles.section}>
                <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>备注信息</ThemedText>
                <ThemedText style={[styles.taskRemark, { color: colors.textSecondary }]}>{task.remark}</ThemedText>
              </View>
            )}
          </ScrollView>

          {/* 操作按钮 */}
          {onEdit && (
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <Button
                title="编辑任务"
                onPress={onEdit}
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                textStyle={styles.editButtonText}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: BorderRadius.lg,
    width: '90%',
    maxHeight: '85%',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
  },
  closeButton: {
    backgroundColor: 'transparent',
  },
  closeButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    marginBottom: Spacing.sm,
  },
  taskTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    lineHeight: 24,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  infoGrid: {
    gap: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    flex: 1,
    textAlign: 'right',
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  timeInfo: {
    gap: Spacing.sm,
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
  },
  timeValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  taskRemark: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  editButton: {
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
});

export default TaskDetailModal;
