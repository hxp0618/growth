package com.growth.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.growth.entity.PregnancyProgress;
import org.apache.ibatis.annotations.Mapper;

/**
 * 孕期进度Mapper接口
 *
 * @author system
 * @since 2024-01-01
 */
@Mapper
public interface PregnancyProgressMapper extends BaseMapper<PregnancyProgress> {

    // 继承BaseMapper已经提供了基本的CRUD操作
    // 由于业务逻辑简化，只需要基本的查询功能即可
}