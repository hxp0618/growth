package com.growth.entity.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * AI 聊天请求 DTO
 *
 * @author growth
 * @since 1.0
 */
@Data
public class ChatRequest {

    /**
     * 用户消息
     */
    @NotBlank(message = "消息内容不能为空")
    @Size(max = 2000, message = "消息内容不能超过2000个字符")
    private String message;

    /**
     * 会话ID（可选，用于上下文对话）
     */
    private String conversationId;

    /**
     * 用户ID（可选，用于个性化服务）
     */
    private Long userId;
}