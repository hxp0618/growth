package com.growth.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 创建家庭请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Schema(description = "创建家庭请求")
public class CreateFamilyRequest {

    /**
     * 家庭名称
     */
    @NotBlank(message = "家庭名称不能为空")
    @Size(max = 100, message = "家庭名称长度不能超过100个字符")
    @Schema(description = "家庭名称", required = true)
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
}