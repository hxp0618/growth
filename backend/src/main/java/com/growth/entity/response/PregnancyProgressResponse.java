package com.growth.entity.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 孕期进度响应类
 *
 * @author system
 * @since 2024-01-01
 */
@Data
public class PregnancyProgressResponse {

    /**
     * 孕期周数
     */
    private Integer pregnancyWeek;

    /**
     * 进度百分比
     */
    private BigDecimal progressPercentage;

    /**
     * 距离预产期天数
     */
    private Integer daysToDelivery;

    /**
     * 宝宝体重（克）
     */
    private BigDecimal babyWeight;

    /**
     * 水果对比
     */
    private String fruitComparison;

    /**
     * 鼓励话语
     */
    private String encouragementMessage;

    /**
     * 孕期阶段描述
     */
    private String pregnancyStage;

    /**
     * 孕期提示信息
     */
    private String pregnancyTips;

    /**
     * 获取孕期阶段描述
     */
    public String getPregnancyStage() {
        if (pregnancyWeek == null) {
            return "未知阶段";
        }
        if (pregnancyWeek <= 12) {
            return "孕早期";
        } else if (pregnancyWeek <= 28) {
            return "孕中期";
        } else {
            return "孕晚期";
        }
    }

    /**
     * 获取孕期提示信息
     */
    public String getPregnancyTips() {
        if (pregnancyWeek == null) {
            return "";
        }
        if (pregnancyWeek <= 12) {
            return "注意休息，避免剧烈运动，补充叶酸";
        } else if (pregnancyWeek <= 28) {
            return "均衡饮食，适量运动，定期产检";
        } else {
            return "准备待产包，注意胎动，随时准备分娩";
        }
    }
}