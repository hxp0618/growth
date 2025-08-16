import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: '',
  });

  const validateForm = (): boolean => {
    const newErrors = {
      username: '',
      phone: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      email: '',
    };

    // 验证用户名
    if (!formData.username) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名长度至少3位';
    }

    // 验证手机号
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!formData.phone) {
      newErrors.phone = '请输入手机号';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号格式';
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少6位';
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    // 验证昵称
    if (!formData.nickname) {
      newErrors.nickname = '请输入昵称';
    }

    // 验证邮箱（可选）
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '请输入正确的邮箱格式';
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    const response = await register({
      username: formData.username,
      phone: formData.phone,
      password: formData.password,
      nickname: formData.nickname,
      email: formData.email || undefined,
    });

    if (response.success) {
      Alert.alert('注册成功', '账户创建成功，请登录', [
        {
          text: '去登录',
          onPress: () => router.replace('/login'),
        },
      ]);
    } else {
      Alert.alert('注册失败', response.message || '注册失败，请重试');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              创建账户
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              填写信息创建你的新账户
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="用户名"
              placeholder="请输入用户名"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              error={errors.username}
              autoComplete="username"
              leftIcon="👤"
              size="large"
            />

            <TextInput
              label="手机号"
              placeholder="请输入手机号"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              error={errors.phone}
              keyboardType="phone-pad"
              autoComplete="tel"
              leftIcon="📱"
              size="large"
            />

            <TextInput
              label="昵称"
              placeholder="请输入昵称"
              value={formData.nickname}
              onChangeText={(value) => handleInputChange('nickname', value)}
              error={errors.nickname}
              leftIcon="✨"
              size="large"
            />

            <TextInput
              label="邮箱（可选）"
              placeholder="请输入邮箱"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoComplete="email"
              leftIcon="📧"
              size="large"
            />

            <TextInput
              label="密码"
              placeholder="请输入密码"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              error={errors.password}
              secureTextEntry
              autoComplete="new-password"
              leftIcon="🔒"
              size="large"
            />

            <TextInput
              label="确认密码"
              placeholder="请再次输入密码"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              error={errors.confirmPassword}
              secureTextEntry
              autoComplete="new-password"
              leftIcon="🔒"
              size="large"
            />

            <Button
              title={isLoading ? '注册中...' : '创建账户'}
              onPress={handleRegister}
              disabled={isLoading}
              size="large"
              style={styles.registerButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              已有账户？{' '}
              <Text 
                style={[styles.linkText, { color: colors.primary }]}
                onPress={() => router.push('/login')}
              >
                立即登录
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.h1,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSizes.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
    marginBottom: Spacing.lg,
  },
  registerButton: {
    marginTop: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.body,
    textAlign: 'center',
  },
  linkText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
});