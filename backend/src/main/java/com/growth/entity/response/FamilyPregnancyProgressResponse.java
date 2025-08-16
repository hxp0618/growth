package com.growth.entity.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 家庭孕妇进度响应类
 *
 * @author growth
 * @since 1.0
 */
@Data
@Accessors(chain = true)
@Schema(description = "家庭孕妇进度响应")
public class FamilyPregnancyProgressResponse {

    /**
     * 家庭ID
     */
    @Schema(description = "家庭ID")
    private Long familyId;

    /**
     * 家庭名称
     */
    @Schema(description = "家庭名称")
    private String familyName;

    /**
     * 孕妇信息列表
     */
    @Schema(description = "孕妇信息列表")
    private List<PregnantWomanInfo> pregnantWomen;

    /**
     * 孕妇信息内部类
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "孕妇信息")
    public static class PregnantWomanInfo {

        /**
         * 用户ID
         */
        @Schema(description = "用户ID")
        private Long userId;

        /**
         * 用户昵称
         */
        @Schema(description = "用户昵称")
        private String nickname;

        /**
         * 用户头像
         */
        @Schema(description = "用户头像")
        private String avatar;

        /**
         * 在家庭中的角色名称
         */
        @Schema(description = "家庭角色名称")
        private String roleName;

        /**
         * 预产期
         */
        @JsonFormat(pattern = "yyyy-MM-dd")
        @Schema(description = "预产期")
        private LocalDate expectedDeliveryDate;

        /**
         * 末次月经日期
         */
        @JsonFormat(pattern = "yyyy-MM-dd")
        @Schema(description = "末次月经日期")
        private LocalDate lastMenstrualPeriod;

        /**
         * 孕期备注信息
         */
        @Schema(description = "孕期备注信息")
        private String pregnancyNotes;

        /**
         * 孕期进度信息
         */
        @Schema(description = "孕期进度信息")
        private PregnancyProgressInfo pregnancyProgress;
    }

    /**
     * 孕期进度信息内部类
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "孕期进度信息")
    public static class PregnancyProgressInfo {

        /**
         * 孕期周数
         */
        @Schema(description = "孕期周数")
        private Integer pregnancyWeek;

        /**
         * 进度百分比
         */
        @Schema(description = "进度百分比")
        private BigDecimal progressPercentage;

        /**
         * 距离预产期天数
         */
        @Schema(description = "距离预产期天数")
        private Integer daysToDelivery;

        /**
         * 宝宝体重（克）
         */
        @Schema(description = "宝宝体重（克）")
        private BigDecimal babyWeight;

        /**
         * 水果对比
         */
        @Schema(description = "水果对比")
        private String fruitComparison;

        /**
         * 鼓励话语
         */
        @Schema(description = "鼓励话语")
        private String encouragementMessage;

        /**
         * 孕期阶段
         */
        @Schema(description = "孕期阶段")
        private String pregnancyStage;

        /**
         * 孕期提示
         */
        @Schema(description = "孕期提示")
        private String pregnancyTips;
    }
}