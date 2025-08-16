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
import { NotificationTemplate, FamilyMemberResponse } from '@/types/api';
import { notificationService } from '@/services/notificationService';
import { familyMemberService } from '@/services/familyMemberService';

export interface CustomNotificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSent?: (success: boolean) => void;
}

export function CustomNotificationModal({
  visible,
  onClose,
  onSent,
}: CustomNotificationModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentFamily } = useFamily();

  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [customIcon, setCustomIcon] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#007AFF');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberResponse[]>([]);
  const [priority, setPriority] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // 新增状态
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date>(new Date());
  const [showAllTemplates, setShowAllTemplates] = useState(false);

  const templates = showAllTemplates
    ? notificationService.getAllNotificationTemplates()
    : notificationService.getNotificationTemplates();

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

  useEffect(() => {
    if (currentFamily?.id && visible) {
      loadFamilyMembers();
    }
  }, [currentFamily?.id, visible, loadFamilyMembers]);

  const handleTemplateSelect = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setCustomTitle(template.title);
    setCustomContent(template.content);
    setCustomIcon(template.icon);
    setBackgroundColor('#007AFF'); // 默认背景色
    setPriority(template.priority);
  };

  const handleCustomMode = () => {
    setSelectedTemplate(null);
    setCustomTitle('');
    setCustomContent('');
    setCustomIcon('📱');
    setBackgroundColor('#007AFF'); // 默认背景色
    setPriority(1);
  };

  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleSave = async () => {
    if (!currentFamily?.id) {
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

      // 直接保存为通知模板
      const templateData = {
        title: customTitle.trim(),
        content: customContent.trim(),
        svgIcon: customIcon || '📱',
        cardBackColor: backgroundColor,
        familyId: currentFamily.id,
        type: priority === 3 ? 3 : priority === 2 ? 2 : 1,
        category: 'custom',
        receiverRoleIds: selectedRoleIds,
        remark: isScheduled ? `定时通知: ${scheduledTime.toLocaleString()}` : '自定义模版',
      };

      const success = await notificationService.createNotificationTemplate(templateData);
      
      if (success) {
        Alert.alert('成功', '通知模版已保存！', [
          {
            text: '确定',
            onPress: () => {
              onSent?.(true);
              resetForm();
            }
          }
        ]);
      } else {
        Alert.alert('失败', '保存通知模版失败，请重试');
        onSent?.(false);
      }
    } catch (error) {
      console.error('保存模版失败:', error);
      Alert.alert('错误', '保存模版时发生错误');
      onSent?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
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
              // 提取真实的模版ID
              const realTemplateId = templateId.replace('template_', '');
              const response = await fetch(`/api/notifications/${realTemplateId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${await AsyncStorage.getItem('auth_token')}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (response.ok) {
                Alert.alert('成功', '模版已删除');
                // 刷新模版列表
                setShowAllTemplates(prev => !prev);
                setTimeout(() => setShowAllTemplates(prev => !prev), 100);
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

  const resetForm = () => {
    setSelectedTemplate(null);
    setCustomTitle('');
    setCustomContent('');
    setCustomIcon('');
    setBackgroundColor('#007AFF');
    setSelectedMembers([]);
    setPriority(1);
    setIsScheduled(false);
    setScheduledTime(new Date());
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>自定义通知</Text>
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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 模板选择 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>通知模版</Text>
              <TouchableOpacity
                style={[styles.toggleButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowAllTemplates(!showAllTemplates)}
              >
                <Text style={[styles.toggleButtonText, { color: colors.text }]}>
                  {showAllTemplates ? '系统模版' : '全部模版'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroll}>
              <TouchableOpacity
                style={[
                  styles.templateCard,
                  !selectedTemplate && styles.selectedTemplateCard,
                  { backgroundColor: colors.card, borderColor: !selectedTemplate ? colors.primary : colors.border }
                ]}
                onPress={handleCustomMode}
              >
                <Text style={styles.templateIcon}>✏️</Text>
                <Text style={[styles.templateTitle, { color: colors.text }]}>自定义</Text>
              </TouchableOpacity>

              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateCard,
                    selectedTemplate?.id === template.id && styles.selectedTemplateCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: selectedTemplate?.id === template.id ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => handleTemplateSelect(template)}
                  onLongPress={() => {
                    if (template.category === 'custom') {
                      handleDeleteTemplate(template.id);
                    }
                  }}
                >
                  <Text style={styles.templateIcon}>{template.icon}</Text>
                  <Text style={[styles.templateTitle, { color: colors.text }]}>{template.title}</Text>
                  <Text style={[styles.templateDesc, { color: colors.textSecondary }]}>
                    {template.description}
                  </Text>
                  {template.category === 'custom' && (
                    <Text style={[styles.customBadge, { color: colors.primary }]}>自定义</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 通知内容 */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>通知内容</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>图标</Text>
              <IconSelector
                selectedIcon={customIcon}
                onIconSelect={setCustomIcon}
                style={styles.iconSelector}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>背景颜色</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
                {[
                  '#007AFF', '#FF3B30', '#FF9500', '#FFCC02', '#34C759', 
                  '#5AC8FA', '#AF52DE', '#FF2D92', '#A2845E', '#8E8E93'
                ].map((color) => (
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
                      <Text style={styles.colorCheckmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>标题</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholder="输入通知标题"
                placeholderTextColor={colors.textSecondary}
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>内容</Text>
              <TextInput
                style={[styles.textAreaInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                value={customContent}
                onChangeText={setCustomContent}
                placeholder="输入通知内容"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                maxLength={200}
              />
            </View>
          </View>

          {/* 优先级选择 */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>优先级</Text>
            <View style={styles.priorityContainer}>
              {[1, 2, 3].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton,
                    priority === level && { backgroundColor: getPriorityColor(level) },
                    { borderColor: getPriorityColor(level) }
                  ]}
                  onPress={() => setPriority(level)}
                >
                  <Text style={[
                    styles.priorityText,
                    { color: priority === level ? '#FFFFFF' : getPriorityColor(level) }
                  ]}>
                    {getPriorityText(level)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 定时发送选项 */}
          <View style={styles.section}>
            <View style={styles.optionRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>定时发送</Text>
              <Switch
                value={isScheduled}
                onValueChange={setIsScheduled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isScheduled ? '#FFFFFF' : colors.textSecondary}
              />
            </View>
            
            {isScheduled && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>发送时间</Text>
                <TouchableOpacity
                  style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, justifyContent: 'center' }]}
                  onPress={() => {
                    // 显示日期选择器
                    Alert.prompt(
                      '设置发送时间',
                      '请输入发送时间 (格式: YYYY-MM-DD HH:MM)',
                      [
                        { text: '取消', style: 'cancel' },
                        {
                          text: '确定',
                          onPress: (text) => {
                            if (text) {
                              try {
                                const date = new Date(text);
                                if (!isNaN(date.getTime())) {
                                  setScheduledTime(date);
                                } else {
                                  Alert.alert('错误', '时间格式不正确，请使用 YYYY-MM-DD HH:MM 格式');
                                }
                              } catch {
                                Alert.alert('错误', '时间格式不正确');
                              }
                            }
                          }
                        }
                      ],
                      'plain-text',
                      scheduledTime.toISOString().slice(0, 16).replace('T', ' ')
                    );
                  }}
                >
                  <Text style={[{ color: colors.text }]}>{scheduledTime.toLocaleString()}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 接收人选择 */}
          {currentFamily?.id && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                接收人 {selectedMembers.length === 0 && '(默认发送给所有家庭成员)'}
              </Text>
              
              {loadingMembers ? (
                <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
              ) : (
                <View style={styles.receiverSection}>
                  {/* 全选按钮 */}
                  <TouchableOpacity
                    style={[
                      styles.allMembersButton,
                      { 
                        backgroundColor: selectedMembers.length === 0 ? colors.primary : 'transparent',
                        borderColor: colors.primary
                      }
                    ]}
                    onPress={() => setSelectedMembers([])}
                  >
                    <View style={[
                      styles.allMembersIcon,
                      { backgroundColor: selectedMembers.length === 0 ? 'rgba(255,255,255,0.2)' : colors.backgroundSecondary }
                    ]}>
                      <Text style={[
                        styles.allMembersIconText,
                        { color: selectedMembers.length === 0 ? '#FFFFFF' : colors.primary }
                      ]}>
                        👥
                      </Text>
                    </View>
                    <Text style={[
                      styles.allMembersText,
                      { color: selectedMembers.length === 0 ? '#FFFFFF' : colors.text }
                    ]}>
                      发送给所有成员
                    </Text>
                    {selectedMembers.length === 0 && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* 分割线 */}
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />

                  {/* 成员列表 */}
                  <Text style={[styles.memberListTitle, { color: colors.textSecondary }]}>
                    或选择特定成员：
                  </Text>
                  
                  <View style={styles.membersList}>
                    {familyMembers.map((member, index) => (
                      <TouchableOpacity
                        key={member.id}
                        style={[
                          styles.memberItem,
                          { borderBottomColor: colors.border },
                          index === familyMembers.length - 1 && styles.lastMemberItem
                        ]}
                        onPress={() => handleMemberToggle(member.id)}
                      >
                        <View style={styles.memberItemLeft}>
                          <View style={[
                            styles.memberAvatar,
                            { backgroundColor: colors.backgroundSecondary }
                          ]}>
                            <Text style={[styles.memberAvatarText, { color: colors.primary }]}>
                              {(member.nickname || member.user?.nickname || '用户').charAt(0)}
                            </Text>
                          </View>
                          <View style={styles.memberInfo}>
                            <Text style={[styles.memberNameText, { color: colors.text }]}>
                              {member.nickname || member.user?.nickname}
                            </Text>
                            <Text style={[styles.memberRoleText, { color: colors.textSecondary }]}>
                              {member.role?.roleName}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={[
                          styles.checkbox,
                          {
                            backgroundColor: selectedMembers.includes(member.id) ? colors.primary : 'transparent',
                            borderColor: selectedMembers.includes(member.id) ? colors.primary : colors.border
                          }
                        ]}>
                          {selectedMembers.includes(member.id) && (
                            <Text style={styles.checkboxTick}>✓</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
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
  templateScroll: {
    marginVertical: Spacing.sm,
  },
  templateCard: {
    width: 120,
    padding: Spacing.md,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    ...Shadows.sm,
  },
  selectedTemplateCard: {
    borderWidth: 2,
  },
  templateIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  templateTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  templateDesc: {
    fontSize: FontSizes.caption,
    textAlign: 'center',
    lineHeight: 16,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
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
  colorCheckmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: FontWeights.bold,
  },
  textInput: {
    height: 50,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    fontSize: FontSizes.body,
  },
  textAreaInput: {
    minHeight: 100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    fontSize: FontSizes.body,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  loadingIndicator: {
    marginVertical: Spacing.md,
  },
  receiverSection: {
    marginTop: Spacing.sm,
  },
  allMembersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    position: 'relative',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  allMembersIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  allMembersIconText: {
    fontSize: 20,
  },
  allMembersText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    flex: 1,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: FontWeights.bold,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  memberListTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.md,
  },
  membersList: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  lastMemberItem: {
    borderBottomWidth: 0,
  },
  memberItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  memberAvatarText: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.bold,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    marginBottom: 2,
  },
  memberRoleText: {
    fontSize: FontSizes.bodySmall,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxTick: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: FontWeights.bold,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  toggleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  toggleButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  customBadge: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    marginTop: Spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
});