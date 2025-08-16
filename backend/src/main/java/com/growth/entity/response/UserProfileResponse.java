package com.growth.entity.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 用户个人信息响应
 *
 * @author growth
 * @since 1.0
 */
@Data
public class UserProfileResponse {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 出生日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthDate;

    /**
     * 年龄（根据出生日期计算）
     */
    private Integer age;

    /**
     * 身高（厘米）
     */
    private BigDecimal height;

    /**
     * 体重（千克）
     */
    private BigDecimal weight;

    /**
     * BMI指数
     */
    private BigDecimal bmi;

    /**
     * 过敏史
     */
    private String allergies;

    /**
     * 既往病史
     */
    private String medicalHistory;

    /**
     * 是否怀孕（0-否，1-是）
     */
    private Integer isPregnant;

    /**
     * 预产期
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expectedDeliveryDate;

    /**
     * 末次月经日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate lastMenstrualPeriod;

    /**
     * 孕期备注信息
     */
    private String pregnancyNotes;

    /**
     * 孕周（根据末次月经计算）
     */
    private Integer pregnancyWeeks;

    /**
     * 状态（0-禁用，1-启用）
     */
    private Integer status;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
}