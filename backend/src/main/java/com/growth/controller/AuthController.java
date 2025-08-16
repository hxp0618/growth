package com.growth.controller;

import cn.dev33.satoken.secure.BCrypt;
import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.util.StrUtil;
import com.growth.common.exception.BusinessException;
import com.growth.common.result.Result;
import com.growth.common.result.ResultCode;
import com.growth.entity.User;
import com.growth.entity.request.RegisterRequest;
import com.growth.entity.request.LoginRequest;
import com.growth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
@Tag(name = "用户认证", description = "登录、注册、登出等认证相关接口")
public class AuthController {

    private final UserService userService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户名密码登录")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        // 查询用户
        User user = userService.getByPhone(request.getPhone());
        if (user == null) {
            throw BusinessException.of(ResultCode.LOGIN_ERROR, "手机号或密码错误");
        }

        // 检查用户状态
        if (user.getStatus() != 1) {
            throw BusinessException.of(ResultCode.ACCOUNT_DISABLED, "账户已被禁用");
        }

        // 验证密码
        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw BusinessException.of(ResultCode.LOGIN_ERROR, "手机号或密码错误");
        }

        // 登录成功，生成token
        StpUtil.login(user.getId());
        String token = StpUtil.getTokenValue();

        // 更新最后登录信息
        String clientIp = getClientIp(httpRequest);
        userService.updateLastLoginInfo(user.getId(), clientIp);

        // 返回登录信息
        Map<String, Object> loginInfo = new HashMap<>();
        loginInfo.put("token", token);
        loginInfo.put("tokenName", StpUtil.getTokenName());
        loginInfo.put("tokenTimeout", StpUtil.getTokenTimeout());
        loginInfo.put("user", maskUserPassword(user));

        log.info("用户登录成功: phone={}, username={}, userId={}, ip={}", user.getPhone(), user.getUsername(), user.getId(), clientIp);
        return loginInfo;
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "新用户注册")
    public void register(@Valid @RequestBody RegisterRequest request) {

        // 检查手机号是否已存在
        if (userService.isPhoneExists(request.getPhone(), null)) {
            throw BusinessException.of(ResultCode.DATA_EXISTS, "手机号已存在");
        }

        // 创建用户
        User user = new User()
                .setUsername(request.getUsername())
                .setPassword(request.getPassword())
                .setNickname(request.getNickname())
                .setEmail(request.getEmail())
                .setPhone(request.getPhone())
                .setStatus(1); // 默认启用

        userService.createUser(user);

        log.info("用户注册成功: username={}", user.getUsername());
    }

    /**
     * 用户登出
     */
    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "退出登录")
    public void logout() {
        Long userId = getCurrentUserId();
        StpUtil.logout();
        log.info("用户登出成功: userId={}", userId);
    }

    /**
     * 获取当前登录用户信息
     */
    @GetMapping("/me")
    @Operation(summary = "获取当前登录用户信息", description = "获取当前登录用户的详细信息")
    public User getCurrentUser() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw BusinessException.of(ResultCode.LOGIN_REQUIRED);
        }

        User user = userService.getById(userId);
        if (user == null) {
            throw BusinessException.of(ResultCode.DATA_NOT_FOUND, "用户不存在");
        }

        return maskUserPassword(user);
    }

    /**
     * 刷新Token
     */
    @PostMapping("/refresh")
    @Operation(summary = "刷新Token", description = "刷新访问令牌")
    public Map<String, Object> refreshToken() {
        // 检查是否登录
        if (!StpUtil.isLogin()) {
            throw BusinessException.of(ResultCode.LOGIN_REQUIRED);
        }

        // 续签token
        StpUtil.renewTimeout(StpUtil.getTokenTimeout());
        String token = StpUtil.getTokenValue();

        Map<String, Object> tokenInfo = new HashMap<>();
        tokenInfo.put("token", token);
        tokenInfo.put("tokenName", StpUtil.getTokenName());
        tokenInfo.put("tokenTimeout", StpUtil.getTokenTimeout());

        return tokenInfo;
    }

    /**
     * 获取当前登录用户ID
     */
    private Long getCurrentUserId() {
        try {
            if (StpUtil.isLogin()) {
                Object loginId = StpUtil.getLoginId();
                if (loginId != null) {
                    return Long.valueOf(loginId.toString());
                }
            }
        } catch (Exception e) {
            log.debug("获取当前用户ID失败: {}", e.getMessage());
        }
        return null;
    }

    /**
     * 屏蔽用户密码
     */
    private User maskUserPassword(User user) {
        if (user != null) {
            user.setPassword(null);
        }
        return user;
    }

    /**
     * 获取客户端IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String xip = request.getHeader("X-Real-IP");
        String xfor = request.getHeader("X-Forwarded-For");
        if (StrUtil.isNotEmpty(xfor) && !"unKnown".equalsIgnoreCase(xfor)) {
            // 多次反向代理后会有多个ip值，第一个ip才是真实ip
            int index = xfor.indexOf(",");
            if (index != -1) {
                return xfor.substring(0, index);
            } else {
                return xfor;
            }
        }
        xfor = xip;
        if (StrUtil.isNotEmpty(xfor) && !"unKnown".equalsIgnoreCase(xfor)) {
            return xfor;
        }
        if (StrUtil.isBlank(xfor) || "unknown".equalsIgnoreCase(xfor)) {
            xfor = request.getHeader("Proxy-Client-IP");
        }
        if (StrUtil.isBlank(xfor) || "unknown".equalsIgnoreCase(xfor)) {
            xfor = request.getHeader("WL-Proxy-Client-IP");
        }
        if (StrUtil.isBlank(xfor) || "unknown".equalsIgnoreCase(xfor)) {
            xfor = request.getHeader("HTTP_CLIENT_IP");
        }
        if (StrUtil.isBlank(xfor) || "unknown".equalsIgnoreCase(xfor)) {
            xfor = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (StrUtil.isBlank(xfor) || "unknown".equalsIgnoreCase(xfor)) {
            xfor = request.getRemoteAddr();
        }
        return xfor;
    }


}
