import { healthService } from '../services/healthService';

export interface NetworkStatus {
  isOnline: boolean;
  lastCheck: Date;
  errorMessage?: string;
  latency?: number;
}

export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private status: NetworkStatus = {
    isOnline: false,
    lastCheck: new Date(),
  };
  private listeners: ((status: NetworkStatus) => void)[] = [];
  private checkInterval: NodeJS.Timeout | null = null;
  private isChecking = false;

  private constructor() {}

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  /**
   * 开始网络监控
   */
  startMonitoring(checkIntervalMs: number = 60000): void {
    if (this.checkInterval) {
      console.log('网络监控已在运行中');
      return;
    }

    console.log('开始网络监控，检查间隔:', checkIntervalMs, 'ms');
    
    // 立即执行一次检查
    this.checkNetworkStatus();
    
    // 设置定期检查
    this.checkInterval = setInterval(() => {
      this.checkNetworkStatus();
    }, checkIntervalMs);
  }

  /**
   * 停止网络监控
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('网络监控已停止');
    }
  }

  /**
   * 检查网络状态
   */
  async checkNetworkStatus(): Promise<NetworkStatus> {
    if (this.isChecking) {
      console.log('网络状态检查正在进行中，返回上次结果');
      return this.status;
    }

    this.isChecking = true;
    const startTime = Date.now();

    try {
      console.log('执行轻量级网络状态检查...');
      
      const response = await healthService.health();
      const latency = Date.now() - startTime;
      
      const newStatus: NetworkStatus = {
        isOnline: response.success,
        lastCheck: new Date(),
        latency,
        errorMessage: response.success ? undefined : response.message,
      };

      // 更新状态
      this.status = newStatus;
      
      // 通知监听器
      this.notifyListeners(newStatus);
      
      console.log('网络状态检查完成:', newStatus.isOnline ? '在线' : '离线');
      return newStatus;
      
    } catch (error) {
      const latency = Date.now() - startTime;
      const errorStatus: NetworkStatus = {
        isOnline: false,
        lastCheck: new Date(),
        latency,
        errorMessage: error instanceof Error ? error.message : '网络检查失败',
      };

      this.status = errorStatus;
      this.notifyListeners(errorStatus);
      
      console.error('网络状态检查失败:', error);
      return errorStatus;
    } finally {
      this.isChecking = false;
    }
  }

  /**
   * 强制刷新网络状态（忽略缓存）
   */
  async forceCheck(): Promise<NetworkStatus> {
    console.log('强制刷新网络状态...');
    return this.checkNetworkStatus();
  }

  /**
   * 获取当前网络状态
   */
  getCurrentStatus(): NetworkStatus {
    return { ...this.status };
  }

  /**
   * 添加状态变化监听器
   */
  addListener(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.push(listener);
    
    // 返回移除监听器的函数
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(status: NetworkStatus): void {
    this.listeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('网络状态监听器执行失败:', error);
      }
    });
  }

  /**
   * 检查是否在线
   */
  isOnline(): boolean {
    return this.status.isOnline;
  }

  /**
   * 获取最后检查时间
   */
  getLastCheckTime(): Date {
    return this.status.lastCheck;
  }

  /**
   * 获取延迟
   */
  getLatency(): number | undefined {
    return this.status.latency;
  }

  /**
   * 获取错误信息
   */
  getErrorMessage(): string | undefined {
    return this.status.errorMessage;
  }
}

// 导出单例实例
export const networkMonitor = NetworkMonitor.getInstance();
