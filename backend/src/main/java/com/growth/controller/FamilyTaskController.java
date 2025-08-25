package com.growth.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.growth.common.controller.BaseController;
import com.growth.entity.request.CreateFamilyTaskRequest;
import com.growth.entity.request.ReassignFamilyTaskRequest;
import com.growth.entity.request.UpdateFamilyTaskRequest;
import com.growth.entity.response.FamilyTaskResponse;
import com.growth.service.FamilyTaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 家庭任务控制器
 *
 * @author growth
 * @since 1.0
 */
@Tag(name = "家庭任务管理", description = "家庭任务相关接口")
@RestController
@RequestMapping("/api/family-tasks")
@RequiredArgsConstructor
@SaCheckLogin
public class FamilyTaskController extends BaseController {

    private final FamilyTaskService familyTaskService;

    @Operation(summary = "创建家庭任务", description = "创建新的家庭任务并指派给指定成员")
    @PostMapping
    public FamilyTaskResponse createTask(@Valid @RequestBody CreateFamilyTaskRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyTaskService.createTask(request, userId);
    }

    @Operation(summary = "更新家庭任务", description = "更新家庭任务信息")
    @PutMapping
    public FamilyTaskResponse updateTask(@Valid @RequestBody UpdateFamilyTaskRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyTaskService.updateTask(request, userId);
    }

    @Operation(summary = "转派家庭任务", description = "将任务转派给其他家庭成员")
    @PostMapping("/reassign")
    public FamilyTaskResponse reassignTask(@Valid @RequestBody ReassignFamilyTaskRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyTaskService.reassignTask(request, userId);
    }

    @Operation(summary = "删除家庭任务", description = "删除指定的家庭任务")
    @DeleteMapping("/{taskId}")
    public boolean deleteTask(
            @Parameter(description = "任务ID", required = true)
            @PathVariable Long taskId) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyTaskService.deleteTask(taskId, userId);
    }

    @Operation(summary = "获取任务详情", description = "根据任务ID获取任务详细信息")
    @GetMapping("/{taskId}")
    public FamilyTaskResponse getTaskDetail(
            @Parameter(description = "任务ID", required = true)
            @PathVariable Long taskId) {
        return familyTaskService.getTaskDetail(taskId);
    }

    @Operation(summary = "分页查询家庭任务", description = "分页查询家庭任务列表")
    @GetMapping
    public PageResult<FamilyTaskResponse> getTaskPage(
            @Parameter(description = "页码", example = "1")
            @RequestParam(defaultValue = "1") Long pageNum,
            @Parameter(description = "每页大小", example = "10")
            @RequestParam(defaultValue = "10") Long pageSize,
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId,
            @Parameter(description = "任务状态（1：待开始，2：进行中，3：已完成，4：已取消）")
            @RequestParam(required = false) Integer status,
            @Parameter(description = "指定人用户ID")
            @RequestParam(required = false) Long assignedUserId,
            @Parameter(description = "创建者用户ID")
            @RequestParam(required = false) Long creatorId) {
        
        PageRequest pageRequest = new PageRequest(pageNum, pageSize);
        IPage<FamilyTaskResponse> page = familyTaskService.getTaskPage(pageRequest, familyId, status, assignedUserId, creatorId);
        
        PageResult<FamilyTaskResponse> pageResult = new PageResult<>();
        pageResult.setCurrent(page.getCurrent())
                  .setSize(page.getSize())
                  .setTotal(page.getTotal())
                  .setPages(page.getPages())
                  .setRecords(page.getRecords());
        
        return pageResult;
    }

    @Operation(summary = "查询家庭任务列表", description = "查询家庭任务列表")
    @GetMapping("/list")
    public List<FamilyTaskResponse> getTaskList(
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId,
            @Parameter(description = "任务状态（1：待开始，2：进行中，3：已完成，4：已取消）")
            @RequestParam(required = false) Integer status,
            @Parameter(description = "指定人用户ID")
            @RequestParam(required = false) Long assignedUserId,
            @Parameter(description = "创建者用户ID")
            @RequestParam(required = false) Long creatorId) {
        return familyTaskService.getTaskList(familyId, status, assignedUserId, creatorId);
    }

    @Operation(summary = "统计家庭任务数量", description = "统计家庭任务数量")
    @GetMapping("/count")
    public Integer countTasks(
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId,
            @Parameter(description = "任务状态（1：待开始，2：进行中，3：已完成，4：已取消）")
            @RequestParam(required = false) Integer status,
            @Parameter(description = "指定人用户ID")
            @RequestParam(required = false) Long assignedUserId) {
        return familyTaskService.countTasks(familyId, status, assignedUserId);
    }

    @Operation(summary = "完成任务", description = "将任务标记为已完成")
    @PostMapping("/{taskId}/complete")
    public FamilyTaskResponse completeTask(
            @Parameter(description = "任务ID", required = true)
            @PathVariable Long taskId) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyTaskService.completeTask(taskId, userId);
    }

    @Operation(summary = "开始任务", description = "将任务标记为进行中")
    @PostMapping("/{taskId}/start")
    public FamilyTaskResponse startTask(
            @Parameter(description = "任务ID", required = true)
            @PathVariable Long taskId) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyTaskService.startTask(taskId, userId);
    }

    @Operation(summary = "取消任务", description = "将任务标记为已取消")
    @PostMapping("/{taskId}/cancel")
    public FamilyTaskResponse cancelTask(
            @Parameter(description = "任务ID", required = true)
            @PathVariable Long taskId) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyTaskService.cancelTask(taskId, userId);
    }
}
