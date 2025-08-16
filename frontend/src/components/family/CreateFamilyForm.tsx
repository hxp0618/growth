import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { useFamily } from '../../contexts/FamilyContext';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

interface CreateFamilyFormProps {
  onSuccess?: (familyId: number) => void;
  onCancel?: () => void;
}

export function CreateFamilyForm({ onSuccess, onCancel }: CreateFamilyFormProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { createFamily, availableRoles, isLoadingRoles } = useFamily();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入家庭名称';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '家庭名称至少需要2个字符';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = '家庭名称不能超过50个字符';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = '家庭描述不能超过200个字符';
    }

    if (!selectedRoleId) {
      newErrors.role = '请选择您在家庭中的角色';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createFamily({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      if (result.success && result.family) {
        // 直接调用成功回调，不使用Alert以避免Web端的问题
        console.log(`家庭"${result.family.name}"创建成功！`);
        onSuccess?.(result.family.id);
      } else {
        Alert.alert('创建失败', result.error || '创建家庭失败，请重试');
      }
    } catch (error) {
      console.error('创建家庭失败:', error);
      Alert.alert('创建失败', '网络错误，请检查网络连接后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId);
    setErrors({ ...errors, role: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          创建家庭
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          创建一个新的家庭，开始记录美好的成长时光
        </ThemedText>

        <ThemedView style={styles.form}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>家庭名称 *</ThemedText>
            <TextInput
              placeholder="请输入家庭名称"
              value={formData.name}
              onChangeText={(value: string) => handleInputChange('name', value)}
              error={errors.name}
              maxLength={50}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>家庭描述</ThemedText>
            <TextInput
              placeholder="请输入家庭描述（可选）"
              value={formData.description}
              onChangeText={(value: string) => handleInputChange('description', value)}
              error={errors.description}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>选择您的角色 *</ThemedText>
            {errors.role && (
              <ThemedText style={[styles.errorText, { color: colors.error || '#ff0000' }]}>
                {errors.role}
              </ThemedText>
            )}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.rolesList}
            >
              {availableRoles.map((role) => (
                <ThemedView
                  key={role.id}
                  style={[
                    styles.roleItem,
                    {
                      borderColor: colors.border,
                      backgroundColor: selectedRoleId === role.id ? colors.tint + '20' : 'transparent',
                    }
                  ]}
                >
                  <Button
                    title={role.roleName}
                    onPress={() => handleRoleSelect(role.id)}
                    variant={selectedRoleId === role.id ? 'primary' : 'outline'}
                    size="small"
                  />
                  {role.description && (
                    <ThemedText style={styles.roleDescription}>
                      {role.description}
                    </ThemedText>
                  )}
                </ThemedView>
              ))}
            </ScrollView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.actions}>
          <Button
            title={isSubmitting ? '创建中...' : '创建家庭'}
            onPress={handleSubmit}
            disabled={isSubmitting}
            variant="primary"
            size="large"
          />
          
          {onCancel && (
            <Button
              title="取消"
              onPress={onCancel}
              disabled={isSubmitting}
              variant="outline"
              size="large"
            />
          )}
        </ThemedView>

        <ThemedView style={styles.tips}>
          <ThemedText style={styles.tipsTitle}>创建须知:</ThemedText>
          <ThemedText style={styles.tipsText}>
            • 您将自动成为家庭的创建者和管理员
          </ThemedText>
          <ThemedText style={styles.tipsText}>
            • 创建后可以邀请其他成员加入家庭
          </ThemedText>
          <ThemedText style={styles.tipsText}>
            • 家庭名称和描述后续可以修改
          </ThemedText>
          <ThemedText style={styles.tipsText}>
            • 每个用户可以参与多个家庭
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 32,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 8,
  },
  rolesList: {
    marginTop: 8,
  },
  roleItem: {
    marginRight: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  roleDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  actions: {
    gap: 16,
    marginBottom: 32,
  },
  tips: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});