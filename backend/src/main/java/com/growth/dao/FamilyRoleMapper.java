package com.growth.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.growth.entity.FamilyRole;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 家庭角色 Mapper 接口
 *
 * @author growth
 * @since 1.0
 */
@Mapper
public interface FamilyRoleMapper extends BaseMapper<FamilyRole> {

    /**
     * 根据状态查询角色列表
     *
     * @param status 状态
     * @return 角色列表
     */
    List<FamilyRole> selectByStatus(@Param("status") Integer status);

    /**
     * 根据角色编码查询角色
     *
     * @param roleCode 角色编码
     * @return 角色信息
     */
    FamilyRole selectByRoleCode(@Param("roleCode") String roleCode);

    /**
     * 查询启用状态的角色列表（按排序序号排序）
     *
     * @return 角色列表
     */
    List<FamilyRole> selectEnabledRolesOrderBySortOrder();
}