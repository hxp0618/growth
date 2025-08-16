package com.growth.entity.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 更新用户个人信息请求
 *
 * @author growth
 * @since 1.0
 */
@Data
public class UpdateUserProfileRequest {

    /**
     * 出生日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("birthDate")
    private LocalDate birthDate;

    /**
     * 身高（厘米）
     */
    @DecimalMin(value = "30.0", message = "身高不能小于30厘米")
    @DecimalMax(value = "300.0", message = "身高不能大于300厘米")
    private BigDecimal height;

    /**
     * 体重（千克）
     */
    @DecimalMin(value = "1.0", message = "体重不能小于1千克")
    @DecimalMax(value = "1000.0", message = "体重不能大于1000千克")
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
    @Min(value = 0, message = "是否怀孕只能为0或1")
    @Max(value = 1, message = "是否怀孕只能为0或1")
    @JsonProperty("isPregnant")
    private Integer isPregnant;

    /**
     * 预产期
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("expectedDeliveryDate")
    private LocalDate expectedDeliveryDate;

    /**
     * 末次月经日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("lastMenstrualPeriod")
    private LocalDate lastMenstrualPeriod;

    /**
     * 孕期备注信息
     */
    private String pregnancyNotes;
}