package com.growth.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.growth.common.controller.BaseController;
import com.growth.entity.request.CreateFamilyRequest;
import com.growth.entity.request.JoinFamilyRequest;
import com.growth.entity.request.UpdateFamilyRequest;
import com.growth.entity.response.FamilyPregnancyProgressResponse;
import com.growth.entity.response.FamilyResponse;
import com.growth.service.FamilyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 家庭控制器
 *
 * @author growth
 * @since 1.0
 */
@Tag(name = "家庭管理", description = "家庭相关接口")
@RestController
@RequestMapping("/api/families")
@RequiredArgsConstructor
@SaCheckLogin
public class FamilyController extends BaseController {

    private final FamilyService familyService;

    @Operation(summary = "创建家庭", description = "创建一个新的家庭，创建者自动成为家庭成员")
    @PostMapping
    public FamilyResponse createFamily(@Valid @RequestBody CreateFamilyRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyService.createFamily(request, userId);
    }

    @Operation(summary = "更新家庭信息", description = "更新家庭的基本信息，需要有相应权限")
    @PutMapping
    public FamilyResponse updateFamily(@Valid @RequestBody UpdateFamilyRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyService.updateFamily(request, userId);
    }

    @Operation(summary = "根据ID查询家庭详情", description = "查询家庭的详细信息，包括成员列表")
    @GetMapping("/{id}")
    public FamilyResponse getFamilyDetail(
            @Parameter(description = "家庭ID", required = true)
            @PathVariable Long id) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyService.getFamilyDetail(id, userId);
    }

    @Operation(summary = "分页查询家庭列表", description = "分页查询家庭列表，支持按创建者、状态、关键词筛选")
    @GetMapping
    public PageResult<FamilyResponse> getFamilyPage(
            @Parameter(description = "页码", example = "1")
            @RequestParam(defaultValue = "1") Long pageNum,
            @Parameter(description = "每页大小", example = "10")
            @RequestParam(defaultValue = "10") Long pageSize,
            @Parameter(description = "创建者ID")
            @RequestParam(required = false) Long creatorId,
            @Parameter(description = "状态（0：禁用，1：正常）")
            @RequestParam(required = false) Integer status,
            @Parameter(description = "关键词（家庭名称）")
            @RequestParam(required = false) String keyword) {
        
        PageRequest pageRequest = new PageRequest(pageNum, pageSize);
        IPage<FamilyResponse> page = familyService.getFamilyPage(pageRequest, creatorId, status, keyword);
        
        PageResult<FamilyResponse> pageResult = new PageResult<>();
        pageResult.setCurrent(page.getCurrent())
                  .setSize(page.getSize())
                  .setTotal(page.getTotal())
                  .setPages(page.getPages())
                  .setRecords(page.getRecords());
        
        return pageResult;
    }

    @Operation(summary = "查询用户参与的家庭列表", description = "查询当前用户参与的所有家庭")
    @GetMapping("/my")
    public List<FamilyResponse> getUserFamilies() {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyService.getUserFamilies(userId);
    }

    @Operation(summary = "加入家庭", description = "通过邀请码加入家庭")
    @PostMapping("/join")
    public boolean joinFamily(@Valid @RequestBody JoinFamilyRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyService.joinFamily(request, userId);
    }

    @Operation(summary = "退出家庭", description = "用户主动退出家庭（创建者不能退出）")
    @PostMapping("/{familyId}/leave")
    public boolean leaveFamily(
            @Parameter(description = "家庭ID", required = true)
            @PathVariable Long familyId) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyService.leaveFamilyByUser(familyId, userId);
    }

    @Operation(summary = "删除家庭", description = "删除家庭（仅创建者可操作）")
    @DeleteMapping("/{familyId}")
    public boolean deleteFamily(
            @Parameter(description = "家庭ID", required = true)
            @PathVariable Long familyId) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyService.deleteFamily(familyId, userId);
    }

    @Operation(summary = "根据邀请码查询家庭信息", description = "根据邀请码查询家庭的基本信息")
    @GetMapping("/invite/{inviteCode}")
    public FamilyResponse getFamilyByInviteCode(
            @Parameter(description = "邀请码", required = true)
            @PathVariable String inviteCode) {
        var family = familyService.getByInviteCode(inviteCode);
        if (family == null) {
            return null;
        }
        Long userId = StpUtil.getLoginIdAsLong();
        return familyService.getFamilyDetail(family.getId(), userId);
    }

    @Operation(summary = "获取家庭孕妇进度", description = "根据当前用户获取其所在家庭的孕妇进度信息")
    @GetMapping("/pregnancy-progress")
    public List<FamilyPregnancyProgressResponse> getFamilyPregnancyProgress() {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyService.getFamilyPregnancyProgress(userId);
    }

}
