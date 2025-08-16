import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useFamily } from '@/contexts/FamilyContext';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasFamily, isLoadingFamilies } = useFamily();

  useEffect(() => {
    // 等待认证状态加载完成
    if (authLoading) {
      console.log('等待认证状态加载...');
      return;
    }

    // 情况2：token失效或用户未登录，跳转到welcome界面
    if (!isAuthenticated) {
      console.log('用户未登录或token失效，跳转到welcome页面');
      router.replace('/welcome');
      return;
    }

    // 用户已登录，等待家庭数据加载完成
    if (isLoadingFamilies) {
      console.log('等待家庭数据加载...');
      return;
    }

    // 情况3：只有用户没有家庭，才默认进入创建or加入家庭页面
    if (!hasFamily) {
      console.log('用户没有家庭，跳转到家庭选择页面');
      router.replace('/family');
      return;
    }

    // 情况1：用户已登录且有家庭，直接进入主页面
    console.log('用户已登录且有家庭，跳转到主应用');
    router.replace('/(tabs)');
    
  }, [isAuthenticated, authLoading, hasFamily, isLoadingFamilies, router]);

  return null; // 不渲染任何内容，只做重定向
}