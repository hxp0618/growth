package com.growth.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.growth.common.controller.BaseController;
import com.growth.common.result.Result;
import com.growth.entity.FamilyNotification;
import com.growth.entity.request.CreateFamilyNotificationRequest;
import com.growth.entity.request.SendNotificationTemplateRequest;
import com.growth.service.FamilyNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 家庭通知模版控制器
 *
 * @author growth
 * @since 1.0
 */
@Tag(name = "家庭通知模版", description = "家庭通知模版相关接口")
@RestController
@RequestMapping("/api/family-notifications")
@RequiredArgsConstructor
@SaCheckLogin
public class FamilyNotificationController extends BaseController {

    private final FamilyNotificationService familyNotificationService;

    @Operation(summary = "创建通知模版", description = "创建一个新的家庭通知模版")
    @PostMapping
    public Result<FamilyNotification> createNotificationTemplate(@Valid @RequestBody CreateFamilyNotificationRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        FamilyNotification notification = familyNotificationService.createNotificationTemplate(request, userId);
        return Result.success(notification);
    }

    @Operation(summary = "更新通知模版", description = "更新指定的通知模版")
    @PutMapping("/{id}")
    public Result<FamilyNotification> updateNotificationTemplate(
            @Parameter(description = "模版ID") @PathVariable Long id,
            @Valid @RequestBody CreateFamilyNotificationRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        FamilyNotification notification = familyNotificationService.updateNotificationTemplate(id, request, userId);
        return Result.success(notification);
    }

    @Operation(summary = "删除通知模版", description = "删除指定的通知模版")
    @DeleteMapping("/{id}")
    public Result<Boolean> deleteNotificationTemplate(@Parameter(description = "模版ID") @PathVariable Long id) {
        Long userId = StpUtil.getLoginIdAsLong();
        boolean success = familyNotificationService.deleteNotificationTemplate(id, userId);
        return Result.success(success);
    }

    @Operation(summary = "获取通知模版详情", description = "根据ID获取通知模版详情")
    @GetMapping("/{id}")
    public Result<FamilyNotification> getNotificationTemplateDetail(@Parameter(description = "模版ID") @PathVariable Long id) {
        Long userId = StpUtil.getLoginIdAsLong();
        FamilyNotification notification = familyNotificationService.getNotificationTemplateDetail(id, userId);
        return Result.success(notification);
    }

    @Operation(summary = "分页查询通知模版", description = "分页查询家庭通知模版列表")
    @GetMapping("/page")
    public Result<IPage<FamilyNotification>> getNotificationTemplatePage(
            PageRequest pageRequest,
            @Parameter(description = "家庭ID") @RequestParam(required = false) Long familyId,
            @Parameter(description = "创建者ID") @RequestParam(required = false) Long creatorId,
            @Parameter(description = "通知类型") @RequestParam(required = false) Integer type,
            @Parameter(description = "模板分类") @RequestParam(required = false) String category,
            @Parameter(description = "是否启用") @RequestParam(required = false) Boolean isActive,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword) {
        Long userId = StpUtil.getLoginIdAsLong();
        IPage<FamilyNotification> page = familyNotificationService.getNotificationTemplatePage(
                pageRequest, familyId, creatorId, type, category, isActive, keyword, userId);
        return Result.success(page);
    }

    @Operation(summary = "获取家庭通知模版列表", description = "获取指定家庭的所有启用的通知模版")
    @GetMapping("/family/{familyId}")
    public Result<List<FamilyNotification>> getFamilyNotificationTemplates(
            @Parameter(description = "家庭ID") @PathVariable Long familyId) {
        Long userId = StpUtil.getLoginIdAsLong();
        List<FamilyNotification> notifications = familyNotificationService.getFamilyNotificationTemplates(familyId, userId);
        return Result.success(notifications);
    }

    @Operation(summary = "发送通知模版", description = "使用通知模版发送通知给家庭成员")
    @PostMapping("/send")
    public Result<Boolean> sendNotificationTemplate(@Valid @RequestBody SendNotificationTemplateRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        boolean success = familyNotificationService.sendNotificationTemplate(request, userId);
        return Result.success(success);
    }

    @Operation(summary = "切换模版状态", description = "激活或停用通知模版")
    @PutMapping("/{id}/toggle")
    public Result<Boolean> toggleNotificationTemplate(
            @Parameter(description = "模版ID") @PathVariable Long id,
            @Parameter(description = "是否激活") @RequestParam boolean isActive) {
        Long userId = StpUtil.getLoginIdAsLong();
        boolean success = familyNotificationService.toggleNotificationTemplate(id, isActive, userId);
        return Result.success(success);
    }
}