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
 * 家庭通知模版实体类
 *
 * @author growth
 * @since 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName(value = "family_notifications", autoResultMap = true)
@Schema(description = "家庭通知模版")
public class FamilyNotification extends BaseEntity {

    /**
     * 通知标题
     */
    @TableField("title")
    @Schema(description = "通知标题")
    private String title;

    /**
     * 通知内容
     */
    @TableField("content")
    @Schema(description = "通知内容")
    private String content;

    /**
     * 通知描述
     */
    @TableField("description")
    @Schema(description = "通知描述")
    private String description;

    /**
     * 通知SVG图标
     */
    @TableField("svg_icon")
    @Schema(description = "通知SVG图标")
    private String svgIcon;

    /**
     * 卡片背景颜色（十六进制颜色值）
     */
    @TableField("card_back_color")
    @Schema(description = "卡片背景颜色")
    private String cardBackColor;

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
     * 通知类型（1：系统通知，2：用户通知，3：紧急通知）
     */
    @TableField("type")
    @Schema(description = "通知类型（1：系统通知，2：用户通知，3：紧急通知）")
    private Integer type;

    /**
     * 模板分类（custom：自定义，system：系统预设）
     */
    @TableField("category")
    @Schema(description = "模板分类")
    private String category;

    /**
     * 使用次数
     */
    @TableField("usage_count")
    @Schema(description = "使用次数")
    private Integer usageCount;

    /**
     * 是否启用
     */
    @TableField("is_active")
    @Schema(description = "是否启用")
    private Boolean isActive;

    /**
     * 接收人用户ID列表，为空则发送给所有家庭成员
     */
    @TableField(value = "receiver_role_ids", typeHandler = JacksonTypeHandler.class)
    @Schema(description = "接收人用户ID列表")
    private List<Long> receiverUserIds;

    /**
     * 备注信息
     */
    @TableField("remark")
    @Schema(description = "备注信息")
    private String remark;
}