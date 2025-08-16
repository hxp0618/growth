package com.growth.controller;

import com.growth.common.controller.BaseController;
import com.growth.entity.response.FamilyRoleResponse;
import com.growth.service.FamilyRoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 家庭角色控制器
 *
 * @author growth
 * @since 1.0
 */
@Tag(name = "家庭角色管理", description = "家庭角色相关接口")
@RestController
@RequestMapping("/api/family-roles")
@RequiredArgsConstructor
public class FamilyRoleController extends BaseController {

    private final FamilyRoleService familyRoleService;

    @Operation(summary = "查询所有启用的角色列表", description = "获取所有启用状态的家庭角色列表，按排序序号排序")
    @GetMapping("/enabled")
    public List<FamilyRoleResponse> listEnabledRoles() {
        return familyRoleService.listEnabledRoles();
    }

    @Operation(summary = "根据ID查询角色详情", description = "根据角色ID查询角色的详细信息")
    @GetMapping("/{id}")
    public FamilyRoleResponse getRoleDetail(
            @Parameter(description = "角色ID", required = true)
            @PathVariable Long id) {
        return familyRoleService.getRoleDetail(id);
    }

    @Operation(summary = "根据角色编码查询角色", description = "根据角色编码查询角色信息")
    @GetMapping("/code/{roleCode}")
    public FamilyRoleResponse getRoleByCode(
            @Parameter(description = "角色编码", required = true)
            @PathVariable String roleCode) {
        var role = familyRoleService.getByRoleCode(roleCode);
        return role != null ? familyRoleService.getRoleDetail(role.getId()) : null;
    }
}