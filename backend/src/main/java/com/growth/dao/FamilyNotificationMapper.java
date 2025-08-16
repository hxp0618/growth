package com.growth.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.growth.entity.FamilyNotification;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 家庭通知模版 Mapper 接口
 *
 * @author growth
 * @since 1.0
 */
@Mapper
public interface FamilyNotificationMapper extends BaseMapper<FamilyNotification> {

    /**
     * 根据家庭ID查询通知模版列表
     *
     * @param familyId 家庭ID
     * @return 通知模版列表
     */
    List<FamilyNotification> selectByFamilyId(@Param("familyId") Long familyId);

    /**
     * 根据创建者ID查询通知模版列表
     *
     * @param creatorId 创建者ID
     * @return 通知模版列表
     */
    List<FamilyNotification> selectByCreatorId(@Param("creatorId") Long creatorId);

    /**
     * 分页查询家庭通知模版
     *
     * @param page      分页参数
     * @param familyId  家庭ID（可选）
     * @param creatorId 创建者ID（可选）
     * @param type      通知类型（可选）
     * @param category  模板分类（可选）
     * @param isActive  是否启用（可选）
     * @param keyword   关键词（可选）
     * @return 通知模版分页结果
     */
    IPage<FamilyNotification> selectNotificationPage(Page<FamilyNotification> page,
                                                     @Param("familyId") Long familyId,
                                                     @Param("creatorId") Long creatorId,
                                                     @Param("type") Integer type,
                                                     @Param("category") String category,
                                                     @Param("isActive") Boolean isActive,
                                                     @Param("keyword") String keyword);

    /**
     * 更新模版使用次数
     *
     * @param id 模版ID
     * @return 更新行数
     */
    int incrementUsageCount(@Param("id") Long id);

    /**
     * 根据家庭ID和类型查询启用的通知模版
     *
     * @param familyId 家庭ID
     * @param type     通知类型
     * @return 通知模版列表
     */
    List<FamilyNotification> selectActiveByFamilyIdAndType(@Param("familyId") Long familyId,
                                                           @Param("type") Integer type);
}