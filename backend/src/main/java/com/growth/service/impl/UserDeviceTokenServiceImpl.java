package com.growth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.growth.dao.UserDeviceTokenMapper;
import com.growth.entity.UserDeviceToken;
import com.growth.service.UserDeviceTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户设备Token服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserDeviceTokenServiceImpl extends ServiceImpl<UserDeviceTokenMapper, UserDeviceToken> 
        implements UserDeviceTokenService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean registerOrUpdateToken(Long userId, String deviceToken, String platform, 
                                        String deviceInfo, String appVersion) {
        try {
            // 检查是否已存在相同的Token
            UserDeviceToken existingToken = this.getOne(
                new LambdaQueryWrapper<UserDeviceToken>()
                    .eq(UserDeviceToken::getDeviceToken, deviceToken)
                    .eq(UserDeviceToken::getIsDeleted, false)
            );

            LocalDateTime now = LocalDateTime.now();

            if (existingToken != null) {
                // 更新现有Token
                existingToken.setUserId(userId)
                    .setPlatform(platform)
                    .setDeviceInfo(deviceInfo)
                    .setAppVersion(appVersion)
                    .setLastActiveTime(now)
                    .setStatus(1)
                    .setPushEnabled(true)
                    .setFailedCount(0)
                    .setLastSuccessTime(now)
                    .setInactiveReason(null);

                boolean result = this.updateById(existingToken);
                if (result) {
                    log.info("更新设备Token成功: userId={}, platform={}, token={}", 
                        userId, platform, maskToken(deviceToken));
                }
                return result;
            } else {
                // 创建新Token
                UserDeviceToken newToken = new UserDeviceToken()
                    .setUserId(userId)
                    .setDeviceToken(deviceToken)
                    .setPlatform(platform)
                    .setDeviceInfo(deviceInfo)
                    .setAppVersion(appVersion)
                    .setPushEnabled(true)
                    .setLastActiveTime(now)
                    .setStatus(1)
                    .setFailedCount(0)
                    .setLastSuccessTime(now);

                boolean result = this.save(newToken);
                if (result) {
                    log.info("注册设备Token成功: userId={}, platform={}, token={}", 
                        userId, platform, maskToken(deviceToken));
                }
                return result;
            }
        } catch (Exception e) {
            log.error("注册或更新设备Token失败: userId={}, platform={}, token={}", 
                userId, platform, maskToken(deviceToken), e);
            return false;
        }
    }

    @Override
    public List<UserDeviceToken> getActiveTokensByUserId(Long userId) {
        return baseMapper.selectActiveTokensByUserId(userId);
    }

    @Override
    public List<UserDeviceToken> getActiveTokensByUserIds(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }
        return baseMapper.selectActiveTokensByUserIds(userIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordPushSuccess(String deviceToken) {
        try {
            int result = baseMapper.updateFailureCount(deviceToken, false, LocalDateTime.now());
            if (result > 0) {
                log.debug("记录推送成功: token={}", maskToken(deviceToken));
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("记录推送成功失败: token={}", maskToken(deviceToken), e);
            return false;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordPushFailure(String deviceToken) {
        try {
            int result = baseMapper.updateFailureCount(deviceToken, true, LocalDateTime.now());
            if (result > 0) {
                log.debug("记录推送失败: token={}", maskToken(deviceToken));
                
                // 检查是否达到失败阈值
                UserDeviceToken token = this.getOne(
                    new LambdaQueryWrapper<UserDeviceToken>()
                        .eq(UserDeviceToken::getDeviceToken, deviceToken)
                        .eq(UserDeviceToken::getIsDeleted, false)
                );
                
                if (token != null && token.getFailedCount() != null && token.getFailedCount() >= 6) {
                    disableToken(deviceToken, "推送失败次数过多");
                }
                
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("记录推送失败失败: token={}", maskToken(deviceToken), e);
            return false;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean disableToken(String deviceToken, String inactiveReason) {
        try {
            int result = baseMapper.disableTokenByDeviceToken(deviceToken, inactiveReason, LocalDateTime.now());
            if (result > 0) {
                log.info("禁用设备Token: token={}, reason={}", maskToken(deviceToken), inactiveReason);
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("禁用设备Token失败: token={}, reason={}", maskToken(deviceToken), inactiveReason, e);
            return false;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int deactivateFailedTokens(int failedThreshold) {
        try {
            int result = baseMapper.batchDeactivateFailedTokens(
                failedThreshold, 
                "推送失败次数过多", 
                LocalDateTime.now()
            );
            if (result > 0) {
                log.info("批量标记失败Token为不活跃: count={}, threshold={}", result, failedThreshold);
            }
            return result;
        } catch (Exception e) {
            log.error("批量标记失败Token为不活跃失败: threshold={}", failedThreshold, e);
            return 0;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateLastActiveTime(String deviceToken, LocalDateTime lastActiveTime) {
        try {
            int result = baseMapper.updateLastActiveTime(deviceToken, lastActiveTime);
            return result > 0;
        } catch (Exception e) {
            log.error("更新Token最后活跃时间失败: token={}", maskToken(deviceToken), e);
            return false;
        }
    }

    @Override
    public int getActiveTokenCount(Long userId) {
        try {
            return baseMapper.countActiveTokensByUserId(userId);
        } catch (Exception e) {
            log.error("获取用户活跃设备数量失败: userId={}", userId, e);
            return 0;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int cleanupInactiveTokens(int thresholdDays) {
        try {
            int result = baseMapper.cleanupInactiveTokens(thresholdDays, LocalDateTime.now());
            if (result > 0) {
                log.info("清理长期不活跃Token: count={}, thresholdDays={}", result, thresholdDays);
            }
            return result;
        } catch (Exception e) {
            log.error("清理长期不活跃Token失败: thresholdDays={}", thresholdDays, e);
            return 0;
        }
    }

    @Override
    public List<UserDeviceToken> getFailedTokens(int failedThreshold) {
        try {
            return baseMapper.selectFailedTokens(failedThreshold);
        } catch (Exception e) {
            log.error("获取失败Token列表失败: threshold={}", failedThreshold, e);
            return List.of();
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean resetFailureCount(String deviceToken) {
        return recordPushSuccess(deviceToken);
    }

    @Override
    public int getFailureCount(String deviceToken) {
        try {
            UserDeviceToken token = this.getOne(
                new LambdaQueryWrapper<UserDeviceToken>()
                    .eq(UserDeviceToken::getDeviceToken, deviceToken)
                    .eq(UserDeviceToken::getIsDeleted, false)
            );
            return token != null && token.getFailedCount() != null ? token.getFailedCount() : 0;
        } catch (Exception e) {
            log.error("获取Token失败次数失败: token={}", maskToken(deviceToken), e);
            return 0;
        }
    }

    @Override
    public boolean isTokenValid(String deviceToken) {
        try {
            UserDeviceToken token = this.getOne(
                new LambdaQueryWrapper<UserDeviceToken>()
                    .eq(UserDeviceToken::getDeviceToken, deviceToken)
                    .eq(UserDeviceToken::getStatus, 1)
                    .eq(UserDeviceToken::getPushEnabled, true)
                    .lt(UserDeviceToken::getFailedCount, 6)
                    .eq(UserDeviceToken::getIsDeleted, false)
            );
            return token != null;
        } catch (Exception e) {
            log.error("检查Token有效性失败: token={}", maskToken(deviceToken), e);
            return false;
        }
    }

    @Override
    public UserDeviceToken getTokenByUserIdAndPlatform(Long userId, String platform) {
        try {
            return baseMapper.selectByUserIdAndPlatform(userId, platform);
        } catch (Exception e) {
            log.error("根据用户ID和平台获取Token失败: userId={}, platform={}", userId, platform, e);
            return null;
        }
    }

    /**
     * 遮蔽Token敏感信息用于日志记录
     */
    private String maskToken(String token) {
        if (!StringUtils.hasText(token)) {
            return "null";
        }
        if (token.length() <= 10) {
            return "***";
        }
        return token.substring(0, 10) + "***" + token.substring(token.length() - 4);
    }
}