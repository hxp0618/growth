package com.growth.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.growth.common.controller.BaseController;
import com.growth.common.exception.BusinessException;
import com.growth.common.result.ResultCode;
import com.growth.dao.FamilyRelationMapper;
import com.growth.entity.Family;
import com.growth.entity.FamilyRelation;
import com.growth.entity.FamilyRole;
import com.growth.entity.UserDeviceToken;
import com.growth.entity.request.UpdateFamilyMemberRequest;
import com.growth.entity.response.FamilyMemberResponse;
import com.growth.service.FamilyRelationService;
import com.growth.service.FamilyRoleService;
import com.growth.service.FamilyService;
import com.growth.service.UserDeviceTokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

/**
 * 家庭成员关系服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@Service
public class FamilyRelationServiceImpl extends ServiceImpl<FamilyRelationMapper, FamilyRelation> implements FamilyRelationService {

    private final FamilyRoleService familyRoleService;
    private final FamilyService familyService;
    private final UserDeviceTokenService userDeviceTokenService;

    public FamilyRelationServiceImpl(FamilyRoleService familyRoleService,
                                   @Lazy FamilyService familyService,
                                   UserDeviceTokenService userDeviceTokenService) {
        this.familyRoleService = familyRoleService;
        this.familyService = familyService;
        this.userDeviceTokenService = userDeviceTokenService;
    }

    @Override
    public FamilyRelation getByFamilyIdAndUserId(Long familyId, Long userId) {
        return baseMapper.selectByFamilyIdAndUserId(familyId, userId);
    }

    @Override
    public boolean isFamilyMember(Long familyId, Long userId) {
        FamilyRelation relation = getByFamilyIdAndUserId(familyId, userId);
        return relation != null && relation.getStatus() == 1;
    }

    @Override
    public List<FamilyRelation> listByUserId(Long userId, Integer status) {
        return baseMapper.selectByUserId(userId, status);
    }

    @Override
    public List<FamilyRelation> listByFamilyId(Long familyId, Integer status) {
        return baseMapper.selectByFamilyId(familyId, status);
    }

    @Override
    public IPage<FamilyMemberResponse> getFamilyMemberPage(BaseController.PageRequest pageRequest,
                                                           Long familyId,
                                                           Integer status,
                                                           Long roleId) {
        Page<FamilyMemberResponse> page = new Page<>(pageRequest.getCurrent(), pageRequest.getSize());
        return baseMapper.selectFamilyMemberDetailPage(page, familyId, status, roleId);
    }

    @Override
    public List<FamilyMemberResponse> getFamilyMemberList(Long familyId, Integer status) {
        return baseMapper.selectFamilyMemberDetailList(familyId, status);
    }

    @Override
    public FamilyMemberResponse getFamilyMemberDetail(Long id) {
        return baseMapper.selectFamilyMemberDetailById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyMemberResponse updateFamilyMember(UpdateFamilyMemberRequest request, Long userId) {
        FamilyRelation relation = this.getById(request.getId());
        if (relation == null) {
            throw new BusinessException(ResultCode.DATA_NOT_FOUND, "家庭成员关系不存在");
        }

        // 检查权限
        if (!checkMemberManagePermission(relation.getFamilyId(), userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权限管理家庭成员");
        }

        // 更新角色信息
        if (request.getRoleId() != null) {
            if (!familyRoleService.isRoleEnabledById(request.getRoleId())) {
                throw new BusinessException(ResultCode.BUSINESS_ERROR, "角色无效");
            }
            FamilyRole role = familyRoleService.getById(request.getRoleId());
            relation.setRoleId(request.getRoleId());
            relation.setRoleName(role.getRoleName());
        }

        // 更新权限配置
        if (request.getPermissions() != null) {
            relation.setPermissions(request.getPermissions());
        }

        // 更新状态
        if (request.getStatus() != null) {
            relation.setStatus(request.getStatus());
        }

        // 更新备注
        if (request.getRemark() != null) {
            relation.setRemark(request.getRemark());
        }

        if (!this.updateById(relation)) {
            throw new BusinessException(ResultCode.OPERATION_ERROR, "更新家庭成员信息失败");
        }

        return getFamilyMemberDetail(relation.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean removeFamilyMember(Long relationId, Long userId) {
        FamilyRelation relation = this.getById(relationId);
        if (relation == null) {
            throw new BusinessException(ResultCode.DATA_NOT_FOUND, "家庭成员关系不存在");
        }

        // 检查权限
        if (!checkMemberManagePermission(relation.getFamilyId(), userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权限管理家庭成员");
        }

        // 检查是否是家庭创建者
        Family family = familyService.getById(relation.getFamilyId());
        if (family != null && family.getCreatorId().equals(relation.getUserId())) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "不能移除家庭创建者");
        }

        // 更新状态为已退出
        relation.setStatus(0);
        return this.updateById(relation);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyRelation createFamilyRelation(Long familyId, Long userId, Long roleId, Long invitedBy, String remark) {
        // 检查角色是否有效
        FamilyRole role = familyRoleService.getById(roleId);
        if (role == null || role.getStatus() != 1) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "角色无效");
        }

        // 检查是否已存在关系
        if (existsByFamilyIdAndUserId(familyId, userId)) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "用户已经是该家庭的成员");
        }

        // 创建关系
        FamilyRelation relation = new FamilyRelation();
        relation.setFamilyId(familyId);
        relation.setUserId(userId);
        relation.setRoleId(roleId);
        relation.setRoleName(role.getRoleName());
        relation.setPermissions(role.getPermissions()); // 使用角色默认权限
        relation.setInvitedBy(invitedBy);
        relation.setJoinedAt(LocalDateTime.now());
        relation.setStatus(1);
        relation.setRemark(remark);

        if (!this.save(relation)) {
            throw new BusinessException(ResultCode.OPERATION_ERROR, "创建家庭成员关系失败");
        }

        return relation;
    }

    @Override
    public Integer countByFamilyId(Long familyId, Integer status) {
        return baseMapper.countByFamilyId(familyId, status);
    }

    @Override
    public boolean existsByFamilyIdAndUserId(Long familyId, Long userId) {
        return baseMapper.existsByFamilyIdAndUserId(familyId, userId);
    }

    @Override
    public boolean checkMemberManagePermission(Long familyId, Long userId) {
        Family family = familyService.getById(familyId);
        if (family == null) {
            return false;
        }

        // 家庭创建者有管理权限
        if (family.getCreatorId().equals(userId)) {
            return true;
        }

        // 检查用户在家庭中的权限
        FamilyRelation relation = getByFamilyIdAndUserId(familyId, userId);
        if (relation == null || relation.getStatus() != 1) {
            return false;
        }

        // 检查权限配置中是否有管理成员的权限
        if (relation.getPermissions() != null) {
            Object inviteMembers = relation.getPermissions().get("invite_members");
            return inviteMembers != null && Boolean.TRUE.equals(inviteMembers);
        }

        return false;
    }

    @Override
    public List<Long> getFamilyMemberIds(Long familyId) {
        List<FamilyRelation> relations = listByFamilyId(familyId, 1); // 状态为1的活跃成员
        return relations.stream()
                .map(FamilyRelation::getUserId)
                .toList();
    }

    @Override
    public List<Long> getFamilyMemberIdsByRoles(Long familyId, List<Long> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            return getFamilyMemberIds(familyId);
        }

        List<FamilyRelation> relations = listByFamilyId(familyId, 1);
        return relations.stream()
                .filter(relation -> roleIds.contains(relation.getRoleId()))
                .map(FamilyRelation::getUserId)
                .toList();
    }

    @Override
    public List<FamilyMemberResponse> getOnlineFamilyMembers(Long familyId) {
        // 获取所有正常状态的家庭成员
        List<FamilyMemberResponse> allMembers = getFamilyMemberList(familyId, 1);
        
        // 过滤出在线成员（这里可以根据实际需求调整在线判断逻辑）
        // 比如根据用户的最后活跃时间、设备Token状态等
        return allMembers.stream()
            .filter(member -> {
                // 这里可以添加更复杂的在线状态判断逻辑
                // 比如检查用户的设备Token是否有效，最后活跃时间是否在合理范围内等
                return member.getStatus() == 1;
            })
            .collect(Collectors.toList());
    }

    @Override
    public List<FamilyMemberResponse> getOnlineFamilyUsers(Long familyId, Integer onlineThresholdMinutes) {
        // 获取所有正常状态的家庭成员
        List<FamilyMemberResponse> allMembers = getFamilyMemberList(familyId, 1);
        
        // 计算在线时间阈值
        LocalDateTime onlineThreshold = LocalDateTime.now().minusMinutes(onlineThresholdMinutes);
        
        // 过滤出在线用户（基于设备Token活跃状态）
        return allMembers.stream()
            .filter(member -> {
                // 检查用户是否有活跃的设备Token
                int activeTokenCount = userDeviceTokenService.getActiveTokenCount(member.getUserId());
                if (activeTokenCount > 0) {
                    // 获取用户的活跃Token列表
                    List<UserDeviceToken> activeTokens = userDeviceTokenService.getActiveTokensByUserId(member.getUserId());
                    // 检查是否有最近活跃的Token
                    return activeTokens.stream()
                        .anyMatch(token -> token.getLastActiveTime() != null && 
                                         token.getLastActiveTime().isAfter(onlineThreshold));
                }
                return false;
            })
            .collect(Collectors.toList());
    }
}
