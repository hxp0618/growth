import { ApiClient } from '../utils/apiClient';
import {
  ApiResponse,
  HealthInfo,
  SystemInfo,
} from '../types/api';

export class HealthService {
  private static lastHealthCheck: Date | null = null;
  private static cachedHealthInfo: HealthInfo | null = null;
  private static readonly CACHE_DURATION = 30000; // 30秒缓存
  private static isChecking = false;

  /**
   * 轻量级健康检查（带缓存）
   */
  static async health(): Promise<ApiResponse<HealthInfo>> {
    // 防止并发检查
    if (this.isChecking) {
      console.log('健康检查正在进行中，返回缓存结果');
      return {
        code: 200,
        message: '使用缓存结果',
        timestamp: Date.now(),
        success: true,
        data: this.cachedHealthInfo || { status: 'unknown', timestamp: new Date().toISOString() },
      };
    }

    // 检查缓存
    if (this.cachedHealthInfo && this.lastHealthCheck) {
      const timeSinceLastCheck = Date.now() - this.lastHealthCheck.getTime();
      if (timeSinceLastCheck < this.CACHE_DURATION) {
        console.log('使用缓存的健康检查结果');
        return {
          code: 200,
          message: '使用缓存结果',
          timestamp: Date.now(),
          success: true,
          data: this.cachedHealthInfo,
        };
      }
    }

    this.isChecking = true;
    
    try {
      console.log('执行健康检查...');
      const response = await ApiClient.get<HealthInfo>('/health');
      
      if (response.success && response.data) {
        // 缓存成功结果
        this.cachedHealthInfo = response.data;
        this.lastHealthCheck = new Date();
        console.log('健康检查完成，结果已缓存');
      }
      
      return response;
    } catch (error) {
      console.error('健康检查失败:', error);
      return {
        code: 500,
        message: error instanceof Error ? error.message : '健康检查失败',
        timestamp: Date.now(),
        success: false,
        failure: true,
      };
    } finally {
      this.isChecking = false;
    }
  }

  /**
   * 系统信息
   */
  static async info(): Promise<ApiResponse<SystemInfo>> {
    return ApiClient.get<SystemInfo>('/health/info');
  }

  /**
   * 强制刷新健康检查（忽略缓存）
   */
  static async healthForce(): Promise<ApiResponse<HealthInfo>> {
    // 清除缓存
    this.cachedHealthInfo = null;
    this.lastHealthCheck = null;
    
    return this.health();
  }

  /**
   * 清除健康检查缓存
   */
  static clearCache(): void {
    this.cachedHealthInfo = null;
    this.lastHealthCheck = null;
    console.log('健康检查缓存已清除');
  }

  /**
   * 获取缓存状态
   */
  static getCacheStatus(): { hasCache: boolean; lastCheck: Date | null; cacheAge: number | null } {
    if (!this.cachedHealthInfo || !this.lastHealthCheck) {
      return { hasCache: false, lastCheck: null, cacheAge: null };
    }

    const cacheAge = Date.now() - this.lastHealthCheck.getTime();
    return {
      hasCache: true,
      lastCheck: this.lastHealthCheck,
      cacheAge,
    };
  }
}

export const healthService = HealthService;