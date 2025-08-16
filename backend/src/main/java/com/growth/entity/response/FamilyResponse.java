package com.growth.entity.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 家庭响应
 *
 * @author growth
 * @since 1.0
 */
@Data
@Schema(description = "家庭响应")
public class FamilyResponse {

    /**
     * 家庭ID
     */
    @Schema(description = "家庭ID")
    private Long id;

    /**
     * 家庭名称
     */
    @Schema(description = "家庭名称")
    private String name;

    /**
     * 创建者ID
     */
    @Schema(description = "创建者ID")
    private Long creatorId;

    /**
     * 创建者姓名
     */
    @Schema(description = "创建者姓名")
    private String creatorName;

    /**
     * 家庭邀请码
     */
    @Schema(description = "家庭邀请码")
    private String inviteCode;

    /**
     * 家庭描述
     */
    @Schema(description = "家庭描述")
    private String description;

    /**
     * 家庭头像URL
     */
    @Schema(description = "家庭头像URL")
    private String avatar;

    /**
     * 家庭状态（0：禁用，1：正常）
     */
    @Schema(description = "家庭状态（0：禁用，1：正常）")
    private Integer status;

    /**
     * 家庭成员数量
     */
    @Schema(description = "家庭成员数量")
    private Integer memberCount;

    /**
     * 家庭成员列表
     */
    @Schema(description = "家庭成员列表")
    private List<FamilyMemberResponse> members;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}