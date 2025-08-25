import { ApiResponse } from '../types/api';
import { ApiClient } from '../utils/apiClient';

/**
 * 孕期进度服务
 */
export class PregnancyProgressService {
  /**
   * 获取用户孕期进度
   * @param userId 用户ID
   * @returns 孕期进度信息
   */
  static async getPregnancyProgressByUserId(userId: number): Promise<any> {
    const response = await ApiClient.get<any>(
      `/pregnancy-progress/user/${userId}`
    );
    
    if (!response.success) {
      throw new Error(response.message || '获取孕期进度失败');
    }
    
    return response.data!;
  }

  /**
   * 获取家庭孕期进度
   * 如果当前用户是孕妇，返回自己的进度；如果不是孕妇，返回其所属家庭中孕妇的进度
   * @returns 孕期进度信息
   */
  static async getFamilyPregnancyProgress(): Promise<any | null> {
    const response = await ApiClient.get<any>(
      `/pregnancy-progress/family`
    );
    
    if (!response.success) {
      throw new Error(response.message || '获取家庭孕期进度失败');
    }
    
    return response.data || null;
  }
}

export const pregnancyProgressService = PregnancyProgressService;