package com.growth.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Map;

/**
 * 更新家庭成员请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Schema(description = "更新家庭成员请求")
public class UpdateFamilyMemberRequest {

    /**
     * 关系ID
     */
    @NotNull(message = "关系ID不能为空")
    @Schema(description = "关系ID", required = true)
    private Long id;

    /**
     * 角色ID
     */
    @Schema(description = "角色ID")
    private Long roleId;

    /**
     * 权限配置
     */
    @Schema(description = "权限配置")
    private Map<String, Object> permissions;

    /**
     * 状态（0：已退出，1：正常）
     */
    @Schema(description = "状态（0：已退出，1：正常）")
    private Integer status;

    /**
     * 备注信息
     */
    @Size(max = 200, message = "备注信息长度不能超过200个字符")
    @Schema(description = "备注信息")
    private String remark;
}