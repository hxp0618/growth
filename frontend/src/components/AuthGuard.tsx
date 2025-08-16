import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useFamily } from '@/contexts/FamilyContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasFamily, isLoadingFamilies } = useFamily();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading || isLoadingFamilies) return; // 等待认证状态和家庭状态加载完成

    const inAuthGroup = segments[0] === '(tabs)';
    const inAuthPages = ['login', 'register'].includes(segments[0] as string);
    const inWelcome = segments[0] === 'welcome';
    const inFamilyPages = segments[0] === 'family';

    if (!isAuthenticated) {
      // 用户未登录
      if (inAuthGroup || inFamilyPages) {
        // 如果用户试图访问需要认证的页面，重定向到欢迎页面
        router.replace('/welcome');
      } else if (!inWelcome && !inAuthPages) {
        // 如果用户不在欢迎页面或认证页面，重定向到欢迎页面
        router.replace('/welcome');
      }
    } else {
      // 用户已登录
      if (inWelcome || inAuthPages) {
        // 如果用户已登录但在欢迎页面或认证页面，根据家庭状态重定向
        if (hasFamily) {
          router.replace('/');
        } else {
          router.replace('/family');
        }
      } else if (inAuthGroup && !hasFamily) {
        // 如果用户已登录但没有家庭，且试图访问主应用，重定向到家庭选择页面
        router.replace('/family');
      } else if (inFamilyPages && hasFamily) {
        // 如果用户已有家庭但在家庭相关页面，重定向到主页
        router.replace('/');
      }
    }
  }, [isAuthenticated, isLoading, isLoadingFamilies, hasFamily, segments, router]);

  // 在加载状态时显示加载界面
  if (isLoading || isLoadingFamilies) {
    return null; // 或者返回一个加载组件
  }

  return <>{children}</>;
}