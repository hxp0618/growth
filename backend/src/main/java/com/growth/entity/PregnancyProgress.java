package com.growth.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.growth.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 孕期进度实体类
 *
 * @author system
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("pregnancy_progress")
public class PregnancyProgress extends BaseEntity {

    /**
     * 孕期周数
     */
    @TableField("pregnancy_week")
    private Integer pregnancyWeek;

    /**
     * 进度百分比
     */
    @TableField("progress_percentage")
    private BigDecimal progressPercentage;

    /**
     * 距离预产期天数
     */
    @TableField("days_to_delivery")
    private Integer daysToDelivery;

    /**
     * 宝宝体重（克）
     */
    @TableField("baby_weight")
    private BigDecimal babyWeight;

    /**
     * 水果对比
     */
    @TableField("fruit_comparison")
    private String fruitComparison;

    /**
     * 鼓励话语
     */
    @TableField("encouragement_message")
    private String encouragementMessage;

    /**
     * 状态（0-禁用，1-启用）
     */
    @TableField("status")
    private Integer status;
}