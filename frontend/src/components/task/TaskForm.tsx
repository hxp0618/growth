import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
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

interface FamilyMember {
  id: number;
  userId: number;
  nickname: string;
  roleName: string;
}

interface TaskFormProps {
  visible: boolean;
  familyId: number;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id?: number;
    title?: string;
    description?: string;
    assignedUserIds?: number[];
    priority?: number;
    expectedCompletionTime?: string;
    remark?: string;
  };
}

const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  familyId,
  onClose,
  onSuccess,
  initialData,
}) => {
  const colors = useThemeColors();
  
  const [loading, setLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<FamilyMember[]>([]);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedUserIds: [] as number[],
    priority: 2,
    expectedCompletionTime: '',
    remark: '',
  });

  // 修复无限循环：移除 familyMembers 依赖
  useEffect(() => {
    if (visible) {
      loadFamilyMembers();
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          assignedUserIds: initialData.assignedUserIds || [],
          priority: initialData.priority || 2,
          expectedCompletionTime: initialData.expectedCompletionTime || '',
          remark: initialData.remark || '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          assignedUserIds: [],
          priority: 2,
          expectedCompletionTime: '',
          remark: '',
        });
        setSelectedMembers([]);
      }
    }
  }, [visible, initialData]);

  // 单独处理已选择成员的设置
  useEffect(() => {
    if (visible && initialData && familyMembers.length > 0) {
      if (initialData.assignedUserIds && initialData.assignedUserIds.length > 0) {
        const members = familyMembers.filter(member => 
          initialData.assignedUserIds!.includes(member.userId)
        );
        setSelectedMembers(members);
      } else {
        setSelectedMembers([]);
      }
    }
  }, [visible, initialData, familyMembers]);

  const loadFamilyMembers = async () => {
    // 防止重复调用
    if (isLoadingMembers) {
      console.log('loadFamilyMembers: 正在加载中，跳过重复调用');
      return;
    }
    
    console.log('loadFamilyMembers: 开始加载家庭成员，familyId:', familyId);
    setIsLoadingMembers(true);
    
    try {
      const response = await familyMemberService.getFamilyMemberList({ familyId, status: 1 });
      console.log('loadFamilyMembers: 加载成功，成员数量:', response.data?.length || 0);
      
      // 转换 FamilyMemberResponse 到 FamilyMember
      const members: FamilyMember[] = (response.data || []).map(item => ({
        id: item.id,
        userId: item.userId,
        nickname: item.nickname || item.user?.nickname || '未知用户',
        roleName: item.role?.roleName || '未知角色'
      }));
      
      setFamilyMembers(members);
    } catch (error) {
      console.error('loadFamilyMembers: 加载失败:', error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleSubmit = async () => {
    // 表单验证
    if (!formData.title.trim()) {
      Alert.alert('错误', '请输入任务标题');
      return;
    }

    if (formData.title.trim().length > 100) {
      Alert.alert('错误', '任务标题不能超过100个字符');
      return;
    }

    if (formData.description && formData.description.length > 500) {
      Alert.alert('错误', '任务说明不能超过500个字符');
      return;
    }

    if (formData.assignedUserIds.length === 0) {
      Alert.alert('错误', '请选择指定人');
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        ...formData,
        familyId,
      };

      if (initialData?.id) {
        // 更新任务
        await familyTaskService.updateTask({
          id: initialData.id,
          ...requestData,
        });
        Alert.alert('成功', '任务更新成功');
      } else {
        // 创建任务
        await familyTaskService.createTask(requestData);
        Alert.alert('成功', '任务创建成功');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('保存任务失败:', error);
      Alert.alert('错误', '保存任务失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberToggle = (member: FamilyMember) => {
    const isSelected = selectedMembers.some(m => m.userId === member.userId);
    if (isSelected) {
      // 移除成员
      const newSelectedMembers = selectedMembers.filter(m => m.userId !== member.userId);
      setSelectedMembers(newSelectedMembers);
      setFormData(prev => ({
        ...prev,
        assignedUserIds: newSelectedMembers.map(m => m.userId)
      }));
    } else {
      // 添加成员
      const newSelectedMembers = [...selectedMembers, member];
      setSelectedMembers(newSelectedMembers);
      setFormData(prev => ({
        ...prev,
        assignedUserIds: newSelectedMembers.map(m => m.userId)
      }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ 
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background
        }}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: colors.textSecondary, fontSize: 18, fontWeight: 'bold' }}>✕</Text>
          </TouchableOpacity>
          <ThemedText style={{ fontSize: 18, fontFamily: Fonts.semiBold, color: colors.text }}>
            {initialData?.id ? '编辑任务' : '新建任务'}
          </ThemedText>
          <View style={{ width: 40, height: 40 }} />
        </View>

        <ScrollView style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
          {/* 任务标题 */}
          <View style={{ marginBottom: 20 }}>
            <ThemedText style={{ fontSize: 14, fontFamily: Fonts.medium, marginBottom: 8, color: colors.text }}>任务标题 *</ThemedText>
            <TextInput
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="请输入任务标题"
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                backgroundColor: colors.background
              }}
              inputStyle={{
                color: colors.text,
                fontSize: 16
              }}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* 任务说明 */}
          <View style={{ marginBottom: 20 }}>
            <ThemedText style={{ fontSize: 14, fontFamily: Fonts.medium, marginBottom: 8, color: colors.text }}>任务说明</ThemedText>
            <TextInput
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="请输入任务说明"
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                backgroundColor: colors.background,
                height: 80
              }}
              inputStyle={{
                fontSize: 16,
                color: colors.text,
                textAlignVertical: 'top'
              }}
            />
          </View>

          {/* 指定人 */}
          <View style={{ marginBottom: 20 }}>
            <ThemedText style={{ fontSize: 14, fontFamily: Fonts.medium, marginBottom: 8, color: colors.text }}>指定人</ThemedText>
            <TouchableOpacity
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12
              }}
              onPress={() => setShowMemberPicker(true)}
            >
              <ThemedText style={{ color: colors.text, textAlign: 'left' }}>
                {selectedMembers.length > 0
                  ? selectedMembers.map(m => m.nickname).join(', ')
                  : '请选择指定人'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* 优先级 */}
          <View style={{ marginBottom: 20 }}>
            <ThemedText style={{ fontSize: 14, fontFamily: Fonts.medium, marginBottom: 8, color: colors.text }}>优先级</ThemedText>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[
                { value: 1, label: '低', color: colors.textSecondary },
                { value: 2, label: '中', color: colors.info },
                { value: 3, label: '高', color: colors.warning },
                { value: 4, label: '紧急', color: colors.error },
              ].map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: formData.priority === priority.value ? priority.color : colors.border,
                    borderRadius: 8,
                    padding: 8,
                    alignItems: 'center',
                    backgroundColor: formData.priority === priority.value ? priority.color + '20' : colors.background
                  }}
                  onPress={() => setFormData({ ...formData, priority: priority.value })}
                >
                  <ThemedText
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.medium,
                      color: formData.priority === priority.value ? priority.color : colors.text
                    }}
                  >
                    {priority.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 预计完成时间 */}
          <View style={{ marginBottom: 20 }}>
            <ThemedText style={{ fontSize: 14, fontFamily: Fonts.medium, marginBottom: 8, color: colors.text }}>预计完成时间</ThemedText>
            <TextInput
              value={formData.expectedCompletionTime}
              onChangeText={(text) => setFormData({ ...formData, expectedCompletionTime: text })}
              placeholder="请选择预计完成时间"
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                backgroundColor: colors.background
              }}
              inputStyle={{
                fontSize: 16,
                color: colors.text
              }}
            />
          </View>

          {/* 备注 */}
          <View style={{ marginBottom: 20 }}>
            <ThemedText style={{ fontSize: 14, fontFamily: Fonts.medium, marginBottom: 8, color: colors.text }}>备注</ThemedText>
            <TextInput
              value={formData.remark}
              onChangeText={(text) => setFormData({ ...formData, remark: text })}
              placeholder="请输入备注信息"
              multiline
              numberOfLines={2}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                backgroundColor: colors.background,
                height: 60
              }}
              inputStyle={{
                fontSize: 16,
                color: colors.text,
                textAlignVertical: 'top'
              }}
            />
          </View>
        </ScrollView>

        <View style={{ 
          padding: 16, 
          borderTopWidth: 1, 
          borderTopColor: colors.border,
          backgroundColor: colors.background
        }}>
          <Button
            title={loading ? (initialData?.id ? '更新中...' : '创建中...') : (initialData?.id ? '更新任务' : '创建任务')}
            onPress={handleSubmit}
            disabled={loading}
            style={{ backgroundColor: colors.primary, borderRadius: 8, padding: 16 }}
            textStyle={{ color: '#FFFFFF', fontSize: 16, fontFamily: Fonts.semiBold }}
          />
        </View>

        {/* 成员选择器 */}
        <Modal
          visible={showMemberPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowMemberPicker(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ 
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              width: '80%',
              maxHeight: '70%',
              borderWidth: 1,
              borderColor: colors.border
            }}>
              <View style={{ 
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border
              }}>
                <ThemedText style={{ fontSize: 18, fontFamily: Fonts.semiBold, color: colors.text }}>选择指定人</ThemedText>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button
                    title="选择所有人"
                    onPress={() => {
                      setSelectedMembers([...familyMembers]);
                      setFormData(prev => ({
                        ...prev,
                        assignedUserIds: familyMembers.map(m => m.userId)
                      }));
                    }}
                    style={{ backgroundColor: colors.info, borderRadius: 8, padding: 8 }}
                    textStyle={{ color: '#FFFFFF', fontSize: 12, fontFamily: Fonts.medium }}
                  />
                  <Button
                    title="确定"
                    onPress={() => setShowMemberPicker(false)}
                    style={{ backgroundColor: colors.primary, borderRadius: 8, padding: 12 }}
                    textStyle={{ color: '#FFFFFF', fontSize: 14, fontFamily: Fonts.medium }}
                  />
                </View>
              </View>
              
              <ScrollView style={{ maxHeight: 300 }}>
                {familyMembers.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={{
                      borderWidth: 1,
                      borderColor: selectedMembers.some(m => m.userId === member.userId) ? colors.primary : colors.border,
                      borderRadius: 8,
                      marginBottom: 8,
                      padding: 12,
                      backgroundColor: selectedMembers.some(m => m.userId === member.userId) ? colors.primary + '20' : colors.background
                    }}
                    onPress={() => handleMemberToggle(member)}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 1 }}>
                        <ThemedText style={{ fontSize: 16, fontFamily: Fonts.medium, color: colors.text }}>
                          {member.nickname}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                          {member.roleName}
                        </ThemedText>
                      </View>
                      {selectedMembers.some(m => m.userId === member.userId) && (
                        <View style={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: 12, 
                          backgroundColor: colors.primary,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }}>✓</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

export default TaskForm;
