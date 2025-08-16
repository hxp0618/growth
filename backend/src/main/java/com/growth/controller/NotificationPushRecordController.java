package com.growth.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.growth.common.controller.BaseController;
import com.growth.common.exception.BusinessException;
import com.growth.common.result.Result;
import com.growth.entity.NotificationPushRecord;
import com.growth.entity.request.BatchMarkReadRequest;
import com.growth.service.NotificationPushRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 通知推送记录控制器
 *
 * @author growth
 * @since 1.0
 */
@Tag(name = "通知推送记录", description = "通知推送记录相关接口")
@RestController
@RequestMapping("/api/notification-records")
@RequiredArgsConstructor
@SaCheckLogin
public class NotificationPushRecordController extends BaseController {

    private final NotificationPushRecordService pushRecordService;

    @Operation(summary = "分页查询推送记录", description = "分页查询通知推送记录列表")
    @GetMapping("/page")
    public Result<IPage<NotificationPushRecord>> getPushRecordPage(
            PageRequest pageRequest,
            @Parameter(description = "模版ID") @RequestParam(required = false) Long templateId,
            @Parameter(description = "发送者ID") @RequestParam(required = false) Long senderId,
            @Parameter(description = "接收者ID") @RequestParam(required = false) Long receiverId,
            @Parameter(description = "家庭ID") @RequestParam(required = false) Long familyId,
            @Parameter(description = "推送状态") @RequestParam(required = false) Integer pushStatus,
            @Parameter(description = "是否已读") @RequestParam(required = false) Boolean isRead,
            @Parameter(description = "开始时间") @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        Long userId = StpUtil.getLoginIdAsLong();
        IPage<NotificationPushRecord> page = pushRecordService.getPushRecordPage(
                pageRequest, templateId, senderId, receiverId, familyId,
                pushStatus, isRead, startTime, endTime, userId);
        return Result.success(page);
    }

    @Operation(summary = "获取用户通知列表", description = "获取当前用户的通知列表")
    @GetMapping("/my-notifications")
    public Result<List<NotificationPushRecord>> getMyNotifications(
            @Parameter(description = "家庭ID") @RequestParam(required = false) Long familyId,
            @Parameter(description = "是否已读") @RequestParam(required = false) Boolean isRead,
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "20") Integer limit) {
        Long userId = StpUtil.getLoginIdAsLong();
        List<NotificationPushRecord> notifications = pushRecordService.getUserNotifications(userId, familyId, isRead, limit);
        return Result.success(notifications);
    }

    @Operation(summary = "获取未读消息数量", description = "获取当前用户的未读消息数量")
    @GetMapping("/unread-count")
    public Result<Integer> getUnreadCount(
            @Parameter(description = "家庭ID") @RequestParam(required = false) Long familyId) {
        Long userId = StpUtil.getLoginIdAsLong();
        int count = pushRecordService.getUnreadCount(userId, familyId);
        return Result.success(count);
    }

    @Operation(summary = "标记消息为已读", description = "将指定消息标记为已读")
    @PutMapping("/{id}/read")
    public Result<Boolean> markAsRead(@Parameter(description = "推送记录ID") @PathVariable Long id) {
        Long userId = StpUtil.getLoginIdAsLong();
        boolean success = pushRecordService.markAsRead(id, userId);
        return Result.success(success);
    }

    @Operation(summary = "批量标记消息为已读", description = "批量将消息标记为已读")
    @PutMapping("/batch-read")
    public Result<Integer> batchMarkAsRead(@Valid @RequestBody BatchMarkReadRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        int successCount = pushRecordService.batchMarkAsRead(request.getNotificationIds(), userId);
        return Result.success(successCount);
    }

    @Operation(summary = "获取推送记录详情", description = "根据ID获取推送记录详情")
    @GetMapping("/{id}")
    public Result<NotificationPushRecord> getPushRecordDetail(@Parameter(description = "推送记录ID") @PathVariable Long id) {
        Long userId = StpUtil.getLoginIdAsLong();
        NotificationPushRecord record = pushRecordService.getById(id);

        // 检查权限
        if (record == null || !pushRecordService.checkRecordPermission(id, userId)) {
            throw new BusinessException("推送记录不存在或无权限访问");
        }

        return Result.success(record);
    }

    @Operation(summary = "获取模版推送统计", description = "获取指定模版的推送统计信息")
    @GetMapping("/template/{templateId}/stats")
    public Result<Object> getTemplateStats(@Parameter(description = "模版ID") @PathVariable Long templateId) {
        Long userId = StpUtil.getLoginIdAsLong();
        Object stats = pushRecordService.getTemplateStats(templateId, userId);
        return Result.success(stats);
    }

    @Operation(summary = "重试失败推送", description = "重试失败的推送记录（管理员功能）")
    @PostMapping("/retry-failed")
    public Result<Boolean> retryFailedPushes(
            @Parameter(description = "最大重试次数") @RequestParam(defaultValue = "3") Integer maxRetryCount) {
        Long userId = StpUtil.getLoginIdAsLong();
        // 这里可以添加管理员权限检查
        boolean success = pushRecordService.retryFailedPushes(maxRetryCount);
        return Result.success(success);
    }
}
