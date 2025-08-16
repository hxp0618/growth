package com.growth.service.impl;

import com.growth.entity.request.ChatRequest;
import com.growth.entity.response.ChatResponse;
import com.growth.service.AIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * AI 服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    // private final ChatClient chatClient;

    @Override
    public ChatResponse chat(ChatRequest request) {
        log.info("收到聊天请求: {}", request.getMessage());
        
        // TODO: 临时返回固定响应，等AI依赖修复后再实现
        return com.growth.entity.response.ChatResponse.builder()
                .reply("AI服务暂时不可用，请稍后再试。")
                .conversationId(request.getConversationId() != null ?
                        request.getConversationId() : UUID.randomUUID().toString())
                .responseTime(LocalDateTime.now())
                .model("temp")
                .status("success")
                .build();
    }

    @Override
    public ChatResponse getHealthAdvice(String userProfile, String question) {
        log.info("获取健康建议请求 - 用户信息: {}, 问题: {}", userProfile, question);
        
        // TODO: 临时返回固定响应，等AI依赖修复后再实现
        return com.growth.entity.response.ChatResponse.builder()
                .reply("健康建议服务暂时不可用，请咨询专业医生。")
                .conversationId(UUID.randomUUID().toString())
                .responseTime(LocalDateTime.now())
                .model("temp")
                .status("success")
                .build();
    }

    @Override
    public ChatResponse getNutritionAdvice(String userInfo, String dietaryRequirements) {
        log.info("获取营养建议请求 - 用户信息: {}, 饮食需求: {}", userInfo, dietaryRequirements);
        
        // TODO: 临时返回固定响应，等AI依赖修复后再实现
        return com.growth.entity.response.ChatResponse.builder()
                .reply("营养建议服务暂时不可用，请咨询专业营养师。")
                .conversationId(UUID.randomUUID().toString())
                .responseTime(LocalDateTime.now())
                .model("temp")
                .status("success")
                .build();
    }
}
