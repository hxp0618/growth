package com.growth.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * Expo推送响应DTO
 *
 * @author growth
 * @since 1.0
 */
@Data
@Accessors(chain = true)
@Schema(description = "Expo推送响应")
public class ExpoPushResponse {

    /**
     * 推送结果列表
     */
    @JsonProperty("data")
    @Schema(description = "推送结果列表")
    private List<ExpoPushTicket> data;

    /**
     * 错误信息
     */
    @JsonProperty("errors")
    @Schema(description = "错误信息")
    private List<ExpoPushError> errors;

    /**
     * Expo推送票据
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "Expo推送票据")
    public static class ExpoPushTicket {

        /**
         * 推送状态（ok/error）
         */
        @JsonProperty("status")
        @Schema(description = "推送状态")
        private String status;

        /**
         * 推送ID（用于后续查询推送状态）
         */
        @JsonProperty("id")
        @Schema(description = "推送ID")
        private String id;

        /**
         * 错误信息（当status为error时）
         */
        @JsonProperty("message")
        @Schema(description = "错误信息")
        private String message;

        /**
         * 错误详情
         */
        @JsonProperty("details")
        @Schema(description = "错误详情")
        private ExpoPushErrorDetails details;

        /**
         * 是否成功
         */
        public boolean isSuccess() {
            return "ok".equals(status);
        }

        /**
         * 是否失败
         */
        public boolean isError() {
            return "error".equals(status);
        }
    }

    /**
     * Expo推送错误详情
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "Expo推送错误详情")
    public static class ExpoPushErrorDetails {

        /**
         * 错误代码
         */
        @JsonProperty("error")
        @Schema(description = "错误代码")
        private String error;

        /**
         * 错误消息
         */
        @JsonProperty("message")
        @Schema(description = "错误消息")
        private String message;

        /**
         * 是否为设备未注册错误
         */
        public boolean isDeviceNotRegistered() {
            return "DeviceNotRegistered".equals(error);
        }

        /**
         * 是否为Token无效错误
         */
        public boolean isInvalidCredentials() {
            return "InvalidCredentials".equals(error);
        }

        /**
         * 是否为消息过大错误
         */
        public boolean isMessageTooBig() {
            return "MessageTooBig".equals(error);
        }

        /**
         * 是否为频率限制错误
         */
        public boolean isMessageRateExceeded() {
            return "MessageRateExceeded".equals(error);
        }
    }

    /**
     * Expo推送错误
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "Expo推送错误")
    public static class ExpoPushError {

        /**
         * 错误代码
         */
        @JsonProperty("code")
        @Schema(description = "错误代码")
        private String code;

        /**
         * 错误消息
         */
        @JsonProperty("message")
        @Schema(description = "错误消息")
        private String message;
    }

    /**
     * 是否有错误
     */
    public boolean hasErrors() {
        return errors != null && !errors.isEmpty();
    }

    /**
     * 获取成功的推送数量
     */
    public int getSuccessCount() {
        if (data == null) {
            return 0;
        }
        return (int) data.stream().filter(ExpoPushTicket::isSuccess).count();
    }

    /**
     * 获取失败的推送数量
     */
    public int getFailureCount() {
        if (data == null) {
            return 0;
        }
        return (int) data.stream().filter(ExpoPushTicket::isError).count();
    }

    /**
     * 获取总推送数量
     */
    public int getTotalCount() {
        return data != null ? data.size() : 0;
    }

    /**
     * 是否全部成功
     */
    public boolean isAllSuccess() {
        return !hasErrors() && getTotalCount() > 0 && getFailureCount() == 0;
    }

    /**
     * 是否有部分成功
     */
    public boolean hasPartialSuccess() {
        return getSuccessCount() > 0 && getFailureCount() > 0;
    }
}