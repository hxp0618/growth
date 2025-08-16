package com.growth.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.growth.entity.Family;
import com.growth.entity.response.FamilyPregnancyProgressResponse;
import com.growth.entity.response.FamilyResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 家庭 Mapper 接口
 *
 * @author growth
 * @since 1.0
 */
@Mapper
public interface FamilyMapper extends BaseMapper<Family> {

    /**
     * 根据邀请码查询家庭
     *
     * @param inviteCode 邀请码
     * @return 家庭信息
     */
    Family selectByInviteCode(@Param("inviteCode") String inviteCode);

    /**
     * 根据创建者ID查询家庭列表
     *
     * @param creatorId 创建者ID
     * @return 家庭列表
     */
    List<Family> selectByCreatorId(@Param("creatorId") Long creatorId);

    /**
     * 分页查询家庭详细信息（包含创建者信息和成员数量）
     *
     * @param page      分页参数
     * @param creatorId 创建者ID（可选）
     * @param status    状态（可选）
     * @param keyword   关键词（可选）
     * @return 家庭详细信息分页结果
     */
    IPage<FamilyResponse> selectFamilyDetailPage(Page<FamilyResponse> page,
                                                 @Param("creatorId") Long creatorId,
                                                 @Param("status") Integer status,
                                                 @Param("keyword") String keyword);

    /**
     * 根据ID查询家庭详细信息（包含创建者信息和成员数量）
     *
     * @param id 家庭ID
     * @return 家庭详细信息
     */
    FamilyResponse selectFamilyDetailById(@Param("id") Long id);

    /**
     * 根据用户ID查询用户参与的家庭列表
     *
     * @param userId 用户ID
     * @return 家庭列表
     */
    List<FamilyResponse> selectFamiliesByUserId(@Param("userId") Long userId);

    /**
     * 根据用户ID查询家庭孕妇进度信息
     *
     * @param userId 用户ID
     * @return 家庭孕妇进度信息列表
     */
    List<FamilyPregnancyProgressResponse> selectFamilyPregnancyProgressByUserId(@Param("userId") Long userId);
}