package com.growth.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.growth.entity.NotificationPushRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 通知推送记录 Mapper 接口
 *
 * @author growth
 * @since 1.0
 */
@Mapper
public interface NotificationPushRecordMapper extends BaseMapper<NotificationPushRecord> {

    /**
     * 根据模版ID查询推送记录
     *
     * @param templateId 模版ID
     * @return 推送记录列表
     */
    List<NotificationPushRecord> selectByTemplateId(@Param("templateId") Long templateId);

    /**
     * 根据接收者ID查询推送记录
     *
     * @param receiverId 接收者ID
     * @return 推送记录列表
     */
    List<NotificationPushRecord> selectByReceiverId(@Param("receiverId") Long receiverId);

    /**
     * 根据家庭ID查询推送记录
     *
     * @param familyId 家庭ID
     * @return 推送记录列表
     */
    List<NotificationPushRecord> selectByFamilyId(@Param("familyId") Long familyId);

    /**
     * 分页查询推送记录
     *
     * @param page       分页参数
     * @param templateId 模版ID（可选）
     * @param senderId   发送者ID（可选）
     * @param receiverId 接收者ID（可选）
     * @param familyId   家庭ID（可选）
     * @param pushStatus 推送状态（可选）
     * @param isRead     是否已读（可选）
     * @param startTime  开始时间（可选）
     * @param endTime    结束时间（可选）
     * @return 推送记录分页结果
     */
    IPage<NotificationPushRecord> selectPushRecordPage(Page<NotificationPushRecord> page,
                                                       @Param("templateId") Long templateId,
                                                       @Param("senderId") Long senderId,
                                                       @Param("receiverId") Long receiverId,
                                                       @Param("familyId") Long familyId,
                                                       @Param("pushStatus") Integer pushStatus,
                                                       @Param("isRead") Boolean isRead,
                                                       @Param("startTime") LocalDateTime startTime,
                                                       @Param("endTime") LocalDateTime endTime);

    /**
     * 标记消息为已读
     *
     * @param id       记录ID
     * @param readTime 阅读时间
     * @return 更新行数
     */
    int markAsRead(@Param("id") Long id, @Param("readTime") LocalDateTime readTime);

    /**
     * 更新推送状态
     *
     * @param id           记录ID
     * @param pushStatus   推送状态
     * @param pushTime     推送时间
     * @param pushResponse 推送响应
     * @param errorCode    错误代码
     * @param errorMessage 错误信息
     * @return 更新行数
     */
    int updatePushStatus(@Param("id") Long id,
                         @Param("pushStatus") Integer pushStatus,
                         @Param("pushTime") LocalDateTime pushTime,
                         @Param("pushResponse") String pushResponse,
                         @Param("errorCode") String errorCode,
                         @Param("errorMessage") String errorMessage);

    /**
     * 查询未读消息数量
     *
     * @param receiverId 接收者ID
     * @param familyId   家庭ID（可选）
     * @return 未读消息数量
     */
    int countUnreadMessages(@Param("receiverId") Long receiverId,
                           @Param("familyId") Long familyId);

    /**
     * 查询推送失败的记录（用于重试）
     *
     * @param maxRetryCount 最大重试次数
     * @return 推送失败的记录列表
     */
    List<NotificationPushRecord> selectFailedPushRecords(@Param("maxRetryCount") Integer maxRetryCount);

    /**
     * 增加重试次数
     *
     * @param id 记录ID
     * @return 更新行数
     */
    int incrementRetryCount(@Param("id") Long id);
}