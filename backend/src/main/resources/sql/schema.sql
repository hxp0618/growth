-- 创建数据库
CREATE DATABASE IF NOT EXISTS `growth` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `growth`;

-- 用户表
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password` VARCHAR(100) NOT NULL COMMENT '密码',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    `gender` TINYINT(1) DEFAULT 0 COMMENT '性别（0：未知，1：男，2：女）',
    `status` TINYINT(1) DEFAULT 1 COMMENT '状态（0：禁用，1：启用）',
    `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
    `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` BIGINT(20) DEFAULT NULL COMMENT '创建人ID',
    `update_by` BIGINT(20) DEFAULT NULL COMMENT '更新人ID',
    `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    `version` INT(11) NOT NULL DEFAULT 1 COMMENT '版本号（乐观锁）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_phone` (`phone`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入默认管理员用户（密码：123456）
INSERT INTO `sys_user` (`id`, `username`, `password`, `nickname`, `email`, `status`, `create_time`, `update_time`)
VALUES (1, 'admin', '$2a$10$7JB720yubVSOMt/hTEnru.VRs3CnAQaja/2q0BI7hNNWpL/QFfQ6y', '系统管理员', 'admin@example.com', 1, NOW(), NOW());




-- 家庭角色表
DROP TABLE IF EXISTS `family_roles`;
CREATE TABLE `family_roles` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
    `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
    `role_code` VARCHAR(50) NOT NULL COMMENT '角色编码',
    `description` VARCHAR(200) DEFAULT NULL COMMENT '角色描述',
    `permissions` JSON DEFAULT NULL COMMENT '默认权限配置JSON',
    `sort_order` INT(11) NOT NULL DEFAULT 0 COMMENT '排序序号',
    `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态（0：禁用，1：启用）',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` BIGINT(20) DEFAULT NULL COMMENT '创建人ID',
    `update_by` BIGINT(20) DEFAULT NULL COMMENT '更新人ID',
    `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    `version` INT(11) NOT NULL DEFAULT 1 COMMENT '版本号（乐观锁）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_code` (`role_code`),
    KEY `idx_role_name` (`role_name`),
    KEY `idx_status` (`status`),
    KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='家庭角色表';

-- 插入默认家庭角色
INSERT INTO `family_roles` (`id`, `role_name`, `role_code`, `description`, `permissions`, `sort_order`, `status`, `create_time`, `update_time`) VALUES
(1, '孕妇', 'PREGNANT_WOMAN', '怀孕的女性，家庭的核心成员', '{"view_all": true, "edit_profile": true, "invite_members": true, "view_records": true, "edit_records": true}', 1, 1, NOW(), NOW()),
(2, '伴侣', 'PARTNER', '孕妇的伴侣，通常是配偶', '{"view_all": true, "edit_profile": true, "invite_members": true, "view_records": true, "edit_records": true}', 2, 1, NOW(), NOW()),
(3, '祖父母', 'GRANDPARENT', '孕妇或伴侣的父母', '{"view_all": true, "edit_profile": true, "view_records": true}', 3, 1, NOW(), NOW()),
(4, '家庭成员', 'FAMILY_MEMBER', '其他家庭成员', '{"view_all": true, "edit_profile": true, "view_records": true}', 4, 1, NOW(), NOW());

-- 家庭表
DROP TABLE IF EXISTS `families`;
CREATE TABLE `families` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '家庭ID',
    `name` VARCHAR(100) NOT NULL COMMENT '家庭名称',
    `creator_id` BIGINT(20) NOT NULL COMMENT '创建者ID',
    `invite_code` VARCHAR(8) NOT NULL COMMENT '家庭邀请码',
    `description` VARCHAR(500) DEFAULT NULL COMMENT '家庭描述',
    `avatar` VARCHAR(500) DEFAULT NULL COMMENT '家庭头像URL',
    `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '家庭状态（0：禁用，1：正常）',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` BIGINT(20) DEFAULT NULL COMMENT '创建人ID',
    `update_by` BIGINT(20) DEFAULT NULL COMMENT '更新人ID',
    `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    `version` INT(11) NOT NULL DEFAULT 1 COMMENT '版本号（乐观锁）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_invite_code` (`invite_code`),
    KEY `idx_creator_id` (`creator_id`),
    KEY `idx_name` (`name`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`),
    CONSTRAINT `fk_families_creator_id` FOREIGN KEY (`creator_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='家庭表';

-- 家庭成员关系表
DROP TABLE IF EXISTS `family_relations`;
CREATE TABLE `family_relations` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '关系ID',
    `family_id` BIGINT(20) NOT NULL COMMENT '家庭ID',
    `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
    `role_id` BIGINT(20) NOT NULL COMMENT '角色ID',
    `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称（冗余字段，便于查询）',
    `permissions` JSON DEFAULT NULL COMMENT '权限配置JSON（可覆盖角色默认权限）',
    `invited_by` BIGINT(20) DEFAULT NULL COMMENT '邀请人ID',
    `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
    `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态（0：已退出，1：正常）',
    `remark` VARCHAR(200) DEFAULT NULL COMMENT '备注信息',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` BIGINT(20) DEFAULT NULL COMMENT '创建人ID',
    `update_by` BIGINT(20) DEFAULT NULL COMMENT '更新人ID',
    `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    `version` INT(11) NOT NULL DEFAULT 1 COMMENT '版本号（乐观锁）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_family_user` (`family_id`, `user_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_role_id` (`role_id`),
    KEY `idx_role_name` (`role_name`),
    KEY `idx_status` (`status`),
    KEY `idx_joined_at` (`joined_at`),
    KEY `idx_invited_by` (`invited_by`),
    CONSTRAINT `fk_family_relations_family_id` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_family_relations_user_id` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_family_relations_role_id` FOREIGN KEY (`role_id`) REFERENCES `family_roles` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_family_relations_invited_by` FOREIGN KEY (`invited_by`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='家庭成员关系表';

-- 用户个人信息表
DROP TABLE IF EXISTS `user_profiles`;
CREATE TABLE `user_profiles` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
    `birth_date` DATE DEFAULT NULL COMMENT '出生日期',
    `height` DECIMAL(5,2) DEFAULT NULL COMMENT '身高（厘米）',
    `weight` DECIMAL(5,2) DEFAULT NULL COMMENT '体重（千克）',
    `allergies` VARCHAR(500) DEFAULT NULL COMMENT '过敏史',
    `medical_history` TEXT DEFAULT NULL COMMENT '既往病史',
    `is_pregnant` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否怀孕（0-否，1-是）',
    `expected_delivery_date` DATE DEFAULT NULL COMMENT '预产期',
    `last_menstrual_period` DATE DEFAULT NULL COMMENT '末次月经日期',
    `pregnancy_notes` TEXT DEFAULT NULL COMMENT '孕期备注信息',
    `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-启用）',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` BIGINT(20) DEFAULT NULL COMMENT '创建人',
    `update_by` BIGINT(20) DEFAULT NULL COMMENT '更新人',
    `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除（0-未删除，1-已删除）',
    `version` INT(11) NOT NULL DEFAULT 1 COMMENT '版本号',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_id` (`user_id`, `is_deleted`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`),
    KEY `idx_is_pregnant` (`is_pregnant`),
    KEY `idx_birth_date` (`birth_date`),
    KEY `idx_expected_delivery_date` (`expected_delivery_date`),
    KEY `idx_last_menstrual_period` (`last_menstrual_period`),
    KEY `idx_create_time` (`create_time`),
    CONSTRAINT `fk_user_profiles_user_id` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户个人信息表';

-- 孕期进度表
DROP TABLE IF EXISTS `pregnancy_progress`;
CREATE TABLE `pregnancy_progress` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `pregnancy_week` INT(11) NOT NULL COMMENT '孕期周数',
    `progress_percentage` DECIMAL(5,2) NOT NULL COMMENT '进度百分比',
    `days_to_delivery` INT(11) NOT NULL COMMENT '距离预产期天数',
    `baby_weight` DECIMAL(8,2) DEFAULT NULL COMMENT '宝宝体重（克）',
    `fruit_comparison` VARCHAR(100) DEFAULT NULL COMMENT '水果对比',
    `encouragement_message` TEXT DEFAULT NULL COMMENT '鼓励话语',
    `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-启用）',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` BIGINT(20) DEFAULT NULL COMMENT '创建人ID',
    `update_by` BIGINT(20) DEFAULT NULL COMMENT '更新人ID',
    `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    `version` INT(11) NOT NULL DEFAULT 1 COMMENT '版本号（乐观锁）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_pregnancy_week` (`pregnancy_week`),
    KEY `idx_pregnancy_week` (`pregnancy_week`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='孕期进度表';

-- 添加索引优化查询性能
CREATE INDEX `idx_user_profiles_birth_date` ON `user_profiles` (`birth_date`);
CREATE INDEX `idx_user_profiles_expected_delivery_date` ON `user_profiles` (`expected_delivery_date`);
CREATE INDEX `idx_user_profiles_last_menstrual_period` ON `user_profiles` (`last_menstrual_period`);



-- 修改 sys_user 表
ALTER TABLE `sys_user` MODIFY COLUMN `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID';

-- 修改 family_roles 表
ALTER TABLE `family_roles` MODIFY COLUMN `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID';

-- 修改 families 表
ALTER TABLE `families` MODIFY COLUMN `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '家庭ID';

-- 修改 family_relations 表
ALTER TABLE `family_relations` MODIFY COLUMN `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '关系ID';

-- 修改 user_profiles 表
ALTER TABLE `user_profiles` MODIFY COLUMN `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID';


-- 删除已存在的表
DROP TABLE IF EXISTS `pregnancy_progress`;

-- 创建孕期进度表
CREATE TABLE `pregnancy_progress` (
                                      `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                                      `pregnancy_week` INT(11) NOT NULL COMMENT '孕期周数',
                                      `progress_percentage` DECIMAL(5,2) NOT NULL COMMENT '进度百分比',
                                      `days_to_delivery` INT(11) NOT NULL COMMENT '距离预产期天数',
                                      `baby_weight` DECIMAL(8,2) DEFAULT NULL COMMENT '宝宝体重（克）',
                                      `fruit_comparison` VARCHAR(100) DEFAULT NULL COMMENT '水果对比',
                                      `encouragement_message` TEXT DEFAULT NULL COMMENT '鼓励话语',
                                      `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-启用）',
                                      `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                      `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                      `create_by` BIGINT(20) DEFAULT NULL COMMENT '创建人ID',
                                      `update_by` BIGINT(20) DEFAULT NULL COMMENT '更新人ID',
                                      `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
                                      `version` INT(11) NOT NULL DEFAULT 1 COMMENT '版本号（乐观锁）',
                                      PRIMARY KEY (`id`),
                                      UNIQUE KEY `uk_pregnancy_week` (`pregnancy_week`),
                                      KEY `idx_pregnancy_week` (`pregnancy_week`),
                                      KEY `idx_status` (`status`),
                                      KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='孕期进度表';


-- 用户设备Token表结构
-- 创建时间：2025-08-12
-- 作者：growth

-- 用户设备Token表
CREATE TABLE `user_device_tokens` (
                                      `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                                      `user_id` BIGINT NOT NULL COMMENT '用户ID',
                                      `device_token` VARCHAR(500) NOT NULL COMMENT '设备Token',
                                      `platform` VARCHAR(20) NOT NULL COMMENT '平台类型（ios/android/web）',
                                      `device_info` TEXT COMMENT '设备信息（JSON格式）',
                                      `app_version` VARCHAR(50) COMMENT '应用版本',
                                      `push_enabled` BOOLEAN DEFAULT TRUE COMMENT '是否启用推送',
                                      `last_active_time` DATETIME COMMENT '最后活跃时间',
                                      `status` TINYINT DEFAULT 1 COMMENT '状态（0：禁用，1：启用）',
                                      `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                      `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                      `create_by` BIGINT COMMENT '创建人ID',
                                      `update_by` BIGINT COMMENT '更新人ID',
                                      `is_deleted` BOOLEAN DEFAULT FALSE COMMENT '逻辑删除标识（0：未删除，1：已删除）',
                                      `version` INT DEFAULT 0 COMMENT '版本号（乐观锁）',
                                      PRIMARY KEY (`id`),
                                      UNIQUE KEY `uk_device_token` (`device_token`),
                                      INDEX `idx_user_id` (`user_id`),
                                      INDEX `idx_platform` (`platform`),
                                      INDEX `idx_status` (`status`),
                                      INDEX `idx_push_enabled` (`push_enabled`),
                                      INDEX `idx_last_active_time` (`last_active_time`),
                                      INDEX `idx_create_time` (`create_time`),
                                      CONSTRAINT `fk_user_device_tokens_user_id` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户设备Token表';

-- 创建索引优化查询性能
CREATE INDEX `idx_user_platform` ON `user_device_tokens` (`user_id`, `platform`);
CREATE INDEX `idx_active_tokens` ON `user_device_tokens` (`status`, `push_enabled`, `last_active_time`);

-- 简化的通知系统表结构（2025-08-16重构）
-- 作者：growth

-- 通知模版表（原notifications表，重新定义为模版表）
DROP TABLE IF EXISTS `family_notifications`;
CREATE TABLE `family_notifications` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title` VARCHAR(100) NOT NULL COMMENT '通知标题',
    `content` VARCHAR(1000) NOT NULL COMMENT '通知内容',
    `svg_icon` TEXT COMMENT '通知SVG图标',
    `creator_id` BIGINT NOT NULL COMMENT '创建者用户ID',
    `family_id` BIGINT NOT NULL COMMENT '所属家庭ID',
    `type` TINYINT DEFAULT 2 COMMENT '通知类型（1：系统通知，2：用户通知，3：紧急通知）',
    `priority` TINYINT DEFAULT 2 COMMENT '优先级（1：低，2：中，3：高）',
    `category` VARCHAR(50) DEFAULT 'custom' COMMENT '模板分类（custom：自定义，system：系统预设）',
    `usage_count` INT DEFAULT 0 COMMENT '使用次数',
    `is_active` BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    `remark` VARCHAR(500) COMMENT '备注信息',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `is_deleted` BOOLEAN DEFAULT FALSE COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    `version` INT DEFAULT 0 COMMENT '版本号（乐观锁）',
    PRIMARY KEY (`id`),
    INDEX `idx_creator_id` (`creator_id`),
    INDEX `idx_family_id` (`family_id`),
    INDEX `idx_category` (`category`),
    INDEX `idx_type` (`type`),
    INDEX `idx_priority` (`priority`),
    INDEX `idx_is_active` (`is_active`),
    INDEX `idx_usage_count` (`usage_count`),
    INDEX `idx_create_time` (`create_time`),
    CONSTRAINT `fk_notifications_creator_id` FOREIGN KEY (`creator_id`) REFERENCES `sys_user` (`id`),
    CONSTRAINT `fk_notifications_family_id` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知模版表';

-- 通知推送记录表（合并所有推送相关信息）
DROP TABLE IF EXISTS `notification_push_records`;
CREATE TABLE `notification_push_records` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `template_id` BIGINT COMMENT '使用的模板ID（可选）',
    `title` VARCHAR(100) NOT NULL COMMENT '通知标题',
    `content` VARCHAR(1000) NOT NULL COMMENT '通知内容',
    `svg_icon` TEXT COMMENT '通知SVG图标',
    `sender_id` BIGINT NOT NULL COMMENT '发送者用户ID',
    `receiver_id` BIGINT NOT NULL COMMENT '接收者用户ID',
    `family_id` BIGINT NOT NULL COMMENT '家庭ID',
    `type` TINYINT DEFAULT 2 COMMENT '通知类型（1：系统通知，2：用户通知，3：紧急通知）',
    `priority` TINYINT DEFAULT 2 COMMENT '优先级（1：低，2：中，3：高）',
    `scheduled_time` DATETIME COMMENT '计划发送时间（为空则立即发送）',
    `sent_time` DATETIME COMMENT '实际发送时间',

    -- 接收者相关信息（合并自notification_receivers）
    `role_id` BIGINT COMMENT '接收者在家庭中的角色ID',
    `role_name` VARCHAR(50) COMMENT '接收者在家庭中的角色名称',
    `is_read` BOOLEAN DEFAULT FALSE COMMENT '是否已读（0：未读，1：已读）',
    `read_time` DATETIME COMMENT '阅读时间',

    -- 推送相关信息（合并自原notification_push_records）
    `device_token_id` BIGINT COMMENT '设备Token ID',
    `device_token` VARCHAR(500) COMMENT '推送时使用的设备Token',
    `platform` VARCHAR(20) COMMENT '设备平台',
    `push_status` TINYINT DEFAULT 0 COMMENT '推送状态（0：未推送，1：推送成功，2：推送失败）',
    `push_time` DATETIME COMMENT '推送时间',
    `push_response` TEXT COMMENT '推送响应信息',
    `error_code` VARCHAR(50) COMMENT '错误代码',
    `error_message` VARCHAR(500) COMMENT '推送失败原因',
    `retry_count` INT DEFAULT 0 COMMENT '重试次数',

    -- 通用字段
    `status` TINYINT DEFAULT 0 COMMENT '记录状态（0：正常，1：已删除，2：发送失败）',
    `is_one_click` BOOLEAN DEFAULT FALSE COMMENT '是否为一键通知',
    `remark` VARCHAR(500) COMMENT '备注信息',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` BIGINT COMMENT '创建人ID',
    `update_by` BIGINT COMMENT '更新人ID',
    `is_deleted` BOOLEAN DEFAULT FALSE COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    `version` INT DEFAULT 0 COMMENT '版本号（乐观锁）',

    PRIMARY KEY (`id`),
    INDEX `idx_template_id` (`template_id`),
    INDEX `idx_sender_id` (`sender_id`),
    INDEX `idx_receiver_id` (`receiver_id`),
    INDEX `idx_family_id` (`family_id`),
    INDEX `idx_device_token_id` (`device_token_id`),
    INDEX `idx_role_id` (`role_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_type` (`type`),
    INDEX `idx_priority` (`priority`),
    INDEX `idx_push_status` (`push_status`),
    INDEX `idx_is_read` (`is_read`),
    INDEX `idx_scheduled_time` (`scheduled_time`),
    INDEX `idx_sent_time` (`sent_time`),
    INDEX `idx_push_time` (`push_time`),
    INDEX `idx_read_time` (`read_time`),
    INDEX `idx_create_time` (`create_time`),
    INDEX `idx_is_one_click` (`is_one_click`),

    CONSTRAINT `fk_push_records_template_id` FOREIGN KEY (`template_id`) REFERENCES `notifications` (`id`),
    CONSTRAINT `fk_push_records_sender_id` FOREIGN KEY (`sender_id`) REFERENCES `sys_user` (`id`),
    CONSTRAINT `fk_push_records_receiver_id` FOREIGN KEY (`receiver_id`) REFERENCES `sys_user` (`id`),
    CONSTRAINT `fk_push_records_family_id` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`),
    CONSTRAINT `fk_push_records_role_id` FOREIGN KEY (`role_id`) REFERENCES `family_roles` (`id`),
    CONSTRAINT `fk_push_records_device_token_id` FOREIGN KEY (`device_token_id`) REFERENCES `user_device_tokens` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知推送记录表';

-- 创建视图用于统计分析
CREATE VIEW `v_notification_stats` AS
SELECT
    npr.template_id,
    n.title as template_title,
    n.creator_id,
    n.family_id,
    COUNT(npr.id) as total_sends,
    COUNT(CASE WHEN npr.is_read = TRUE THEN 1 END) as read_count,
    COUNT(CASE WHEN npr.is_read = FALSE THEN 1 END) as unread_count,
    COUNT(CASE WHEN npr.push_status = 1 THEN 1 END) as push_success_count,
    COUNT(CASE WHEN npr.push_status = 2 THEN 1 END) as push_failed_count,
    COUNT(DISTINCT npr.receiver_id) as unique_receivers,
    ROUND(COUNT(CASE WHEN npr.is_read = TRUE THEN 1 END) * 100.0 / COUNT(npr.id), 2) as read_rate,
    ROUND(COUNT(CASE WHEN npr.push_status = 1 THEN 1 END) * 100.0 / COUNT(npr.id), 2) as push_success_rate
FROM notification_push_records npr
LEFT JOIN family_notifications n ON npr.template_id = n.id
WHERE npr.is_deleted = FALSE
GROUP BY npr.template_id, n.title, n.creator_id, n.family_id;

-- 插入一些系统预设模板
INSERT INTO `notifications` (`title`, `content`, `svg_icon`, `creator_id`, `family_id`, `priority`, `category`, `remark`, `create_by`) VALUES
('产检提醒', '需要家人陪同去产检，请及时关注！', '🏥', 1, 1, 2, 'system', '系统预设模板', 1),
('身体不适', '身体感到不适，需要家人关注和照顾', '😷', 1, 1, 3, 'system', '系统预设模板', 1),
('分享喜悦', '想要分享胎动、B超等美好时刻！', '😊', 1, 1, 1, 'system', '系统预设模板', 1),
('紧急情况', '遇到紧急情况，请立即联系！', '🚨', 1, 1, 3, 'system', '系统预设模板', 1),
('服药提醒', '该服用维生素或其他药物了', '💊', 1, 1, 2, 'system', '系统预设模板', 1),
('预约提醒', '有重要的医疗预约或检查', '📅', 1, 1, 2, 'system', '系统预设模板', 1),
('用餐提醒', '该吃饭了，注意营养均衡', '🍽️', 1, 1, 1, 'system', '系统预设模板', 1),
('运动提醒', '适当运动有益健康', '🤸‍♀️', 1, 1, 1, 'system', '系统预设模板', 1);
