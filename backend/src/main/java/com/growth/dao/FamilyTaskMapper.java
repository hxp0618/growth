package com.growth.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.growth.entity.FamilyTask;
import com.growth.entity.response.FamilyTaskResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 家庭任务Mapper接口
 *
 * @author growth
 * @since 1.0
 */
@Mapper
public interface FamilyTaskMapper extends BaseMapper<FamilyTask> {

    /**
     * 分页查询家庭任务列表
     *
     * @param page 分页参数
     * @param familyId 家庭ID
     * @param status 任务状态
     * @param assignedUserId 指定人用户ID
     * @param creatorId 创建者用户ID
     * @return 任务列表
     */
    IPage<FamilyTaskResponse> selectTaskPage(Page<FamilyTaskResponse> page,
                                           @Param("familyId") Long familyId,
                                           @Param("status") Integer status,
                                           @Param("assignedUserId") Long assignedUserId,
                                           @Param("creatorId") Long creatorId);

    /**
     * 查询家庭任务列表
     *
     * @param familyId 家庭ID
     * @param status 任务状态
     * @param assignedUserId 指定人用户ID
     * @param creatorId 创建者用户ID
     * @return 任务列表
     */
    List<FamilyTaskResponse> selectTaskList(@Param("familyId") Long familyId,
                                          @Param("status") Integer status,
                                          @Param("assignedUserId") Long assignedUserId,
                                          @Param("creatorId") Long creatorId);

    /**
     * 根据ID查询任务详情
     *
     * @param id 任务ID
     * @return 任务详情
     */
    FamilyTaskResponse selectTaskDetail(@Param("id") Long id);

    /**
     * 统计家庭任务数量
     *
     * @param familyId 家庭ID
     * @param status 任务状态
     * @param assignedUserId 指定人用户ID
     * @return 任务数量
     */
    Integer countTasks(@Param("familyId") Long familyId,
                      @Param("status") Integer status,
                      @Param("assignedUserId") Long assignedUserId);
}
