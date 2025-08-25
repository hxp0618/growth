package com.growth.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.growth.common.controller.BaseController.PageRequest;
import com.growth.entity.FamilyTask;
import com.growth.entity.request.CreateFamilyTaskRequest;
import com.growth.entity.request.ReassignFamilyTaskRequest;
import com.growth.entity.request.UpdateFamilyTaskRequest;
import com.growth.entity.response.FamilyTaskResponse;

import java.util.List;

/**
 * 家庭任务服务接口
 *
 * @author growth
 * @since 1.0
 */
public interface FamilyTaskService {

    /**
     * 创建家庭任务
     *
     * @param request 创建任务请求
     * @param creatorId 创建者用户ID
     * @return 创建的任务
     */
    FamilyTaskResponse createTask(CreateFamilyTaskRequest request, Long creatorId);

    /**
     * 更新家庭任务
     *
     * @param request 更新任务请求
     * @param userId 操作用户ID
     * @return 更新后的任务
     */
    FamilyTaskResponse updateTask(UpdateFamilyTaskRequest request, Long userId);

    /**
     * 转派家庭任务
     *
     * @param request 转派任务请求
     * @param userId 操作用户ID
     * @return 转派后的任务
     */
    FamilyTaskResponse reassignTask(ReassignFamilyTaskRequest request, Long userId);

    /**
     * 删除家庭任务
     *
     * @param taskId 任务ID
     * @param userId 操作用户ID
     * @return 是否删除成功
     */
    boolean deleteTask(Long taskId, Long userId);

    /**
     * 根据ID查询任务详情
     *
     * @param taskId 任务ID
     * @return 任务详情
     */
    FamilyTaskResponse getTaskDetail(Long taskId);

    /**
     * 分页查询家庭任务列表
     *
     * @param pageRequest 分页请求
     * @param familyId 家庭ID
     * @param status 任务状态
     * @param assignedUserId 指定人用户ID
     * @param creatorId 创建者用户ID
     * @return 任务列表
     */
    IPage<FamilyTaskResponse> getTaskPage(PageRequest pageRequest, Long familyId, Integer status, Long assignedUserId, Long creatorId);

    /**
     * 查询家庭任务列表
     *
     * @param familyId 家庭ID
     * @param status 任务状态
     * @param assignedUserId 指定人用户ID
     * @param creatorId 创建者用户ID
     * @return 任务列表
     */
    List<FamilyTaskResponse> getTaskList(Long familyId, Integer status, Long assignedUserId, Long creatorId);

    /**
     * 统计家庭任务数量
     *
     * @param familyId 家庭ID
     * @param status 任务状态
     * @param assignedUserId 指定人用户ID
     * @return 任务数量
     */
    Integer countTasks(Long familyId, Integer status, Long assignedUserId);

    /**
     * 完成任务
     *
     * @param taskId 任务ID
     * @param userId 操作用户ID
     * @return 更新后的任务
     */
    FamilyTaskResponse completeTask(Long taskId, Long userId);

    /**
     * 开始任务
     *
     * @param taskId 任务ID
     * @param userId 操作用户ID
     * @return 更新后的任务
     */
    FamilyTaskResponse startTask(Long taskId, Long userId);

    /**
     * 取消任务
     *
     * @param taskId 任务ID
     * @param userId 操作用户ID
     * @return 更新后的任务
     */
    FamilyTaskResponse cancelTask(Long taskId, Long userId);
}
