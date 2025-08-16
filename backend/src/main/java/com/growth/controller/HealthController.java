package com.growth.controller;

import com.growth.common.result.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/health")
@Tag(name = "健康检查", description = "系统健康状态检查接口")
public class HealthController {

    @Value("${spring.application.name:growth}")
    private String applicationName;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    /**
     * 健康检查
     */
    @GetMapping
    @Operation(summary = "健康检查", description = "检查系统运行状态")
    public Result<Map<String, Object>> health() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("application", applicationName);
        healthInfo.put("profile", activeProfile);
        healthInfo.put("timestamp", LocalDateTime.now());
        healthInfo.put("version", "1.0.0");
        
        return Result.success(healthInfo);
    }

    /**
     * 系统信息
     */
    @GetMapping("/info")
    @Operation(summary = "系统信息", description = "获取系统基本信息")
    public Result<Map<String, Object>> info() {
        Map<String, Object> systemInfo = new HashMap<>();
        
        // 应用信息
        Map<String, Object> appInfo = new HashMap<>();
        appInfo.put("name", applicationName);
        appInfo.put("version", "1.0.0");
        appInfo.put("profile", activeProfile);
        systemInfo.put("application", appInfo);
        
        // JVM信息
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> jvmInfo = new HashMap<>();
        jvmInfo.put("javaVersion", System.getProperty("java.version"));
        jvmInfo.put("totalMemory", runtime.totalMemory() / 1024 / 1024 + " MB");
        jvmInfo.put("freeMemory", runtime.freeMemory() / 1024 / 1024 + " MB");
        jvmInfo.put("maxMemory", runtime.maxMemory() / 1024 / 1024 + " MB");
        jvmInfo.put("processors", runtime.availableProcessors());
        systemInfo.put("jvm", jvmInfo);
        
        // 系统信息
        Map<String, Object> osInfo = new HashMap<>();
        osInfo.put("name", System.getProperty("os.name"));
        osInfo.put("version", System.getProperty("os.version"));
        osInfo.put("arch", System.getProperty("os.arch"));
        systemInfo.put("os", osInfo);
        
        systemInfo.put("timestamp", LocalDateTime.now());
        
        return Result.success(systemInfo);
    }
}