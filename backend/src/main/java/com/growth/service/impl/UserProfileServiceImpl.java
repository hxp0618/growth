package com.growth.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.growth.common.exception.BusinessException;
import com.growth.common.result.ResultCode;
import com.growth.dao.UserProfileMapper;
import com.growth.entity.UserProfile;
import com.growth.entity.request.UpdateUserProfileRequest;
import com.growth.entity.response.UserProfileResponse;
import com.growth.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 用户个人信息服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl extends ServiceImpl<UserProfileMapper, UserProfile> implements UserProfileService {

    @Override
    public UserProfileResponse getUserProfileDetail(Long userId) {
        UserProfileResponse response = baseMapper.selectDetailByUserId(userId);
        if (response == null) {
            // 如果用户还没有个人信息，返回基本信息
            response = new UserProfileResponse();
            response.setUserId(userId);
            response.setStatus(1);
        }
        return response;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserProfileResponse updateUserProfile(UpdateUserProfileRequest request, Long userId) {
        log.info("接收到更新个人信息请求，用户ID: {}, 请求数据: {}", userId, request);
        log.info("出生日期: {}, 预产期: {}, 末次月经: {}, 是否怀孕: {}",
                request.getBirthDate(), request.getExpectedDeliveryDate(),
                request.getLastMenstrualPeriod(), request.getIsPregnant());
        
        // 验证孕期信息的逻辑性
        validatePregnancyInfo(request);

        UserProfile existingProfile = getByUserId(userId);

        if (existingProfile == null) {
            // 创建新的个人信息
            UserProfile newProfile = new UserProfile();
            newProfile.setUserId(userId);
            copyNonNullProperties(request, newProfile);
            newProfile.setStatus(1);
            
            if (!this.save(newProfile)) {
                throw new BusinessException(ResultCode.OPERATION_ERROR, "创建个人信息失败");
            }
        } else {
            // 更新现有的个人信息
            copyNonNullProperties(request, existingProfile);
            
            if (!this.updateById(existingProfile)) {
                throw new BusinessException(ResultCode.OPERATION_ERROR, "更新个人信息失败");
            }
        }

        return getUserProfileDetail(userId);
    }

    @Override
    public UserProfile getByUserId(Long userId) {
        return baseMapper.selectByUserId(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean saveOrUpdateProfile(UserProfile userProfile) {
        UserProfile existing = getByUserId(userProfile.getUserId());
        if (existing == null) {
            return this.save(userProfile);
        } else {
            userProfile.setId(existing.getId());
            return this.updateById(userProfile);
        }
    }

    /**
     * 验证孕期信息的逻辑性
     */
    private void validatePregnancyInfo(UpdateUserProfileRequest request) {
        if (request.getIsPregnant() != null && request.getIsPregnant() == 1) {
            // 如果设置为怀孕状态，需要验证相关信息
            if (request.getLastMenstrualPeriod() != null) {
                LocalDate lmp = request.getLastMenstrualPeriod();
                LocalDate now = LocalDate.now();

                // 末次月经不能是未来日期
                if (lmp.isAfter(now)) {
                    throw new BusinessException(ResultCode.VALIDATION_ERROR, "末次月经日期不能是未来日期");
                }

                // 末次月经不能超过300天前（大约10个月）
                if (lmp.isBefore(now.minusDays(300))) {
                    throw new BusinessException(ResultCode.VALIDATION_ERROR, "末次月经日期过早，请检查输入");
                }
            }

            if (request.getExpectedDeliveryDate() != null) {
                LocalDate edd = request.getExpectedDeliveryDate();
                LocalDate now = LocalDate.now();

                // 预产期应该在未来
                if (edd.isBefore(now)) {
                    throw new BusinessException(ResultCode.VALIDATION_ERROR, "预产期应该是未来日期");
                }

                // 预产期不应该超过一年后
                if (edd.isAfter(now.plusDays(365))) {
                    throw new BusinessException(ResultCode.VALIDATION_ERROR, "预产期过晚，请检查输入");
                }
            }

            // 如果同时提供了末次月经和预产期，验证它们的一致性
            if (request.getLastMenstrualPeriod() != null && request.getExpectedDeliveryDate() != null) {
                LocalDate calculatedEdd = request.getLastMenstrualPeriod().plusDays(280); // 280天约为40周
                LocalDate providedEdd = request.getExpectedDeliveryDate();

                // 允许7天的误差
                if (Math.abs(calculatedEdd.toEpochDay() - providedEdd.toEpochDay()) > 7) {
                    log.warn("预产期与末次月经计算不一致，用户ID: {}, 末次月经: {}, 预产期: {}", request, request.getLastMenstrualPeriod(), request.getExpectedDeliveryDate());
                }
            }
        }
    }

    /**
     * 复制非null属性
     */
    private void copyNonNullProperties(UpdateUserProfileRequest source, UserProfile target) {
        if (source.getBirthDate() != null) {
            target.setBirthDate(source.getBirthDate());
        }
        if (source.getHeight() != null) {
            target.setHeight(source.getHeight());
        }
        if (source.getWeight() != null) {
            target.setWeight(source.getWeight());
        }
        if (source.getAllergies() != null) {
            target.setAllergies(source.getAllergies());
        }
        if (source.getMedicalHistory() != null) {
            target.setMedicalHistory(source.getMedicalHistory());
        }
        if (source.getIsPregnant() != null) {
            target.setIsPregnant(source.getIsPregnant());
        }
        if (source.getExpectedDeliveryDate() != null) {
            target.setExpectedDeliveryDate(source.getExpectedDeliveryDate());
        }
        if (source.getLastMenstrualPeriod() != null) {
            target.setLastMenstrualPeriod(source.getLastMenstrualPeriod());
        }
        if (source.getPregnancyNotes() != null) {
            target.setPregnancyNotes(source.getPregnancyNotes());
        }
    }
}
