package com.growth.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.growth.entity.UserProfile;
import com.growth.entity.request.UpdateUserProfileRequest;
import com.growth.entity.response.UserProfileResponse;

/**
 * 用户个人信息服务接口
 *
 * @author growth
 * @since 1.0
 */
public interface UserProfileService extends IService<UserProfile> {

    /**
     * 获取用户个人信息详情
     *
     * @param userId 用户ID
     * @return 个人信息详情
     */
    UserProfileResponse getUserProfileDetail(Long userId);

    /**
     * 更新用户个人信息
     *
     * @param request 更新请求
     * @param userId  用户ID
     * @return 更新后的个人信息详情
     */
    UserProfileResponse updateUserProfile(UpdateUserProfileRequest request, Long userId);

    /**
     * 根据用户ID获取个人信息
     *
     * @param userId 用户ID
     * @return 个人信息
     */
    UserProfile getByUserId(Long userId);

    /**
     * 创建或更新用户个人信息
     *
     * @param userProfile 个人信息
     * @return 是否成功
     */
    boolean saveOrUpdateProfile(UserProfile userProfile);
}