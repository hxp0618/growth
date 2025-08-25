import { ApiClient } from '../utils/apiClient';
import { 
  CreateFamilyTaskRequest, 
  UpdateFamilyTaskRequest, 
  FamilyTaskResponse,
  ReassignFamilyTaskRequest,
  PageRequest,
  PageResult
} from '../types/api';

class FamilyTaskService {
  /**
   * 创建家庭任务
   */
  async createTask(request: CreateFamilyTaskRequest): Promise<FamilyTaskResponse> {
    const response = await ApiClient.post<FamilyTaskResponse>('/family-tasks', request);
    return response.data!;
  }

  /**
   * 更新家庭任务
   */
  async updateTask(request: UpdateFamilyTaskRequest): Promise<FamilyTaskResponse> {
    const response = await ApiClient.put<FamilyTaskResponse>('/family-tasks', request);
    return response.data!;
  }

  /**
   * 删除家庭任务
   */
  async deleteTask(taskId: number): Promise<boolean> {
    const response = await ApiClient.delete<boolean>(`/family-tasks/${taskId}`);
    return response.data!;
  }

  /**
   * 获取任务详情
   */
  async getTaskDetail(taskId: number): Promise<FamilyTaskResponse> {
    const response = await ApiClient.get<FamilyTaskResponse>(`/family-tasks/${taskId}`);
    return response.data!;
  }

  /**
   * 分页查询家庭任务
   */
  async getTaskPage(
    pageRequest: PageRequest,
    familyId: number,
    status?: number,
    assignedUserId?: number,
    creatorId?: number
  ): Promise<PageResult<FamilyTaskResponse>> {
    const params = new URLSearchParams({
      pageNum: pageRequest.pageNum.toString(),
      pageSize: pageRequest.pageSize.toString(),
      familyId: familyId.toString(),
    });
    
    if (status !== undefined) {
      params.append('status', status.toString());
    }
    if (assignedUserId !== undefined) {
      params.append('assignedUserId', assignedUserId.toString());
    }
    if (creatorId !== undefined) {
      params.append('creatorId', creatorId.toString());
    }

    const response = await ApiClient.get<PageResult<FamilyTaskResponse>>(`/family-tasks?${params}`);
    return response.data!;
  }

  /**
   * 查询家庭任务列表
   */
  async getTaskList(params: {
    familyId: number;
    status?: number;
    assignedUserId?: number;
    creatorId?: number;
  }): Promise<FamilyTaskResponse[]> {
    const urlParams = new URLSearchParams({
      familyId: params.familyId.toString(),
    });
    
    if (params.status !== undefined) {
      urlParams.append('status', params.status.toString());
    }
    if (params.assignedUserId !== undefined) {
      urlParams.append('assignedUserId', params.assignedUserId.toString());
    }
    if (params.creatorId !== undefined) {
      urlParams.append('creatorId', params.creatorId.toString());
    }

    const response = await ApiClient.get<FamilyTaskResponse[]>(`/family-tasks/list?${urlParams}`);
    return response.data!;
  }

  /**
   * 统计家庭任务数量
   */
  async countTasks(
    familyId: number,
    status?: number,
    assignedUserId?: number
  ): Promise<number> {
    const params = new URLSearchParams({
      familyId: familyId.toString(),
    });
    
    if (status !== undefined) {
      params.append('status', status.toString());
    }
    if (assignedUserId !== undefined) {
      params.append('assignedUserId', assignedUserId.toString());
    }

    const response = await ApiClient.get<number>(`/family-tasks/count?${params}`);
    return response.data!;
  }

  /**
   * 完成任务
   */
  async completeTask(taskId: number): Promise<FamilyTaskResponse> {
    const response = await ApiClient.post<FamilyTaskResponse>(`/family-tasks/${taskId}/complete`);
    return response.data!;
  }

  /**
   * 开始任务
   */
  async startTask(taskId: number): Promise<FamilyTaskResponse> {
    const response = await ApiClient.post<FamilyTaskResponse>(`/family-tasks/${taskId}/start`);
    return response.data!;
  }

  /**
   * 取消任务
   */
  async cancelTask(taskId: number): Promise<FamilyTaskResponse> {
    const response = await ApiClient.post<FamilyTaskResponse>(`/family-tasks/${taskId}/cancel`);
    return response.data!;
  }

  /**
   * 转派任务（单用户转派）
   */
  async reassignTask(request: ReassignFamilyTaskRequest): Promise<FamilyTaskResponse> {
    const response = await ApiClient.post<FamilyTaskResponse>('/family-tasks/reassign', request);
    return response.data!;
  }

  /**
   * 获取任务状态文本
   */
  getStatusText(status: number): string {
    switch (status) {
      case 1: return '待开始';
      case 2: return '进行中';
      case 3: return '已完成';
      case 4: return '已取消';
      default: return '未知';
    }
  }

  /**
   * 获取优先级文本
   */
  getPriorityText(priority: number): string {
    switch (priority) {
      case 1: return '低';
      case 2: return '中';
      case 3: return '高';
      case 4: return '紧急';
      default: return '中';
    }
  }

  /**
   * 获取任务状态颜色
   */
  getStatusColor(status: number): string {
    switch (status) {
      case 1: return '#6B7280'; // gray
      case 2: return '#F59E0B'; // orange
      case 3: return '#10B981'; // green
      case 4: return '#EF4444'; // red
      default: return '#6B7280';
    }
  }

  /**
   * 获取优先级颜色
   */
  getPriorityColor(priority: number): string {
    switch (priority) {
      case 1: return '#6B7280'; // gray
      case 2: return '#3B82F6'; // blue
      case 3: return '#F59E0B'; // orange
      case 4: return '#EF4444'; // red
      default: return '#3B82F6';
    }
  }
}

export const familyTaskService = new FamilyTaskService();
