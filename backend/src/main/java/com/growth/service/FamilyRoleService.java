package com.growth.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.growth.entity.FamilyRole;
import com.growth.entity.response.FamilyRoleResponse;

import java.util.List;

/**
 * 家庭角色服务接口
 *
 * @author growth
 * @since 1.0
 */
public interface FamilyRoleService extends IService<FamilyRole> {

    /**
     * 查询所有启用状态的角色列表
     *
     * @return 角色列表
     */
    List<FamilyRoleResponse> listEnabledRoles();

    /**
     * 根据角色编码查询角色
     *
     * @param roleCode 角色编码
     * @return 角色信息
     */
    FamilyRole getByRoleCode(String roleCode);

    /**
     * 根据ID查询角色详细信息
     *
     * @param id 角色ID
     * @return 角色详细信息
     */
    FamilyRoleResponse getRoleDetail(Long id);

    /**
     * 检查角色是否存在且启用
     *
     * @param roleId 角色ID
     * @return 是否存在且启用
     */
    boolean isRoleEnabledById(Long roleId);
}