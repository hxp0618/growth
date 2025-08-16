package com.growth.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.growth.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

/**
 * 用户Mapper接口
 *
 * @author growth
 * @since 1.0
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

    /**
     * 根据用户名查询用户
     *
     * @param username 用户名
     * @return 用户信息
     */
    @Select("SELECT * FROM sys_user WHERE username = #{username} AND is_deleted = 0")
    User selectByUsername(@Param("username") String username);

    /**
     * 根据邮箱查询用户
     *
     * @param email 邮箱
     * @return 用户信息
     */
    @Select("SELECT * FROM sys_user WHERE email = #{email} AND is_deleted = 0")
    User selectByEmail(@Param("email") String email);

    /**
     * 根据手机号查询用户
     *
     * @param phone 手机号
     * @return 用户信息
     */
    @Select("SELECT * FROM sys_user WHERE phone = #{phone} AND is_deleted = 0")
    User selectByPhone(@Param("phone") String phone);

    /**
     * 更新最后登录信息
     *
     * @param userId 用户ID
     * @param lastLoginTime 最后登录时间
     * @param lastLoginIp 最后登录IP
     * @return 影响行数
     */
    @Update("UPDATE sys_user SET last_login_time = #{lastLoginTime}, last_login_ip = #{lastLoginIp} WHERE id = #{userId}")
    int updateLastLoginInfo(@Param("userId") Long userId,
                           @Param("lastLoginTime") java.time.LocalDateTime lastLoginTime,
                           @Param("lastLoginIp") String lastLoginIp);
}
