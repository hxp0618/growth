package com.growth.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.growth.entity.PregnancyProgress;
import com.growth.entity.response.PregnancyProgressResponse;

/**
 * 孕期进度服务接口
 *
 * @author system
 * @since 2024-01-01
 */
public interface PregnancyProgressService extends IService<PregnancyProgress> {

    /**
     * 根据用户ID获取孕期进度信息
     * 通过用户ID获取用户预产期，计算距离预产期的天数，然后查询对应的孕期进度信息
     *
     * @param userId 用户ID
     * @return 孕期进度响应
     */
    PregnancyProgressResponse getPregnancyProgressByUserId(Long userId);

    /**
     * 获取用户关联的孕期进度信息
     * 如果当前用户是孕妇，返回自己的孕期进度
     * 如果当前用户不是孕妇，返回其所属家庭中孕妇的孕期进度
     *
     * @param userId 当前登录用户ID
     * @return 孕期进度响应，如果找不到孕妇信息则返回null
     */
    PregnancyProgressResponse getRelatedPregnancyProgress(Long userId);
}