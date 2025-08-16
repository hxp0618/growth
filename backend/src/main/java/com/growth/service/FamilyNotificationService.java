package com.growth.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.growth.common.controller.BaseController;
import com.growth.entity.FamilyNotification;
import com.growth.entity.request.CreateFamilyNotificationRequest;
import com.growth.entity.request.SendNotificationTemplateRequest;

import java.util.List;

/**
 * 家庭通知模版服务接口
 *
 * @author growth
 * @since 1.0
 */
public interface FamilyNotificationService extends IService<FamilyNotification> {

    /**
     * 创建通知模版
     *
     * @param request 创建请求
     * @param userId  当前用户ID
     * @return 通知模版
     */
    FamilyNotification createNotificationTemplate(CreateFamilyNotificationRequest request, Long userId);

    /**
     * 更新通知模版
     *
     * @param id      模版ID
     * @param request 更新请求
     * @param userId  当前用户ID
     * @return 通知模版
     */
    FamilyNotification updateNotificationTemplate(Long id, CreateFamilyNotificationRequest request, Long userId);

    /**
     * 删除通知模版
     *
     * @param id     模版ID
     * @param userId 当前用户ID
     * @return 是否成功
     */
    boolean deleteNotificationTemplate(Long id, Long userId);

    /**
     * 根据ID查询通知模版详情
     *
     * @param id     模版ID
     * @param userId 当前用户ID
     * @return 通知模版
     */
    FamilyNotification getNotificationTemplateDetail(Long id, Long userId);

    /**
     * 分页查询家庭通知模版
     *
     * @param pageRequest 分页请求
     * @param familyId    家庭ID（可选）
     * @param creatorId   创建者ID（可选）
     * @param type        通知类型（可选）
     * @param category    模板分类（可选）
     * @param isActive    是否启用（可选）
     * @param keyword     关键词（可选）
     * @param userId      当前用户ID
     * @return 通知模版分页结果
     */
    IPage<FamilyNotification> getNotificationTemplatePage(BaseController.PageRequest pageRequest,
                                                          Long familyId,
                                                          Long creatorId,
                                                          Integer type,
                                                          String category,
                                                          Boolean isActive,
                                                          String keyword,
                                                          Long userId);

    /**
     * 获取家庭的通知模版列表
     *
     * @param familyId 家庭ID
     * @param userId   当前用户ID
     * @return 通知模版列表
     */
    List<FamilyNotification> getFamilyNotificationTemplates(Long familyId, Long userId);

    /**
     * 发送通知模版
     *
     * @param request 发送请求
     * @param userId  当前用户ID
     * @return 是否成功
     */
    boolean sendNotificationTemplate(SendNotificationTemplateRequest request, Long userId);

    /**
     * 激活/停用通知模版
     *
     * @param id       模版ID
     * @param isActive 是否激活
     * @param userId   当前用户ID
     * @return 是否成功
     */
    boolean toggleNotificationTemplate(Long id, boolean isActive, Long userId);

    /**
     * 检查用户是否有权限操作该通知模版
     *
     * @param templateId 模版ID
     * @param userId     用户ID
     * @return 是否有权限
     */
    boolean checkTemplatePermission(Long templateId, Long userId);

    /**
     * 根据家庭ID和角色获取需要接收通知的家庭成员ID列表（基于角色的方法，保留兼容性）
     *
     * @param familyId        家庭ID
     * @param receiverRoleIds 接收者角色ID列表，为空则返回所有家庭成员
     * @return 家庭成员ID列表
     */
    List<Long> getFamilyMembersByRoles(Long familyId, List<Long> receiverRoleIds);

    /**
     * 根据家庭ID和用户ID列表获取需要接收通知的家庭成员ID列表
     *
     * @param familyId 家庭ID
     * @param userIds  接收者用户ID列表，为空则返回空列表
     * @return 属于该家庭的有效用户ID列表
     */
    List<Long> getFamilyMembersByUserIds(Long familyId, List<Long> userIds);
}