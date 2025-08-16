package com.growth.controller;

import com.growth.common.result.Result;
import com.growth.entity.UserProfile;
import com.growth.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 测试控制器 - 用于验证ID生成策略
 * 测试完成后可以删除此文件
 *
 * @author growth
 * @since 1.0
 */
@Tag(name = "测试接口", description = "用于测试ID生成策略")
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final UserProfileService userProfileService;

    /**
     * 测试创建用户档案 - 验证ID生成
     */
    @Operation(summary = "测试ID生成", description = "创建测试用户档案以验证ID生成策略")
    @PostMapping("/create-profile")
    public Result<UserProfile> testCreateProfile(@RequestParam Long userId) {
        UserProfile profile = new UserProfile();
        profile.setUserId(userId);
        profile.setStatus(1);
        
        // 不设置ID，让MyBatis-Plus自动生成
        boolean saved = userProfileService.save(profile);
        
        if (saved) {
            return Result.success(profile);
        } else {
            return Result.failure("创建失败");
        }
    }

    /**
     * 获取MyBatis-Plus配置信息
     */
    @Operation(summary = "获取配置信息", description = "查看当前MyBatis-Plus配置")
    @GetMapping("/config-info")
    public Result<String> getConfigInfo() {
        return Result.success("请查看应用日志中的MyBatis-Plus配置信息，然后重启应用程序测试ID生成");
    }
}