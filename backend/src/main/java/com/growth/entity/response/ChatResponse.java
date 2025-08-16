package com.growth.entity.response;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * AI 聊天响应 DTO
 *
 * @author growth
 * @since 1.0
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponse {

    /**
     * AI 回复内容
     */
    private String reply;

    /**
     * 会话ID
     */
    private String conversationId;

    /**
     * 响应时间
     */
    private LocalDateTime responseTime;

    /**
     * 使用的模型
     */
    private String model;

    /**
     * 消耗的 token 数量
     */
    private Integer tokenUsage;

    /**
     * 响应状态（成功/失败）
     */
    private String status;

    /**
     * 错误信息（如果有）
     */
    private String error;
}