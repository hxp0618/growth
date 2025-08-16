import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, LoginRequest, RegisterRequest, ApiResponse, LoginResponseData } from '@/services/authService';
import { userProfileService } from '@/services/userProfileService';
import { UpdateUserProfileRequest, UserProfileResponse } from '@/types/api';
import { addTokenExpiredListener, removeTokenExpiredListener } from '@/utils/apiClient';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<ApiResponse<LoginResponseData>>;
  register: (userData: RegisterRequest) => Promise<ApiResponse<any>>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: UpdateUserProfileRequest) => Promise<ApiResponse<UserProfileResponse>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // 获取用户详细信息的函数
  const getUserProfile = async (): Promise<void> => {
    try {
      const response = await userProfileService.getCurrentUserProfile();
      if (response.success && response.data) {
        setUserProfile(response.data);
      } else if (response.code === 401) {
        // token失效，清除用户状态
        console.log('获取用户详细信息时发现token失效');
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Get user profile error:', error);
    }
  };

  useEffect(() => {
    initializeAuth();

    // 监听token失效事件
    const handleTokenExpired = () => {
      console.log('收到token失效通知，清除用户状态');
      setUser(null);
      setUserProfile(null);
    };

    addTokenExpiredListener(handleTokenExpired);

    return () => {
      removeTokenExpiredListener(handleTokenExpired);
    };
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // 首先检查本地存储的用户信息
      const storedUser = await authService.getStoredUser();
      const isLoggedIn = await authService.isLoggedIn();
      
      if (isLoggedIn && storedUser) {
        // 先设置本地存储的用户信息
        setUser(storedUser);
        
        // 尝试验证token有效性并获取最新用户信息
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          // token有效，更新用户信息
          setUser(response.data);
          // 获取用户详细个人信息
          await getUserProfile();
        } else if (response.code === 401) {
          // token失效，清除用户状态
          console.log('Token失效，清除用户状态');
          setUser(null);
          setUserProfile(null);
        }
      }
    } catch (error) {
      console.error('Initialize auth error:', error);
      // 网络错误时，保持本地用户状态但标记为可能需要重新验证
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponseData>> => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        code: 500,
        message: error instanceof Error ? error.message : '网络连接失败，请检查网络设置后重试',
        timestamp: Date.now(),
        success: false,
        failure: true,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      return {
        code: 500,
        message: error instanceof Error ? error.message : '网络连接失败，请检查网络设置后重试',
        timestamp: Date.now(),
        success: false,
        failure: true,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      // 即使出错也清除用户状态
      setUser(null);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        // 同时更新用户详细信息
        await getUserProfile();
      } else if (response.code === 401) {
        // Token 过期，清除用户状态
        console.log('刷新用户信息时发现token失效');
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };


  const updateUserProfile = async (profileData: UpdateUserProfileRequest): Promise<ApiResponse<UserProfileResponse>> => {
    setIsLoading(true);
    
    try {
      const response = await userProfileService.updateUserProfile(profileData);
      
      if (response.success && response.data) {
        setUserProfile(response.data);
      }
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        code: 500,
        message: error instanceof Error ? error.message : '更新个人信息失败',
        timestamp: Date.now(),
        success: false,
        failure: true,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    getUserProfile,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}