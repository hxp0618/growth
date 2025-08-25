import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiClient } from '../utils/apiClient';
import { NetworkDiagnosticsService } from '../utils/networkDiagnostics';
import {
  SendOneClickNotificationRequest,
  CreateNotificationRequest,
  NotificationResponse,
  ApiResponse,
  PageResult,
  NotificationTemplate,
  FamilyNotification
} from '../types/api';

// 配置通知处理行为
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  categoryIdentifier?: string;
}

export interface ScheduledNotificationOptions {
  seconds?: number;
  repeats?: boolean;
}

class NotificationService {
  private expoPushToken: string | null = null;

  /**
   * 请求通知权限
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // 检查是否在web环境中
      if (Platform.OS === 'web') {
        return await this.requestWebNotificationPermission();
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // 如果权限未被授予，请求权限
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('通知权限未被授予');
        return false;
      }

      // 对于Android，设置通知渠道
      if (Platform.OS === 'android') {
        await this.setupAndroidChannel();
      }

      return true;
    } catch (error) {
      console.error('请求通知权限失败:', error);
      return false;
    }
  }

  /**
   * Web环境下请求通知权限
   */
  private async requestWebNotificationPermission(): Promise<boolean> {
    try {
      // 检查浏览器是否支持通知
      if (!('Notification' in window)) {
        console.warn('此浏览器不支持通知功能');
        return false;
      }

      // 检查当前权限状态
      let permission = Notification.permission;

      // 如果权限未被决定，请求权限
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission === 'granted') {
        console.log('Web通知权限已获取');
        return true;
      } else {
        console.warn('Web通知权限被拒绝:', permission);
        return false;
      }
    } catch (error) {
      console.error('请求Web通知权限失败:', error);
      return false;
    }
  }

  /**
   * 设置Android通知渠道
   */
  private async setupAndroidChannel(): Promise<void> {
    await Notifications.setNotificationChannelAsync('default', {
      name: '默认通知',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });

    // 紧急通知渠道
    await Notifications.setNotificationChannelAsync('emergency', {
      name: '紧急通知',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF0000',
      sound: 'default',
    });

    // 一般提醒渠道
    await Notifications.setNotificationChannelAsync('reminder', {
      name: '提醒通知',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFA500',
      sound: 'default',
    });
  }

  /**
   * 发送本地通知
   */
  async sendLocalNotification(notification: NotificationData): Promise<string | null> {
    try {
      // 确保有权限
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('通知权限未授予');
      }

      // 在web环境下使用浏览器原生通知API
      if (Platform.OS === 'web') {
        return await this.sendWebNotification(notification);
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryIdentifier,
        },
        trigger: null, // 立即发送
      });

      console.log('本地通知已发送:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('发送本地通知失败:', error);
      return null;
    }
  }

  /**
   * Web环境下发送通知
   */
  private async sendWebNotification(notification: NotificationData): Promise<string | null> {
    try {
      if (!('Notification' in window)) {
        throw new Error('此浏览器不支持通知功能');
      }

      if (Notification.permission !== 'granted') {
        throw new Error('通知权限未授予');
      }

      const webNotification = new Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.ico', // 使用应用图标
        badge: '/favicon.ico',
        tag: `notification-${Date.now()}`, // 用于去重
        requireInteraction: notification.categoryIdentifier === 'emergency', // 紧急通知需要用户交互
        silent: false,
      });

      // 添加点击事件处理
      webNotification.onclick = () => {
        window.focus(); // 聚焦到应用窗口
        webNotification.close();
      };

      // 自动关闭通知（除非是紧急通知）
      if (notification.categoryIdentifier !== 'emergency') {
        setTimeout(() => {
          webNotification.close();
        }, 5000); // 5秒后自动关闭
      }

      const notificationId = `web-${Date.now()}`;
      console.log('Web通知已发送:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('发送Web通知失败:', error);
      throw error;
    }
  }

  /**
   * 安排延迟通知
   */
  async scheduleNotification(
    notification: NotificationData,
    options: ScheduledNotificationOptions
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('通知权限未授予');
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryIdentifier,
        },
        trigger: {
          seconds: options.seconds || 1,
          repeats: options.repeats || false,
        } as Notifications.TimeIntervalTriggerInput,
      });

      console.log('定时通知已安排:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('安排定时通知失败:', error);
      return null;
    }
  }

  /**
   * 取消指定通知
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('通知已取消:', notificationId);
    } catch (error) {
      console.error('取消通知失败:', error);
    }
  }

  /**
   * 取消所有通知
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('所有通知已取消');
    } catch (error) {
      console.error('取消所有通知失败:', error);
    }
  }

  /**
   * 获取Expo推送令牌（用于远程推送）
   */
  async getExpoPushToken(): Promise<string | null> {
    try {
      if (this.expoPushToken) {
        return this.expoPushToken;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('通知权限未授予');
      }

      // 获取项目ID，如果没有配置则不传递projectId参数
      const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
      
      const tokenOptions: any = {};
      if (projectId && projectId !== 'your-project-id') {
        tokenOptions.projectId = projectId;
      }
      
      const token = await Notifications.getExpoPushTokenAsync(tokenOptions);

      this.expoPushToken = token.data;
      console.log('Expo推送令牌:', this.expoPushToken);
      
      // 将推送令牌发送到后端服务器
      await this.registerPushToken(this.expoPushToken);
      
      return this.expoPushToken;
    } catch (error) {
      console.error('获取Expo推送令牌失败:', error);
      return null;
    }
  }

  /**
   * 注册推送令牌到后端服务器
   */
  private async registerPushToken(token: string): Promise<void> {
    try {
      // 检查是否已登录，如果未登录则跳过注册
      const authToken = await AsyncStorage.getItem('auth_token');
      if (!authToken) {
        console.log('用户未登录，跳过推送令牌注册');
        return;
      }

      // 获取应用版本信息
      const appVersion = require('../../package.json').version || '1.0.0';
      
      // 构建设备信息
      const deviceInfo = JSON.stringify({
        platform: Platform.OS,
        version: Platform.Version,
        model: Platform.OS === 'ios' ? 'iPhone' : 'Android',
        timestamp: new Date().toISOString(),
      });

      const response = await ApiClient.post<boolean>('/device-tokens/register', {
        deviceToken: token,
        platform: Platform.OS,
        deviceInfo: deviceInfo,
        appVersion: appVersion,
      });
      
      if (response.success) {
        console.log('推送令牌注册成功');
      } else {
        console.error('推送令牌注册失败:', response.message);
        // 如果是网络错误，稍后重试
        if (response.message?.includes('Network') || response.message?.includes('网络')) {
          this.scheduleTokenRegistrationRetry(token);
        }
      }
    } catch (error) {
      console.error('推送令牌注册失败:', error);
      
      // 只在特定错误情况下进行网络诊断，避免频繁调用
      if (error instanceof Error && this.shouldPerformNetworkDiagnostics(error)) {
        console.log('检测到网络错误，进行网络诊断...');
        const diagnostics = await NetworkDiagnosticsService.runDiagnostics();
        const statusDescription = NetworkDiagnosticsService.getNetworkStatusDescription(diagnostics);
        console.log('网络诊断结果:', statusDescription);
        
        // 网络错误时安排重试
        if (NetworkDiagnosticsService.isNetworkError(error)) {
          console.log('检测到网络错误，将在30秒后重试推送令牌注册');
          this.scheduleTokenRegistrationRetry(token);
        }
      } else {
        // 非网络错误，直接安排重试
        console.log('非网络错误，将在30秒后重试推送令牌注册');
        this.scheduleTokenRegistrationRetry(token);
      }
    }
  }

  /**
   * 判断是否需要进行网络诊断
   */
  private shouldPerformNetworkDiagnostics(error: Error): boolean {
    // 只对明显的网络错误进行诊断
    const networkErrorKeywords = [
      'Network request failed',
      'fetch',
      'timeout',
      'connection',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ERR_NETWORK',
      'ERR_INTERNET_DISCONNECTED'
    ];
    
    return networkErrorKeywords.some(keyword => 
      error.message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * 安排推送令牌注册重试
   */
  private scheduleTokenRegistrationRetry(token: string): void {
    console.log('安排推送令牌注册重试...');
    setTimeout(async () => {
      try {
        console.log('开始重试推送令牌注册...');
        await this.registerPushToken(token);
      } catch (error) {
        console.error('推送令牌重试注册失败:', error);
        
        // 只在重试失败且是网络错误时进行诊断
        if (error instanceof Error && this.shouldPerformNetworkDiagnostics(error)) {
          const diagnostics = await NetworkDiagnosticsService.runDiagnostics();
          if (!diagnostics.serverReachable) {
            console.log('服务器仍然不可达，放弃推送令牌注册');
            const suggestions = NetworkDiagnosticsService.getNetworkTroubleshootingSuggestions(diagnostics);
            console.log('建议的解决方案:', suggestions);
          }
        }
      }
    }, 30000); // 30秒后重试
  }

  /**
   * 手动重新注册推送令牌（用于用户手动重试）
   */
  async retryPushTokenRegistration(): Promise<boolean> {
    try {
      if (!this.expoPushToken) {
        console.log('没有可用的推送令牌，尝试重新获取...');
        this.expoPushToken = await this.getExpoPushToken();
      }

      if (this.expoPushToken) {
        await this.registerPushToken(this.expoPushToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('手动重试推送令牌注册失败:', error);
      return false;
    }
  }


  /**
   * 获取Token状态
   */
  async getTokenStatus(): Promise<any> {
    try {
      if (!this.expoPushToken) {
        return null;
      }

      const response = await ApiClient.get<any>(`/device-tokens/status?deviceToken=${encodeURIComponent(this.expoPushToken)}`);

      if (response.success) {
        return response.data;
      } else {
        console.error('获取Token状态失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('获取Token状态失败:', error);
      return null;
    }
  }

  /**
   * 测试推送Token
   */
  async testPushToken(): Promise<any> {
    try {
      if (!this.expoPushToken) {
        return { success: false, message: 'Token不存在' };
      }

      const response = await ApiClient.post<any>(`/device-tokens/test-push?deviceToken=${encodeURIComponent(this.expoPushToken)}`);

      if (response.success) {
        return response.data;
      } else {
        console.error('测试推送Token失败:', response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('测试推送Token失败:', error);
      return { success: false, message: (error as Error).message || '未知错误' };
    }
  }

  /**
   * 发送一键通知 - 根据类型发送不同的通知
   */
  async sendOneClickNotification(type: string, userName?: string): Promise<boolean> {
    const notifications: Record<string, NotificationData> = {
      '产检提醒': {
        title: '💊 产检提醒',
        body: `${userName || '孕妈妈'}需要家人陪同去产检，请及时关注！`,
        data: { type: 'medical_checkup', urgent: true },
        categoryIdentifier: 'reminder',
      },
      '身体不适': {
        title: '😷 身体不适',
        body: `${userName || '孕妈妈'}身体感到不适，需要家人关注和照顾`,
        data: { type: 'health_concern', urgent: true },
        categoryIdentifier: 'emergency',
      },
      '分享喜悦': {
        title: '😊 分享喜悦',
        body: `${userName || '孕妈妈'}想要分享胎动、B超等美好时刻！`,
        data: { type: 'happy_moment', urgent: false },
        categoryIdentifier: 'reminder',
      },
      '紧急情况': {
        title: '🚨 紧急情况',
        body: `${userName || '孕妈妈'}遇到紧急情况，请立即联系！`,
        data: { type: 'emergency', urgent: true },
        categoryIdentifier: 'emergency',
      },
    };

    const notification = notifications[type];
    if (!notification) {
      console.error('未知的通知类型:', type);
      return false;
    }

    const result = await this.sendLocalNotification(notification);
    return result !== null;
  }

  /**
   * 发送一键通知到后端（更新为新架构）
   */
  async sendOneClickNotificationToServer(request: SendOneClickNotificationRequest): Promise<number | null> {
    try {
      const response = await ApiClient.post<number>('/notifications/one-click', request);
      if (response.success) {
        console.log('一键通知发送成功，记录ID:', response.data);
        return response.data || null;
      } else {
        console.error('发送一键通知失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('发送一键通知到服务器失败:', error);
      return null;
    }
  }

  /**
   * 创建通知模版到后端（更新为新架构）
   */
  async createNotificationTemplate(templateData: any): Promise<boolean> {
    try {
      console.log('正在创建通知模版，数据:', templateData);
      const response = await ApiClient.post<boolean>('/family-notifications', templateData);
      console.log('创建通知模版响应:', response);
      
      if (response.success) {
        console.log('通知模版创建成功');
        return true;
      } else {
        console.error('创建通知模版失败:', response.message);
        return false;
      }
    } catch (error) {
      console.error('创建通知模版到服务器失败:', error);
      return false;
    }
  }

  /**
   * 更新通知模版（更新为新架构）
   */
  async updateNotificationTemplate(templateId: number, templateData: any): Promise<boolean> {
    try {
      console.log('正在更新通知模版，ID:', templateId, '数据:', templateData);
      const response = await ApiClient.put<boolean>(`/family-notifications/${templateId}`, templateData);
      console.log('更新通知模版响应:', response);
      
      if (response.success) {
        console.log('通知模版更新成功');
        return true;
      } else {
        console.error('更新通知模版失败:', response.message);
        return false;
      }
    } catch (error) {
      console.error('更新通知模版到服务器失败:', error);
      return false;
    }
  }

  /**
   * 删除通知模版（更新为新架构）
   */
  async deleteNotificationTemplate(templateId: number): Promise<boolean> {
    try {
      console.log('正在删除通知模版，ID:', templateId);
      const response = await ApiClient.delete<boolean>(`/family-notifications/${templateId}`);
      console.log('删除通知模版响应:', response);
      
      if (response.success) {
        console.log('通知模版删除成功');
        return true;
      } else {
        console.error('删除通知模版失败:', response.message);
        return false;
      }
    } catch (error) {
      console.error('删除通知模版到服务器失败:', error);
      return false;
    }
  }

  /**
   * 获取家庭的通知模版（更新为新架构）
   */
  async getFamilyNotificationTemplates(familyId: number): Promise<NotificationTemplate[]> {
    try {
      console.log('正在获取家庭通知模版，家庭ID:', familyId);
      const response = await ApiClient.get<FamilyNotification[]>(`/family-notifications/family/${familyId}`);
      console.log('获取家庭通知模版响应:', response);
      
      if (response.success && response.data) {
        // 将后端的通知模版数据转换为前端模版格式
        const templates = response.data.map(notification => ({
          id: `template_${notification.id}`,
          title: notification.title,
          content: notification.content,
          icon: notification.svgIcon || '📱',
          type: notification.type || 2,
          priority: notification.type || 1,
          category: 'custom' as const,
          description: `${notification.title}`
        }));
        console.log('转换后的模版:', templates);
        return templates;
      }
      console.log('没有找到模版数据');
      return [];
    } catch (error) {
      console.error('获取家庭通知模版失败:', error);
      return [];
    }
  }

  /**
   * 获取家庭的通知模版原始数据（用于编辑）
   */
  async getFamilyNotificationTemplatesRaw(familyId: number): Promise<FamilyNotification[]> {
    try {
      console.log('正在获取家庭通知模版原始数据，家庭ID:', familyId);
      const response = await ApiClient.get<FamilyNotification[]>(`/family-notifications/family/${familyId}`);
      console.log('获取家庭通知模版原始数据响应:', response);
      
      if (response.success && response.data) {
        return response.data;
      }
      console.log('没有找到模版原始数据');
      return [];
    } catch (error) {
      console.error('获取家庭通知模版原始数据失败:', error);
      return [];
    }
  }

  /**
   * 使用模版发送通知（更新为新架构）
   */
  async sendNotificationFromTemplate(templateId: number, familyId: number): Promise<boolean> {
    try {
      const response = await ApiClient.post<boolean>(`/family-notifications/send`, {
        templateId: templateId,
        familyId: familyId
      });
      if (response.success) {
        console.log('使用模版发送通知成功');
        return true;
      } else {
        console.error('使用模版发送通知失败:', response.message);
        return false;
      }
    } catch (error) {
      console.error('使用模版发送通知失败:', error);
      return false;
    }
  }



  /**
   * 获取家庭通知模版列表（更新为新架构）
   */
  async getFamilyNotifications(
    familyId: number,
    pageNum: number = 1,
    pageSize: number = 10,
    type?: number,
    status?: number,
    creatorId?: number
  ): Promise<PageResult<NotificationResponse> | null> {
    try {
      const params = {
        pageNum,
        pageSize,
        ...(type && { type }),
        ...(status && { status }),
        ...(creatorId && { creatorId }),
      };
      const response = await ApiClient.get<PageResult<NotificationResponse>>(
        `/notifications/family/${familyId}`,
        params
      );
      if (response.success) {
        return response.data || null;
      } else {
        console.error('获取家庭通知模版失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('获取家庭通知模版失败:', error);
      return null;
    }
  }

  /**
   * 获取接收的通知列表（更新为新架构）
   */
  async getReceivedNotifications(
    pageNum: number = 1,
    pageSize: number = 10,
    isRead?: boolean,
    notificationType?: number
  ): Promise<PageResult<any> | null> {
    try {
      const params = {
        pageNum,
        pageSize,
        ...(isRead !== undefined && { isRead }),
        ...(notificationType && { notificationType }),
      };
      const response = await ApiClient.get<PageResult<any>>(
        '/notifications/received',
        params
      );
      if (response.success) {
        return response.data || null;
      } else {
        console.error('获取接收通知失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('获取接收通知失败:', error);
      return null;
    }
  }

  /**
   * 标记通知为已读（更新为新架构）
   */
  async markNotificationAsRead(templateId: number): Promise<boolean> {
    try {
      const response = await ApiClient.post<boolean>(`/notifications/${templateId}/read`);
      if (response.success) {
        console.log('通知已标记为已读');
        return true;
      } else {
        console.error('标记通知已读失败:', response.message);
        return false;
      }
    } catch (error) {
      console.error('标记通知已读失败:', error);
      return false;
    }
  }

  /**
   * 获取未读通知数量（更新为新架构）
   */
  async getUnreadNotificationCount(familyId?: number): Promise<number> {
    try {
      const params = familyId ? { familyId } : {};
      const response = await ApiClient.get<number>('/notifications/unread-count', params);
      if (response.success) {
        return response.data || 0;
      } else {
        console.error('获取未读通知数量失败:', response.message);
        return 0;
      }
    } catch (error) {
      console.error('获取未读通知数量失败:', error);
      return 0;
    }
  }

  /**
   * 获取通知模板列表
   */
  getNotificationTemplates(): NotificationTemplate[] {
    return [
      {
        id: 'medical_checkup',
        title: '产检提醒',
        content: '需要家人陪同去产检，请及时关注！',
        icon: '💊',
        type: 2,
        priority: 2,
        category: 'health',
        description: '提醒家人陪同产检'
      },
      {
        id: 'health_concern',
        title: '身体不适',
        content: '身体感到不适，需要家人关注和照顾',
        icon: '😷',
        type: 3,
        priority: 3,
        category: 'emergency',
        description: '身体不适需要照顾'
      },
      {
        id: 'happy_moment',
        title: '分享喜悦',
        content: '想要分享胎动、B超等美好时刻！',
        icon: '😊',
        type: 1,
        priority: 1,
        category: 'sharing',
        description: '分享孕期美好时刻'
      },
      {
        id: 'emergency',
        title: '紧急情况',
        content: '遇到紧急情况，请立即联系！',
        icon: '🚨',
        type: 3,
        priority: 3,
        category: 'emergency',
        description: '紧急情况求助'
      },
      {
        id: 'medication_reminder',
        title: '服药提醒',
        content: '该服用维生素或其他药物了',
        icon: '💊',
        type: 1,
        priority: 2,
        category: 'health',
        description: '提醒按时服药'
      },
      {
        id: 'appointment_reminder',
        title: '预约提醒',
        content: '有重要的医疗预约或检查',
        icon: '📅',
        type: 2,
        priority: 2,
        category: 'reminder',
        description: '医疗预约提醒'
      },
      {
        id: 'meal_time',
        title: '用餐提醒',
        content: '该吃饭了，注意营养均衡',
        icon: '🍽️',
        type: 1,
        priority: 1,
        category: 'reminder',
        description: '用餐时间提醒'
      },
      {
        id: 'exercise_reminder',
        title: '运动提醒',
        content: '适当运动有益健康',
        icon: '🤸‍♀️',
        type: 1,
        priority: 1,
        category: 'health',
        description: '运动锻炼提醒'
      }
    ];
  }

  /**
   * 发送自定义通知（结合本地和服务器）
   */
  async sendCustomNotification(
    request: SendOneClickNotificationRequest,
    sendLocalNotification: boolean = true
  ): Promise<boolean> {
    try {
      // 先发送到服务器
      const serverId = await this.sendOneClickNotificationToServer(request);
      
      if (sendLocalNotification) {
        // 发送本地通知
        const localNotification: NotificationData = {
          title: request.title,
          body: request.content,
          data: {
            serverId,
            familyId: request.familyId,
            type: 'custom',
            priority: request.priority || 1
          },
          categoryIdentifier: request.priority === 3 ? 'emergency' : 'reminder',
        };
        
        await this.sendLocalNotification(localNotification);
      }
      
      return serverId !== null;
    } catch (error) {
      console.error('发送自定义通知失败:', error);
      return false;
    }
  }

  /**
   * 获取用户自定义模板
   */
  getUserCustomTemplates(): NotificationTemplate[] {
    try {
      const stored = localStorage.getItem('custom_notification_templates');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('获取自定义模板失败:', error);
      return [];
    }
  }

  /**
   * 保存用户自定义模板
   */
  saveUserCustomTemplate(template: Omit<NotificationTemplate, 'id'>): boolean {
    try {
      const templates = this.getUserCustomTemplates();
      const newTemplate: NotificationTemplate = {
        ...template,
        id: `custom_${Date.now()}`,
        category: 'custom'
      };
      
      templates.push(newTemplate);
      localStorage.setItem('custom_notification_templates', JSON.stringify(templates));
      console.log('自定义模板保存成功:', newTemplate.title);
      return true;
    } catch (error) {
      console.error('保存自定义模板失败:', error);
      return false;
    }
  }

  /**
   * 删除用户自定义模板
   */
  deleteUserCustomTemplate(templateId: string): boolean {
    try {
      const templates = this.getUserCustomTemplates();
      const filteredTemplates = templates.filter(t => t.id !== templateId);
      localStorage.setItem('custom_notification_templates', JSON.stringify(filteredTemplates));
      console.log('自定义模板删除成功:', templateId);
      return true;
    } catch (error) {
      console.error('删除自定义模板失败:', error);
      return false;
    }
  }

  /**
   * 获取所有模板（系统模板 + 用户自定义模板）
   */
  getAllNotificationTemplates(): NotificationTemplate[] {
    const systemTemplates = this.getNotificationTemplates();
    const customTemplates = this.getUserCustomTemplates();
    return [...systemTemplates, ...customTemplates];
  }

  /**
   * 更新用户自定义模板
   */
  updateUserCustomTemplate(templateId: string, updates: Partial<NotificationTemplate>): boolean {
    try {
      const templates = this.getUserCustomTemplates();
      const templateIndex = templates.findIndex(t => t.id === templateId);
      
      if (templateIndex === -1) {
        console.error('模板不存在:', templateId);
        return false;
      }

      templates[templateIndex] = { ...templates[templateIndex], ...updates };
      localStorage.setItem('custom_notification_templates', JSON.stringify(templates));
      console.log('自定义模板更新成功:', templateId);
      return true;
    } catch (error) {
      console.error('更新自定义模板失败:', error);
      return false;
    }
  }

  /**
   * 创建并发送定时通知
   */
  async scheduleCustomNotification(
    request: SendOneClickNotificationRequest & { scheduledTime: string }
  ): Promise<boolean> {
    try {
      // 发送到服务器，包含定时信息
      const serverId = await this.sendOneClickNotificationToServer(request);
      
      if (serverId) {
        console.log('定时通知创建成功，服务器ID:', serverId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('创建定时通知失败:', error);
      return false;
    }
  }

  /**
   * 获取通知模板使用统计
   */
  getTemplateUsageStats(): Record<string, number> {
    try {
      const stored = localStorage.getItem('template_usage_stats');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('获取模板使用统计失败:', error);
      return {};
    }
  }

  /**
   * 记录模板使用
   */
  recordTemplateUsage(templateId: string): void {
    try {
      const stats = this.getTemplateUsageStats();
      stats[templateId] = (stats[templateId] || 0) + 1;
      localStorage.setItem('template_usage_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('记录模板使用失败:', error);
    }
  }

  /**
   * 获取最常用的模板
   */
  getMostUsedTemplates(limit: number = 5): NotificationTemplate[] {
    const stats = this.getTemplateUsageStats();
    const allTemplates = this.getAllNotificationTemplates();
    
    return allTemplates
      .map(template => ({
        ...template,
        usageCount: stats[template.id] || 0
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  /**
   * 添加通知监听器
   */
  addNotificationListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * 添加通知响应监听器（用户点击通知时）
   */
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * 清除应用图标上的徽章数字
   */
  async clearBadgeCount(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('清除徽章数字失败:', error);
    }
  }

  /**
   * 设置应用图标徽章数字
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('设置徽章数字失败:', error);
    }
  }
}

// 导出单例实例
export const notificationService = new NotificationService();
export default notificationService;