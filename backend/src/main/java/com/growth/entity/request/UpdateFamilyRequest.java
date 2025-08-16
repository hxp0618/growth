package com.growth.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 更新家庭请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Schema(description = "更新家庭请求")
public class UpdateFamilyRequest {

    /**
     * 家庭ID
     */
    @NotNull(message = "家庭ID不能为空")
    @Schema(description = "家庭ID", required = true)
    private Long id;

    /**
     * 家庭名称
     */
    @Size(max = 100, message = "家庭名称长度不能超过100个字符")
    @Schema(description = "家庭名称")
    private String name;

    /**
     * 家庭描述
     */
    @Size(max = 500, message = "家庭描述长度不能超过500个字符")
    @Schema(description = "家庭描述")
    private String description;

    /**
     * 家庭头像URL
     */
    @Size(max = 500, message = "家庭头像URL长度不能超过500个字符")
    @Schema(description = "家庭头像URL")
    private String avatar;

    /**
     * 家庭状态（0：禁用，1：正常）
     */
    @Schema(description = "家庭状态（0：禁用，1：正常）")
    private Integer status;
}