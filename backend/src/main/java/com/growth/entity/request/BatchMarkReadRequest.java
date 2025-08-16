package com.growth.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * 批量标记通知已读请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Accessors(chain = true)
@Schema(description = "批量标记通知已读请求")
public class BatchMarkReadRequest {

    /**
     * 通知ID列表
     */
    @NotEmpty(message = "通知ID列表不能为空")
    @Schema(description = "通知ID列表", example = "[1, 2, 3]", required = true)
    private List<Long> notificationIds;
}