import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from '../types/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Token失效事件监听器
type TokenExpiredListener = () => void;
let tokenExpiredListeners: TokenExpiredListener[] = [];

export const addTokenExpiredListener = (listener: TokenExpiredListener) => {
  tokenExpiredListeners.push(listener);
};

export const removeTokenExpiredListener = (listener: TokenExpiredListener) => {
  tokenExpiredListeners = tokenExpiredListeners.filter(l => l !== listener);
};

const notifyTokenExpired = () => {
  tokenExpiredListeners.forEach(listener => listener());
};

export class ApiClient {
  private static async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    }

    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data: ApiResponse<T> = await response.json();

      if (response.ok && data.success) {
        return data;
      } else {
        // 如果是401错误，清除认证数据并通知监听器
        if (response.status === 401) {
          console.log('API请求返回401，token失效');
          await AsyncStorage.multiRemove(['auth_token', 'user_info']);
          notifyTokenExpired();
        }
        
        return {
          code: data.code || response.status,
          message: data.message || `请求失败: ${response.statusText}`,
          timestamp: data.timestamp || Date.now(),
          success: false,
          failure: true,
        };
      }
    } catch (error) {
      return {
        code: response.status,
        message: `响应解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: Date.now(),
        success: false,
        failure: true,
      };
    }
  }

  private static async handleError(error: unknown): Promise<ApiResponse<any>> {
    console.error('API request error:', error);
    
    let message = '网络连接失败，请检查网络设置';
    let code = 500;
    
    if (error instanceof Error) {
      // 网络连接失败
      if (error.message.includes('Network request failed') ||
          error.message.includes('fetch')) {
        message = '无法连接到服务器，请检查网络连接或稍后重试';
        code = 503; // Service Unavailable
      }
      // 超时错误
      else if (error.message.includes('timeout')) {
        message = '请求超时，请检查网络连接后重试';
        code = 408; // Request Timeout
      }
      // 其他错误
      else {
        message = error.message;
      }
    }
    
    return {
      code,
      message,
      timestamp: Date.now(),
      success: false,
      failure: true,
    };
  }

  static async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      let url = `${API_BASE_URL}${endpoint}`;

      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        if (searchParams.toString()) {
          url += `?${searchParams.toString()}`;
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'include',
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  static async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        mode: 'cors',
        credentials: 'include',
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  static async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        mode: 'cors',
        credentials: 'include',
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
        mode: 'cors',
        credentials: 'include',
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }
}