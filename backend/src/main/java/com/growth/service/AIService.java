package com.growth.service;

import com.growth.entity.request.ChatRequest;
import com.growth.entity.response.ChatResponse;

/**
 * AI 服务接口
 *
 * @author growth
 * @since 1.0
 */
public interface AIService {

    /**
     * 发送聊天消息并获取 AI 回复
     *
     * @param request 聊天请求
     * @return AI 回复响应
     */
    com.growth.entity.response.ChatResponse chat(ChatRequest request);

    /**
     * 流式聊天（实时返回）
     *
     * @param request 聊天请求
     * @return 流式响应
     */
    // Flux<String> streamChat(ChatRequest request);

    /**
     * 获取健康建议
     *
     * @param userProfile 用户健康信息
     * @param question 用户问题
     * @return 健康建议
     */
    com.growth.entity.response.ChatResponse getHealthAdvice(String userProfile, String question);

    /**
     * 获取营养建议
     *
     * @param userInfo 用户信息
     * @param dietaryRequirements 饮食要求
     * @return 营养建议
     */
    com.growth.entity.response.ChatResponse getNutritionAdvice(String userInfo, String dietaryRequirements);
}