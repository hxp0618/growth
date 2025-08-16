package com.growth.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.stp.StpUtil;
import com.growth.common.controller.BaseController;
import com.growth.entity.UserDeviceToken;
import com.growth.entity.request.RegisterDeviceTokenRequest;
import com.growth.service.UserDeviceTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 设备Token控制器
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/device-tokens")
@RequiredArgsConstructor
@Tag(name = "设备Token管理", description = "设备Token注册和管理相关接口")
public class DeviceTokenController extends BaseController {

    private final UserDeviceTokenService tokenService;

    /**
     * 注册或更新设备Token
     */
    @PostMapping("/register")
    @SaCheckLogin
    @Operation(summary = "注册或更新设备Token", description = "用户注册或更新推送设备Token")
    public boolean registerDeviceToken(@RequestBody @Validated RegisterDeviceTokenRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        
        return tokenService.registerOrUpdateToken(
            userId,
            request.getDeviceToken(),
            request.getPlatform(),
            request.getDeviceInfo(),
            request.getAppVersion()
        );
    }

    /**
     * 获取用户的设备Token列表
     */
    @GetMapping("/list")
    @SaCheckLogin
    @Operation(summary = "获取设备Token列表", description = "获取当前用户的所有设备Token")
    public List<UserDeviceToken> getDeviceTokens() {
        Long userId = StpUtil.getLoginIdAsLong();
        return tokenService.getActiveTokensByUserId(userId);
    }

    /**
     * 删除设备Token
     */
    @DeleteMapping("/{tokenId}")
    @SaCheckLogin
    @Operation(summary = "删除设备Token", description = "删除指定的设备Token")
    public boolean deleteDeviceToken(@PathVariable Long tokenId) {
        Long userId = StpUtil.getLoginIdAsLong();
        
        // 验证Token是否属于当前用户
        UserDeviceToken token = tokenService.getById(tokenId);
        if (token == null || !token.getUserId().equals(userId)) {
            return false;
        }
        
        return tokenService.disableToken(token.getDeviceToken(), "用户主动删除");
    }

    /**
     * 更新Token活跃时间
     */
    @PostMapping("/heartbeat")
    @SaCheckLogin
    @Operation(summary = "更新Token活跃时间", description = "更新设备Token的最后活跃时间")
    public boolean updateHeartbeat(@RequestParam String deviceToken) {
        return tokenService.updateLastActiveTime(deviceToken, LocalDateTime.now());
    }

    /**
     * 获取Token状态
     */
    @GetMapping("/status")
    @SaCheckLogin
    @Operation(summary = "获取Token状态", description = "获取设备Token的状态信息")
    public Map<String, Object> getTokenStatus(@RequestParam String deviceToken) {
        Long userId = StpUtil.getLoginIdAsLong();
        
        Map<String, Object> status = new HashMap<>();
        
        // 检查Token是否有效
        boolean isValid = tokenService.isTokenValid(deviceToken);
        status.put("isValid", isValid);
        
        if (isValid) {
            // 获取Token详细信息
            UserDeviceToken token = tokenService.getOne(
                tokenService.lambdaQuery()
                    .eq(UserDeviceToken::getDeviceToken, deviceToken)
                    .eq(UserDeviceToken::getUserId, userId)
                    .eq(UserDeviceToken::getIsDeleted, false)
                    .getWrapper()
            );
            
            if (token != null) {
                status.put("platform", token.getPlatform());
                status.put("failedCount", token.getFailedCount());
                status.put("lastActiveTime", token.getLastActiveTime());
                status.put("lastSuccessTime", token.getLastSuccessTime());
                status.put("createTime", token.getCreateTime());
            }
        }
        
        return status;
    }

    /**
     * 获取用户设备统计
     */
    @GetMapping("/stats")
    @SaCheckLogin
    @Operation(summary = "获取设备统计", description = "获取用户的设备Token统计信息")
    public Map<String, Object> getDeviceStats() {
        Long userId = StpUtil.getLoginIdAsLong();
        
        Map<String, Object> stats = new HashMap<>();
        
        // 获取活跃设备数量
        int activeCount = tokenService.getActiveTokenCount(userId);
        stats.put("activeDeviceCount", activeCount);
        
        // 获取所有设备Token
        List<UserDeviceToken> allTokens = tokenService.lambdaQuery()
            .eq(UserDeviceToken::getUserId, userId)
            .eq(UserDeviceToken::getIsDeleted, false)
            .list();
        
        stats.put("totalDeviceCount", allTokens.size());
        
        // 按平台统计
        Map<String, Long> platformStats = allTokens.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                UserDeviceToken::getPlatform,
                java.util.stream.Collectors.counting()
            ));
        stats.put("platformStats", platformStats);
        
        // 统计失败设备数量
        long failedCount = allTokens.stream()
            .filter(token -> token.getFailedCount() != null && token.getFailedCount() >= 6)
            .count();
        stats.put("failedDeviceCount", failedCount);
        
        return stats;
    }

    /**
     * 测试推送Token
     */
    @PostMapping("/test-push")
    @SaCheckLogin
    @Operation(summary = "测试推送Token", description = "测试指定Token的推送功能")
    public Map<String, Object> testPushToken(@RequestParam String deviceToken) {
        Long userId = StpUtil.getLoginIdAsLong();
        
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 验证Token是否属于当前用户
            UserDeviceToken token = tokenService.getOne(
                tokenService.lambdaQuery()
                    .eq(UserDeviceToken::getDeviceToken, deviceToken)
                    .eq(UserDeviceToken::getUserId, userId)
                    .eq(UserDeviceToken::getIsDeleted, false)
                    .getWrapper()
            );
            
            if (token == null) {
                result.put("success", false);
                result.put("message", "Token不存在或不属于当前用户");
                return result;
            }
            
            // 检查Token是否有效
            boolean isValid = tokenService.isTokenValid(deviceToken);
            if (!isValid) {
                result.put("success", false);
                result.put("message", "Token已失效");
                return result;
            }
            
            // 这里可以发送一个测试推送消息
            // 暂时只返回Token验证结果
            result.put("success", true);
            result.put("message", "Token验证成功，可以接收推送");
            result.put("platform", token.getPlatform());
            result.put("failedCount", token.getFailedCount());
            
        } catch (Exception e) {
            log.error("测试推送Token失败", e);
            result.put("success", false);
            result.put("message", "测试失败: " + e.getMessage());
        }
        
        return result;
    }
}