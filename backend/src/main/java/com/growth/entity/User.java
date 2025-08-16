package com.growth.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.growth.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serial;

/**
 * 用户实体类
 *
 * @author growth
 * @since 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("sys_user")
@Schema(description = "用户实体")
public class User extends BaseEntity {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 用户名
     */
    @TableField("username")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20个字符之间")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "用户名只能包含字母、数字和下划线")
    @Schema(description = "用户名", example = "admin")
    private String username;

    /**
     * 密码
     */
    @TableField("password")
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 100, message = "密码长度必须在6-100个字符之间")
    @JsonIgnore
    @Schema(description = "密码", example = "123456")
    private String password;

    /**
     * 昵称
     */
    @TableField("nickname")
    @Size(max = 50, message = "昵称长度不能超过50个字符")
    @Schema(description = "昵称", example = "管理员")
    private String nickname;

    /**
     * 邮箱
     */
    @TableField("email")
    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱长度不能超过100个字符")
    @Schema(description = "邮箱", example = "admin@example.com")
    private String email;

    /**
     * 手机号
     */
    @TableField("phone")
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @Schema(description = "手机号", example = "13800138000")
    private String phone;

    /**
     * 头像URL
     */
    @TableField("avatar")
    @Size(max = 500, message = "头像URL长度不能超过500个字符")
    @Schema(description = "头像URL", example = "https://example.com/avatar.jpg")
    private String avatar;

    /**
     * 性别（0：未知，1：男，2：女）
     */
    @TableField("gender")
    @Schema(description = "性别", example = "1", allowableValues = {"0", "1", "2"})
    private Integer gender;

    /**
     * 状态（0：禁用，1：启用）
     */
    @TableField("status")
    @Schema(description = "状态", example = "1", allowableValues = {"0", "1"})
    private Integer status;

    /**
     * 最后登录时间
     */
    @TableField("last_login_time")
    @Schema(description = "最后登录时间")
    private java.time.LocalDateTime lastLoginTime;

    /**
     * 最后登录IP
     */
    @TableField("last_login_ip")
    @Size(max = 50, message = "最后登录IP长度不能超过50个字符")
    @Schema(description = "最后登录IP", example = "192.168.1.1")
    private String lastLoginIp;

    /**
     * 备注
     */
    @TableField("remark")
    @Size(max = 500, message = "备注长度不能超过500个字符")
    @Schema(description = "备注", example = "系统管理员")
    private String remark;
}
