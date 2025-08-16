package com.growth.common.result;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 响应状态码枚举
 *
 * @author growth
 * @since 1.0
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    // 成功
    SUCCESS(200, "操作成功"),

    // 客户端错误
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不允许"),
    REQUEST_TIMEOUT(408, "请求超时"),
    CONFLICT(409, "资源冲突"),
    UNSUPPORTED_MEDIA_TYPE(415, "不支持的媒体类型"),
    TOO_MANY_REQUESTS(429, "请求过于频繁"),

    // 服务器错误
    FAILURE(500, "系统异常"),
    SERVICE_UNAVAILABLE(503, "服务不可用"),

    // 业务错误码 (1000-1999)
    BUSINESS_ERROR(1000, "业务异常"),
    VALIDATION_ERROR(1001, "参数校验失败"),
    DATA_NOT_FOUND(1002, "数据不存在"),
    DATA_EXISTS(1003, "数据已存在"),
    DATA_ERROR(1004, "数据异常"),
    OPERATION_ERROR(1005, "操作失败"),

    // 认证授权错误码 (2000-2999)
    LOGIN_REQUIRED(2000, "请先登录"),
    LOGIN_ERROR(2001, "用户名或密码错误"),
    ACCOUNT_DISABLED(2002, "账户已被禁用"),
    ACCOUNT_LOCKED(2003, "账户已被锁定"),
    PASSWORD_EXPIRED(2004, "密码已过期"),
    TOKEN_EXPIRED(2005, "令牌已过期"),
    TOKEN_INVALID(2006, "令牌无效"),
    PERMISSION_DENIED(2007, "权限不足"),

    // 文件操作错误码 (3000-3999)
    FILE_NOT_FOUND(3000, "文件不存在"),
    FILE_UPLOAD_ERROR(3001, "文件上传失败"),
    FILE_DELETE_ERROR(3002, "文件删除失败"),
    FILE_SIZE_LIMIT(3003, "文件大小超出限制"),
    FILE_TYPE_ERROR(3004, "文件类型不支持"),

    // 外部服务错误码 (4000-4999)
    EXTERNAL_SERVICE_ERROR(4000, "外部服务异常"),
    NETWORK_ERROR(4001, "网络连接异常"),
    TIMEOUT_ERROR(4002, "请求超时"),

    // 数据库错误码 (5000-5999)
    DATABASE_ERROR(5000, "数据库异常"),
    DATA_INTEGRITY_ERROR(5001, "数据完整性异常"),
    DUPLICATE_KEY_ERROR(5002, "数据重复"),

    // 缓存错误码 (6000-6999)
    CACHE_ERROR(6000, "缓存异常"),
    CACHE_KEY_NOT_FOUND(6001, "缓存键不存在"),

    // 消息队列错误码 (7000-7999)
    MQ_ERROR(7000, "消息队列异常"),
    MESSAGE_SEND_ERROR(7001, "消息发送失败"),
    MESSAGE_CONSUME_ERROR(7002, "消息消费失败");

    /**
     * 状态码
     */
    private final Integer code;

    /**
     * 响应消息
     */
    private final String message;

    /**
     * 根据状态码获取枚举
     */
    public static ResultCode getByCode(Integer code) {
        for (ResultCode resultCode : values()) {
            if (resultCode.getCode().equals(code)) {
                return resultCode;
            }
        }
        return FAILURE;
    }
}