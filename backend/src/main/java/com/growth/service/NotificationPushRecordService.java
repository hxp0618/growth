package com.growth.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.growth.common.controller.BaseController;
import com.growth.entity.FamilyNotification;
import com.growth.entity.NotificationPushRecord;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 通知推送记录服务接口
 *
 * @author growth
 * @since 1.0
 */
public interface NotificationPushRecordService extends IService<NotificationPushRecord> {

    /**
     * 创建推送记录
     *
     * @param template     通知模版
     * @param senderId     发送者ID
     * @param receiverIds  接收者ID列表
     * @return 推送记录列表
     */
    List<NotificationPushRecord> createPushRecords(FamilyNotification template, Long senderId, List<Long> receiverIds);

    /**
     * 执行推送
     *
     * @param pushRecords 推送记录列表
     * @return 是否成功
     */
    boolean executePush(List<NotificationPushRecord> pushRecords);

    /**
     * 标记消息为已读
     *
     * @param id     记录ID
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean markAsRead(Long id, Long userId);

    /**
     * 批量标记消息为已读
     *
     * @param ids    记录ID列表
     * @param userId 用户ID
     * @return 成功数量
     */
    int batchMarkAsRead(List<Long> ids, Long userId);

    /**
     * 更新推送状态
     *
     * @param id           记录ID
     * @param pushStatus   推送状态
     * @param pushResponse 推送响应
     * @param errorCode    错误代码
     * @param errorMessage 错误信息
     * @return 是否成功
     */
    boolean updatePushStatus(Long id, Integer pushStatus, String pushResponse, String errorCode, String errorMessage);

    /**
     * 分页查询推送记录
     *
     * @param pageRequest 分页请求
     * @param templateId  模版ID（可选）
     * @param senderId    发送者ID（可选）
     * @param receiverId  接收者ID（可选）
     * @param familyId    家庭ID（可选）
     * @param pushStatus  推送状态（可选）
     * @param isRead      是否已读（可选）
     * @param startTime   开始时间（可选）
     * @param endTime     结束时间（可选）
     * @param userId      当前用户ID
     * @return 推送记录分页结果
     */
    IPage<NotificationPushRecord> getPushRecordPage(BaseController.PageRequest pageRequest,
                                                    Long templateId,
                                                    Long senderId,
                                                    Long receiverId,
                                                    Long familyId,
                                                    Integer pushStatus,
                                                    Boolean isRead,
                                                    LocalDateTime startTime,
                                                    LocalDateTime endTime,
                                                    Long userId);

    /**
     * 获取用户的通知列表
     *
     * @param userId   用户ID
     * @param familyId 家庭ID（可选）
     * @param isRead   是否已读（可选）
     * @param limit    限制数量
     * @return 通知列表
     */
    List<NotificationPushRecord> getUserNotifications(Long userId, Long familyId, Boolean isRead, Integer limit);

    /**
     * 获取用户未读消息数量
     *
     * @param userId   用户ID
     * @param familyId 家庭ID（可选）
     * @return 未读消息数量
     */
    int getUnreadCount(Long userId, Long familyId);

    /**
     * 重试失败的推送
     *
     * @param maxRetryCount 最大重试次数
     * @return 重试结果
     */
    boolean retryFailedPushes(Integer maxRetryCount);

    /**
     * 检查用户是否有权限访问该推送记录
     *
     * @param recordId 记录ID
     * @param userId   用户ID
     * @return 是否有权限
     */
    boolean checkRecordPermission(Long recordId, Long userId);

    /**
     * 获取模版的推送统计信息
     *
     * @param templateId 模版ID
     * @param userId     当前用户ID
     * @return 统计信息
     */
    Object getTemplateStats(Long templateId, Long userId);
}