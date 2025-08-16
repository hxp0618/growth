package com.growth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.growth.dao.FamilyRoleMapper;
import com.growth.entity.FamilyRole;
import com.growth.entity.response.FamilyRoleResponse;
import com.growth.service.FamilyRoleService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 家庭角色服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Service
public class FamilyRoleServiceImpl extends ServiceImpl<FamilyRoleMapper, FamilyRole> implements FamilyRoleService {

    @Override
    public List<FamilyRoleResponse> listEnabledRoles() {
        List<FamilyRole> roles = baseMapper.selectEnabledRolesOrderBySortOrder();
        return roles.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public FamilyRole getByRoleCode(String roleCode) {
        return baseMapper.selectByRoleCode(roleCode);
    }

    @Override
    public FamilyRoleResponse getRoleDetail(Long id) {
        FamilyRole role = this.getById(id);
        if (role == null) {
            return null;
        }
        return convertToResponse(role);
    }

    @Override
    public boolean isRoleEnabledById(Long roleId) {
        if (roleId == null) {
            return false;
        }
        FamilyRole role = this.getById(roleId);
        return role != null && role.getStatus() != null && role.getStatus() == 1;
    }

    /**
     * 转换为响应对象
     *
     * @param role 角色实体
     * @return 响应对象
     */
    private FamilyRoleResponse convertToResponse(FamilyRole role) {
        FamilyRoleResponse response = new FamilyRoleResponse();
        BeanUtils.copyProperties(role, response);
        return response;
    }
}