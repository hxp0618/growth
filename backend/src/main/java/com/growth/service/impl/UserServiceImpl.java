package com.growth.service.impl;

import cn.dev33.satoken.secure.BCrypt;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.growth.common.exception.BusinessException;
import com.growth.common.result.ResultCode;
import com.growth.entity.User;
import com.growth.dao.UserMapper;
import com.growth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 用户服务实现类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final UserMapper userMapper;

    @Override
    public User getByUsername(String username) {
        if (StrUtil.isBlank(username)) {
            return null;
        }
        return userMapper.selectByUsername(username);
    }

    @Override
    public User getByEmail(String email) {
        if (StrUtil.isBlank(email)) {
            return null;
        }
        return userMapper.selectByEmail(email);
    }

    @Override
    public User getByPhone(String phone) {
        if (StrUtil.isBlank(phone)) {
            return null;
        }
        return userMapper.selectByPhone(phone);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean createUser(User user) {
        // 校验用户名是否已存在
        if (isUsernameExists(user.getUsername(), null)) {
            throw BusinessException.of(ResultCode.DATA_EXISTS, "用户名已存在");
        }

        // 校验邮箱是否已存在
        if (StrUtil.isNotBlank(user.getEmail()) && isEmailExists(user.getEmail(), null)) {
            throw BusinessException.of(ResultCode.DATA_EXISTS, "邮箱已存在");
        }

        // 校验手机号是否已存在
        if (StrUtil.isNotBlank(user.getPhone()) && isPhoneExists(user.getPhone(), null)) {
            throw BusinessException.of(ResultCode.DATA_EXISTS, "手机号已存在");
        }

        // 加密密码
        user.setPassword(BCrypt.hashpw(user.getPassword()));

        // 设置默认值
        if (user.getStatus() == null) {
            user.setStatus(1); // 默认启用
        }
        if (user.getGender() == null) {
            user.setGender(0); // 默认未知
        }

        return save(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateUser(User user) {
        User existUser = getById(user.getId());
        if (existUser == null) {
            throw BusinessException.of(ResultCode.DATA_NOT_FOUND, "用户不存在");
        }

        // 校验用户名是否已存在
        if (StrUtil.isNotBlank(user.getUsername()) && isUsernameExists(user.getUsername(), user.getId())) {
            throw BusinessException.of(ResultCode.DATA_EXISTS, "用户名已存在");
        }

        // 校验邮箱是否已存在
        if (StrUtil.isNotBlank(user.getEmail()) && isEmailExists(user.getEmail(), user.getId())) {
            throw BusinessException.of(ResultCode.DATA_EXISTS, "邮箱已存在");
        }

        // 校验手机号是否已存在
        if (StrUtil.isNotBlank(user.getPhone()) && isPhoneExists(user.getPhone(), user.getId())) {
            throw BusinessException.of(ResultCode.DATA_EXISTS, "手机号已存在");
        }

        // 不允许更新密码（通过专门的修改密码接口）
        user.setPassword(null);

        return updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteUser(Long userId) {
        User user = getById(userId);
        if (user == null) {
            throw BusinessException.of(ResultCode.DATA_NOT_FOUND, "用户不存在");
        }
        return removeById(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        User user = getById(userId);
        if (user == null) {
            throw BusinessException.of(ResultCode.DATA_NOT_FOUND, "用户不存在");
        }

        // 验证旧密码
        if (!BCrypt.checkpw(oldPassword, user.getPassword())) {
            throw BusinessException.of(ResultCode.BUSINESS_ERROR, "原密码不正确");
        }

        // 更新密码
        user.setPassword(BCrypt.hashpw(newPassword));
        return updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean resetPassword(Long userId, String newPassword) {
        User user = getById(userId);
        if (user == null) {
            throw BusinessException.of(ResultCode.DATA_NOT_FOUND, "用户不存在");
        }

        // 更新密码
        user.setPassword(BCrypt.hashpw(newPassword));
        return updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean changeStatus(Long userId, Integer status) {
        User user = getById(userId);
        if (user == null) {
            throw BusinessException.of(ResultCode.DATA_NOT_FOUND, "用户不存在");
        }

        user.setStatus(status);
        return updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateLastLoginInfo(Long userId, String loginIp) {
        return userMapper.updateLastLoginInfo(userId, LocalDateTime.now(), loginIp) > 0;
    }

    @Override
    public IPage<User> pageUsers(Page<User> page, String username, String email, Integer status) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StrUtil.isNotBlank(username), User::getUsername, username)
                .like(StrUtil.isNotBlank(email), User::getEmail, email)
                .eq(status != null, User::getStatus, status)
                .orderByDesc(User::getCreateTime);
        return page(page, wrapper);
    }

    @Override
    public boolean isUsernameExists(String username, Long excludeUserId) {
        if (StrUtil.isBlank(username)) {
            return false;
        }
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, username);
        if (excludeUserId != null) {
            wrapper.ne(User::getId, excludeUserId);
        }
        return count(wrapper) > 0;
    }

    @Override
    public boolean isEmailExists(String email, Long excludeUserId) {
        if (StrUtil.isBlank(email)) {
            return false;
        }
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getEmail, email);
        if (excludeUserId != null) {
            wrapper.ne(User::getId, excludeUserId);
        }
        return count(wrapper) > 0;
    }

    @Override
    public boolean isPhoneExists(String phone, Long excludeUserId) {
        if (StrUtil.isBlank(phone)) {
            return false;
        }
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getPhone, phone);
        if (excludeUserId != null) {
            wrapper.ne(User::getId, excludeUserId);
        }
        return count(wrapper) > 0;
    }
}
