package com.growth.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.growth.entity.User;

/**
 * 用户服务接口
 *
 * @author growth
 * @since 1.0
 */
public interface UserService extends IService<User> {

    /**
     * 根据用户名查询用户
     *
     * @param username 用户名
     * @return 用户信息
     */
    User getByUsername(String username);

    /**
     * 根据邮箱查询用户
     *
     * @param email 邮箱
     * @return 用户信息
     */
    User getByEmail(String email);

    /**
     * 根据手机号查询用户
     *
     * @param phone 手机号
     * @return 用户信息
     */
    User getByPhone(String phone);

    /**
     * 创建用户
     *
     * @param user 用户信息
     * @return 是否成功
     */
    boolean createUser(User user);

    /**
     * 更新用户信息
     *
     * @param user 用户信息
     * @return 是否成功
     */
    boolean updateUser(User user);

    /**
     * 删除用户
     *
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean deleteUser(Long userId);

    /**
     * 修改密码
     *
     * @param userId 用户ID
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 是否成功
     */
    boolean changePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 重置密码
     *
     * @param userId 用户ID
     * @param newPassword 新密码
     * @return 是否成功
     */
    boolean resetPassword(Long userId, String newPassword);

    /**
     * 启用/禁用用户
     *
     * @param userId 用户ID
     * @param status 状态（0：禁用，1：启用）
     * @return 是否成功
     */
    boolean changeStatus(Long userId, Integer status);

    /**
     * 更新最后登录信息
     *
     * @param userId 用户ID
     * @param loginIp 登录IP
     * @return 是否成功
     */
    boolean updateLastLoginInfo(Long userId, String loginIp);

    /**
     * 分页查询用户列表
     *
     * @param page 分页参数
     * @param username 用户名（可选）
     * @param email 邮箱（可选）
     * @param status 状态（可选）
     * @return 分页结果
     */
    IPage<User> pageUsers(Page<User> page, String username, String email, Integer status);

    /**
     * 检查用户名是否存在
     *
     * @param username 用户名
     * @param excludeUserId 排除的用户ID（用于更新时检查）
     * @return 是否存在
     */
    boolean isUsernameExists(String username, Long excludeUserId);

    /**
     * 检查邮箱是否存在
     *
     * @param email 邮箱
     * @param excludeUserId 排除的用户ID（用于更新时检查）
     * @return 是否存在
     */
    boolean isEmailExists(String email, Long excludeUserId);

    /**
     * 检查手机号是否存在
     *
     * @param phone 手机号
     * @param excludeUserId 排除的用户ID（用于更新时检查）
     * @return 是否存在
     */
    boolean isPhoneExists(String phone, Long excludeUserId);
}