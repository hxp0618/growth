package com.growth.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 创建家庭任务请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Schema(description = "创建家庭任务请求")
public class CreateFamilyTaskRequest {

    /**
     * 任务标题
     */
    @NotBlank(message = "任务标题不能为空")
    @Size(max = 100, message = "任务标题长度不能超过100个字符")
    @Schema(description = "任务标题", required = true, example = "购买孕妇奶粉")
    private String title;

    /**
     * 任务说明
     */
    @Size(max = 500, message = "任务说明长度不能超过500个字符")
    @Schema(description = "任务说明", example = "需要购买适合孕妇的营养奶粉")
    private String description;

    /**
     * 指定人用户ID列表
     */
    @NotNull(message = "指定人不能为空")
    @Schema(description = "指定人用户ID列表", required = true, example = "[1, 2]")
    private List<Long> assignedUserIds;

    /**
     * 所属家庭ID
     */
    @NotNull(message = "家庭ID不能为空")
    @Schema(description = "所属家庭ID", required = true, example = "1")
    private Long familyId;

    /**
     * 优先级（1：低，2：中，3：高，4：紧急）
     */
    @Schema(description = "优先级（1：低，2：中，3：高，4：紧急）", example = "2")
    private Integer priority = 2;

    /**
     * 预计完成时间
     */
    @Schema(description = "预计完成时间")
    private LocalDateTime expectedCompletionTime;

    /**
     * 备注信息
     */
    @Size(max = 200, message = "备注信息长度不能超过200个字符")
    @Schema(description = "备注信息")
    private String remark;
}
