package com.growth.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.growth.entity.UserDeviceToken;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户设备Token Mapper接口
 *
 * @author growth
 * @since 1.0
 */
@Mapper
public interface UserDeviceTokenMapper extends BaseMapper<UserDeviceToken> {

    /**
     * 根据用户ID获取活跃的设备Token列表
     *
     * @param userId 用户ID
     * @return 活跃的设备Token列表
     */
    List<UserDeviceToken> selectActiveTokensByUserId(@Param("userId") Long userId);

    /**
     * 根据用户ID列表获取活跃的设备Token列表
     *
     * @param userIds 用户ID列表
     * @return 活跃的设备Token列表
     */
    List<UserDeviceToken> selectActiveTokensByUserIds(@Param("userIds") List<Long> userIds);

    /**
     * 根据设备Token更新失败次数
     *
     * @param deviceToken 设备Token
     * @param increment   是否增加失败次数（true：+1，false：重置为0）
     * @param currentTime 当前时间
     * @return 更新行数
     */
    int updateFailureCount(@Param("deviceToken") String deviceToken,
                          @Param("increment") boolean increment,
                          @Param("currentTime") LocalDateTime currentTime);

    /**
     * 批量标记Token为不活跃
     *
     * @param failedThreshold 失败次数阈值
     * @param inactiveReason  不活跃原因
     * @param currentTime     当前时间
     * @return 更新行数
     */
    int batchDeactivateFailedTokens(@Param("failedThreshold") int failedThreshold,
                                   @Param("inactiveReason") String inactiveReason,
                                   @Param("currentTime") LocalDateTime currentTime);

    /**
     * 根据设备Token禁用Token
     *
     * @param deviceToken    设备Token
     * @param inactiveReason 不活跃原因
     * @param currentTime    当前时间
     * @return 更新行数
     */
    int disableTokenByDeviceToken(@Param("deviceToken") String deviceToken,
                                 @Param("inactiveReason") String inactiveReason,
                                 @Param("currentTime") LocalDateTime currentTime);

    /**
     * 更新Token最后活跃时间
     *
     * @param deviceToken    设备Token
     * @param lastActiveTime 最后活跃时间
     * @return 更新行数
     */
    int updateLastActiveTime(@Param("deviceToken") String deviceToken,
                            @Param("lastActiveTime") LocalDateTime lastActiveTime);

    /**
     * 根据用户ID和平台查找Token
     *
     * @param userId   用户ID
     * @param platform 平台
     * @return Token记录
     */
    UserDeviceToken selectByUserIdAndPlatform(@Param("userId") Long userId,
                                             @Param("platform") String platform);

    /**
     * 清理长期不活跃的Token记录
     *
     * @param thresholdDays 阈值天数
     * @param currentTime   当前时间
     * @return 删除行数
     */
    int cleanupInactiveTokens(@Param("thresholdDays") int thresholdDays,
                             @Param("currentTime") LocalDateTime currentTime);

    /**
     * 统计用户的活跃设备数量
     *
     * @param userId 用户ID
     * @return 活跃设备数量
     */
    int countActiveTokensByUserId(@Param("userId") Long userId);

    /**
     * 获取失败次数超过阈值的Token列表
     *
     * @param failedThreshold 失败次数阈值
     * @return Token列表
     */
    List<UserDeviceToken> selectFailedTokens(@Param("failedThreshold") int failedThreshold);
}