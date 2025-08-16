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

import java.util.Map;

/**
 * 家庭角色实体类
 *
 * @author growth
 * @since 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName(value = "family_roles", autoResultMap = true)
@Schema(description = "家庭角色")
public class FamilyRole extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 角色名称
     */
    @TableField("role_name")
    @Schema(description = "角色名称")
    private String roleName;

    /**
     * 角色编码
     */
    @TableField("role_code")
    @Schema(description = "角色编码")
    private String roleCode;

    /**
     * 角色描述
     */
    @TableField("description")
    @Schema(description = "角色描述")
    private String description;

    /**
     * 默认权限配置JSON
     */
    @TableField(value = "permissions", typeHandler = JacksonTypeHandler.class)
    @Schema(description = "默认权限配置")
    private Map<String, Object> permissions;

    /**
     * 排序序号
     */
    @TableField("sort_order")
    @Schema(description = "排序序号")
    private Integer sortOrder;

    /**
     * 状态（0：禁用，1：启用）
     */
    @TableField("status")
    @Schema(description = "状态（0：禁用，1：启用）")
    private Integer status;
}