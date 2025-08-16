package com.growth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.growth.common.controller.BaseController;
import com.growth.common.exception.BusinessException;
import com.growth.dao.NotificationPushRecordMapper;
import com.growth.entity.FamilyNotification;
import com.growth.entity.NotificationPushRecord;
import com.growth.entity.UserDeviceToken;
import com.growth.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 通知推送记录服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationPushRecordServiceImpl extends ServiceImpl<NotificationPushRecordMapper, NotificationPushRecord>
        implements NotificationPushRecordService {

    private final FamilyRelationService familyRelationService;
    private final UserDeviceTokenService deviceTokenService;
    private final ExpoPushService expoPushService;
    private final FamilyService familyService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<NotificationPushRecord> createPushRecords(FamilyNotification template, Long senderId, List<Long> receiverIds) {
        List<NotificationPushRecord> pushRecords = new ArrayList<>();

        for (Long receiverId : receiverIds) {
            // 获取用户设备Token
            List<UserDeviceToken> deviceTokens = deviceTokenService.getActiveTokensByUserId(receiverId);

            if (deviceTokens.isEmpty()) {
                log.warn("用户[{}]没有有效的设备Token，跳过推送", receiverId);
                continue;
            }

            // 获取用户在家庭中的角色信息
            var familyRelation = familyRelationService.getByFamilyIdAndUserId(template.getFamilyId(), receiverId);

            // 为每个设备Token创建推送记录
            for (UserDeviceToken deviceToken : deviceTokens) {
                NotificationPushRecord record = new NotificationPushRecord();
                record.setTemplateId(template.getId());
                record.setTitle(template.getTitle());
                record.setContent(template.getContent());
                record.setSvgIcon(template.getSvgIcon());
                record.setSenderId(senderId);
                record.setReceiverId(receiverId);
                record.setFamilyId(template.getFamilyId());
                record.setSentTime(LocalDateTime.now());
                record.setType(template.getType());
                record.setPriority(2); // 默认中等优先级
                record.setIsOneClick(true); // 标记为一键通知

                if (familyRelation != null) {
                    record.setRoleId(familyRelation.getRoleId());
                    // 需要获取角色名称，这里先设置为空
                    record.setRoleName("");
                }

                record.setDeviceTokenId(deviceToken.getId());
                record.setDeviceToken(deviceToken.getDeviceToken());
                record.setPlatform(deviceToken.getPlatform());
                record.setPushStatus(0); // 未推送
                record.setIsRead(false);
                record.setRetryCount(0);
                record.setStatus(0); // 正常状态

                pushRecords.add(record);
            }
        }

        if (!pushRecords.isEmpty()) {
            saveBatch(pushRecords);
            log.info("创建推送记录成功，数量：{}", pushRecords.size());
        }

        return pushRecords;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean executePush(List<NotificationPushRecord> pushRecords) {
        if (pushRecords.isEmpty()) {
            return true;
        }

        try {
            // 使用ExpoPushService发送推送
            boolean success = expoPushService.sendPushRecords(pushRecords);

            if (success) {
                log.info("推送执行成功，记录数量：{}", pushRecords.size());
            } else {
                log.error("推送执行失败，记录数量：{}", pushRecords.size());
            }

            return success;
        } catch (Exception e) {
            log.error("推送执行异常", e);

            // 更新推送状态为失败
            for (NotificationPushRecord record : pushRecords) {
                updatePushStatus(record.getId(), 2, null, "PUSH_ERROR", e.getMessage());
            }

            return false;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean markAsRead(Long id, Long userId) {
        NotificationPushRecord record = getById(id);
        if (record == null) {
            throw new BusinessException("推送记录不存在");
        }

        if (!record.getReceiverId().equals(userId)) {
            throw new BusinessException("无权限操作该推送记录");
        }

        if (record.getIsRead()) {
            return true; // 已经是已读状态
        }

        int result = baseMapper.markAsRead(id, LocalDateTime.now());
        if (result > 0) {
            log.info("用户[{}]标记消息[{}]为已读", userId, id);
        }

        return result > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int batchMarkAsRead(List<Long> ids, Long userId) {
        int successCount = 0;

        for (Long id : ids) {
            try {
                if (markAsRead(id, userId)) {
                    successCount++;
                }
            } catch (Exception e) {
                log.warn("标记消息[{}]为已读失败：{}", id, e.getMessage());
            }
        }

        log.info("用户[{}]批量标记消息为已读，成功数量：{}/{}", userId, successCount, ids.size());
        return successCount;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updatePushStatus(Long id, Integer pushStatus, String pushResponse, String errorCode, String errorMessage) {
        int result = baseMapper.updatePushStatus(id, pushStatus, LocalDateTime.now(), pushResponse, errorCode, errorMessage);
        return result > 0;
    }

    @Override
    public IPage<NotificationPushRecord> getPushRecordPage(BaseController.PageRequest pageRequest,
                                                           Long templateId,
                                                           Long senderId,
                                                           Long receiverId,
                                                           Long familyId,
                                                           Integer pushStatus,
                                                           Boolean isRead,
                                                           LocalDateTime startTime,
                                                           LocalDateTime endTime,
                                                           Long userId) {
        Page<NotificationPushRecord> page = new Page<>(pageRequest.getCurrent(), pageRequest.getSize());

        // 检查权限：只能查看自己相关的记录或有权限的家庭记录
        if (receiverId != null && !receiverId.equals(userId)) {
            throw new BusinessException("无权限查看其他用户的推送记录");
        }

        if (familyId != null && !familyService.checkFamilyPermission(familyId, userId)) {
            throw new BusinessException("无权限查看该家庭的推送记录");
        }

        return baseMapper.selectPushRecordPage(page, templateId, senderId, receiverId, familyId,
                                              pushStatus, isRead, startTime, endTime);
    }

    @Override
    public List<NotificationPushRecord> getUserNotifications(Long userId, Long familyId, Boolean isRead, Integer limit) {
        LambdaQueryWrapper<NotificationPushRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(NotificationPushRecord::getReceiverId, userId);

        if (familyId != null) {
            wrapper.eq(NotificationPushRecord::getFamilyId, familyId);
        }

        if (isRead != null) {
            wrapper.eq(NotificationPushRecord::getIsRead, isRead);
        }

        wrapper.orderByDesc(NotificationPushRecord::getCreateTime);

        if (limit != null && limit > 0) {
            wrapper.last("LIMIT " + limit);
        }

        return list(wrapper);
    }

    @Override
    public int getUnreadCount(Long userId, Long familyId) {
        return baseMapper.countUnreadMessages(userId, familyId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean retryFailedPushes(Integer maxRetryCount) {
        List<NotificationPushRecord> failedRecords = baseMapper.selectFailedPushRecords(maxRetryCount);

        if (failedRecords.isEmpty()) {
            return true;
        }

        log.info("重试失败推送，记录数量：{}", failedRecords.size());

        // 增加重试次数
        for (NotificationPushRecord record : failedRecords) {
            baseMapper.incrementRetryCount(record.getId());
        }

        // 重新执行推送
        return executePush(failedRecords);
    }

    @Override
    public boolean checkRecordPermission(Long recordId, Long userId) {
        NotificationPushRecord record = getById(recordId);
        if (record == null) {
            return false;
        }

        // 发送者和接收者都有权限查看
        if (record.getSenderId().equals(userId) || record.getReceiverId().equals(userId)) {
            return true;
        }

        // 家庭管理员有权限查看
        return familyService.checkFamilyPermission(record.getFamilyId(), userId);
    }

    @Override
    public Object getTemplateStats(Long templateId, Long userId) {
        // 这里可以返回模版的详细统计信息
        // 暂时返回简单的统计
        LambdaQueryWrapper<NotificationPushRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(NotificationPushRecord::getTemplateId, templateId);

        List<NotificationPushRecord> records = list(wrapper);

        long totalSends = records.size();
        long readCount = records.stream().filter(NotificationPushRecord::getIsRead).count();
        long successCount = records.stream().filter(r -> r.getPushStatus() == 1).count();

        var stats = new Object() {
            public final long totalSends = NotificationPushRecordServiceImpl.this.getTotalSends();
            public final long readCount = NotificationPushRecordServiceImpl.this.getReadCount();
            public final long successCount = NotificationPushRecordServiceImpl.this.getSuccessCount();
            public final double readRate = totalSends > 0 ? (double) readCount / totalSends * 100 : 0;
            public final double successRate = totalSends > 0 ? (double) successCount / totalSends * 100 : 0;

            private long getTotalSends() { return totalSends; }
            private long getReadCount() { return readCount; }
            private long getSuccessCount() { return successCount; }
        };

        return stats;
    }

    // Helper methods for stats calculation
    private long getTotalSends() { return 0; }
    private long getReadCount() { return 0; }
    private long getSuccessCount() { return 0; }
}
