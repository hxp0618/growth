import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { View } from 'react-native';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FamilyProvider } from '@/contexts/FamilyContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { AuthGuard } from '@/components/AuthGuard';
import { NetworkStatusIndicator } from '@/components/ui/NetworkStatusIndicator';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // 可以在这里添加自定义字体文件
    // 'PingFang-SC': require('../assets/fonts/PingFang-SC.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <FamilyProvider>
          <NotificationProvider>
            <SafeAreaProvider>
              <View style={{ flex: 1 }}>
                <AuthGuard>
                  <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="settings" options={{ title: '设置' }} />
                    <Stack.Screen name="welcome" options={{ headerShown: false }} />
                    <Stack.Screen name="login" options={{ title: '登录' }} />
                    <Stack.Screen name="register" options={{ title: '注册' }} />
                    <Stack.Screen name="family/index" options={{ title: '选择家庭', headerShown: false }} />
                    <Stack.Screen name="family/create" options={{ title: '创建家庭' }} />
                    <Stack.Screen name="family/join" options={{ title: '加入家庭' }} />
                    <Stack.Screen name="test-custom-notification" options={{ title: '自定义通知测试' }} />
                  </Stack>
                </AuthGuard>
                <NetworkStatusIndicator showDetails={true} />
                <StatusBar style="auto" />
              </View>
            </SafeAreaProvider>
          </NotificationProvider>
        </FamilyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}