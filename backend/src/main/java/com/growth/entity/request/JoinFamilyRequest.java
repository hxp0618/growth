package com.growth.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 加入家庭请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Schema(description = "加入家庭请求")
public class JoinFamilyRequest {

    /**
     * 家庭邀请码
     */
    @NotBlank(message = "家庭邀请码不能为空")
    @Size(min = 8, max = 8, message = "家庭邀请码长度必须为8位")
    @Schema(description = "家庭邀请码", required = true)
    private String inviteCode;

    /**
     * 角色ID
     */
    @NotNull(message = "角色ID不能为空")
    @Schema(description = "角色ID", required = true)
    private Long roleId;

    /**
     * 备注信息
     */
    @Size(max = 200, message = "备注信息长度不能超过200个字符")
    @Schema(description = "备注信息")
    private String remark;
}