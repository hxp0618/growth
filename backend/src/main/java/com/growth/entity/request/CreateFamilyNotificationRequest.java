package com.growth.entity.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * 创建家庭通知模版请求
 *
 * @author growth
 * @since 1.0
 */
@Data
@Accessors(chain = true)
@Schema(description = "创建家庭通知模版请求")
public class CreateFamilyNotificationRequest {

    /**
     * 通知标题
     */
    @NotBlank(message = "通知标题不能为空")
    @Size(max = 100, message = "通知标题长度不能超过100个字符")
    @Schema(description = "通知标题", example = "产检提醒", required = true)
    private String title;

    /**
     * 通知内容
     */
    @NotBlank(message = "通知内容不能为空")
    @Size(max = 1000, message = "通知内容长度不能超过1000个字符")
    @Schema(description = "通知内容", example = "今天是产检日，记得按时去医院", required = true)
    private String content;

    /**
     * 通知描述
     */
    @Size(max = 500, message = "通知描述长度不能超过500个字符")
    @Schema(description = "通知描述", example = "产检提醒通知")
    private String description;

    /**
     * 通知SVG图标
     */
    @Size(max = 2000, message = "SVG图标长度不能超过2000个字符")
    @Schema(description = "通知SVG图标", example = "<svg>...</svg>")
    private String svgIcon;

    /**
     * 卡片背景颜色（十六进制颜色值）
     */
    @NotBlank(message = "卡片背景颜色不能为空")
    @Size(max = 100, message = "颜色值长度不能超过100个字符")
    @Schema(description = "卡片背景颜色", example = "#FF6B6B", required = true)
    private String cardBackColor;

    /**
     * 家庭ID
     */
    @NotNull(message = "家庭ID不能为空")
    @Schema(description = "家庭ID", example = "1", required = true)
    private Long familyId;

    /**
     * 通知类型（1：系统通知，2：用户通知，3：紧急通知）
     */
    @Schema(description = "通知类型（1：系统通知，2：用户通知，3：紧急通知）", example = "2", allowableValues = {"1", "2", "3"})
    private Integer type = 2;

    /**
     * 模板分类（custom：自定义，system：系统预设）
     */
    @Size(max = 50, message = "分类长度不能超过50个字符")
    @Schema(description = "模板分类", example = "custom")
    private String category = "custom";

    /**
     * 接收人用户ID列表，为空则发送给所有家庭成员
     */
    @Schema(description = "接收人用户ID列表，为空则发送给所有家庭成员", example = "[1, 2]")
    private List<Long> receiverUserIds;

    /**
     * 备注信息
     */
    @Size(max = 500, message = "备注长度不能超过500个字符")
    @Schema(description = "备注信息", example = "重要提醒模版")
    private String remark;
}