package com.growth.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.growth.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 用户个人信息实体类
 *
 * @author growth
 * @since 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user_profiles")
public class UserProfile extends BaseEntity {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 出生日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthDate;

    /**
     * 身高（厘米）
     */
    private BigDecimal height;

    /**
     * 体重（千克）
     */
    private BigDecimal weight;

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
     * 状态（0-禁用，1-启用）
     */
    private Integer status;
}