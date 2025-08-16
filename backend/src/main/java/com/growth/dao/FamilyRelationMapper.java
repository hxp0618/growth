package com.growth.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.growth.entity.FamilyRelation;
import com.growth.entity.response.FamilyMemberResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 家庭成员关系 Mapper 接口
 *
 * @author growth
 * @since 1.0
 */
@Mapper
public interface FamilyRelationMapper extends BaseMapper<FamilyRelation> {

    /**
     * 根据家庭ID和用户ID查询关系
     *
     * @param familyId 家庭ID
     * @param userId   用户ID
     * @return 关系信息
     */
    FamilyRelation selectByFamilyIdAndUserId(@Param("familyId") Long familyId, @Param("userId") Long userId);

    /**
     * 根据用户ID查询用户的家庭关系列表
     *
     * @param userId 用户ID
     * @param status 状态（可选）
     * @return 关系列表
     */
    List<FamilyRelation> selectByUserId(@Param("userId") Long userId, @Param("status") Integer status);

    /**
     * 根据家庭ID查询家庭成员关系列表
     *
     * @param familyId 家庭ID
     * @param status   状态（可选）
     * @return 关系列表
     */
    List<FamilyRelation> selectByFamilyId(@Param("familyId") Long familyId, @Param("status") Integer status);

    /**
     * 分页查询家庭成员详细信息（包含用户信息和角色信息）
     *
     * @param page     分页参数
     * @param familyId 家庭ID
     * @param status   状态（可选）
     * @param roleId   角色ID（可选）
     * @return 家庭成员详细信息分页结果
     */
    IPage<FamilyMemberResponse> selectFamilyMemberDetailPage(Page<FamilyMemberResponse> page,
                                                             @Param("familyId") Long familyId,
                                                             @Param("status") Integer status,
                                                             @Param("roleId") Long roleId);

    /**
     * 根据家庭ID查询家庭成员详细信息列表（包含用户信息和角色信息）
     *
     * @param familyId 家庭ID
     * @param status   状态（可选）
     * @return 家庭成员详细信息列表
     */
    List<FamilyMemberResponse> selectFamilyMemberDetailList(@Param("familyId") Long familyId,
                                                            @Param("status") Integer status);

    /**
     * 根据ID查询家庭成员详细信息（包含用户信息和角色信息）
     *
     * @param id 关系ID
     * @return 家庭成员详细信息
     */
    FamilyMemberResponse selectFamilyMemberDetailById(@Param("id") Long id);

    /**
     * 统计家庭成员数量
     *
     * @param familyId 家庭ID
     * @param status   状态（可选）
     * @return 成员数量
     */
    Integer countByFamilyId(@Param("familyId") Long familyId, @Param("status") Integer status);

    /**
     * 检查用户是否已经是家庭成员
     *
     * @param familyId 家庭ID
     * @param userId   用户ID
     * @return 是否存在
     */
    Boolean existsByFamilyIdAndUserId(@Param("familyId") Long familyId, @Param("userId") Long userId);
}