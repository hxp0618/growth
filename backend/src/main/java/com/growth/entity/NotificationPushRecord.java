package com.growth.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.growth.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * 通知推送记录实体类
 *
 * @author growth
 * @since 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("notification_push_records")
@Schema(description = "通知推送记录")
public class NotificationPushRecord extends BaseEntity {

    /**
     * 使用的模板ID（可选）
     */
    @TableField("template_id")
    @Schema(description = "使用的模板ID")
    private Long templateId;

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
     * 通知SVG图标
     */
    @TableField("svg_icon")
    @Schema(description = "通知SVG图标")
    private String svgIcon;

    /**
     * 发送者用户ID
     */
    @TableField("sender_id")
    @Schema(description = "发送者用户ID")
    private Long senderId;

    /**
     * 通知类型（1：系统通知，2：用户通知，3：紧急通知）
     */
    @TableField("type")
    @Schema(description = "通知类型（1：系统通知，2：用户通知，3：紧急通知）")
    private Integer type;

    /**
     * 优先级（1：低，2：中，3：高）
     */
    @TableField("priority")
    @Schema(description = "优先级（1：低，2：中，3：高）")
    private Integer priority;

    /**
     * 是否为一键通知
     */
    @TableField("is_one_click")
    @Schema(description = "是否为一键通知")
    private Boolean isOneClick;

    /**
     * 接收者用户ID
     */
    @TableField("receiver_id")
    @Schema(description = "接收者用户ID")
    private Long receiverId;

    /**
     * 家庭ID
     */
    @TableField("family_id")
    @Schema(description = "家庭ID")
    private Long familyId;

    /**
     * 实际发送时间
     */
    @TableField("sent_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "实际发送时间")
    private LocalDateTime sentTime;

    /**
     * 接收者在家庭中的角色ID
     */
    @TableField("role_id")
    @Schema(description = "接收者在家庭中的角色ID")
    private Long roleId;

    /**
     * 接收者在家庭中的角色名称
     */
    @TableField("role_name")
    @Schema(description = "接收者在家庭中的角色名称")
    private String roleName;

    /**
     * 是否已读（0：未读，1：已读）
     */
    @TableField("is_read")
    @Schema(description = "是否已读")
    private Boolean isRead;

    /**
     * 阅读时间
     */
    @TableField("read_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "阅读时间")
    private LocalDateTime readTime;

    /**
     * 设备Token ID
     */
    @TableField("device_token_id")
    @Schema(description = "设备Token ID")
    private Long deviceTokenId;

    /**
     * 推送时使用的设备Token
     */
    @TableField("device_token")
    @Schema(description = "推送时使用的设备Token")
    private String deviceToken;

    /**
     * 设备平台
     */
    @TableField("platform")
    @Schema(description = "设备平台")
    private String platform;

    /**
     * 推送状态（0：未推送，1：推送成功，2：推送失败）
     */
    @TableField("push_status")
    @Schema(description = "推送状态（0：未推送，1：推送成功，2：推送失败）")
    private Integer pushStatus;

    /**
     * 推送时间
     */
    @TableField("push_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "推送时间")
    private LocalDateTime pushTime;

    /**
     * 推送响应信息
     */
    @TableField("push_response")
    @Schema(description = "推送响应信息")
    private String pushResponse;

    /**
     * 错误代码
     */
    @TableField("error_code")
    @Schema(description = "错误代码")
    private String errorCode;

    /**
     * 推送失败原因
     */
    @TableField("error_message")
    @Schema(description = "推送失败原因")
    private String errorMessage;

    /**
     * 重试次数
     */
    @TableField("retry_count")
    @Schema(description = "重试次数")
    private Integer retryCount;

    /**
     * 记录状态（0：正常，1：已删除，2：发送失败）
     */
    @TableField("status")
    @Schema(description = "记录状态（0：正常，1：已删除，2：发送失败）")
    private Integer status;

    /**
     * 备注信息
     */
    @TableField("remark")
    @Schema(description = "备注信息")
    private String remark;
}
