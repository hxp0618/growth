package com.growth.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.growth.entity.UserProfile;
import com.growth.entity.response.UserProfileResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 用户个人信息Mapper接口
 *
 * @author growth
 * @since 1.0
 */
@Mapper
public interface UserProfileMapper extends BaseMapper<UserProfile> {

    /**
     * 根据用户ID查询个人信息详情
     *
     * @param userId 用户ID
     * @return 个人信息详情
     */
    UserProfileResponse selectDetailByUserId(@Param("userId") Long userId);

    /**
     * 根据用户ID查询个人信息
     *
     * @param userId 用户ID
     * @return 个人信息
     */
    UserProfile selectByUserId(@Param("userId") Long userId);
}