package com.growth.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.growth.entity.UserDeviceToken;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户设备Token服务接口
 *
 * @author growth
 * @since 1.0
 */
public interface UserDeviceTokenService extends IService<UserDeviceToken> {

    /**
     * 注册或更新设备Token
     *
     * @param userId      用户ID
     * @param deviceToken 设备Token
     * @param platform    平台类型
     * @param deviceInfo  设备信息
     * @param appVersion  应用版本
     * @return 是否成功
     */
    boolean registerOrUpdateToken(Long userId, String deviceToken, String platform, 
                                 String deviceInfo, String appVersion);

    /**
     * 根据用户ID获取活跃的设备Token列表
     *
     * @param userId 用户ID
     * @return 活跃的设备Token列表
     */
    List<UserDeviceToken> getActiveTokensByUserId(Long userId);

    /**
     * 根据用户ID列表获取活跃的设备Token列表
     *
     * @param userIds 用户ID列表
     * @return 活跃的设备Token列表
     */
    List<UserDeviceToken> getActiveTokensByUserIds(List<Long> userIds);

    /**
     * 记录推送成功
     *
     * @param deviceToken 设备Token
     * @return 是否成功
     */
    boolean recordPushSuccess(String deviceToken);

    /**
     * 记录推送失败
     *
     * @param deviceToken 设备Token
     * @return 是否成功
     */
    boolean recordPushFailure(String deviceToken);

    /**
     * 禁用设备Token
     *
     * @param deviceToken    设备Token
     * @param inactiveReason 不活跃原因
     * @return 是否成功
     */
    boolean disableToken(String deviceToken, String inactiveReason);

    /**
     * 批量标记失败Token为不活跃
     *
     * @param failedThreshold 失败次数阈值
     * @return 处理的Token数量
     */
    int deactivateFailedTokens(int failedThreshold);

    /**
     * 更新Token最后活跃时间
     *
     * @param deviceToken    设备Token
     * @param lastActiveTime 最后活跃时间
     * @return 是否成功
     */
    boolean updateLastActiveTime(String deviceToken, LocalDateTime lastActiveTime);

    /**
     * 获取用户的活跃设备数量
     *
     * @param userId 用户ID
     * @return 活跃设备数量
     */
    int getActiveTokenCount(Long userId);

    /**
     * 清理长期不活跃的Token
     *
     * @param thresholdDays 阈值天数
     * @return 清理的Token数量
     */
    int cleanupInactiveTokens(int thresholdDays);

    /**
     * 获取失败Token列表
     *
     * @param failedThreshold 失败次数阈值
     * @return 失败Token列表
     */
    List<UserDeviceToken> getFailedTokens(int failedThreshold);

    /**
     * 重置Token失败计数
     *
     * @param deviceToken 设备Token
     * @return 是否成功
     */
    boolean resetFailureCount(String deviceToken);

    /**
     * 获取Token失败次数
     *
     * @param deviceToken 设备Token
     * @return 失败次数
     */
    int getFailureCount(String deviceToken);

    /**
     * 检查Token是否有效
     *
     * @param deviceToken 设备Token
     * @return 是否有效
     */
    boolean isTokenValid(String deviceToken);

    /**
     * 根据用户ID和平台获取Token
     *
     * @param userId   用户ID
     * @param platform 平台
     * @return Token记录
     */
    UserDeviceToken getTokenByUserIdAndPlatform(Long userId, String platform);
}