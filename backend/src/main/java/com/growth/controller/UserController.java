package com.growth.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.growth.common.controller.BaseController;
import com.growth.common.result.Result;
import com.growth.entity.User;
import com.growth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/**
 * 用户控制器
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@Tag(name = "用户管理", description = "用户相关接口")
public class UserController extends BaseController {

    private final UserService userService;

    /**
     * 分页查询用户列表
     */
    @GetMapping
    @Operation(summary = "分页查询用户列表", description = "支持按用户名、邮箱、状态筛选")
    public Result<PageResult<User>> pageUsers(
            @Parameter(description = "当前页码") @RequestParam(defaultValue = "1") Long current,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Long size,
            @Parameter(description = "用户名") @RequestParam(required = false) String username,
            @Parameter(description = "邮箱") @RequestParam(required = false) String email,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        
        Page<User> page = createPage(new PageRequest(current, size));
        return pageResult(userService.pageUsers(page, username, email, status));
    }

    /**
     * 根据ID查询用户
     */
    @GetMapping("/{id}")
    @Operation(summary = "根据ID查询用户", description = "获取用户详细信息")
    public Result<User> getUser(@Parameter(description = "用户ID") @PathVariable Long id) {
        User user = userService.getById(id);
        return Result.success(user);
    }

    /**
     * 创建用户
     */
    @PostMapping
    @Operation(summary = "创建用户", description = "新增用户信息")
    public Result<Void> createUser(@Valid @RequestBody User user) {
        userService.createUser(user);
        return Result.success();
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新用户信息", description = "修改用户基本信息")
    public Result<Void> updateUser(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @Valid @RequestBody User user) {
        user.setId(id);
        userService.updateUser(user);
        return Result.success();
    }

    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户", description = "逻辑删除用户")
    public Result<Void> deleteUser(@Parameter(description = "用户ID") @PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }

    /**
     * 修改密码
     */
    @PutMapping("/{id}/password")
    @Operation(summary = "修改密码", description = "用户修改自己的密码")
    public Result<Void> changePassword(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(id, request.getOldPassword(), request.getNewPassword());
        return Result.success();
    }

    /**
     * 重置密码
     */
    @PutMapping("/{id}/reset-password")
    @Operation(summary = "重置密码", description = "管理员重置用户密码")
    public Result<Void> resetPassword(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(id, request.getNewPassword());
        return Result.success();
    }

    /**
     * 启用/禁用用户
     */
    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用用户", description = "修改用户状态")
    public Result<Void> changeStatus(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @Valid @RequestBody ChangeStatusRequest request) {
        userService.changeStatus(id, request.getStatus());
        return Result.success();
    }

    /**
     * 检查用户名是否存在
     */
    @GetMapping("/check-username")
    @Operation(summary = "检查用户名是否存在", description = "用于注册时验证用户名唯一性")
    public Result<Boolean> checkUsername(
            @Parameter(description = "用户名") @RequestParam String username,
            @Parameter(description = "排除的用户ID") @RequestParam(required = false) Long excludeUserId) {
        boolean exists = userService.isUsernameExists(username, excludeUserId);
        return Result.success(exists);
    }

    /**
     * 检查邮箱是否存在
     */
    @GetMapping("/check-email")
    @Operation(summary = "检查邮箱是否存在", description = "用于注册时验证邮箱唯一性")
    public Result<Boolean> checkEmail(
            @Parameter(description = "邮箱") @RequestParam String email,
            @Parameter(description = "排除的用户ID") @RequestParam(required = false) Long excludeUserId) {
        boolean exists = userService.isEmailExists(email, excludeUserId);
        return Result.success(exists);
    }

    /**
     * 检查手机号是否存在
     */
    @GetMapping("/check-phone")
    @Operation(summary = "检查手机号是否存在", description = "用于注册时验证手机号唯一性")
    public Result<Boolean> checkPhone(
            @Parameter(description = "手机号") @RequestParam String phone,
            @Parameter(description = "排除的用户ID") @RequestParam(required = false) Long excludeUserId) {
        boolean exists = userService.isPhoneExists(phone, excludeUserId);
        return Result.success(exists);
    }

    /**
     * 修改密码请求
     */
    public static class ChangePasswordRequest {
        @NotNull(message = "原密码不能为空")
        private String oldPassword;
        
        @NotNull(message = "新密码不能为空")
        private String newPassword;

        public String getOldPassword() { return oldPassword; }
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    /**
     * 重置密码请求
     */
    public static class ResetPasswordRequest {
        @NotNull(message = "新密码不能为空")
        private String newPassword;

        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    /**
     * 修改状态请求
     */
    public static class ChangeStatusRequest {
        @NotNull(message = "状态不能为空")
        private Integer status;

        public Integer getStatus() { return status; }
        public void setStatus(Integer status) { this.status = status; }
    }
}