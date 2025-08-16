package com.growth.common.result;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;

/**
 * 统一响应体
 *
 * @author growth
 * @since 1.0
 */
@Data
@Accessors(chain = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result<T> implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 状态码
     */
    private Integer code;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    /**
     * 请求时间戳
     */
    private Long timestamp;

    /**
     * 请求追踪ID
     */
    private String traceId;

    public Result() {
        this.timestamp = System.currentTimeMillis();
    }

    public Result(Integer code, String message) {
        this();
        this.code = code;
        this.message = message;
    }

    public Result(Integer code, String message, T data) {
        this(code, message);
        this.data = data;
    }

    public Result(ResultCode resultCode) {
        this(resultCode.getCode(), resultCode.getMessage());
    }

    public Result(ResultCode resultCode, T data) {
        this(resultCode.getCode(), resultCode.getMessage(), data);
    }

    /**
     * 成功响应
     */
    public static <T> Result<T> success() {
        return new Result<>(ResultCode.SUCCESS);
    }

    /**
     * 成功响应带数据
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(ResultCode.SUCCESS, data);
    }

    /**
     * 成功响应带消息和数据
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), message, data);
    }

    /**
     * 失败响应
     */
    public static <T> Result<T> failure() {
        return new Result<>(ResultCode.FAILURE);
    }

    /**
     * 失败响应带消息
     */
    public static <T> Result<T> failure(String message) {
        return new Result<>(ResultCode.FAILURE.getCode(), message);
    }

    /**
     * 失败响应带结果码
     */
    public static <T> Result<T> failure(ResultCode resultCode) {
        return new Result<>(resultCode);
    }

    /**
     * 失败响应带结果码和数据
     */
    public static <T> Result<T> failure(ResultCode resultCode, T data) {
        return new Result<>(resultCode, data);
    }

    /**
     * 失败响应带状态码和消息
     */
    public static <T> Result<T> failure(Integer code, String message) {
        return new Result<>(code, message);
    }

    /**
     * 自定义响应
     */
    public static <T> Result<T> result(Integer code, String message, T data) {
        return new Result<>(code, message, data);
    }

    /**
     * 自定义响应（无数据）
     */
    public static <T> Result<T> result(Integer code, String message) {
        return new Result<>(code, message);
    }

    /**
     * 判断是否成功
     */
    public boolean isSuccess() {
        return ResultCode.SUCCESS.getCode().equals(this.code);
    }

    /**
     * 判断是否失败
     */
    public boolean isFailure() {
        return !isSuccess();
    }
}
