package com.growth.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.stp.StpUtil;
import com.growth.common.controller.BaseController;
import com.growth.common.result.Result;
import com.growth.entity.response.PregnancyProgressResponse;
import com.growth.service.PregnancyProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 孕期进度控制器
 *
 * @author system
 * @since 2024-01-01
 */
@Slf4j
@RestController
@RequestMapping("/api/pregnancy-progress")
@RequiredArgsConstructor
@SaCheckLogin
@Tag(name = "孕期进度管理", description = "孕期进度相关接口")
public class PregnancyProgressController extends BaseController {

    private final PregnancyProgressService pregnancyProgressService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "获取用户孕期进度", description = "根据用户ID和当前日期获取孕期进度信息")
    public Result<PregnancyProgressResponse> getPregnancyProgressByUserId(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        log.info("获取用户孕期进度，用户ID: {}", userId);
        PregnancyProgressResponse response = pregnancyProgressService.getPregnancyProgressByUserId(userId);
        return Result.success(response);
    }

    @GetMapping("/family")
    @Operation(summary = "获取家庭孕期进度", description = "根据当前登录用户获取孕期进度信息。如果当前用户是孕妇，返回自己的进度；如果不是孕妇，返回其所属家庭中孕妇的进度")
    public Result<PregnancyProgressResponse> getFamilyPregnancyProgress() {
        Long userId = StpUtil.getLoginIdAsLong();
        log.info("获取用户{}的家庭孕期进度", userId);
        
        PregnancyProgressResponse response = pregnancyProgressService.getRelatedPregnancyProgress(userId);
        if (response == null) {
            log.info("用户{}未找到相关的孕期进度信息", userId);
            return Result.success(null);
        }
        
        return Result.success(response);
    }
}