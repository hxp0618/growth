package com.growth.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.growth.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * 家庭任务实体类
 *
 * @author growth
 * @since 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("family_tasks")
@Schema(description = "家庭任务")
public class FamilyTask extends BaseEntity {

    /**
     * 任务标题
     */
    @TableField("title")
    @Schema(description = "任务标题")
    private String title;

    /**
     * 任务说明
     */
    @TableField("description")
    @Schema(description = "任务说明")
    private String description;

    /**
     * 任务状态（1：待开始，2：进行中，3：已完成，4：已取消）
     */
    @TableField("status")
    @Schema(description = "任务状态（1：待开始，2：进行中，3：已完成，4：已取消）")
    private Integer status;

    /**
     * 指定人用户ID列表
     */
    @TableField(value = "assigned_user_ids", typeHandler = JacksonTypeHandler.class)
    @Schema(description = "指定人用户ID列表")
    private List<Long> assignedUserIds;

    /**
     * 创建者用户ID
     */
    @TableField("creator_id")
    @Schema(description = "创建者用户ID")
    private Long creatorId;

    /**
     * 所属家庭ID
     */
    @TableField("family_id")
    @Schema(description = "所属家庭ID")
    private Long familyId;

    /**
     * 优先级（1：低，2：中，3：高，4：紧急）
     */
    @TableField("priority")
    @Schema(description = "优先级（1：低，2：中，3：高，4：紧急）")
    private Integer priority;

    /**
     * 预计完成时间
     */
    @TableField("expected_completion_time")
    @Schema(description = "预计完成时间")
    private java.time.LocalDateTime expectedCompletionTime;

    /**
     * 实际完成时间
     */
    @TableField("actual_completion_time")
    @Schema(description = "实际完成时间")
    private java.time.LocalDateTime actualCompletionTime;

    /**
     * 备注信息
     */
    @TableField("remark")
    @Schema(description = "备注信息")
    private String remark;

    /**
     * 创建时间
     */
    @TableField("create_time")
    @Schema(description = "创建时间")
    private java.time.LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField("update_time")
    @Schema(description = "更新时间")
    private java.time.LocalDateTime updateTime;

    /**
     * 创建人ID
     */
    @TableField("create_by")
    @Schema(description = "创建人ID")
    private Long createBy;

    /**
     * 更新人ID
     */
    @TableField("update_by")
    @Schema(description = "更新人ID")
    private Long updateBy;

    /**
     * 逻辑删除标识（0：未删除，1：已删除）
     */
    @TableField("is_deleted")
    @Schema(description = "逻辑删除标识（0：未删除，1：已删除）")
    private Boolean isDeleted;

    /**
     * 版本号（乐观锁）
     */
    @TableField("version")
    @Schema(description = "版本号（乐观锁）")
    private Integer version;
}
