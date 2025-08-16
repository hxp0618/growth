import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Card } from '../ui/Card';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { familyMemberService } from '../../services/familyMemberService';
import { familyService } from '../../services/familyService';
import { FamilyMemberResponse, FamilyResponse } from '../../types/api';
import { useFamily } from '../../contexts/FamilyContext';

interface FamilyMembersProps {
  onInviteMember?: () => void;
}

export function FamilyMembers({ onInviteMember }: FamilyMembersProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentFamily } = useFamily();
  
  const [members, setMembers] = useState<FamilyMemberResponse[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<FamilyMemberResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState<string>('');

  // 获取家庭成员列表
  const fetchFamilyMembers = async () => {
    if (!currentFamily?.id) return;

    setIsLoading(true);
    try {
      // 获取所有家庭成员
      const allMembersResponse = await familyMemberService.getFamilyMemberList({
        familyId: currentFamily.id,
        status: 1, // 只获取正常状态的成员
      });

      if (allMembersResponse.success && allMembersResponse.data) {
        setMembers(allMembersResponse.data);
      }

      // 获取在线家庭成员（基于StpUtil.isLogin）
      const onlineResponse = await familyMemberService.getOnlineFamilyMembers({
        familyId: currentFamily.id,
      });

      if (onlineResponse.success && onlineResponse.data) {
        setOnlineMembers(onlineResponse.data);
      }
    } catch (error) {
      console.error('获取家庭成员失败:', error);
      Alert.alert('错误', '获取家庭成员失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取家庭邀请码
  const fetchInviteCode = async () => {
    if (!currentFamily?.id) return;

    try {
      const response = await familyService.getFamilyDetail(currentFamily.id);
      if (response.success && response.data) {
        setInviteCode(response.data.inviteCode);
      }
    } catch (error) {
      console.error('获取邀请码失败:', error);
      Alert.alert('错误', '获取邀请码失败');
    }
  };

  // 处理邀请更多成员
  const handleInviteMore = () => {
    fetchInviteCode();
    setShowInviteModal(true);
  };

  // 复制邀请码
  const copyInviteCode = async () => {
    try {
      await Clipboard.setStringAsync(inviteCode);
      Alert.alert('成功', '邀请码已复制到剪贴板');
    } catch (error) {
      console.error('复制邀请码失败:', error);
      Alert.alert('错误', '复制邀请码失败');
    }
  };

  // 获取成员头像
  const getMemberAvatar = (member: FamilyMemberResponse) => {
    if (member.user?.avatar) {
      return member.user.avatar;
    }
    
    // 根据角色返回默认头像
    const roleCode = member.role?.roleCode || '';
    switch (roleCode) {
      case 'MOTHER':
        return '👩';
      case 'FATHER':
        return '👨';
      case 'GRANDFATHER':
        return '👴';
      case 'GRANDMOTHER':
        return '👵';
      default:
        return '👤';
    }
  };

  // 获取成员颜色
  const getMemberColor = (member: FamilyMemberResponse) => {
    const roleCode = member.role?.roleCode || '';
    switch (roleCode) {
      case 'MOTHER':
        return colors.pregnant;
      case 'FATHER':
        return colors.partner;
      case 'GRANDFATHER':
      case 'GRANDMOTHER':
        return colors.grandparent;
      default:
        return colors.secondary;
    }
  };

  // 判断成员是否在线
  const isMemberOnline = (member: FamilyMemberResponse) => {
    // 这里可以根据实际需求实现在线状态判断
    // 比如根据最后活跃时间、设备Token状态等
    return member.status === 1;
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, [currentFamily?.id]);

  if (isLoading) {
    return (
      <Card variant="default" style={styles.loadingCard}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            加载家庭成员中...
          </ThemedText>
        </View>
      </Card>
    );
  }

  return (
    <>
      <Card variant="default" style={styles.membersCard}>
        <View style={styles.cardHeader}>
          <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
            👨‍👩‍👧‍👦 家庭成员 ({onlineMembers.length}人在线)
          </ThemedText>
        </View>
        
        {onlineMembers.length > 0 ? (
          <View style={styles.membersList}>
            {onlineMembers.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <View style={styles.memberAvatar}>
                  <ThemedText style={styles.memberAvatarText}>
                    {getMemberAvatar(member)}
                  </ThemedText>
                  {isMemberOnline(member) && (
                    <View style={[styles.onlineIndicator, { backgroundColor: colors.success }]} />
                  )}
                </View>
                <View style={styles.memberInfo}>
                  <ThemedText style={[styles.memberName, { color: colors.text }]}>
                    {member.user?.nickname || member.nickname || '未知用户'}
                  </ThemedText>
                  <ThemedText style={[styles.memberRole, { color: colors.textSecondary }]}>
                    {member.role?.roleName || '成员'}
                  </ThemedText>
                </View>
                <View style={[styles.memberColorIndicator, { backgroundColor: getMemberColor(member) }]} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              暂无在线家庭成员
            </ThemedText>
          </View>
        )}

        <TouchableOpacity
          style={[styles.inviteButton, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
          onPress={handleInviteMore}
        >
          <ThemedText style={[styles.inviteButtonText, { color: colors.primary }]}>
            邀请更多成员
          </ThemedText>
        </TouchableOpacity>
      </Card>

      {/* 邀请码模态框 */}
      <Modal
        visible={showInviteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
              邀请家庭成员
            </ThemedText>
            
            <ThemedText style={[styles.modalDescription, { color: colors.textSecondary }]}>
              分享以下邀请码给想要加入的家庭成员：
            </ThemedText>

            <View style={[styles.inviteCodeContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <ThemedText style={[styles.inviteCode, { color: colors.text }]}>
                {inviteCode || '加载中...'}
              </ThemedText>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.copyButton, { backgroundColor: colors.primary }]}
                onPress={copyInviteCode}
              >
                <ThemedText style={[styles.modalButtonText, { color: colors.neutral100 }]}>
                  复制邀请码
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => setShowInviteModal(false)}
              >
                <ThemedText style={[styles.modalButtonText, { color: colors.text }]}>
                  关闭
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  membersCard: {
    marginBottom: Spacing.md,
  },
  loadingCard: {
    marginBottom: Spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.body,
  },
  cardHeader: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  membersList: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  memberAvatar: {
    position: 'relative',
  },
  memberAvatarText: {
    fontSize: 32,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  memberRole: {
    fontSize: FontSizes.bodySmall,
  },
  memberColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.body,
  },
  inviteButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  inviteButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalDescription: {
    fontSize: FontSizes.body,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  inviteCodeContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  inviteCode: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
    letterSpacing: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  copyButton: {
    // 样式已在modalButton中定义
  },
  cancelButton: {
    // 样式已在modalButton中定义
  },
  modalButtonText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
});
