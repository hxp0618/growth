package com.growth.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import jakarta.validation.constraints.NotNull;

/**
 * 发送通知模版请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Accessors(chain = true)
@Schema(description = "发送通知模版请求")
public class SendNotificationTemplateRequest {

    /**
     * 通知模版ID
     */
    @NotNull(message = "通知模版ID不能为空")
    @Schema(description = "通知模版ID", example = "1", required = true)
    private Long templateId;

    /**
     * 家庭ID
     */
    @NotNull(message = "家庭ID不能为空")
    @Schema(description = "家庭ID", example = "1", required = true)
    private Long familyId;
}