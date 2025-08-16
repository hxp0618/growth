package com.growth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.growth.common.controller.BaseController;
import com.growth.common.exception.BusinessException;
import com.growth.dao.FamilyNotificationMapper;
import com.growth.entity.FamilyNotification;
import com.growth.entity.request.CreateFamilyNotificationRequest;
import com.growth.entity.request.SendNotificationTemplateRequest;
import com.growth.service.FamilyNotificationService;
import com.growth.service.FamilyRelationService;
import com.growth.service.FamilyService;
import com.growth.service.NotificationPushRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 家庭通知模版服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FamilyNotificationServiceImpl extends ServiceImpl<FamilyNotificationMapper, FamilyNotification>
        implements FamilyNotificationService {

    private final FamilyService familyService;
    private final FamilyRelationService familyRelationService;
    private final NotificationPushRecordService pushRecordService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyNotification createNotificationTemplate(CreateFamilyNotificationRequest request, Long userId) {
        // 验证家庭权限
        if (!familyService.checkFamilyPermission(request.getFamilyId(), userId)) {
            throw new BusinessException("无权限操作该家庭");
        }

        FamilyNotification notification = new FamilyNotification();
        BeanUtils.copyProperties(request, notification);
        notification.setCreatorId(userId);
        notification.setUsageCount(0);
        notification.setIsActive(true);

        if (!save(notification)) {
            throw new BusinessException("创建通知模版失败");
        }

        log.info("用户[{}]创建通知模版[{}]成功", userId, notification.getId());
        return notification;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyNotification updateNotificationTemplate(Long id, CreateFamilyNotificationRequest request, Long userId) {
        FamilyNotification notification = getById(id);
        if (notification == null) {
            throw new BusinessException("通知模版不存在");
        }

        // 检查权限：只有创建者和家庭管理员可以修改
        if (!checkTemplatePermission(id, userId)) {
            throw new BusinessException("无权限操作该通知模版");
        }

        BeanUtils.copyProperties(request, notification);
        notification.setId(id);

        if (!updateById(notification)) {
            throw new BusinessException("更新通知模版失败");
        }

        log.info("用户[{}]更新通知模版[{}]成功", userId, id);
        return notification;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteNotificationTemplate(Long id, Long userId) {
        if (!checkTemplatePermission(id, userId)) {
            throw new BusinessException("无权限操作该通知模版");
        }

        boolean result = removeById(id);
        if (result) {
            log.info("用户[{}]删除通知模版[{}]成功", userId, id);
        }

        return result;
    }

    @Override
    public FamilyNotification getNotificationTemplateDetail(Long id, Long userId) {
        FamilyNotification notification = getById(id);
        if (notification == null) {
            throw new BusinessException("通知模版不存在");
        }

        // 检查权限：只有家庭成员可以查看
        if (!familyService.checkFamilyPermission(notification.getFamilyId(), userId)) {
            throw new BusinessException("无权限查看该通知模版");
        }

        return notification;
    }

    @Override
    public IPage<FamilyNotification> getNotificationTemplatePage(BaseController.PageRequest pageRequest,
                                                                Long familyId,
                                                                Long creatorId,
                                                                Integer type,
                                                                String category,
                                                                Boolean isActive,
                                                                String keyword,
                                                                Long userId) {
        Page<FamilyNotification> page = new Page<>(pageRequest.getCurrent(), pageRequest.getSize());

        // 如果指定了familyId，检查权限
        if (familyId != null && !familyService.checkFamilyPermission(familyId, userId)) {
            throw new BusinessException("无权限查看该家庭的通知模版");
        }

        return baseMapper.selectNotificationPage(page, familyId, creatorId, type, category, isActive, keyword);
    }

    @Override
    public List<FamilyNotification> getFamilyNotificationTemplates(Long familyId, Long userId) {
        // 检查家庭权限
        if (!familyService.checkFamilyPermission(familyId, userId)) {
            throw new BusinessException("无权限查看该家庭的通知模版");
        }

        LambdaQueryWrapper<FamilyNotification> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(FamilyNotification::getFamilyId, familyId)
               .eq(FamilyNotification::getIsActive, true)
               .orderByDesc(FamilyNotification::getUsageCount)
               .orderByDesc(FamilyNotification::getCreateTime);

        return list(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean sendNotificationTemplate(SendNotificationTemplateRequest request, Long userId) {
        FamilyNotification template = getById(request.getTemplateId());
        if (template == null) {
            throw new BusinessException("通知模版不存在");
        }

        // 检查权限
        if (!familyService.checkFamilyPermission(request.getFamilyId(), userId)) {
            throw new BusinessException("无权限操作该家庭");
        }

        if (!template.getFamilyId().equals(request.getFamilyId())) {
            throw new BusinessException("通知模版不属于该家庭");
        }

        if (!template.getIsActive()) {
            throw new BusinessException("通知模版已停用");
        }

        // 获取接收者列表
        List<Long> receiverIds = getFamilyMembersByUserIds(request.getFamilyId(), template.getReceiverUserIds());
        if (receiverIds.isEmpty()) {
            throw new BusinessException("没有找到有效的接收者");
        }

        // 创建推送记录
        List<com.growth.entity.NotificationPushRecord> pushRecords =
            pushRecordService.createPushRecords(template, userId, receiverIds);

        // 执行推送
        boolean success = pushRecordService.executePush(pushRecords);

        if (success) {
            // 更新使用次数
            baseMapper.incrementUsageCount(template.getId());
            log.info("用户[{}]发送通知模版[{}]成功，接收者数量：{}", userId, template.getId(), receiverIds.size());
        }

        return success;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean toggleNotificationTemplate(Long id, boolean isActive, Long userId) {
        if (!checkTemplatePermission(id, userId)) {
            throw new BusinessException("无权限操作该通知模版");
        }

        FamilyNotification notification = new FamilyNotification();
        notification.setId(id);
        notification.setIsActive(isActive);

        boolean result = updateById(notification);
        if (result) {
            log.info("用户[{}]{}通知模版[{}]成功", userId, isActive ? "激活" : "停用", id);
        }

        return result;
    }

    @Override
    public boolean checkTemplatePermission(Long templateId, Long userId) {
        FamilyNotification template = getById(templateId);
        if (template == null) {
            return false;
        }

        // 创建者有权限
        if (template.getCreatorId().equals(userId)) {
            return true;
        }

        // 家庭成员有权限查看，但只有管理员有权限修改
        return familyService.checkFamilyPermission(template.getFamilyId(), userId);
    }

    @Override
    public List<Long> getFamilyMembersByRoles(Long familyId, List<Long> receiverRoleIds) {
        // 如果角色ID列表为空，获取所有家庭成员
        if (receiverRoleIds == null || receiverRoleIds.isEmpty()) {
            return familyRelationService.getFamilyMemberIds(familyId);
        }

        // 根据角色获取家庭成员
        return familyRelationService.getFamilyMemberIdsByRoles(familyId, receiverRoleIds);
    }

    @Override
    public List<Long> getFamilyMembersByUserIds(Long familyId, List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of(); // 如果没有用户ID，返回空列表
        }

        // 过滤掉不在该家庭中的用户
        return userIds.stream()
                .filter(userId -> familyRelationService.isFamilyMember(familyId, userId))
                .collect(Collectors.toList());
    }
}
