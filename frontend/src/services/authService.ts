import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  username?: string;
  password: string;
  phone: string;
  nickname: string;
  email?: string;
}

export interface User {
  id: number;
  create_time: string;
  update_time: string;
  is_deleted: boolean;
  version: number;
  nickname: string;
  phone: string;
  gender: number;
  status: number;
  last_login_time: string;
  last_login_ip: string;
}

export interface LoginResponseData {
  token: string;
  tokenName: string;
  tokenTimeout: number;
  user: User;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
  timestamp: number;
  success: boolean;
  failure: boolean;
}

class AuthService {
  private token: string | null = null;

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data: ApiResponse<LoginResponseData> = await response.json();

      if (response.ok && data.success && data.data && data.data.token) {
        this.token = data.data.token;
        await AsyncStorage.setItem('auth_token', data.data.token);
        await AsyncStorage.setItem('user_info', JSON.stringify(data.data.user));
        
        return data;
      } else {
        return {
          code: data.code || response.status,
          message: data.message || '登录失败',
          timestamp: data.timestamp || Date.now(),
          success: false,
          failure: true,
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        code: 500,
        message: error instanceof Error ? error.message : '网络连接失败，请检查网络设置',
        timestamp: Date.now(),
        success: false,
        failure: true,
      };
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data: ApiResponse<any> = await response.json();

      if (response.ok && data.success) {
        return data;
      } else {
        return {
          code: data.code || response.status,
          message: data.message || '注册失败',
          timestamp: data.timestamp || Date.now(),
          success: false,
          failure: true,
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return {
        code: 500,
        message: error instanceof Error ? error.message : '网络连接失败，请检查网络设置',
        timestamp: Date.now(),
        success: false,
        failure: true,
      };
    }
  }

  async logout(): Promise<ApiResponse<any>> {
    try {
      const token = await this.getToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `${token}` : '',
        },
        mode: 'cors',
        credentials: 'include',
      });

      // 无论服务器响应如何，都清除本地存储
      await this.clearAuthData();

      if (response.ok) {
        const data: ApiResponse<any> = await response.json();
        return data;
      } else {
        return {
          code: response.status,
          message: '登出失败',
          timestamp: Date.now(),
          success: false,
          failure: true,
        };
      }
    } catch (error) {
      console.error('Logout error:', error);
      // 即使出错也清除本地数据
      await this.clearAuthData();
      return {
        code: 500,
        message: '网络连接失败，已清除本地登录状态',
        timestamp: Date.now(),
        success: false,
        failure: true,
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        return {
          code: 401,
          message: '未登录',
          timestamp: Date.now(),
          success: false,
          failure: true,
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      });

      const data: ApiResponse<User> = await response.json();

      if (response.ok && data.success && data.data) {
        await AsyncStorage.setItem('user_info', JSON.stringify(data.data));
        return data;
      } else {
        if (response.status === 401) {
          // Token 过期，清除本地数据
          await this.clearAuthData();
        }
        return {
          code: data.code || response.status,
          message: data.message || '获取用户信息失败',
          timestamp: data.timestamp || Date.now(),
          success: false,
          failure: true,
        };
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        code: 500,
        message: '网络连接失败，请检查网络设置',
        timestamp: Date.now(),
        success: false,
        failure: true,
      };
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string; tokenName: string; tokenTimeout: number }>> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        return {
          code: 401,
          message: '未登录',
          timestamp: Date.now(),
          success: false,
          failure: true,
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      });

      const data: ApiResponse<{ token: string; tokenName: string; tokenTimeout: number }> = await response.json();

      if (response.ok && data.success && data.data && data.data.token) {
        this.token = data.data.token;
        await AsyncStorage.setItem('auth_token', data.data.token);
        
        return data;
      } else {
        return {
          code: data.code || response.status,
          message: data.message || '刷新Token失败',
          timestamp: data.timestamp || Date.now(),
          success: false,
          failure: true,
        };
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        code: 500,
        message: '网络连接失败，请检查网络设置',
        timestamp: Date.now(),
        success: false,
        failure: true,
      };
    }
  }

  async getToken(): Promise<string | null> {
    if (this.token) {
      return this.token;
    }
    
    try {
      this.token = await AsyncStorage.getItem('auth_token');
      return this.token;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userInfo = await AsyncStorage.getItem('user_info');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Get stored user error:', error);
      return null;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  private async clearAuthData(): Promise<void> {
    this.token = null;
    try {
      await AsyncStorage.multiRemove(['auth_token', 'user_info']);
    } catch (error) {
      console.error('Clear auth data error:', error);
    }
  }

}

export const authService = new AuthService();