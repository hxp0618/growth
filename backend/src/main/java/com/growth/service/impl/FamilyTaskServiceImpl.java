package com.growth.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.growth.common.controller.BaseController.PageRequest;
import com.growth.common.exception.BusinessException;
import com.growth.dao.FamilyTaskMapper;
import com.growth.entity.FamilyTask;
import com.growth.entity.request.CreateFamilyTaskRequest;
import com.growth.entity.request.ReassignFamilyTaskRequest;
import com.growth.entity.request.UpdateFamilyTaskRequest;
import com.growth.entity.response.FamilyTaskResponse;
import com.growth.entity.FamilyNotification;
import com.growth.service.FamilyNotificationService;
import com.growth.service.FamilyRelationService;
import com.growth.service.FamilyTaskService;
import com.growth.service.NotificationPushRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 家庭任务服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FamilyTaskServiceImpl implements FamilyTaskService {

    private final FamilyTaskMapper familyTaskMapper;
    private final FamilyRelationService familyRelationService;
    private final FamilyNotificationService familyNotificationService;
    private final NotificationPushRecordService pushRecordService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyTaskResponse createTask(CreateFamilyTaskRequest request, Long creatorId) {
        // 验证用户是否为家庭成员
        if (!familyRelationService.existsByFamilyIdAndUserId(request.getFamilyId(), creatorId)) {
            throw new BusinessException("您不是该家庭的成员");
        }

        // 验证指定人是否为家庭成员
        if (request.getAssignedUserIds() != null && !request.getAssignedUserIds().isEmpty()) {
            for (Long userId : request.getAssignedUserIds()) {
                if (!familyRelationService.existsByFamilyIdAndUserId(request.getFamilyId(), userId)) {
                    throw new BusinessException("指定人不是该家庭的成员");
                }
            }
        }

        // 创建任务
        FamilyTask task = new FamilyTask();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(1); // 待开始
        task.setAssignedUserIds(request.getAssignedUserIds());
        task.setCreatorId(creatorId);
        task.setFamilyId(request.getFamilyId());
        task.setPriority(request.getPriority() != null ? request.getPriority() : 2);
        task.setExpectedCompletionTime(request.getExpectedCompletionTime());
        task.setRemark(request.getRemark());
        task.setCreateBy(creatorId);
        task.setUpdateBy(creatorId);
        task.setIsDeleted(false);
        task.setVersion(0);

        familyTaskMapper.insert(task);

        // 发送通知给指定人
        if (task.getAssignedUserIds() != null && !task.getAssignedUserIds().isEmpty()) {
            sendTaskAssignmentNotification(task);
        }

        return getTaskDetail(task.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyTaskResponse updateTask(UpdateFamilyTaskRequest request, Long userId) {
        FamilyTask task = familyTaskMapper.selectById(request.getId());
        if (task == null) {
            throw new BusinessException("任务不存在");
        }

        // 验证权限：只有创建者、指定人或家庭管理员可以更新任务
        if (!canModifyTask(task, userId)) {
            throw new BusinessException("您没有权限修改此任务");
        }

        // 更新任务信息
        boolean needNotification = false;
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
            if (request.getStatus() == 3) { // 已完成
                task.setActualCompletionTime(LocalDateTime.now());
            }
        }
        if (request.getAssignedUserIds() != null) {
            // 验证新的指定人是否为家庭成员
            for (Long assignedUserId : request.getAssignedUserIds()) {
                if (!familyRelationService.existsByFamilyIdAndUserId(task.getFamilyId(), assignedUserId)) {
                    throw new BusinessException("指定人不是该家庭的成员");
                }
            }
            
            // 检查指定人是否发生变化
            if (!isSameUserList(task.getAssignedUserIds(), request.getAssignedUserIds())) {
                task.setAssignedUserIds(request.getAssignedUserIds());
                needNotification = true;
            }
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getExpectedCompletionTime() != null) {
            task.setExpectedCompletionTime(request.getExpectedCompletionTime());
        }
        if (request.getActualCompletionTime() != null) {
            task.setActualCompletionTime(request.getActualCompletionTime());
        }
        if (request.getRemark() != null) {
            task.setRemark(request.getRemark());
        }

        // 设置更新人信息
        task.setUpdateBy(userId);
        task.setVersion(task.getVersion() != null ? task.getVersion() + 1 : 1);

        familyTaskMapper.updateById(task);

        // 如果指定人发生变化，发送通知
        if (needNotification && task.getAssignedUserIds() != null && !task.getAssignedUserIds().isEmpty()) {
            sendTaskAssignmentNotification(task);
        }

        return getTaskDetail(task.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyTaskResponse reassignTask(ReassignFamilyTaskRequest request, Long userId) {
        FamilyTask task = familyTaskMapper.selectById(request.getTaskId());
        if (task == null) {
            throw new BusinessException("任务不存在");
        }

        // 验证权限：只有当前指定人可以转派任务
        if (task.getAssignedUserIds() == null || !task.getAssignedUserIds().contains(userId)) {
            throw new BusinessException("只有当前指定人可以转派任务");
        }

        // 验证新的指定人是否为家庭成员
        if (!familyRelationService.existsByFamilyIdAndUserId(task.getFamilyId(), request.getNewAssignedUserId())) {
            throw new BusinessException("指定人不是该家庭的成员");
        }

        // 更新指定人
        task.setAssignedUserIds(List.of(request.getNewAssignedUserId()));
        task.setUpdateBy(userId);
        task.setVersion(task.getVersion() != null ? task.getVersion() + 1 : 1);
        familyTaskMapper.updateById(task);

        // 发送转派通知
        sendTaskReassignmentNotification(task, request.getReason());

        return getTaskDetail(task.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteTask(Long taskId, Long userId) {
        FamilyTask task = familyTaskMapper.selectById(taskId);
        if (task == null) {
            throw new BusinessException("任务不存在");
        }

        // 验证权限：只有创建者或家庭管理员可以删除任务
        if (!canDeleteTask(task, userId)) {
            throw new BusinessException("您没有权限删除此任务");
        }

        // 逻辑删除
        task.setIsDeleted(true);
        task.setUpdateBy(userId);
        task.setVersion(task.getVersion() != null ? task.getVersion() + 1 : 1);
        return familyTaskMapper.updateById(task) > 0;
    }

    @Override
    public FamilyTaskResponse getTaskDetail(Long taskId) {
        return familyTaskMapper.selectTaskDetail(taskId);
    }

    @Override
    public IPage<FamilyTaskResponse> getTaskPage(PageRequest pageRequest, Long familyId, Integer status, Long assignedUserId, Long creatorId) {
        Page<FamilyTaskResponse> page = new Page<>(pageRequest.getCurrent(), pageRequest.getSize());
        return familyTaskMapper.selectTaskPage(page, familyId, status, assignedUserId, creatorId);
    }

    @Override
    public List<FamilyTaskResponse> getTaskList(Long familyId, Integer status, Long assignedUserId, Long creatorId) {
        return familyTaskMapper.selectTaskList(familyId, status, assignedUserId, creatorId);
    }

    @Override
    public Integer countTasks(Long familyId, Integer status, Long assignedUserId) {
        return familyTaskMapper.countTasks(familyId, status, assignedUserId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyTaskResponse completeTask(Long taskId, Long userId) {
        FamilyTask task = familyTaskMapper.selectById(taskId);
        if (task == null) {
            throw new BusinessException("任务不存在");
        }

        // 验证权限：只有指定人可以完成任务
        if (task.getAssignedUserIds() == null || !task.getAssignedUserIds().contains(userId)) {
            throw new BusinessException("只有指定人可以完成任务");
        }

        task.setStatus(3); // 已完成
        task.setActualCompletionTime(LocalDateTime.now());
        task.setUpdateBy(userId);
        task.setVersion(task.getVersion() != null ? task.getVersion() + 1 : 1);
        familyTaskMapper.updateById(task);

        return getTaskDetail(taskId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyTaskResponse startTask(Long taskId, Long userId) {
        FamilyTask task = familyTaskMapper.selectById(taskId);
        if (task == null) {
            throw new BusinessException("任务不存在");
        }

        // 验证权限：只有指定人可以开始任务
        if (task.getAssignedUserIds() == null || !task.getAssignedUserIds().contains(userId)) {
            throw new BusinessException("只有指定人可以开始任务");
        }

        task.setStatus(2); // 进行中
        task.setUpdateBy(userId);
        task.setVersion(task.getVersion() != null ? task.getVersion() + 1 : 1);
        familyTaskMapper.updateById(task);

        return getTaskDetail(taskId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyTaskResponse cancelTask(Long taskId, Long userId) {
        FamilyTask task = familyTaskMapper.selectById(taskId);
        if (task == null) {
            throw new BusinessException("任务不存在");
        }

        // 验证权限：只有创建者或指定人可以取消任务
        if (!canModifyTask(task, userId)) {
            throw new BusinessException("您没有权限取消此任务");
        }

        task.setStatus(4); // 已取消
        task.setUpdateBy(userId);
        task.setVersion(task.getVersion() != null ? task.getVersion() + 1 : 1);
        familyTaskMapper.updateById(task);

        return getTaskDetail(taskId);
    }

    /**
     * 检查用户是否可以修改任务
     */
    private boolean canModifyTask(FamilyTask task, Long userId) {
        // 创建者可以修改
        if (task.getCreatorId().equals(userId)) {
            return true;
        }
        // 指定人可以修改
        if (task.getAssignedUserIds() != null && task.getAssignedUserIds().contains(userId)) {
            return true;
        }
        // 家庭成员可以修改（简化处理，允许家庭成员之间相互修改任务）
        if (familyRelationService.existsByFamilyIdAndUserId(task.getFamilyId(), userId)) {
            return true;
        }
        return false;
    }

    /**
     * 检查用户是否可以删除任务
     */
    private boolean canDeleteTask(FamilyTask task, Long userId) {
        // 创建者可以删除
        if (task.getCreatorId().equals(userId)) {
            return true;
        }
        // 家庭管理员可以删除（这里简化处理，实际可能需要更复杂的权限判断）
        return false;
    }

    /**
     * 比较两个用户ID列表是否相同
     */
    private boolean isSameUserList(List<Long> list1, List<Long> list2) {
        if (list1 == null && list2 == null) {
            return true;
        }
        if (list1 == null || list2 == null) {
            return false;
        }
        if (list1.size() != list2.size()) {
            return false;
        }
        return list1.containsAll(list2) && list2.containsAll(list1);
    }

    /**
     * 发送任务指派通知
     */
    private void sendTaskAssignmentNotification(FamilyTask task) {
        try {
            if (task.getAssignedUserIds() == null || task.getAssignedUserIds().isEmpty()) {
                return;
            }

            // 创建临时通知模板
            FamilyNotification template = new FamilyNotification();
            template.setTitle("新任务指派");
            template.setContent(String.format("您有一个新任务：%s", task.getTitle()));
            if (task.getDescription() != null && !task.getDescription().isEmpty()) {
                template.setContent(template.getContent() + String.format("\n任务说明：%s", task.getDescription()));
            }
            template.setFamilyId(task.getFamilyId());
            template.setType(2); // 用户通知
            template.setCategory("task");
            template.setIsActive(true);
            template.setReceiverUserIds(task.getAssignedUserIds());
            
            // 创建推送记录并执行推送
            List<com.growth.entity.NotificationPushRecord> pushRecords = 
                pushRecordService.createPushRecords(template, task.getCreatorId(), task.getAssignedUserIds());
            pushRecordService.executePush(pushRecords);
            
            log.info("发送任务指派通知成功，任务ID：{}，指定人：{}", task.getId(), task.getAssignedUserIds());
        } catch (Exception e) {
            log.error("发送任务指派通知失败", e);
        }
    }

    /**
     * 发送任务转派通知
     */
    private void sendTaskReassignmentNotification(FamilyTask task, String reason) {
        try {
            if (task.getAssignedUserIds() == null || task.getAssignedUserIds().isEmpty()) {
                return;
            }

            // 创建临时通知模板
            FamilyNotification template = new FamilyNotification();
            template.setTitle("任务转派");
            template.setContent(String.format("任务「%s」已转派给您", task.getTitle()));
            if (reason != null && !reason.isEmpty()) {
                template.setContent(template.getContent() + String.format("\n转派原因：%s", reason));
            }
            template.setFamilyId(task.getFamilyId());
            template.setType(2); // 用户通知
            template.setCategory("task");
            template.setIsActive(true);
            template.setReceiverUserIds(task.getAssignedUserIds());
            
            // 创建推送记录并执行推送
            List<com.growth.entity.NotificationPushRecord> pushRecords = 
                pushRecordService.createPushRecords(template, task.getCreatorId(), task.getAssignedUserIds());
            pushRecordService.executePush(pushRecords);
            
            log.info("发送任务转派通知成功，任务ID：{}，新指定人：{}", task.getId(), task.getAssignedUserIds());
        } catch (Exception e) {
            log.error("发送任务转派通知失败", e);
        }
    }
}
