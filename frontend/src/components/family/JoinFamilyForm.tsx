import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { useFamily } from '../../contexts/FamilyContext';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

interface JoinFamilyFormProps {
  onSuccess?: (familyId: number) => void;
  onCancel?: () => void;
}

export function JoinFamilyForm({ onSuccess, onCancel }: JoinFamilyFormProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { joinFamily, availableRoles } = useFamily();
  
  const [inviteCode, setInviteCode] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInviteCodeChange = (code: string) => {
    setInviteCode(code);
    // 清除邀请码错误信息
    if (errors.inviteCode) {
      setErrors({ ...errors, inviteCode: '' });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!inviteCode.trim()) {
      newErrors.inviteCode = '请输入邀请码';
    } else if (inviteCode.trim().length < 6) {
      newErrors.inviteCode = '邀请码长度不能少于6位';
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
      const result = await joinFamily(inviteCode.trim(), selectedRoleId!);

      if (result.success) {
        // 成功加入家庭
        console.log('成功加入家庭！');
        // 这里我们不知道具体的家庭ID，所以传递0，让上级组件处理跳转
        onSuccess?.(0);
      } else {
        Alert.alert('加入失败', result.error || '加入家庭失败，请重试');
      }
    } catch (error) {
      console.error('加入家庭失败:', error);
      Alert.alert('加入失败', '网络错误，请检查网络连接后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId);
    // 清除角色选择错误信息
    if (errors.role) {
      setErrors({ ...errors, role: '' });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          加入家庭
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          输入邀请码加入现有家庭，开始记录美好的成长时光
        </ThemedText>

        <ThemedView style={styles.form}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>邀请码 *</ThemedText>
            <TextInput
              placeholder="请输入6位数以上的邀请码"
              value={inviteCode}
              onChangeText={handleInviteCodeChange}
              error={errors.inviteCode}
              maxLength={20}
              autoCapitalize="characters"
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
            title={isSubmitting ? '加入中...' : '加入家庭'}
            onPress={handleSubmit}
            disabled={isSubmitting || !inviteCode.trim() || !selectedRoleId}
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
          <ThemedText style={styles.tipsTitle}>加入须知:</ThemedText>
          <ThemedText style={styles.tipsText}>
            • 请向家庭创建者获取正确的邀请码
          </ThemedText>
          <ThemedText style={styles.tipsText}>
            • 加入后可以参与家庭的成长记录
          </ThemedText>
          <ThemedText style={styles.tipsText}>
            • 您的角色决定了在家庭中的权限
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