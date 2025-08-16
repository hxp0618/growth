import { ApiClient } from '../utils/apiClient';
import {
  ApiResponse,
  FamilyRoleResponse,
} from '../types/api';

export class FamilyRoleService {
  /**
   * 查询所有启用的角色列表
   */
  static async listEnabledRoles(): Promise<ApiResponse<FamilyRoleResponse[]>> {
    return ApiClient.get<FamilyRoleResponse[]>('/family-roles/enabled');
  }

  /**
   * 根据ID查询角色详情
   */
  static async getRoleDetail(id: number): Promise<ApiResponse<FamilyRoleResponse>> {
    return ApiClient.get<FamilyRoleResponse>(`/family-roles/${id}`);
  }

  /**
   * 根据角色编码查询角色
   */
  static async getRoleByCode(roleCode: string): Promise<ApiResponse<FamilyRoleResponse>> {
    return ApiClient.get<FamilyRoleResponse>(`/family-roles/code/${roleCode}`);
  }
}

export const familyRoleService = FamilyRoleService;