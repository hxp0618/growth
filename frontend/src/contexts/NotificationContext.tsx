import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService } from '@/services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  unreadCount: number;
  isInitialized: boolean;
  expoPushToken: string | null;
  initializeNotifications: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  refreshUnreadCount: (familyId?: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const initializeNotifications = async () => {
    try {
      console.log('初始化通知服务...');
      
      // 请求通知权限
      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) {
        console.log('通知权限未授予，跳过令牌获取');
        setIsInitialized(true);
        return;
      }
      
      // 设置通知监听器
      setupNotificationListeners();
      
      // 如果用户已登录，获取推送令牌
      if (isAuthenticated) {
        const token = await notificationService.getExpoPushToken();
        setExpoPushToken(token);
      }
      
      setIsInitialized(true);
      console.log('通知服务初始化完成');
    } catch (error) {
      console.error('通知服务初始化失败:', error);
      setIsInitialized(true); // 即使失败也标记为已初始化，避免无限重试
    }
  };

  const setupNotificationListeners = () => {
    // 监听接收到的通知
    const notificationListener = notificationService.addNotificationListener((notification) => {
      console.log('收到通知:', notification);
      
      // 处理通知数据
      handleNotificationReceived(notification);
    });

    // 监听用户点击通知的响应
    const responseListener = notificationService.addNotificationResponseListener((response) => {
      console.log('用户点击通知:', response);
      
      // 处理通知点击事件
      handleNotificationClick(response);
    });

    // 清理监听器
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  };

  const handleNotificationReceived = (notification: Notifications.Notification) => {
    const data = notification.request.content.data;
    
    // 根据通知类型更新未读数量
    if (data?.type === 'family_notification' && typeof data?.familyId === 'number') {
      refreshUnreadCount(data.familyId);
    }
  };

  const handleNotificationClick = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    
    // 这里可以添加导航逻辑
    console.log('处理通知点击:', data);
    
    // 如果是家庭通知，可以导航到相应页面
    if (data?.type === 'family_notification') {
      // 导航到家庭通知页面
    }
  };

  const sendTestNotification = async () => {
    try {
      await notificationService.sendLocalNotification({
        title: '测试通知',
        body: '这是一个测试通知，用于验证推送功能是否正常工作',
        data: {
          type: 'test',
          timestamp: Date.now(),
        },
        categoryIdentifier: 'reminder',
      });
      console.log('测试通知发送成功');
    } catch (error) {
      console.error('发送测试通知失败:', error);
    }
  };

  const refreshUnreadCount = async (familyId?: number) => {
    try {
      const count = await notificationService.getUnreadNotificationCount(familyId);
      setUnreadCount(count);
      
      // 更新应用图标徽章
      await notificationService.setBadgeCount(count);
    } catch (error) {
      console.error('刷新未读通知数量失败:', error);
    }
  };

  // 组件挂载时初始化通知服务
  useEffect(() => {
    initializeNotifications();
  }, []);

  // 用户登录状态变化时处理推送令牌
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (isAuthenticated && !expoPushToken) {
      // 用户登录后获取推送令牌
      const getTokenAsync = async () => {
        try {
          const token = await notificationService.getExpoPushToken();
          setExpoPushToken(token);
        } catch (error) {
          console.error('获取推送令牌失败:', error);
        }
      };
      getTokenAsync();
    } else if (!isAuthenticated && expoPushToken) {
      // 用户登出后清除推送令牌
      setExpoPushToken(null);
    }
  }, [isAuthenticated, isInitialized, expoPushToken]);

  // Token初始化完成后的处理
  useEffect(() => {
    if (!isInitialized || !expoPushToken) {
      return;
    }

    console.log('通知Token初始化完成:', expoPushToken);
  }, [isInitialized, expoPushToken]);

  const value: NotificationContextType = {
    unreadCount,
    isInitialized,
    expoPushToken,
    initializeNotifications,
    sendTestNotification,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}