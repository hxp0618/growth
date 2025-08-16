package com.growth.entity.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 创建孕期进度请求类
 *
 * @author system
 * @since 2024-01-01
 */
@Data
public class CreatePregnancyProgressRequest {

    /**
     * 孕期周数
     */
    @NotNull(message = "孕期周数不能为空")
    @Min(value = 1, message = "孕期周数不能小于1")
    @Max(value = 42, message = "孕期周数不能大于42")
    private Integer pregnancyWeek;

    /**
     * 进度百分比
     */
    @NotNull(message = "进度百分比不能为空")
    @DecimalMin(value = "0.00", message = "进度百分比不能小于0")
    @DecimalMax(value = "100.00", message = "进度百分比不能大于100")
    private BigDecimal progressPercentage;

    /**
     * 距离预产期天数
     */
    @NotNull(message = "距离预产期天数不能为空")
    @Min(value = 0, message = "距离预产期天数不能小于0")
    private Integer daysToDelivery;

    /**
     * 宝宝体重（克）
     */
    @DecimalMin(value = "0.00", message = "宝宝体重不能小于0")
    private BigDecimal babyWeight;

    /**
     * 水果对比
     */
    @Size(max = 50, message = "水果对比长度不能超过50个字符")
    private String fruitComparison;

    /**
     * 鼓励话语
     */
    @Size(max = 500, message = "鼓励话语长度不能超过500个字符")
    private String encouragementMessage;

    /**
     * 宝宝昵称
     */
    @Size(max = 50, message = "宝宝昵称长度不能超过50个字符")
    private String babyName;

    /**
     * 记录日期
     */
    private LocalDate recordDate;
}