package com.growth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.growth.common.exception.BusinessException;
import com.growth.common.result.ResultCode;
import com.growth.dao.PregnancyProgressMapper;
import com.growth.dao.UserProfileMapper;
import com.growth.entity.PregnancyProgress;
import com.growth.entity.UserProfile;
import com.growth.entity.response.PregnancyProgressResponse;
import com.growth.service.FamilyRelationService;
import com.growth.service.PregnancyProgressService;
import com.growth.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * 孕期进度服务实现类
 *
 * @author system
 * @since 2024-01-01
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PregnancyProgressServiceImpl extends ServiceImpl<PregnancyProgressMapper, PregnancyProgress> implements PregnancyProgressService {

    private final PregnancyProgressMapper pregnancyProgressMapper;
    private final UserProfileMapper userProfileMapper;
    private final FamilyRelationService familyRelationService;
    private final UserProfileService userProfileService;

    @Override
    public PregnancyProgressResponse getPregnancyProgressByUserId(Long userId) {
        log.info("开始获取用户孕期进度信息，用户ID: {}", userId);

        // 1. 获取用户信息，特别是预产期
        UserProfile userProfile = userProfileMapper.selectByUserId(userId);
        if (userProfile == null) {
            throw new BusinessException(ResultCode.DATA_NOT_FOUND, "用户信息不存在");
        }

        // 2. 检查用户是否怀孕以及是否有预产期
        if (!Integer.valueOf(1).equals(userProfile.getIsPregnant()) || userProfile.getExpectedDeliveryDate() == null) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "用户未怀孕或未设置预产期");
        }

        LocalDate expectedDeliveryDate = userProfile.getExpectedDeliveryDate();
        LocalDate currentDate = LocalDate.now();

        // 3. 计算距离预产期的天数
        long daysToDelivery = ChronoUnit.DAYS.between(currentDate, expectedDeliveryDate);
        log.info("用户ID: {}, 预产期: {}, 当前日期: {}, 距离预产期天数: {}",
                userId, expectedDeliveryDate, currentDate, daysToDelivery);

        // 4. 如果已经过了预产期，返回特殊信息
        if (daysToDelivery < 0) {
            PregnancyProgressResponse response = new PregnancyProgressResponse();
            response.setPregnancyWeek(40);
            response.setProgressPercentage(new java.math.BigDecimal("100.00"));
            response.setDaysToDelivery(0);
            response.setBabyWeight(new java.math.BigDecimal("3200.00"));
            response.setFruitComparison("小西瓜");
            response.setEncouragementMessage("宝宝已经出生或即将出生，恭喜你成为妈妈！");
            return response;
        }

        // 5. 根据距离预产期天数查询孕期进度信息
        LambdaQueryWrapper<PregnancyProgress> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.le(PregnancyProgress::getDaysToDelivery, (int) daysToDelivery)
                   .eq(PregnancyProgress::getStatus, 1)
                   .orderByDesc(PregnancyProgress::getDaysToDelivery)
                   .last("LIMIT 1");

        PregnancyProgress progress = pregnancyProgressMapper.selectOne(queryWrapper);

        // 6. 如果没有找到对应的进度信息，返回默认信息
        if (progress == null) {
            log.warn("未找到对应的孕期进度信息，距离预产期天数: {}", daysToDelivery);
            PregnancyProgressResponse response = new PregnancyProgressResponse();
            response.setPregnancyWeek(1);
            response.setProgressPercentage(new java.math.BigDecimal("2.50"));
            response.setDaysToDelivery((int) daysToDelivery);
            response.setBabyWeight(new java.math.BigDecimal("0.1"));
            response.setFruitComparison("芝麻");
            response.setEncouragementMessage("恭喜你怀孕了！新的生命之旅开始了！");
            return response;
        }

        // 7. 转换为响应对象并返回
        PregnancyProgressResponse response = convertToResponse(progress);
        // 使用实际计算的天数
        response.setDaysToDelivery((int) daysToDelivery);

        log.info("成功获取用户孕期进度信息: {}", response);
        return response;
    }

    /**
     * 将实体转换为响应DTO
     *
     * @param progress 孕期进度实体
     * @return 孕期进度响应DTO
     */
    private PregnancyProgressResponse convertToResponse(PregnancyProgress progress) {
        if (progress == null) {
            return null;
        }

        PregnancyProgressResponse response = new PregnancyProgressResponse();
        BeanUtils.copyProperties(progress, response);

        // 设置计算字段
        response.setPregnancyStage(getPregnancyStage(progress.getPregnancyWeek()));
        response.setPregnancyTips(getPregnancyTips(progress.getPregnancyWeek()));

        return response;
    }

    /**
     * 获取孕期阶段描述
     */
    private String getPregnancyStage(Integer pregnancyWeek) {
        if (pregnancyWeek == null) {
            return "未知阶段";
        }
        if (pregnancyWeek <= 12) {
            return "孕早期";
        } else if (pregnancyWeek <= 28) {
            return "孕中期";
        } else {
            return "孕晚期";
        }
    }

    /**
     * 获取孕期提示信息
     */
    private String getPregnancyTips(Integer pregnancyWeek) {
        if (pregnancyWeek == null) {
            return "";
        }
        if (pregnancyWeek <= 12) {
            return "注意休息，避免剧烈运动，补充叶酸";
        } else if (pregnancyWeek <= 28) {
            return "均衡饮食，适量运动，定期产检";
        } else {
            return "准备待产包，注意胎动，随时准备分娩";
        }
    }

    @Override
    public PregnancyProgressResponse getRelatedPregnancyProgress(Long userId) {
        log.info("开始获取用户{}的关联孕期进度信息", userId);
        
        // 1. 首先检查当前用户是否为孕妇
        UserProfile currentUserProfile = userProfileMapper.selectByUserId(userId);
        if (currentUserProfile != null &&
            Integer.valueOf(1).equals(currentUserProfile.getIsPregnant()) &&
            currentUserProfile.getExpectedDeliveryDate() != null) {
            log.info("用户{}是孕妇，返回自己的孕期进度", userId);
            return getPregnancyProgressByUserId(userId);
        }
        
        log.info("用户{}不是孕妇，查找其所属家庭的孕妇信息", userId);
        
        // 2. 查找用户所属的家庭中的孕妇
        // 获取用户参与的家庭列表
        var familyRelations = familyRelationService.listByUserId(userId, 1);
        if (familyRelations == null || familyRelations.isEmpty()) {
            log.info("用户{}未加入任何家庭", userId);
            return null;
        }
        
        // 3. 遍历每个家庭，查找孕妇
        for (var relation : familyRelations) {
            if (relation.getStatus() != 1) {
                continue; // 跳过已退出的家庭
            }
            
            // 获取该家庭的所有成员
            var familyMembers = familyRelationService.getFamilyMemberList(relation.getFamilyId(), 1);
            if (familyMembers == null || familyMembers.isEmpty()) {
                continue;
            }
            
            // 查找家庭中的孕妇
            for (var member : familyMembers) {
                if (member.getUserId().equals(userId)) {
                    continue; // 跳过当前用户自己
                }
                
                UserProfile memberProfile = userProfileMapper.selectByUserId(member.getUserId());
                if (memberProfile != null &&
                    Integer.valueOf(1).equals(memberProfile.getIsPregnant()) &&
                    memberProfile.getExpectedDeliveryDate() != null) {
                    log.info("在家庭{}中找到孕妇用户{}", relation.getFamilyId(), member.getUserId());
                    return getPregnancyProgressByUserId(member.getUserId());
                }
            }
        }
        
        log.info("用户{}所属的家庭中未找到孕妇信息", userId);
        return null;
    }
}
