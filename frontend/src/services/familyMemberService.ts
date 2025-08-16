import { ApiClient } from '../utils/apiClient';
import {
  ApiResponse,
  PageResult,
  UpdateFamilyMemberRequest,
  FamilyMemberResponse,
} from '../types/api';

export class FamilyMemberService {
  /**
   * 分页查询家庭成员
   */
  static async getFamilyMemberPage(params: {
    pageNum?: number;
    pageSize?: number;
    familyId: number;
    status?: number;
    roleId?: number;
  }): Promise<ApiResponse<PageResult<FamilyMemberResponse>>> {
    const {
      pageNum = 1,
      pageSize = 10,
      familyId,
      status,
      roleId,
    } = params;

    return ApiClient.get<PageResult<FamilyMemberResponse>>('/family-members', {
      pageNum,
      pageSize,
      familyId,
      status,
      roleId,
    });
  }

  /**
   * 查询家庭成员列表
   */
  static async getFamilyMemberList(params: {
    familyId: number;
    status?: number;
  }): Promise<ApiResponse<FamilyMemberResponse[]>> {
    const { familyId, status } = params;

    return ApiClient.get<FamilyMemberResponse[]>('/family-members/list', {
      familyId,
      status,
    });
  }

  /**
   * 根据ID查询家庭成员详情
   */
  static async getFamilyMemberDetail(id: number): Promise<ApiResponse<FamilyMemberResponse>> {
    return ApiClient.get<FamilyMemberResponse>(`/family-members/${id}`);
  }

  /**
   * 更新家庭成员信息
   */
  static async updateFamilyMember(request: UpdateFamilyMemberRequest): Promise<ApiResponse<FamilyMemberResponse>> {
    return ApiClient.put<FamilyMemberResponse>('/family-members', request);
  }

  /**
   * 移除家庭成员
   */
  static async removeFamilyMember(id: number): Promise<ApiResponse<boolean>> {
    return ApiClient.delete<boolean>(`/family-members/${id}`);
  }

  /**
   * 统计家庭成员数量
   */
  static async countFamilyMembers(params: {
    familyId: number;
    status?: number;
  }): Promise<ApiResponse<number>> {
    const { familyId, status } = params;

    return ApiClient.get<number>('/family-members/count', {
      familyId,
      status,
    });
  }

  /**
   * 检查用户是否为家庭成员
   */
  static async checkFamilyMember(params: {
    familyId: number;
    userId: number;
  }): Promise<ApiResponse<boolean>> {
    const { familyId, userId } = params;

    return ApiClient.get<boolean>('/family-members/check', {
      familyId,
      userId,
    });
  }

  /**
   * 获取在线家庭成员列表
   */
  static async getOnlineFamilyMembers(params: {
    familyId: number;
  }): Promise<ApiResponse<FamilyMemberResponse[]>> {
    const { familyId } = params;

    return ApiClient.get<FamilyMemberResponse[]>('/family-members/online', {
      familyId,
    });
  }

  /**
   * 获取家庭在线用户列表（基于设备Token活跃状态）
   */
  static async getOnlineFamilyUsers(params: {
    familyId: number;
    onlineThresholdMinutes?: number;
  }): Promise<ApiResponse<FamilyMemberResponse[]>> {
    const { familyId, onlineThresholdMinutes = 30 } = params;

    return ApiClient.get<FamilyMemberResponse[]>('/family-members/online-users', {
      familyId,
      onlineThresholdMinutes,
    });
  }

  /**
   * 调试用户家庭成员状态
   */
  static async debugUserFamilyStatus(params: {
    familyId: number;
  }): Promise<ApiResponse<any>> {
    const { familyId } = params;

    return ApiClient.get<any>('/family-members/debug-user-status', {
      familyId,
    });
  }

  /**
   * 查询Redis会话信息
   */
  static async getRedisSessionInfo(): Promise<ApiResponse<any>> {
    return ApiClient.get<any>('/family-members/redis-session');
  }

  /**
   * 获取家庭在线用户（基于StpUtil.isLogin）
   */
  static async getOnlineUsersFromStp(params: {
    familyId: number;
  }): Promise<ApiResponse<any>> {
    const { familyId } = params;

    return ApiClient.get<any>('/family-members/online-from-stp', {
      familyId,
    });
  }

  /**
   * 查看Redis会话原始数据
   */
  static async getRedisSessionRawData(): Promise<ApiResponse<any>> {
    return ApiClient.get<any>('/family-members/redis-session-raw');
  }
}

export const familyMemberService = FamilyMemberService;