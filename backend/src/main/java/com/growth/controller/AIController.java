package com.growth.controller;

import com.growth.common.controller.BaseController;
import com.growth.common.result.Result;
import com.growth.entity.request.ChatRequest;
import com.growth.entity.response.ChatResponse;
import com.growth.service.AIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * AI 聊天控制器
 *
 * @author growth
 * @since 1.0
 */
@Tag(name = "AI聊天", description = "AI聊天相关接口")
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController extends BaseController {

    private final AIService aiService;

    /**
     * AI 聊天
     *
     * @param request 聊天请求
     * @return AI 回复
     */
    @Operation(summary = "AI聊天", description = "与AI进行对话")
    @PostMapping("/chat")
    public Result<com.growth.entity.response.ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        com.growth.entity.response.ChatResponse response = aiService.chat(request);
        return Result.success(response);
    }

    /**
     * 获取健康建议
     *
     * @param userProfile 用户健康信息
     * @param question 健康问题
     * @return 健康建议
     */
    @Operation(summary = "获取健康建议", description = "基于用户信息获取个性化健康建议")
    @PostMapping("/health-advice")
    public Result<com.growth.entity.response.ChatResponse> getHealthAdvice(
            @RequestParam String userProfile,
            @RequestParam String question) {
        com.growth.entity.response.ChatResponse response = aiService.getHealthAdvice(userProfile, question);
        return Result.success(response);
    }

    /**
     * 获取营养建议
     *
     * @param userInfo 用户信息
     * @param dietaryRequirements 饮食需求
     * @return 营养建议
     */
    @Operation(summary = "获取营养建议", description = "基于用户信息获取个性化营养建议")
    @PostMapping("/nutrition-advice")
    public Result<com.growth.entity.response.ChatResponse> getNutritionAdvice(
            @RequestParam String userInfo,
            @RequestParam String dietaryRequirements) {
        com.growth.entity.response.ChatResponse response = aiService.getNutritionAdvice(userInfo, dietaryRequirements);
        return Result.success(response);
    }

    /**
     * 智能问答（基于用户档案）
     *
     * @param request 聊天请求
     * @return AI 回复
     */
    @Operation(summary = "智能问答", description = "基于用户档案的智能问答")
    @PostMapping("/smart-qa")
    public Result<com.growth.entity.response.ChatResponse> smartQA(@Valid @RequestBody ChatRequest request) {
        // 这里可以根据 userId 获取用户档案信息，提供更个性化的回答
        if (request.getUserId() != null) {
            // TODO: 获取用户档案信息，结合用户信息提供更精准的回答
            // UserProfile userProfile = userProfileService.getById(request.getUserId());
            // 可以将用户档案信息加入到提示词中
        }
        
        com.growth.entity.response.ChatResponse response = aiService.chat(request);
        return Result.success(response);
    }

    /**
     * AI 服务健康检查
     *
     * @return 服务状态
     */
    @Operation(summary = "AI服务健康检查", description = "检查AI服务是否正常")
    @GetMapping("/health")
    public Result<String> healthCheck() {
        try {
            ChatRequest testRequest = new ChatRequest();
            testRequest.setMessage("你好");
            com.growth.entity.response.ChatResponse response = aiService.chat(testRequest);
            
            if ("success".equals(response.getStatus())) {
                return Result.success("AI服务正常");
            } else {
                return Result.failure("AI服务异常: " + response.getError());
            }
        } catch (Exception e) {
            return Result.failure("AI服务异常: " + e.getMessage());
        }
    }
}