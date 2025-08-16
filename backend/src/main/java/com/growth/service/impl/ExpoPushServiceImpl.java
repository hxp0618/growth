package com.growth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.growth.dao.NotificationPushRecordMapper;
import com.growth.entity.FamilyNotification;
import com.growth.entity.NotificationPushRecord;
import com.growth.entity.UserDeviceToken;
import com.growth.entity.dto.ExpoPushMessage;
import com.growth.entity.dto.ExpoPushResponse;
import com.growth.service.ExpoPushService;
import com.growth.service.FamilyRelationService;
import com.growth.service.UserDeviceTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Expo推送服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExpoPushServiceImpl implements ExpoPushService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final UserDeviceTokenService tokenService;
    private final FamilyRelationService familyRelationService;
    private final NotificationPushRecordMapper pushRecordMapper;

    @Value("${expo.push.api-url:https://exp.host/--/api/v2/push/send}")
    private String expoPushApiUrl;

    @Value("${expo.push.batch-size:100}")
    private int batchSize;

    @Value("${expo.push.timeout:30}")
    private int timeoutSeconds;

    private static final String EXPO_TOKEN_PREFIX = "ExponentPushToken[";
    private static final String EXPO_TOKEN_SUFFIX = "]";

    @Override
    public ExpoPushResponse sendMessage(ExpoPushMessage message) {
        return sendMessages(List.of(message));
    }

    @Override
    public ExpoPushResponse sendMessages(List<ExpoPushMessage> messages) {
        if (CollectionUtils.isEmpty(messages)) {
            log.warn("推送消息列表为空");
            return new ExpoPushResponse();
        }

        try {
            // 验证Token格式
            List<ExpoPushMessage> validMessages = messages.stream()
                .filter(msg -> isValidExpoPushToken(msg.getTo()))
                .collect(Collectors.toList());

            if (validMessages.isEmpty()) {
                log.warn("没有有效的推送Token");
                return new ExpoPushResponse();
            }

            // 分批发送
            List<ExpoPushResponse.ExpoPushTicket> allTickets = new ArrayList<>();
            List<ExpoPushResponse.ExpoPushError> allErrors = new ArrayList<>();

            for (int i = 0; i < validMessages.size(); i += batchSize) {
                int endIndex = Math.min(i + batchSize, validMessages.size());
                List<ExpoPushMessage> batch = validMessages.subList(i, endIndex);

                ExpoPushResponse batchResponse = sendBatch(batch);
                if (batchResponse != null) {
                    if (batchResponse.getData() != null) {
                        allTickets.addAll(batchResponse.getData());
                    }
                    if (batchResponse.getErrors() != null) {
                        allErrors.addAll(batchResponse.getErrors());
                    }
                }
            }

            ExpoPushResponse response = new ExpoPushResponse();
            response.setData(allTickets);
            response.setErrors(allErrors.isEmpty() ? null : allErrors);

            log.info("推送完成: 总数={}, 成功={}, 失败={}",
                validMessages.size(), response.getSuccessCount(), response.getFailureCount());

            return response;

        } catch (Exception e) {
            log.error("发送推送消息失败", e);
            return new ExpoPushResponse();
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean sendPushRecords(List<NotificationPushRecord> pushRecords) {
        if (CollectionUtils.isEmpty(pushRecords)) {
            log.warn("推送记录列表为空");
            return false;
        }

        try {
            int successCount = 0;
            int totalCount = pushRecords.size();

            for (NotificationPushRecord record : pushRecords) {
                try {
                    // 获取用户的设备tokens
                    List<UserDeviceToken> deviceTokens = tokenService.getActiveTokensByUserId(record.getReceiverId());

                    if (CollectionUtils.isEmpty(deviceTokens)) {
                        // 没有设备token，标记为失败
                        updatePushRecordStatus(record, 2, "没有可用的设备Token", null);
                        continue;
                    }

                    // 构建推送消息
                    List<ExpoPushMessage> messages = buildPushMessagesFromRecord(record, deviceTokens);

                    if (CollectionUtils.isEmpty(messages)) {
                        updatePushRecordStatus(record, 2, "构建推送消息失败", null);
                        continue;
                    }

                    // 发送推送
                    ExpoPushResponse response = sendMessages(messages);

                    // 处理推送结果
                    if (response != null && response.getSuccessCount() > 0) {
                        // 有成功的推送
                        updatePushRecordStatus(record, 1, null, response);
                        successCount++;
                    } else {
                        // 推送失败
                        String errorMsg = response != null && response.getErrors() != null && !response.getErrors().isEmpty()
                            ? response.getErrors().get(0).getMessage()
                            : "推送失败";
                        updatePushRecordStatus(record, 2, errorMsg, response);
                    }

                } catch (Exception e) {
                    log.error("发送推送记录失败: recordId={}", record.getId(), e);
                    updatePushRecordStatus(record, 2, "发送异常: " + e.getMessage(), null);
                }
            }

            log.info("批量推送完成: 总数={}, 成功={}, 失败={}", totalCount, successCount, totalCount - successCount);
            return successCount > 0;

        } catch (Exception e) {
            log.error("批量发送推送记录失败", e);
            return false;
        }
    }

    /**
     * 从推送记录构建推送消息
     */
    private List<ExpoPushMessage> buildPushMessagesFromRecord(NotificationPushRecord record, List<UserDeviceToken> deviceTokens) {
        List<ExpoPushMessage> messages = new ArrayList<>();

        for (UserDeviceToken token : deviceTokens) {
            if (!isValidExpoPushToken(token.getDeviceToken())) {
                continue;
            }

            ExpoPushMessage message = new ExpoPushMessage();
            message.setTo(token.getDeviceToken());
            message.setTitle(record.getTitle());
            message.setBody(record.getContent());
            message.setSound("default");
            message.setPriority(getPushPriorityFromRecord(record));
            message.setChannelId(getNotificationChannelFromRecord(record));

            // 设置数据
            Map<String, Object> data = new HashMap<>();
            data.put("notificationId", record.getId());
            data.put("templateId", record.getTemplateId());
            data.put("type", record.getType());
            data.put("priority", record.getPriority());
            data.put("familyId", record.getFamilyId());
            data.put("senderId", record.getSenderId());
            data.put("isOneClick", record.getIsOneClick());

            if (StringUtils.hasText(record.getSvgIcon())) {
                data.put("icon", record.getSvgIcon());
            }

            message.setData(data);
            messages.add(message);

            // 更新记录的设备token信息
            record.setDeviceTokenId(token.getId());
            record.setDeviceToken(token.getDeviceToken());
            record.setPlatform(token.getPlatform());
        }

        return messages;
    }

    /**
     * 更新推送记录状态
     */
    private void updatePushRecordStatus(NotificationPushRecord record, int pushStatus, String errorMessage, ExpoPushResponse response) {
        try {
            String responseStr = null;
            String errorCode = null;

            if (response != null) {
                try {
                    responseStr = objectMapper.writeValueAsString(response);
                } catch (JsonProcessingException e) {
                    log.warn("序列化推送响应失败", e);
                }

                if (response.getErrors() != null && !response.getErrors().isEmpty()) {
                    errorCode = response.getErrors().get(0).getCode();
                }
            }

            pushRecordMapper.updatePushStatus(
                record.getId(),
                pushStatus,
                LocalDateTime.now(),
                responseStr,
                errorCode,
                errorMessage
            );

            // 更新本地对象状态
            record.setPushStatus(pushStatus);
            record.setPushTime(LocalDateTime.now());
            record.setErrorMessage(errorMessage);
            record.setErrorCode(errorCode);

        } catch (Exception e) {
            log.error("更新推送记录状态失败: recordId={}", record.getId(), e);
        }
    }

    /**
     * 从推送记录获取推送优先级
     */
    private String getPushPriorityFromRecord(NotificationPushRecord record) {
        if (record.getPriority() == null) {
            return "normal";
        }

        switch (record.getPriority()) {
            case 1: return "normal";
            case 3: return "high";
            default: return "normal";
        }
    }

    /**
     * 从推送记录获取通知渠道
     */
    private String getNotificationChannelFromRecord(NotificationPushRecord record) {
        if (record.getType() == null) {
            return "default";
        }

        switch (record.getType()) {
            case 1: return "system";
            case 3: return "urgent";
            default: return "default";
        }
    }

    /**
     * 发送单批推送消息
     */
    private ExpoPushResponse sendBatch(List<ExpoPushMessage> batch) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Accept", "application/json");
            headers.set("Accept-Encoding", "gzip, deflate");

            HttpEntity<List<ExpoPushMessage>> entity = new HttpEntity<>(batch, headers);

            log.debug("发送推送批次: size={}, url={}", batch.size(), expoPushApiUrl);

            ResponseEntity<ExpoPushResponse> responseEntity = restTemplate.postForEntity(
                expoPushApiUrl, entity, ExpoPushResponse.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                return responseEntity.getBody();
            } else {
                log.error("推送API返回错误状态: {}", responseEntity.getStatusCode());
                return new ExpoPushResponse();
            }

        } catch (Exception e) {
            log.error("发送推送批次失败", e);
            return new ExpoPushResponse();
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean sendImmediateNotification(FamilyNotification notification, List<Long> receiverIds) {
        try {
            // 获取接收者ID列表
            List<Long> targetReceiverIds = getTargetReceiverIds(notification.getFamilyId(),
                receiverIds, notification.getCreatorId());

            if (CollectionUtils.isEmpty(targetReceiverIds)) {
                log.warn("没有找到有效的接收者: notificationId={}", notification.getId());
                return false;
            }

            // 获取活跃的设备Token
            List<UserDeviceToken> activeTokens = tokenService.getActiveTokensByUserIds(targetReceiverIds);
            log.info("推送目标用户: {}, 找到活跃Token数量: {}", targetReceiverIds, activeTokens.size());

            // 详细记录每个用户的Token情况
            for (Long userId : targetReceiverIds) {
                List<UserDeviceToken> userTokens = activeTokens.stream()
                    .filter(token -> token.getUserId().equals(userId))
                    .toList();
                log.info("用户 {} 的活跃Token数量: {}", userId, userTokens.size());
                if (userTokens.isEmpty()) {
                    // 检查该用户是否有Token但状态不活跃
                    List<UserDeviceToken> allUserTokens = tokenService.getActiveTokensByUserId(userId);
                    log.warn("用户 {} 没有活跃Token，总Token数量: {}", userId, allUserTokens.size());
                }
            }

            if (CollectionUtils.isEmpty(activeTokens)) {
                log.warn("没有找到活跃的设备Token: notificationId={}, 目标用户: {}",
                    notification.getId(), targetReceiverIds);
                return false;
            }

            // 构建推送消息
            List<ExpoPushMessage> messages = buildPushMessages(notification, activeTokens);
            if (CollectionUtils.isEmpty(messages)) {
                log.warn("构建推送消息失败: notificationId={}", notification.getId());
                return false;
            }

            // 创建推送记录
            List<NotificationPushRecord> pushRecords = createPushRecords(notification, activeTokens);
            if (!CollectionUtils.isEmpty(pushRecords)) {
                // 使用MyBatis-Plus的批量插入
                for (NotificationPushRecord record : pushRecords) {
                    pushRecordMapper.insert(record);
                }
            }

            // 发送推送
            ExpoPushResponse response = sendMessages(messages);

            // 处理推送响应
            processPushResponse(response, activeTokens, notification);

            log.info("通知推送完成: notificationId={}, 成功数={}", notification.getId(), response.getSuccessCount());

            return response.getSuccessCount() > 0;

        } catch (Exception e) {
            log.error("发送立即通知失败: notificationId={}", notification.getId(), e);
            return false;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean sendScheduledNotification(FamilyNotification notification) {
        return sendImmediateNotification(notification, null);
    }

    @Override
    public List<ExpoPushMessage> buildPushMessages(FamilyNotification notification, List<UserDeviceToken> deviceTokens) {
        List<ExpoPushMessage> messages = new ArrayList<>();

        for (UserDeviceToken token : deviceTokens) {
            ExpoPushMessage message = ExpoPushMessage.createWithData(
                token.getDeviceToken(),
                notification.getTitle(),
                notification.getContent(),
                buildPushData(notification)
            );

            // 设置推送属性
            message.setPriority(getPushPriority(notification))
                   .setChannelId(getNotificationChannel(notification))
                   .setSound("default");

            messages.add(message);
        }

        return messages;
    }

    @Override
    public void processPushResponse(ExpoPushResponse response, List<UserDeviceToken> deviceTokens,
                                   FamilyNotification notification) {
        if (response == null || response.getData() == null) {
            return;
        }

        List<ExpoPushResponse.ExpoPushTicket> tickets = response.getData();

        for (int i = 0; i < tickets.size() && i < deviceTokens.size(); i++) {
            ExpoPushResponse.ExpoPushTicket ticket = tickets.get(i);
            UserDeviceToken token = deviceTokens.get(i);

            // 更新推送记录状态
            updatePushRecordStatus(notification.getId(), token.getId(), ticket);

            // 更新Token失败计数
            if (ticket.isSuccess()) {
                tokenService.recordPushSuccess(token.getDeviceToken());
            } else {
                handlePushError(token, ticket);
            }
        }
    }

    /**
     * 处理推送错误
     */
    private void handlePushError(UserDeviceToken token, ExpoPushResponse.ExpoPushTicket ticket) {
        if (ticket.getDetails() != null) {
            ExpoPushResponse.ExpoPushErrorDetails details = ticket.getDetails();

            if (details.isDeviceNotRegistered() || details.isInvalidCredentials()) {
                // Token无效，立即禁用
                tokenService.disableToken(token.getDeviceToken(), "设备Token无效: " + details.getError());
            } else if (details.isMessageTooBig()) {
                // 消息过大，不计入失败次数
                log.warn("推送消息过大: token={}, message={}",
                    maskToken(token.getDeviceToken()), details.getMessage());
            } else if (details.isMessageRateExceeded()) {
                // 频率限制，不计入失败次数
                log.warn("推送频率超限: token={}, message={}",
                    maskToken(token.getDeviceToken()), details.getMessage());
            } else {
                // 其他错误，计入失败次数
                tokenService.recordPushFailure(token.getDeviceToken());
            }
        } else {
            // 未知错误，计入失败次数
            tokenService.recordPushFailure(token.getDeviceToken());
        }
    }

    /**
     * 更新推送记录状态
     */
    private void updatePushRecordStatus(Long notificationId, Long deviceTokenId,
                                       ExpoPushResponse.ExpoPushTicket ticket) {
        try {
            // 查找对应的推送记录 - 使用模版ID查询
            LambdaQueryWrapper<NotificationPushRecord> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(NotificationPushRecord::getTemplateId, notificationId)
                   .eq(NotificationPushRecord::getDeviceTokenId, deviceTokenId);
            
            NotificationPushRecord record = pushRecordMapper.selectOne(wrapper);

            if (record != null) {
                int status = ticket.isSuccess() ?
                    1 : // SUCCESS状态
                    2;  // FAILED状态

                String errorCode = null;
                String errorMessage = null;
                if (ticket.isError()) {
                    errorMessage = ticket.getMessage();
                    if (ticket.getDetails() != null) {
                        errorCode = ticket.getDetails().getError();
                        if (StringUtils.hasText(ticket.getDetails().getMessage())) {
                            errorMessage = ticket.getDetails().getMessage();
                        }
                    }
                }

                String responseJson = null;
                try {
                    responseJson = objectMapper.writeValueAsString(ticket);
                } catch (JsonProcessingException e) {
                    log.warn("序列化推送响应失败", e);
                }

                pushRecordMapper.updatePushStatus(
                    record.getId(),
                    status,
                    LocalDateTime.now(),
                    responseJson,
                    errorCode,
                    errorMessage
                );
            }
        } catch (Exception e) {
            log.error("更新推送记录状态失败: notificationId={}, deviceTokenId={}",
                notificationId, deviceTokenId, e);
        }
    }

    @Override
    public boolean isValidExpoPushToken(String deviceToken) {
        if (!StringUtils.hasText(deviceToken)) {
            return false;
        }
        return deviceToken.startsWith(EXPO_TOKEN_PREFIX) && deviceToken.endsWith(EXPO_TOKEN_SUFFIX);
    }

    @Override
    public Map<String, Object> buildPushData(FamilyNotification notification) {
        Map<String, Object> data = new HashMap<>();
        data.put("notificationId", notification.getId());
        data.put("familyId", notification.getFamilyId());
        data.put("creatorId", notification.getCreatorId());
        data.put("type", "family_notification");
        data.put("priority", 2); // 默认中等优先级
        data.put("isOneClick", true);

        if (StringUtils.hasText(notification.getSvgIcon())) {
            data.put("svgIcon", notification.getSvgIcon());
        }

        return data;
    }

    @Override
    public String getPushPriority(FamilyNotification notification) {
        // FamilyNotification 没有priority字段，使用默认中等优先级
        return "normal";
    }

    @Override
    public String getNotificationChannel(FamilyNotification notification) {
        if (notification.getType() != null && notification.getType() == 3) {
            return "emergency";
        }
        return "default";
    }

    @Override
    public boolean testConnection() {
        try {
            // 发送一个测试请求到Expo API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 使用一个无效的Token进行测试，只是为了验证连接
            ExpoPushMessage testMessage = ExpoPushMessage.create(
                "ExponentPushToken[test]", "Test", "Connection test");

            HttpEntity<List<ExpoPushMessage>> entity = new HttpEntity<>(List.of(testMessage), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                expoPushApiUrl, entity, String.class);

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("测试Expo推送服务连接失败", e);
            return false;
        }
    }

    @Override
    public Map<String, Object> getServiceStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("apiUrl", expoPushApiUrl);
        status.put("batchSize", batchSize);
        status.put("timeout", timeoutSeconds);
        status.put("connected", testConnection());
        status.put("timestamp", LocalDateTime.now());
        return status;
    }

    /**
     * 获取目标接收者ID列表
     */
    private List<Long> getTargetReceiverIds(Long familyId, List<Long> receiverIds, Long senderId) {
        if (!CollectionUtils.isEmpty(receiverIds)) {
            // 验证指定的接收者是否都是家庭成员
            return familyRelationService.getFamilyMemberList(familyId, 1).stream()
                .map(relation -> relation.getUserId())
                .filter(receiverIds::contains)
                .collect(Collectors.toList());
        } else {
            // 发送给所有家庭成员（包含发送者）
            return familyRelationService.getFamilyMemberList(familyId, 1).stream()
                .map(relation -> relation.getUserId())
                .collect(Collectors.toList());
        }
    }

    /**
     * 创建推送记录
     */
    private List<NotificationPushRecord> createPushRecords(FamilyNotification notification,
                                                          List<UserDeviceToken> deviceTokens) {
        List<NotificationPushRecord> records = new ArrayList<>();

        for (UserDeviceToken token : deviceTokens) {
            NotificationPushRecord record = new NotificationPushRecord()
                .setTemplateId(notification.getId())
                .setTitle(notification.getTitle())
                .setContent(notification.getContent())
                .setSvgIcon(notification.getSvgIcon())
                .setSenderId(notification.getCreatorId())
                .setReceiverId(token.getUserId())
                .setFamilyId(notification.getFamilyId())
                .setType(notification.getType())
                .setPriority(2) // 默认中等优先级
                .setIsOneClick(true)
                .setDeviceTokenId(token.getId())
                .setDeviceToken(token.getDeviceToken())
                .setPlatform(token.getPlatform())
                .setPushStatus(0) // PENDING状态
                .setRetryCount(0);

            records.add(record);
        }

        return records;
    }

    /**
     * 遮蔽Token敏感信息
     */
    private String maskToken(String token) {
        if (!StringUtils.hasText(token)) {
            return "null";
        }
        if (token.length() <= 20) {
            return "***";
        }
        return token.substring(0, 20) + "***" + token.substring(token.length() - 4);
    }
}
