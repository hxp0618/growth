package com.growth.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Map;

/**
 * Expo推送消息DTO
 *
 * @author growth
 * @since 1.0
 */
@Data
@Accessors(chain = true)
@Schema(description = "Expo推送消息")
public class ExpoPushMessage {

    /**
     * 目标设备Token
     */
    @JsonProperty("to")
    @Schema(description = "目标设备Token", required = true)
    private String to;

    /**
     * 推送标题
     */
    @JsonProperty("title")
    @Schema(description = "推送标题")
    private String title;

    /**
     * 推送内容
     */
    @JsonProperty("body")
    @Schema(description = "推送内容")
    private String body;

    /**
     * 推送数据
     */
    @JsonProperty("data")
    @Schema(description = "推送数据")
    private Map<String, Object> data;

    /**
     * 推送声音
     */
    @JsonProperty("sound")
    @Schema(description = "推送声音", example = "default")
    private String sound = "default";

    /**
     * 推送优先级
     */
    @JsonProperty("priority")
    @Schema(description = "推送优先级", example = "high")
    private String priority = "normal";

    /**
     * 通知渠道ID（Android）
     */
    @JsonProperty("channelId")
    @Schema(description = "通知渠道ID")
    private String channelId;

    /**
     * 徽章数量（iOS）
     */
    @JsonProperty("badge")
    @Schema(description = "徽章数量")
    private Integer badge;

    /**
     * TTL（生存时间，秒）
     */
    @JsonProperty("ttl")
    @Schema(description = "生存时间（秒）")
    private Integer ttl;

    /**
     * 过期时间（Unix时间戳）
     */
    @JsonProperty("expiration")
    @Schema(description = "过期时间")
    private Long expiration;

    /**
     * 是否可折叠（Android）
     */
    @JsonProperty("collapse_key")
    @Schema(description = "折叠键")
    private String collapseKey;

    /**
     * 创建基础推送消息
     */
    public static ExpoPushMessage create(String deviceToken, String title, String body) {
        return new ExpoPushMessage()
                .setTo(deviceToken)
                .setTitle(title)
                .setBody(body);
    }

    /**
     * 创建带数据的推送消息
     */
    public static ExpoPushMessage createWithData(String deviceToken, String title, String body, 
                                               Map<String, Object> data) {
        return new ExpoPushMessage()
                .setTo(deviceToken)
                .setTitle(title)
                .setBody(body)
                .setData(data);
    }

    /**
     * 设置高优先级
     */
    public ExpoPushMessage setHighPriority() {
        this.priority = "high";
        return this;
    }

    /**
     * 设置普通优先级
     */
    public ExpoPushMessage setNormalPriority() {
        this.priority = "normal";
        return this;
    }

    /**
     * 设置通知渠道
     */
    public ExpoPushMessage setChannel(String channelId) {
        this.channelId = channelId;
        return this;
    }
}