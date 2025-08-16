package com.growth.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.stp.StpUtil;
import com.growth.common.result.Result;
import com.growth.entity.request.UpdateUserProfileRequest;
import com.growth.entity.response.UserProfileResponse;
import com.growth.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


/**
 * 用户个人信息控制器
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/user/profile")
@RequiredArgsConstructor
@Validated
@SaCheckLogin
public class UserProfileController {

    private final UserProfileService userProfileService;

    /**
     * 获取当前用户个人信息
     */
    @GetMapping
    public Result<UserProfileResponse> getUserProfile() {
        Long userId = StpUtil.getLoginIdAsLong();
        UserProfileResponse response = userProfileService.getUserProfileDetail(userId);
        return Result.success(response);
    }

    /**
     * 获取指定用户个人信息（家庭成员可见）
     */
    @GetMapping("/{userId}")
    public Result<UserProfileResponse> getUserProfileById(@PathVariable Long userId) {
        // TODO: 这里应该添加权限验证，确保当前用户有权限查看指定用户的信息
        // 比如：同一个家庭的成员可以查看彼此的基本信息
        UserProfileResponse response = userProfileService.getUserProfileDetail(userId);
        return Result.success(response);
    }

    /**
     * 更新个人信息
     */
    @PutMapping
    public Result<UserProfileResponse> updateUserProfile(@Valid @RequestBody UpdateUserProfileRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        UserProfileResponse response = userProfileService.updateUserProfile(request, userId);
        return Result.success(response);
    }

    /**
     * 更新基本信息
     */
    @PutMapping("/basic")
    public Result<UserProfileResponse> updateBasicInfo(@Valid @RequestBody UpdateUserProfileRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();

        // 只允许更新基本信息，清空孕期相关字段
        request.setIsPregnant(null);
        request.setExpectedDeliveryDate(null);
        request.setLastMenstrualPeriod(null);
        request.setPregnancyNotes(null);

        UserProfileResponse response = userProfileService.updateUserProfile(request, userId);
        return Result.success(response);
    }

    /**
     * 更新健康信息
     */
    @PutMapping("/health")
    public Result<UserProfileResponse> updateHealthInfo(@Valid @RequestBody UpdateUserProfileRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();

        // 只允许更新健康信息，清空其他字段
        UpdateUserProfileRequest healthRequest = new UpdateUserProfileRequest();
        healthRequest.setAllergies(request.getAllergies());
        healthRequest.setMedicalHistory(request.getMedicalHistory());

        UserProfileResponse response = userProfileService.updateUserProfile(healthRequest, userId);
        return Result.success(response);
    }

    /**
     * 更新孕期信息
     */
    @PutMapping("/pregnancy")
    public Result<UserProfileResponse> updatePregnancyInfo(@Valid @RequestBody UpdateUserProfileRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();

        // 只允许更新孕期信息，清空其他字段
        UpdateUserProfileRequest pregnancyRequest = new UpdateUserProfileRequest();
        pregnancyRequest.setIsPregnant(request.getIsPregnant());
        pregnancyRequest.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        pregnancyRequest.setLastMenstrualPeriod(request.getLastMenstrualPeriod());
        pregnancyRequest.setPregnancyNotes(request.getPregnancyNotes());

        UserProfileResponse response = userProfileService.updateUserProfile(pregnancyRequest, userId);
        return Result.success(response);
    }
}
