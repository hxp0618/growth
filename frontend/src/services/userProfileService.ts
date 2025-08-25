import { ApiClient } from '../utils/apiClient';
import { ApiResponse, UpdateUserProfileRequest, UserProfileResponse } from '../types/api';

/**
 * 用户个人信息服务
 */
class UserProfileService {
  private readonly baseUrl = '/user/profile';

  /**
   * 获取当前用户个人信息
   */
  async getCurrentUserProfile(): Promise<ApiResponse<UserProfileResponse>> {
    try {
      return await ApiClient.get<UserProfileResponse>(this.baseUrl);
    } catch (error) {
      console.error('Get current user profile error:', error);
      throw error;
    }
  }

  /**
   * 获取指定用户个人信息（家庭成员可见）
   */
  async getUserProfileById(userId: number): Promise<ApiResponse<UserProfileResponse>> {
    try {
      return await ApiClient.get<UserProfileResponse>(`${this.baseUrl}/${userId}`);
    } catch (error) {
      console.error('Get user profile by id error:', error);
      throw error;
    }
  }

  /**
   * 更新个人信息（完整更新）
   */
  async updateUserProfile(data: UpdateUserProfileRequest): Promise<ApiResponse<UserProfileResponse>> {
    try {
      return await ApiClient.put<UserProfileResponse>(this.baseUrl, data);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  /**
   * 更新基本信息
   */
  async updateBasicInfo(data: UpdateUserProfileRequest): Promise<ApiResponse<UserProfileResponse>> {
    try {
      return await ApiClient.put<UserProfileResponse>(`${this.baseUrl}/basic`, data);
    } catch (error) {
      console.error('Update basic info error:', error);
      throw error;
    }
  }

  /**
   * 更新健康信息
   */
  async updateHealthInfo(data: Pick<UpdateUserProfileRequest, 'allergies' | 'medicalHistory'>): Promise<ApiResponse<UserProfileResponse>> {
    try {
      return await ApiClient.put<UserProfileResponse>(`${this.baseUrl}/health`, data);
    } catch (error) {
      console.error('Update health info error:', error);
      throw error;
    }
  }

  /**
   * 更新孕期信息
   */
  async updatePregnancyInfo(data: Pick<UpdateUserProfileRequest, 'isPregnant' | 'expectedDeliveryDate' | 'lastMenstrualPeriod' | 'pregnancyNotes'>): Promise<ApiResponse<UserProfileResponse>> {
    try {
      return await ApiClient.put<UserProfileResponse>(`${this.baseUrl}/pregnancy`, data);
    } catch (error) {
      console.error('Update pregnancy info error:', error);
      throw error;
    }
  }

  /**
   * 格式化日期为 yyyy-MM-dd 格式
   */
  formatDate(date: string | Date): string {
    if (!date) return '';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * 验证日期格式
   */
  isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * 计算BMI
   */
  calculateBMI(height?: number, weight?: number): number | null {
    if (!height || !weight || height <= 0 || weight <= 0) return null;
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    return Math.round(bmi * 10) / 10; // 保留一位小数
  }

  /**
   * 计算年龄
   */
  calculateAge(birthDate: string): number | null {
    if (!birthDate || !this.isValidDate(birthDate)) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  }

  /**
   * 计算孕周
   */
  calculatePregnancyWeeks(lastMenstrualPeriod: string): number | null {
    if (!lastMenstrualPeriod || !this.isValidDate(lastMenstrualPeriod)) return null;
    
    const today = new Date();
    const lmp = new Date(lastMenstrualPeriod);
    
    const diffTime = today.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return null;
    
    return Math.floor(diffDays / 7);
  }
}

export const userProfileService = new UserProfileService();