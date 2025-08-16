package com.growth.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.growth.common.controller.BaseController;
import com.growth.entity.Family;
import com.growth.entity.request.CreateFamilyRequest;
import com.growth.entity.request.JoinFamilyRequest;
import com.growth.entity.request.UpdateFamilyRequest;
import com.growth.entity.response.FamilyPregnancyProgressResponse;
import com.growth.entity.response.FamilyResponse;

import java.util.List;

/**
 * 家庭服务接口
 *
 * @author growth
 * @since 1.0
 */
public interface FamilyService extends IService<Family> {

    /**
     * 创建家庭
     *
     * @param request 创建家庭请求
     * @param userId  当前用户ID
     * @return 家庭详细信息
     */
    FamilyResponse createFamily(CreateFamilyRequest request, Long userId);

    /**
     * 更新家庭信息
     *
     * @param request 更新家庭请求
     * @param userId  当前用户ID
     * @return 家庭详细信息
     */
    FamilyResponse updateFamily(UpdateFamilyRequest request, Long userId);

    /**
     * 根据ID查询家庭详细信息
     *
     * @param id     家庭ID
     * @param userId 当前用户ID
     * @return 家庭详细信息
     */
    FamilyResponse getFamilyDetail(Long id, Long userId);

    /**
     * 分页查询家庭列表
     *
     * @param pageRequest 分页请求
     * @param creatorId   创建者ID（可选）
     * @param status      状态（可选）
     * @param keyword     关键词（可选）
     * @return 家庭列表分页结果
     */
    IPage<FamilyResponse> getFamilyPage(BaseController.PageRequest pageRequest,
                                        Long creatorId,
                                        Integer status,
                                        String keyword);

    /**
     * 查询用户参与的家庭列表
     *
     * @param userId 用户ID
     * @return 家庭列表
     */
    List<FamilyResponse> getUserFamilies(Long userId);

    /**
     * 加入家庭
     *
     * @param request 加入家庭请求
     * @param userId  当前用户ID
     * @return 是否成功
     */
    boolean joinFamily(JoinFamilyRequest request, Long userId);

    /**
     * 退出家庭
     *
     * @param familyId 家庭ID
     * @param userId   当前用户ID
     * @return 是否成功
     */
    boolean leaveFamilyByUser(Long familyId, Long userId);

    /**
     * 删除家庭（仅创建者可删除）
     *
     * @param familyId 家庭ID
     * @param userId   当前用户ID
     * @return 是否成功
     */
    boolean deleteFamily(Long familyId, Long userId);

    /**
     * 根据邀请码查询家庭
     *
     * @param inviteCode 邀请码
     * @return 家庭信息
     */
    Family getByInviteCode(String inviteCode);

    /**
     * 生成唯一的邀请码
     *
     * @return 邀请码
     */
    String generateUniqueInviteCode();

    /**
     * 检查用户是否有权限操作家庭
     *
     * @param familyId 家庭ID
     * @param userId   用户ID
     * @return 是否有权限
     */
    boolean checkFamilyPermission(Long familyId, Long userId);

    /**
     * 获取用户所在家庭的孕妇进度信息
     *
     * @param userId 用户ID
     * @return 家庭孕妇进度信息列表
     */
    List<FamilyPregnancyProgressResponse> getFamilyPregnancyProgress(Long userId);
}