package com.growth.entity.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 家庭任务响应
 *
 * @author growth
 * @since 1.0
 */
@Data
@Schema(description = "家庭任务响应")
public class FamilyTaskResponse {

    /**
     * 任务ID
     */
    @Schema(description = "任务ID", example = "1")
    private Long id;

    /**
     * 任务标题
     */
    @Schema(description = "任务标题", example = "购买孕妇奶粉")
    private String title;

    /**
     * 任务说明
     */
    @Schema(description = "任务说明", example = "需要购买适合孕妇的营养奶粉")
    private String description;

    /**
     * 任务状态（1：待开始，2：进行中，3：已完成，4：已取消）
     */
    @Schema(description = "任务状态（1：待开始，2：进行中，3：已完成，4：已取消）", example = "2")
    private Integer status;

    /**
     * 任务状态文本
     */
    @Schema(description = "任务状态文本", example = "进行中")
    private String statusText;

    /**
     * 指定人用户ID列表
     */
    @Schema(description = "指定人用户ID列表", example = "[1, 2]")
    private List<Long> assignedUserIds;

    /**
     * 指定人昵称列表（逗号分隔）
     */
    @Schema(description = "指定人昵称列表（逗号分隔）", example = "老公,妈妈")
    private String assignedUserNicknames;

    /**
     * 创建者用户ID
     */
    @Schema(description = "创建者用户ID", example = "1")
    private Long creatorId;

    /**
     * 创建者昵称
     */
    @Schema(description = "创建者昵称", example = "妈妈")
    private String creatorNickname;

    /**
     * 所属家庭ID
     */
    @Schema(description = "所属家庭ID", example = "1")
    private Long familyId;

    /**
     * 优先级（1：低，2：中，3：高，4：紧急）
     */
    @Schema(description = "优先级（1：低，2：中，3：高，4：紧急）", example = "2")
    private Integer priority;

    /**
     * 优先级文本
     */
    @Schema(description = "优先级文本", example = "中")
    private String priorityText;

    /**
     * 预计完成时间
     */
    @Schema(description = "预计完成时间")
    private LocalDateTime expectedCompletionTime;

    /**
     * 实际完成时间
     */
    @Schema(description = "实际完成时间")
    private LocalDateTime actualCompletionTime;

    /**
     * 备注信息
     */
    @Schema(description = "备注信息")
    private String remark;

    /**
     * 创建时间
     */
    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

    /**
     * 创建人ID
     */
    @Schema(description = "创建人ID")
    private Long createBy;

    /**
     * 更新人ID
     */
    @Schema(description = "更新人ID")
    private Long updateBy;

    /**
     * 逻辑删除标识（0：未删除，1：已删除）
     */
    @Schema(description = "逻辑删除标识（0：未删除，1：已删除）")
    private Boolean isDeleted;

    /**
     * 版本号（乐观锁）
     */
    @Schema(description = "版本号（乐观锁）")
    private Integer version;
}
