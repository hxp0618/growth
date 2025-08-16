package com.growth.entity.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 发送一键通知请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Accessors(chain = true)
@Schema(description = "发送一键通知请求")
public class SendOneClickNotificationRequest {

    /**
     * 通知标题
     */
    @NotBlank(message = "通知标题不能为空")
    @Size(max = 100, message = "通知标题长度不能超过100个字符")
    @Schema(description = "通知标题", example = "重要提醒", required = true)
    private String title;

    /**
     * 通知内容
     */
    @NotBlank(message = "通知内容不能为空")
    @Size(max = 1000, message = "通知内容长度不能超过1000个字符")
    @Schema(description = "通知内容", example = "请记得按时服用叶酸片", required = true)
    private String content;

    /**
     * 通知SVG图标
     */
    @Size(max = 2000, message = "SVG图标长度不能超过2000个字符")
    @Schema(description = "通知SVG图标", example = "<svg>...</svg>")
    private String svgIcon;

    /**
     * 家庭ID
     */
    @NotNull(message = "家庭ID不能为空")
    @Schema(description = "家庭ID", example = "1", required = true)
    private Long familyId;

    /**
     * 接收者用户ID列表（为空则发送给所有家庭成员）
     */
    @Schema(description = "接收者用户ID列表，为空则发送给所有家庭成员", example = "[1, 2, 3]")
    private List<Long> receiverIds;

    /**
     * 优先级（1：低，2：中，3：高）
     */
    @Schema(description = "优先级（1：低，2：中，3：高）", example = "2", allowableValues = {"1", "2", "3"})
    private Integer priority;

    /**
     * 计划发送时间（为空则立即发送）
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "计划发送时间，为空则立即发送", example = "2023-12-01 10:00:00")
    private LocalDateTime scheduledTime;
}