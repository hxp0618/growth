package com.growth.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.growth.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * 用户设备Token实体类
 *
 * @author growth
 * @since 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("user_device_tokens")
@Schema(description = "用户设备Token")
public class UserDeviceToken extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    @TableField("user_id")
    @NotNull(message = "用户ID不能为空")
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 设备Token
     */
    @TableField("device_token")
    @NotBlank(message = "设备Token不能为空")
    @Size(max = 500, message = "设备Token长度不能超过500个字符")
    @Schema(description = "设备Token")
    private String deviceToken;

    /**
     * 平台类型（ios/android/web）
     */
    @TableField("platform")
    @NotBlank(message = "平台类型不能为空")
    @Size(max = 20, message = "平台类型长度不能超过20个字符")
    @Schema(description = "平台类型", example = "ios")
    private String platform;

    /**
     * 设备信息（JSON格式）
     */
    @TableField("device_info")
    @Schema(description = "设备信息")
    private String deviceInfo;

    /**
     * 应用版本
     */
    @TableField("app_version")
    @Size(max = 50, message = "应用版本长度不能超过50个字符")
    @Schema(description = "应用版本", example = "1.0.0")
    private String appVersion;

    /**
     * 是否启用推送
     */
    @TableField("push_enabled")
    @Schema(description = "是否启用推送", example = "true")
    private Boolean pushEnabled;

    /**
     * 最后活跃时间
     */
    @TableField("last_active_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "最后活跃时间")
    private LocalDateTime lastActiveTime;

    /**
     * 状态（0：禁用，1：启用）
     */
    @TableField("status")
    @Schema(description = "状态（0：禁用，1：启用）", example = "1")
    private Integer status;

    /**
     * 推送失败次数
     */
    @TableField("failed_count")
    @Schema(description = "推送失败次数", example = "0")
    private Integer failedCount;

    /**
     * 最后失败时间
     */
    @TableField("last_failed_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "最后失败时间")
    private LocalDateTime lastFailedTime;

    /**
     * 最后成功时间
     */
    @TableField("last_success_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "最后成功时间")
    private LocalDateTime lastSuccessTime;

    /**
     * 不活跃原因
     */
    @TableField("inactive_reason")
    @Size(max = 200, message = "不活跃原因长度不能超过200个字符")
    @Schema(description = "不活跃原因")
    private String inactiveReason;
}