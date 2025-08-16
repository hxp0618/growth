package com.growth.common.advice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.growth.common.result.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * 统一响应体处理器
 * 自动包装Controller返回值为统一响应格式
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@RestControllerAdvice(basePackages = "com.growth.controller")
@RequiredArgsConstructor
public class ResultHandlerAdvice implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper;

    @Override
    public boolean supports(@NotNull MethodParameter returnType, @NotNull Class<? extends HttpMessageConverter<?>> converterType) {
        // 支持所有返回类型
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, @NotNull MethodParameter returnType, @NotNull MediaType selectedContentType, 
                                  @NotNull Class<? extends HttpMessageConverter<?>> selectedConverterType, 
                                  @NotNull ServerHttpRequest request, @NotNull ServerHttpResponse response) {
        
        // 如果响应的Content-Type为JSON格式
        if (MediaType.APPLICATION_JSON.equals(selectedContentType) || 
            selectedContentType.includes(MediaType.APPLICATION_JSON)) {
            
            // 如果已经是Result类型，直接返回
            if (body instanceof Result) {
                return body;
            }
            
            // 如果是String类型，需要特殊处理，避免类型转换异常
            if (body instanceof String) {
                try {
                    Result<Object> result = Result.success(body);
                    return objectMapper.writeValueAsString(result);
                } catch (JsonProcessingException e) {
                    log.error("String类型响应体包装失败", e);
                    return body;
                }
            }
            
            // 其他类型包装为成功响应
            return Result.success(body);
        }
        
        // 非JSON格式直接返回原始响应体
        return body;
    }
}