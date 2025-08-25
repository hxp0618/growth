import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { familyTaskService } from '../../services/familyTaskService';
import { familyMemberService } from '../../services/familyMemberService';
import { useThemeColors } from '../../hooks/useColorScheme';
import { Spacing, BorderRadius, Shadows } from '../../constants/Colors';

interface FamilyMember {
  id: number;
  userId: number;
  nickname: string;
  roleName: string;
}

interface TaskReassignModalProps {
  visible: boolean;
  task: any;
  familyId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const TaskReassignModal: React.FC<TaskReassignModalProps> = ({
  visible,
  task,
  familyId,
  onClose,
  onSuccess,
}) => {
  const colors = useThemeColors();
  
  const [loading, setLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<FamilyMember[]>([]);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (visible) {
      loadFamilyMembers();
    }
  }, [visible]);

  const loadFamilyMembers = async () => {
    try {
      const response = await familyMemberService.getFamilyMemberList({ familyId, status: 1 });
      // 过滤掉当前指定人
      const members = (response.data || []).filter((member: FamilyMember) => 
        !task?.assignedUserIds?.includes(member.userId)
      );
      setFamilyMembers(members);
    } catch (error) {
      console.error('加载家庭成员失败:', error);
      Alert.alert('错误', '加载家庭成员失败');
    }
  };

  const handleMemberToggle = (member: FamilyMember) => {
    const isSelected = selectedMembers.some(m => m.userId === member.userId);
    if (isSelected) {
      // 移除成员
      const newSelectedMembers = selectedMembers.filter(m => m.userId !== member.userId);
      setSelectedMembers(newSelectedMembers);
    } else {
      // 添加成员
      const newSelectedMembers = [...selectedMembers, member];
      setSelectedMembers(newSelectedMembers);
    }
  };

  const handleReassign = async () => {
    if (selectedMembers.length === 0) {
      Alert.alert('错误', '请选择新的指定人');
      return;
    }

    try {
      setLoading(true);
      // 使用更新任务接口而不是转派接口，因为转派接口只支持单个用户
      await familyTaskService.updateTask({
        id: task.id,
        assignedUserIds: selectedMembers.map(m => m.userId),
      });
      
      Alert.alert('成功', '任务转派成功');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('转派任务失败:', error);
      Alert.alert('错误', '转派任务失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAssignedUsersText = () => {
    if (!task?.assignedUserNicknames) {
      return '未指派';
    }
    return task.assignedUserNicknames;
  };

  const getSelectedMembersText = () => {
    if (selectedMembers.length === 0) {
      return '请选择新的指定人';
    }
    if (selectedMembers.length === 1) {
      return selectedMembers[0].nickname;
    }
    return `${selectedMembers.map(m => m.nickname).join('、')} (${selectedMembers.length}人)`;
  };

  const renderMemberItem = (member: FamilyMember) => {
    const isSelected = selectedMembers.some(m => m.userId === member.userId);
    return (
      <TouchableOpacity
        key={member.id}
        style={[
          styles.memberItem,
          isSelected && styles.memberItemSelected,
        ]}
        onPress={() => handleMemberToggle(member)}
      >
        <View style={styles.memberItemContent}>
          <View style={styles.memberInfo}>
            <ThemedText style={[
              styles.memberItemText,
              isSelected && styles.memberItemTextSelected
            ]}>
              {member.nickname}
            </ThemedText>
            <ThemedText style={[
              styles.memberRole,
              isSelected && styles.memberItemTextSelected
            ]}>
              {member.roleName}
            </ThemedText>
          </View>
          {isSelected && (
            <View style={styles.checkmark}>
              <ThemedText style={styles.checkmarkText}>✓</ThemedText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
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
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>转派任务</ThemedText>
            <Button
              title="关闭"
              onPress={onClose}
              style={styles.closeButton}
              textStyle={[styles.closeButtonText, { color: colors.textSecondary }]}
            />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 任务信息 */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>任务信息</ThemedText>
              <View style={[styles.taskInfo, { backgroundColor: colors.backgroundSecondary }]}>
                <ThemedText style={[styles.taskTitle, { color: colors.text }]}>{task?.title}</ThemedText>
                {task?.description && (
                  <ThemedText style={[styles.taskDescription, { color: colors.textSecondary }]}>
                    {task.description}
                  </ThemedText>
                )}
              </View>
            </View>

            {/* 选择新指定人 */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>选择新指定人</ThemedText>
              <View style={styles.memberList}>
                {familyMembers.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberItem,
                      { 
                        backgroundColor: colors.background,
                        borderColor: colors.border
                      },
                      selectedMembers.some(m => m.userId === member.userId) && {
                        backgroundColor: colors.primary + '20',
                        borderColor: colors.primary,
                      }
                    ]}
                    onPress={() => handleMemberToggle(member)}
                  >
                    <View style={styles.memberItemContent}>
                      <View style={styles.memberInfo}>
                        <ThemedText style={[styles.memberName, { color: colors.text }]}>
                          {member.nickname}
                        </ThemedText>
                        <ThemedText style={[styles.memberRole, { color: colors.textSecondary }]}>
                          {member.roleName}
                        </ThemedText>
                      </View>
                      {selectedMembers.some(m => m.userId === member.userId) && (
                        <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                          <ThemedText style={styles.checkmarkText}>✓</ThemedText>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 转派原因 */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>转派原因</ThemedText>
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="请输入转派原因（可选）"
                multiline
                numberOfLines={3}
                style={[styles.reasonInput, { 
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text
                }]}
              />
            </View>
          </ScrollView>

          {/* 操作按钮 */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button
              title="确认转派"
              onPress={handleReassign}
              loading={loading}
              style={[styles.reassignButton, { backgroundColor: colors.primary }]}
              textStyle={styles.reassignButtonText}
            />
          </View>
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
  taskInfo: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    marginBottom: Spacing.xs,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  memberList: {
    gap: Spacing.sm,
  },
  memberItem: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  memberItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  memberRole: {
    fontSize: 12,
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  reassignButton: {
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  reassignButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
});

export default TaskReassignModal;
