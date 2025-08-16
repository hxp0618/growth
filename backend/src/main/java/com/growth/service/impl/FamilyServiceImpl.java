package com.growth.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.growth.common.controller.BaseController;
import com.growth.common.exception.BusinessException;
import com.growth.common.result.ResultCode;
import com.growth.dao.FamilyMapper;
import com.growth.entity.Family;
import com.growth.entity.FamilyRole;
import com.growth.entity.request.CreateFamilyRequest;
import com.growth.entity.request.JoinFamilyRequest;
import com.growth.entity.request.UpdateFamilyRequest;
import com.growth.entity.response.FamilyPregnancyProgressResponse;
import com.growth.entity.response.FamilyResponse;
import com.growth.service.FamilyRelationService;
import com.growth.service.FamilyRoleService;
import com.growth.service.FamilyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Random;

/**
 * 家庭服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@Service
public class FamilyServiceImpl extends ServiceImpl<FamilyMapper, Family> implements FamilyService {

    private final FamilyRelationService familyRelationService;
    private final FamilyRoleService familyRoleService;

    public FamilyServiceImpl(@Lazy FamilyRelationService familyRelationService,
                           FamilyRoleService familyRoleService) {
        this.familyRelationService = familyRelationService;
        this.familyRoleService = familyRoleService;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyResponse createFamily(CreateFamilyRequest request, Long userId) {
        // 创建家庭实体
        Family family = new Family();
        BeanUtils.copyProperties(request, family);
        family.setCreatorId(userId);
        family.setInviteCode(generateUniqueInviteCode());
        family.setStatus(1); // 默认正常状态

        // 保存家庭
        if (!this.save(family)) {
            throw new BusinessException(ResultCode.OPERATION_ERROR, "创建家庭失败");
        }

        // 创建创建者的家庭关系（默认为孕妇角色）
        FamilyRole pregnantRole = familyRoleService.getByRoleCode("PREGNANT_WOMAN");
        if (pregnantRole == null) {
            throw new BusinessException(ResultCode.DATA_NOT_FOUND, "默认角色不存在");
        }

        familyRelationService.createFamilyRelation(family.getId(), userId, pregnantRole.getId(), null, "家庭创建者");

        return getFamilyDetail(family.getId(), userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FamilyResponse updateFamily(UpdateFamilyRequest request, Long userId) {
        Family family = this.getById(request.getId());
        if (family == null) {
            throw new BusinessException(ResultCode.DATA_NOT_FOUND, "家庭不存在");
        }

        // 检查权限（只有创建者或有权限的成员可以修改）
        if (!checkFamilyPermission(family.getId(), userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权限修改家庭信息");
        }

        // 更新家庭信息
        if (StringUtils.hasText(request.getName())) {
            family.setName(request.getName());
        }
        if (request.getDescription() != null) {
            family.setDescription(request.getDescription());
        }
        if (request.getAvatar() != null) {
            family.setAvatar(request.getAvatar());
        }
        if (request.getStatus() != null) {
            family.setStatus(request.getStatus());
        }

        if (!this.updateById(family)) {
            throw new BusinessException(ResultCode.OPERATION_ERROR, "更新家庭信息失败");
        }

        return getFamilyDetail(family.getId(), userId);
    }

    @Override
    public FamilyResponse getFamilyDetail(Long id, Long userId) {
        FamilyResponse response = baseMapper.selectFamilyDetailById(id);
        if (response == null) {
            throw new BusinessException(ResultCode.DATA_NOT_FOUND, "家庭不存在");
        }

        // 检查用户是否有权限查看该家庭
        if (!checkFamilyPermission(id, userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权限查看该家庭");
        }

        // 获取家庭成员列表
        response.setMembers(familyRelationService.getFamilyMemberList(id, 1));

        return response;
    }

    @Override
    public IPage<FamilyResponse> getFamilyPage(BaseController.PageRequest pageRequest,
                                               Long creatorId,
                                               Integer status,
                                               String keyword) {
        Page<FamilyResponse> page = new Page<>(pageRequest.getCurrent(), pageRequest.getSize());
        return baseMapper.selectFamilyDetailPage(page, creatorId, status, keyword);
    }

    @Override
    public List<FamilyResponse> getUserFamilies(Long userId) {
        return baseMapper.selectFamiliesByUserId(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean joinFamily(JoinFamilyRequest request, Long userId) {
        // 根据邀请码查找家庭
        Family family = getByInviteCode(request.getInviteCode());
        if (family == null) {
            throw new BusinessException(ResultCode.DATA_NOT_FOUND, "邀请码无效");
        }

        if (family.getStatus() != 1) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "家庭已被禁用");
        }

        // 检查用户是否已经是家庭成员
        if (familyRelationService.existsByFamilyIdAndUserId(family.getId(), userId)) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "您已经是该家庭的成员");
        }

        // 检查角色是否有效
        if (!familyRoleService.isRoleEnabledById(request.getRoleId())) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "角色无效");
        }

        // 创建家庭关系
        familyRelationService.createFamilyRelation(family.getId(), userId, request.getRoleId(), null, request.getRemark());

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean leaveFamilyByUser(Long familyId, Long userId) {
        Family family = this.getById(familyId);
        if (family == null) {
            throw new BusinessException(ResultCode.DATA_NOT_FOUND, "家庭不存在");
        }

        // 创建者不能退出家庭
        if (family.getCreatorId().equals(userId)) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "家庭创建者不能退出家庭，请删除家庭");
        }

        // 查找用户在该家庭的关系
        var relation = familyRelationService.getByFamilyIdAndUserId(familyId, userId);
        if (relation == null) {
            throw new BusinessException(ResultCode.DATA_NOT_FOUND, "您不是该家庭的成员");
        }

        // 更新关系状态为已退出
        relation.setStatus(0);
        return familyRelationService.updateById(relation);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteFamily(Long familyId, Long userId) {
        Family family = this.getById(familyId);
        if (family == null) {
            throw new BusinessException(ResultCode.DATA_NOT_FOUND, "家庭不存在");
        }

        // 只有创建者可以删除家庭
        if (!family.getCreatorId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "只有家庭创建者可以删除家庭");
        }

        // 逻辑删除家庭（BaseEntity中有逻辑删除字段）
        return this.removeById(familyId);
    }

    @Override
    public Family getByInviteCode(String inviteCode) {
        return baseMapper.selectByInviteCode(inviteCode);
    }

    @Override
    public String generateUniqueInviteCode() {
        String inviteCode;
        int maxAttempts = 10;
        int attempts = 0;

        do {
            inviteCode = generateRandomCode();
            attempts++;
            if (attempts > maxAttempts) {
                throw new BusinessException(ResultCode.FAILURE, "生成邀请码失败，请重试");
            }
        } while (getByInviteCode(inviteCode) != null);

        return inviteCode;
    }

    @Override
    public boolean checkFamilyPermission(Long familyId, Long userId) {
        Family family = this.getById(familyId);
        if (family == null) {
            return false;
        }

        // 创建者有所有权限
        if (family.getCreatorId().equals(userId)) {
            return true;
        }

        // 检查是否是家庭成员
        return familyRelationService.existsByFamilyIdAndUserId(familyId, userId);
    }

    @Override
    public List<FamilyPregnancyProgressResponse> getFamilyPregnancyProgress(Long userId) {
        log.info("开始获取用户{}的家庭孕妇进度信息", userId);
        
        List<FamilyPregnancyProgressResponse> responses = baseMapper.selectFamilyPregnancyProgressByUserId(userId);
        
        if (responses == null || responses.isEmpty()) {
            log.info("用户{}没有找到家庭孕妇进度信息", userId);
            return List.of();
        }
        
        log.info("用户{}获取到{}个家庭的孕妇进度信息", userId, responses.size());
        return responses;
    }

    /**
     * 生成随机邀请码
     *
     * @return 邀请码
     */
    private String generateRandomCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }

        return code.toString();
    }
}