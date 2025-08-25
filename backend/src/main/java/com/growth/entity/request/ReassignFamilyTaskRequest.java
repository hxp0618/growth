package com.growth.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotNull;

/**
 * 转派家庭任务请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Schema(description = "转派家庭任务请求")
public class ReassignFamilyTaskRequest {

    /**
     * 任务ID
     */
    @NotNull(message = "任务ID不能为空")
    @Schema(description = "任务ID", required = true, example = "1")
    private Long taskId;

    /**
     * 新的指定人用户ID
     */
    @NotNull(message = "新的指定人不能为空")
    @Schema(description = "新的指定人用户ID", required = true, example = "2")
    private Long newAssignedUserId;

    /**
     * 转派原因
     */
    @Schema(description = "转派原因", example = "时间冲突，无法按时完成")
    private String reason;
}
