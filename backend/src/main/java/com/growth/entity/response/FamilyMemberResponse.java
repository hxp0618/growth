package com.growth.entity.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 家庭成员响应
 *
 * @author growth
 * @since 1.0
 */
@Data
@Schema(description = "家庭成员响应")
public class FamilyMemberResponse {

    /**
     * 关系ID
     */
    @Schema(description = "关系ID")
    private Long id;

    /**
     * 家庭ID
     */
    @Schema(description = "家庭ID")
    private Long familyId;

    /**
     * 用户ID
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 用户名
     */
    @Schema(description = "用户名")
    private String username;

    /**
     * 昵称
     */
    @Schema(description = "昵称")
    private String nickname;

    /**
     * 头像URL
     */
    @Schema(description = "头像URL")
    private String avatar;

    /**
     * 角色ID
     */
    @Schema(description = "角色ID")
    private Long roleId;

    /**
     * 角色名称
     */
    @Schema(description = "角色名称")
    private String roleName;

    /**
     * 角色编码
     */
    @Schema(description = "角色编码")
    private String roleCode;

    /**
     * 权限配置
     */
    @Schema(description = "权限配置")
    private Map<String, Object> permissions;

    /**
     * 邀请人ID
     */
    @Schema(description = "邀请人ID")
    private Long invitedBy;

    /**
     * 邀请人姓名
     */
    @Schema(description = "邀请人姓名")
    private String invitedByName;

    /**
     * 加入时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "加入时间")
    private LocalDateTime joinedAt;

    /**
     * 状态（0：已退出，1：正常）
     */
    @Schema(description = "状态（0：已退出，1：正常）")
    private Integer status;

    /**
     * 备注信息
     */
    @Schema(description = "备注信息")
    private String remark;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}