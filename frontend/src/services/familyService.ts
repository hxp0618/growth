import { ApiClient } from '../utils/apiClient';
import {
  ApiResponse,
  PageResult,
  CreateFamilyRequest,
  UpdateFamilyRequest,
  JoinFamilyRequest,
  FamilyResponse,
} from '../types/api';

export class FamilyService {
  /**
   * 创建家庭
   */
  static async createFamily(request: CreateFamilyRequest): Promise<ApiResponse<FamilyResponse>> {
    return ApiClient.post<FamilyResponse>('/families', request);
  }

  /**
   * 更新家庭信息
   */
  static async updateFamily(request: UpdateFamilyRequest): Promise<ApiResponse<FamilyResponse>> {
    return ApiClient.put<FamilyResponse>('/families', request);
  }

  /**
   * 根据ID查询家庭详情
   */
  static async getFamilyDetail(id: number): Promise<ApiResponse<FamilyResponse>> {
    return ApiClient.get<FamilyResponse>(`/families/${id}`);
  }

  /**
   * 分页查询家庭列表
   */
  static async getFamilyPage(params: {
    pageNum?: number;
    pageSize?: number;
    creatorId?: number;
    status?: number;
    keyword?: string;
  } = {}): Promise<ApiResponse<PageResult<FamilyResponse>>> {
    const {
      pageNum = 1,
      pageSize = 10,
      creatorId,
      status,
      keyword,
    } = params;

    return ApiClient.get<PageResult<FamilyResponse>>('/families', {
      pageNum,
      pageSize,
      creatorId,
      status,
      keyword,
    });
  }

  /**
   * 查询用户参与的家庭列表
   */
  static async getUserFamilies(): Promise<ApiResponse<FamilyResponse[]>> {
    return ApiClient.get<FamilyResponse[]>('/families/my');
  }

  /**
   * 加入家庭
   */
  static async joinFamily(request: JoinFamilyRequest): Promise<ApiResponse<boolean>> {
    return ApiClient.post<boolean>('/families/join', request);
  }

  /**
   * 退出家庭
   */
  static async leaveFamily(familyId: number): Promise<ApiResponse<boolean>> {
    return ApiClient.post<boolean>(`/families/${familyId}/leave`);
  }

  /**
   * 删除家庭
   */
  static async deleteFamily(familyId: number): Promise<ApiResponse<boolean>> {
    return ApiClient.delete<boolean>(`/families/${familyId}`);
  }

  /**
   * 根据邀请码查询家庭信息
   */
  static async getFamilyByInviteCode(inviteCode: string): Promise<ApiResponse<FamilyResponse>> {
    return ApiClient.get<FamilyResponse>(`/families/invite/${inviteCode}`);
  }
}

export const familyService = FamilyService;