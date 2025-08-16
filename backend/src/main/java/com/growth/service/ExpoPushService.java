package com.growth.service;

import com.growth.entity.FamilyNotification;
import com.growth.entity.NotificationPushRecord;
import com.growth.entity.UserDeviceToken;
import com.growth.entity.dto.ExpoPushMessage;
import com.growth.entity.dto.ExpoPushResponse;

import java.util.List;
import java.util.Map;

/**
 * Expo推送服务接口
 *
 * @author growth
 * @since 1.0
 */
public interface ExpoPushService {

    /**
     * 发送单条推送消息
     *
     * @param message 推送消息
     * @return 推送响应
     */
    ExpoPushResponse sendMessage(ExpoPushMessage message);

    /**
     * 批量发送推送消息
     *
     * @param messages 推送消息列表
     * @return 推送响应
     */
    ExpoPushResponse sendMessages(List<ExpoPushMessage> messages);

    /**
     * 发送推送记录列表（新架构）
     *
     * @param pushRecords 推送记录列表
     * @return 推送结果
     */
    boolean sendPushRecords(List<NotificationPushRecord> pushRecords);

    /**
     * 发送立即通知
     *
     * @param notification 通知对象
     * @param receiverIds  接收者ID列表（为空则发送给所有家庭成员）
     * @return 推送结果
     */
    boolean sendImmediateNotification(FamilyNotification notification, List<Long> receiverIds);

    /**
     * 发送定时通知
     *
     * @param notification 通知对象
     * @return 推送结果
     */
    boolean sendScheduledNotification(FamilyNotification notification);

    /**
     * 构建推送消息
     *
     * @param notification 通知对象
     * @param deviceTokens 设备Token列表
     * @return 推送消息列表
     */
    List<ExpoPushMessage> buildPushMessages(FamilyNotification notification, List<UserDeviceToken> deviceTokens);

    /**
     * 处理推送响应
     *
     * @param response     推送响应
     * @param deviceTokens 设备Token列表
     * @param notification 通知对象
     */
    void processPushResponse(ExpoPushResponse response, List<UserDeviceToken> deviceTokens,
                           FamilyNotification notification);

    /**
     * 验证设备Token格式
     *
     * @param deviceToken 设备Token
     * @return 是否有效
     */
    boolean isValidExpoPushToken(String deviceToken);

    /**
     * 获取推送消息的数据部分
     *
     * @param notification 通知对象
     * @return 数据Map
     */
    Map<String, Object> buildPushData(FamilyNotification notification);

    /**
     * 根据通知优先级设置推送优先级
     *
     * @param notification 通知对象
     * @return 推送优先级
     */
    String getPushPriority(FamilyNotification notification);

    /**
     * 根据通知类型设置通知渠道
     *
     * @param notification 通知对象
     * @return 通知渠道ID
     */
    String getNotificationChannel(FamilyNotification notification);

    /**
     * 测试推送服务连接
     *
     * @return 是否连接成功
     */
    boolean testConnection();

    /**
     * 获取推送服务状态
     *
     * @return 服务状态信息
     */
    Map<String, Object> getServiceStatus();
}
