package com.growth.common.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.growth.common.result.Result;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 基础控制器
 * 提供通用的控制器功能和工具方法
 *
 * @author growth
 * @since 1.0
 */
public abstract class BaseController {

    @Autowired
    protected HttpServletRequest request;

    @Autowired
    protected HttpServletResponse response;

    /**
     * 获取当前登录用户ID
     */
    protected Long getCurrentUserId() {
        try {
            if (StpUtil.isLogin()) {
                Object loginId = StpUtil.getLoginId();
                if (loginId != null) {
                    return Long.valueOf(loginId.toString());
                }
            }
        } catch (Exception e) {
            // 忽略异常，返回null
        }
        return null;
    }

    /**
     * 获取当前登录用户名
     */
    protected String getCurrentUsername() {
        try {
            if (StpUtil.isLogin()) {
                return StpUtil.getLoginId().toString();
            }
        } catch (Exception e) {
            // 忽略异常，返回null
        }
        return null;
    }

    /**
     * 创建分页对象
     */
    protected <T> Page<T> createPage(PageRequest pageRequest) {
        return new Page<>(pageRequest.getCurrent(), pageRequest.getSize());
    }

    /**
     * 创建分页对象（使用默认参数）
     */
    protected <T> Page<T> createPage() {
        return createPage(new PageRequest());
    }

    /**
     * 包装分页结果
     */
    protected <T> Result<PageResult<T>> pageResult(IPage<T> page) {
        PageResult<T> pageResult = new PageResult<T>()
                .setCurrent(page.getCurrent())
                .setSize(page.getSize())
                .setTotal(page.getTotal())
                .setPages(page.getPages())
                .setRecords(page.getRecords());
        return Result.success(pageResult);
    }

    /**
     * 分页请求参数
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "分页请求参数")
    public static class PageRequest {

        @Schema(description = "当前页码", example = "1")
        private Long current = 1L;

        @Schema(description = "每页大小", example = "10")
        private Long size = 10L;

        public PageRequest() {
        }

        public PageRequest(Long current, Long size) {
            this.current = current != null && current > 0 ? current : 1L;
            this.size = size != null && size > 0 ? size : 10L;
            // 限制每页最大数量
            if (this.size > 100) {
                this.size = 100L;
            }
        }
    }

    /**
     * 分页结果
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "分页结果")
    public static class PageResult<T> {

        @Schema(description = "当前页码")
        private Long current;

        @Schema(description = "每页大小")
        private Long size;

        @Schema(description = "总记录数")
        private Long total;

        @Schema(description = "总页数")
        private Long pages;

        @Schema(description = "数据列表")
        private java.util.List<T> records;
    }
}
