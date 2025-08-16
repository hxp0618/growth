package com.growth.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 注册设备Token请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Schema(description = "注册设备Token请求")
public class RegisterDeviceTokenRequest {

    /**
     * 设备Token
     */
    @NotBlank(message = "设备Token不能为空")
    @Size(max = 500, message = "设备Token长度不能超过500个字符")
    @Schema(description = "设备Token", required = true)
    private String deviceToken;

    /**
     * 平台类型
     */
    @NotBlank(message = "平台类型不能为空")
    @Size(max = 20, message = "平台类型长度不能超过20个字符")
    @Schema(description = "平台类型", example = "ios", required = true)
    private String platform;

    /**
     * 设备信息
     */
    @Schema(description = "设备信息（JSON格式）")
    private String deviceInfo;

    /**
     * 应用版本
     */
    @Size(max = 50, message = "应用版本长度不能超过50个字符")
    @Schema(description = "应用版本", example = "1.0.0")
    private String appVersion;
}