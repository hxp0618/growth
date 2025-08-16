package com.growth.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.growth.common.controller.BaseController;
import com.growth.entity.FamilyRelation;
import com.growth.entity.request.UpdateFamilyMemberRequest;
import com.growth.entity.response.FamilyMemberResponse;

import java.util.List;

/**
 * 家庭关系服务接口
 *
 * @author system
 * @since 2024-01-01
 */
public interface FamilyRelationService extends IService<FamilyRelation> {

    /**
     * 根据家庭ID和用户ID查询家庭关系
     *
     * @param familyId 家庭ID
     * @param userId   用户ID
     * @return 家庭关系
     */
    FamilyRelation getByFamilyIdAndUserId(Long familyId, Long userId);

    /**
     * 检查用户是否为家庭成员
     *
     * @param familyId 家庭ID
     * @param userId   用户ID
     * @return 是否为家庭成员
     */
    boolean isFamilyMember(Long familyId, Long userId);

    /**
     * 根据用户ID查询家庭关系列表
     *
     * @param userId 用户ID
     * @param status 状态
     * @return 家庭关系列表
     */
    List<FamilyRelation> listByUserId(Long userId, Integer status);

    /**
     * 根据家庭ID查询家庭关系列表
     *
     * @param familyId 家庭ID
     * @param status   状态
     * @return 家庭关系列表
     */
    List<FamilyRelation> listByFamilyId(Long familyId, Integer status);

    /**
     * 分页查询家庭成员详情
     *
     * @param pageRequest 分页参数
     * @param familyId    家庭ID
     * @param status      状态
     * @param roleId      角色ID
     * @return 家庭成员详情分页
     */
    IPage<FamilyMemberResponse> getFamilyMemberPage(BaseController.PageRequest pageRequest,
                                                    Long familyId,
                                                    Integer status,
                                                    Long roleId);

    /**
     * 查询家庭成员详情列表
     *
     * @param familyId 家庭ID
     * @param status   状态
     * @return 家庭成员详情列表
     */
    List<FamilyMemberResponse> getFamilyMemberList(Long familyId, Integer status);

    /**
     * 根据ID查询家庭成员详情
     *
     * @param id 关系ID
     * @return 家庭成员详情
     */
    FamilyMemberResponse getFamilyMemberDetail(Long id);

    /**
     * 更新家庭成员信息
     *
     * @param request 更新请求
     * @param userId  操作用户ID
     * @return 更新后的家庭成员详情
     */
    FamilyMemberResponse updateFamilyMember(UpdateFamilyMemberRequest request, Long userId);

    /**
     * 移除家庭成员
     *
     * @param relationId 关系ID
     * @param userId     操作用户ID
     * @return 是否成功
     */
    boolean removeFamilyMember(Long relationId, Long userId);

    /**
     * 创建家庭成员关系
     *
     * @param familyId  家庭ID
     * @param userId    用户ID
     * @param roleId    角色ID
     * @param invitedBy 邀请人ID
     * @param remark    备注
     * @return 创建的家庭关系
     */
    FamilyRelation createFamilyRelation(Long familyId, Long userId, Long roleId, Long invitedBy, String remark);

    /**
     * 统计家庭成员数量
     *
     * @param familyId 家庭ID
     * @param status   状态
     * @return 成员数量
     */
    Integer countByFamilyId(Long familyId, Integer status);

    /**
     * 检查用户是否已在家庭中
     *
     * @param familyId 家庭ID
     * @param userId   用户ID
     * @return 是否存在关系
     */
    boolean existsByFamilyIdAndUserId(Long familyId, Long userId);

    /**
     * 检查用户是否有管理家庭成员的权限
     *
     * @param familyId 家庭ID
     * @param userId   用户ID
     * @return 是否有权限
     */
    boolean checkMemberManagePermission(Long familyId, Long userId);

    /**
     * 获取家庭成员ID列表
     *
     * @param familyId 家庭ID
     * @return 家庭成员ID列表
     */
    List<Long> getFamilyMemberIds(Long familyId);

    /**
     * 根据角色获取家庭成员ID列表
     *
     * @param familyId    家庭ID
     * @param roleIds     角色ID列表
     * @return 家庭成员ID列表
     */
    List<Long> getFamilyMemberIdsByRoles(Long familyId, List<Long> roleIds);

    /**
     * 获取在线家庭成员列表
     *
     * @param familyId 家庭ID
     * @return 在线家庭成员列表
     */
    List<FamilyMemberResponse> getOnlineFamilyMembers(Long familyId);

    /**
     * 获取家庭在线用户列表（基于设备Token活跃状态）
     *
     * @param familyId 家庭ID
     * @param onlineThresholdMinutes 在线时间阈值（分钟）
     * @return 在线家庭成员列表
     */
    List<FamilyMemberResponse> getOnlineFamilyUsers(Long familyId, Integer onlineThresholdMinutes);
}