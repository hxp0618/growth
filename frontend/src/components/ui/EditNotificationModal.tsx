import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, Shadows } from '@/constants/Colors';
import { useFamily } from '@/contexts/FamilyContext';
import { IconSelector } from '@/components/ui/IconSelector';
import { NotificationTemplate, FamilyMemberResponse, FamilyNotification } from '@/types/api';
import { notificationService } from '@/services/notificationService';
import { familyMemberService } from '@/services/familyMemberService';

export interface EditNotificationModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdated?: (success: boolean) => void;
  template: FamilyNotification | null;
}

export function EditNotificationModal({
  visible,
  onClose,
  onUpdated,
  template,
}: EditNotificationModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentFamily } = useFamily();

  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [customIcon, setCustomIcon] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#007AFF');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberResponse[]>([]);
  const [priority, setPriority] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // 加载家庭成员
  const loadFamilyMembers = useCallback(async () => {
    if (!currentFamily?.id) return;
    
    setLoadingMembers(true);
    try {
      const response = await familyMemberService.getFamilyMemberList({
        familyId: currentFamily.id,
        status: 1 // 只获取启用状态的成员
      });
      if (response.success && response.data) {
        setFamilyMembers(response.data);
      }
    } catch (error) {
      console.error('加载家庭成员失败:', error);
    } finally {
      setLoadingMembers(false);
    }
  }, [currentFamily?.id]);

  // 当模板数据变化时，填充表单
  useEffect(() => {
    if (template) {
      setCustomTitle(template.title || '');
      setCustomContent(template.content || '');
      setCustomIcon(template.svgIcon || '📱');
      setBackgroundColor(template.cardBackColor || '#007AFF');
      setPriority(template.type || 1);
      // 这里可以根据template.receiverRoleIds来设置selectedMembers
      // 但需要先获取角色对应的成员ID
    }
  }, [template]);

  useEffect(() => {
    if (currentFamily?.id && visible) {
      loadFamilyMembers();
    }
  }, [currentFamily?.id, visible, loadFamilyMembers]);

  const handleSave = async () => {
    if (!currentFamily?.id || !template) {
      Alert.alert('错误', '请先在首页选择家庭');
      return;
    }

    if (!customTitle.trim()) {
      Alert.alert('错误', '请输入通知标题');
      return;
    }

    if (!customContent.trim()) {
      Alert.alert('错误', '请输入通知内容');
      return;
    }

    setIsLoading(true);

    try {
      // 将选中的成员ID转换为角色ID
      const selectedRoleIds = selectedMembers.length > 0 
        ? selectedMembers.map(memberId => {
            const member = familyMembers.find(m => m.id === memberId);
            return member?.role?.id;
          }).filter(Boolean) // 过滤掉undefined值
        : undefined;

      // 更新通知模板
      const templateData = {
        title: customTitle.trim(),
        content: customContent.trim(),
        svgIcon: customIcon || '📱',
        cardBackColor: backgroundColor,
        familyId: currentFamily.id,
        type: priority === 3 ? 3 : priority === 2 ? 2 : 1,
        category: 'custom',
        receiverRoleIds: selectedRoleIds,
        remark: '自定义模版',
      };

      const success = await notificationService.updateNotificationTemplate(template.id, templateData);
      
      if (success) {
        Alert.alert('成功', '通知模版已更新！', [
          {
            text: '确定',
            onPress: () => {
              onUpdated?.(true);
              onClose();
            }
          }
        ]);
      } else {
        Alert.alert('失败', '更新通知模版失败，请重试');
        onUpdated?.(false);
      }
    } catch (error) {
      console.error('更新模版失败:', error);
      Alert.alert('错误', '更新模版时发生错误');
      onUpdated?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!template) return;

    Alert.alert(
      '确认删除',
      '确定要删除这个自定义模版吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await notificationService.deleteNotificationTemplate(template.id);
              if (success) {
                Alert.alert('成功', '模版已删除');
                onUpdated?.(true);
                onClose();
              } else {
                Alert.alert('失败', '删除模版失败');
              }
            } catch (error) {
              console.error('删除模版失败:', error);
              Alert.alert('错误', '删除模版时发生错误');
            }
          }
        }
      ]
    );
  };

  const getPriorityColor = (level: number) => {
    switch (level) {
      case 3:
        return colors.error;
      case 2:
        return colors.warning || '#FFA500';
      default:
        return colors.primary;
    }
  };

  const getPriorityText = (level: number) => {
    switch (level) {
      case 3:
        return '紧急';
      case 2:
        return '重要';
      default:
        return '普通';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: colors.text }]}>取消</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>编辑通知模版</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.headerButton, styles.deleteButton]}
              disabled={isLoading}
            >
              <Text style={[styles.headerButtonText, { color: colors.error }]}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.headerButton, styles.saveButton]}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={[styles.headerButtonText, { color: colors.primary }]}>
                  保存
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 通知内容编辑 */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>通知内容</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>通知标题</Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholder="请输入通知标题"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>通知内容</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={customContent}
                onChangeText={setCustomContent}
                placeholder="请输入通知内容"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>通知图标</Text>
              <IconSelector
                selectedIcon={customIcon}
                onIconSelect={setCustomIcon}
                style={styles.iconSelector}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>卡片背景颜色</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
                {['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5856D6', '#FF2D92', '#5AC8FA'].map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      backgroundColor === color && styles.selectedColorOption
                    ]}
                    onPress={() => setBackgroundColor(color)}
                  >
                    {backgroundColor === color && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>优先级</Text>
              <View style={styles.priorityContainer}>
                {[1, 2, 3].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.priorityButton,
                      { backgroundColor: getPriorityColor(level) },
                      priority === level && styles.selectedPriorityButton
                    ]}
                    onPress={() => setPriority(level)}
                  >
                    <Text style={styles.priorityButtonText}>
                      {getPriorityText(level)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginRight: Spacing.sm,
  },
  saveButton: {
    backgroundColor: 'transparent',
  },
  headerButtonText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  headerTitle: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.semibold,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.body,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.body,
    minHeight: 100,
  },
  iconSelector: {
    minHeight: 60,
  },
  colorScroll: {
    marginVertical: Spacing.sm,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    opacity: 0.7,
  },
  selectedPriorityButton: {
    opacity: 1,
  },
  priorityButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
});
