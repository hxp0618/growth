package com.growth.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import com.growth.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * 家庭实体类
 *
 * @author growth
 * @since 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("families")
@Schema(description = "家庭")
public class Family extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 家庭名称
     */
    @TableField("name")
    @Schema(description = "家庭名称")
    private String name;

    /**
     * 创建者ID
     */
    @TableField("creator_id")
    @Schema(description = "创建者ID")
    private Long creatorId;

    /**
     * 家庭邀请码
     */
    @TableField("invite_code")
    @Schema(description = "家庭邀请码")
    private String inviteCode;

    /**
     * 家庭描述
     */
    @TableField("description")
    @Schema(description = "家庭描述")
    private String description;

    /**
     * 家庭头像URL
     */
    @TableField("avatar")
    @Schema(description = "家庭头像URL")
    private String avatar;

    /**
     * 家庭状态（0：禁用，1：正常）
     */
    @TableField("status")
    @Schema(description = "家庭状态（0：禁用，1：正常）")
    private Integer status;
}