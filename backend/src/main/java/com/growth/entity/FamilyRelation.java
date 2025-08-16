package com.growth.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.growth.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 家庭成员关系实体类
 *
 * @author growth
 * @since 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName(value = "family_relations", autoResultMap = true)
@Schema(description = "家庭成员关系")
public class FamilyRelation extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 家庭ID
     */
    @TableField("family_id")
    @Schema(description = "家庭ID")
    private Long familyId;

    /**
     * 用户ID
     */
    @TableField("user_id")
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 角色ID
     */
    @TableField("role_id")
    @Schema(description = "角色ID")
    private Long roleId;

    /**
     * 角色名称（冗余字段，便于查询）
     */
    @TableField("role_name")
    @Schema(description = "角色名称")
    private String roleName;

    /**
     * 权限配置JSON（可覆盖角色默认权限）
     */
    @TableField(value = "permissions", typeHandler = JacksonTypeHandler.class)
    @Schema(description = "权限配置")
    private Map<String, Object> permissions;

    /**
     * 邀请人ID
     */
    @TableField("invited_by")
    @Schema(description = "邀请人ID")
    private Long invitedBy;

    /**
     * 加入时间
     */
    @TableField("joined_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "加入时间")
    private LocalDateTime joinedAt;

    /**
     * 状态（0：已退出，1：正常）
     */
    @TableField("status")
    @Schema(description = "状态（0：已退出，1：正常）")
    private Integer status;

    /**
     * 备注信息
     */
    @TableField("remark")
    @Schema(description = "备注信息")
    private String remark;
}