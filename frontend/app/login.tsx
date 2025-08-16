import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useFamily } from '@/contexts/FamilyContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { hasFamily, isLoadingFamilies } = useFamily();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    phone: '',
    password: '',
  });

  const validateForm = (): boolean => {
    const newErrors = {
      phone: '',
      password: '',
    };

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

    setErrors(newErrors);
    return !newErrors.phone && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    const response = await login({
      phone: formData.phone,
      password: formData.password,
    });

    if (response.success) {
      // 登录成功后，让 AuthGuard 来处理路由跳转
      // AuthGuard 会根据用户的家庭状态自动跳转到正确的页面
    } else {
      Alert.alert('登录失败', response.message || '请检查手机号和密码是否正确');
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
              欢迎回来
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              登录到你的账户继续使用
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
              label="密码"
              placeholder="请输入密码"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              error={errors.password}
              secureTextEntry
              autoComplete="password"
              leftIcon="🔒"
              size="large"
            />

            <Button
              title={isLoading ? '登录中...' : '登录'}
              onPress={handleLogin}
              disabled={isLoading}
              size="large"
              style={styles.loginButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              还没有账户？
              <Text
                style={[styles.linkText, { color: colors.primary }]}
                onPress={() => router.push('/register')}
              >
                立即注册
              </Text>
            </Text>
            
            <Text 
              style={[styles.linkText, { color: colors.primary }]}
              onPress={() => Alert.alert('忘记密码', '忘记密码功能正在开发中...')}
            >
              忘记密码？
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
    marginBottom: Spacing.xxl,
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
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  loginButton: {
    marginTop: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.md,
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