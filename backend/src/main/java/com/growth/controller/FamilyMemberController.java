package com.growth.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.growth.common.controller.BaseController;
import com.growth.entity.request.UpdateFamilyMemberRequest;
import com.growth.entity.response.FamilyMemberResponse;
import com.growth.service.FamilyRelationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.growth.entity.Family;
import com.growth.entity.FamilyRelation;
import com.growth.service.FamilyService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.ArrayList;
import java.util.stream.Collectors;

/**
 * 家庭成员控制器
 *
 * @author growth
 * @since 1.0
 */
@Tag(name = "家庭成员管理", description = "家庭成员相关接口")
@RestController
@RequestMapping("/api/family-members")
@RequiredArgsConstructor
@SaCheckLogin
public class FamilyMemberController extends BaseController {

    private final FamilyRelationService familyRelationService;
    private final FamilyService familyService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Operation(summary = "分页查询家庭成员", description = "分页查询指定家庭的成员列表，支持按状态、角色筛选")
    @GetMapping
    public PageResult<FamilyMemberResponse> getFamilyMemberPage(
            @Parameter(description = "页码", example = "1")
            @RequestParam(defaultValue = "1") Long pageNum,
            @Parameter(description = "每页大小", example = "10")
            @RequestParam(defaultValue = "10") Long pageSize,
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId,
            @Parameter(description = "状态（0：已退出，1：正常）")
            @RequestParam(required = false) Integer status,
            @Parameter(description = "角色ID")
            @RequestParam(required = false) Long roleId) {
        
        PageRequest pageRequest = new PageRequest(pageNum, pageSize);
        IPage<FamilyMemberResponse> page = familyRelationService.getFamilyMemberPage(pageRequest, familyId, status, roleId);
        
        PageResult<FamilyMemberResponse> pageResult = new PageResult<>();
        pageResult.setCurrent(page.getCurrent())
                  .setSize(page.getSize())
                  .setTotal(page.getTotal())
                  .setPages(page.getPages())
                  .setRecords(page.getRecords());
        
        return pageResult;
    }

    @Operation(summary = "查询家庭成员列表", description = "查询指定家庭的所有成员列表")
    @GetMapping("/list")
    public List<FamilyMemberResponse> getFamilyMemberList(
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId,
            @Parameter(description = "状态（0：已退出，1：正常）")
            @RequestParam(required = false) Integer status) {
        return familyRelationService.getFamilyMemberList(familyId, status);
    }

    @Operation(summary = "根据ID查询家庭成员详情", description = "根据关系ID查询家庭成员的详细信息")
    @GetMapping("/{id}")
    public FamilyMemberResponse getFamilyMemberDetail(
            @Parameter(description = "关系ID", required = true)
            @PathVariable Long id) {
        return familyRelationService.getFamilyMemberDetail(id);
    }

    @Operation(summary = "更新家庭成员信息", description = "更新家庭成员的角色、权限等信息，需要有管理权限")
    @PutMapping
    public FamilyMemberResponse updateFamilyMember(@Valid @RequestBody UpdateFamilyMemberRequest request) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyRelationService.updateFamilyMember(request, userId);
    }

    @Operation(summary = "移除家庭成员", description = "将指定成员从家庭中移除，需要有管理权限")
    @DeleteMapping("/{id}")
    public boolean removeFamilyMember(
            @Parameter(description = "关系ID", required = true)
            @PathVariable Long id) {
        Long userId = StpUtil.getLoginIdAsLong();
        return familyRelationService.removeFamilyMember(id, userId);
    }

    @Operation(summary = "统计家庭成员数量", description = "统计指定家庭的成员数量")
    @GetMapping("/count")
    public Integer countFamilyMembers(
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId,
            @Parameter(description = "状态（0：已退出，1：正常）")
            @RequestParam(required = false) Integer status) {
        return familyRelationService.countByFamilyId(familyId, status);
    }

    @Operation(summary = "检查用户是否为家庭成员", description = "检查指定用户是否已经是家庭成员")
    @GetMapping("/check")
    public boolean checkFamilyMember(
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId,
            @Parameter(description = "用户ID", required = true)
            @RequestParam Long userId) {
        return familyRelationService.existsByFamilyIdAndUserId(familyId, userId);
    }

    @Operation(summary = "获取在线家庭成员", description = "获取指定家庭的在线成员列表，基于StpUtil.isLogin判断")
    @GetMapping("/online")
    public List<FamilyMemberResponse> getOnlineFamilyMembers(
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId) {
        // 获取家庭所有成员
        List<FamilyMemberResponse> allMembers = familyRelationService.getFamilyMemberList(familyId, 1);
        
        // 过滤出在线成员
        return allMembers.stream()
                .filter(member -> StpUtil.isLogin(member.getUserId()))
                .collect(Collectors.toList());
    }

    @Operation(summary = "获取家庭在线用户", description = "获取指定家庭的在线用户列表，基于StpUtil.isLogin判断")
    @GetMapping("/online-users")
    public List<FamilyMemberResponse> getOnlineFamilyUsers(
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId,
            @Parameter(description = "在线时间阈值（分钟），默认30分钟，已废弃，保留兼容性")
            @RequestParam(defaultValue = "30") Integer onlineThresholdMinutes) {
        // 获取家庭所有成员
        List<FamilyMemberResponse> allMembers = familyRelationService.getFamilyMemberList(familyId, 1);
        
        // 过滤出在线成员
        return allMembers.stream()
                .filter(member -> StpUtil.isLogin(member.getUserId()))
                .collect(Collectors.toList());
    }

    @Operation(summary = "调试用户家庭成员状态", description = "检查当前用户在指定家庭中的状态")
    @GetMapping("/debug-user-status")
    public Map<String, Object> debugUserFamilyStatus(
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId) {
        Long userId = StpUtil.getLoginIdAsLong();
        
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("familyId", familyId);
        
        // 检查用户是否为家庭成员
        boolean isMember = familyRelationService.existsByFamilyIdAndUserId(familyId, userId);
        result.put("isMember", isMember);
        
        if (isMember) {
            // 获取用户的家庭成员详情
            FamilyRelation relation = familyRelationService.getByFamilyIdAndUserId(familyId, userId);
            if (relation != null) {
                result.put("relationId", relation.getId());
                result.put("roleId", relation.getRoleId());
                result.put("roleName", relation.getRoleName());
                result.put("status", relation.getStatus());
                result.put("joinedAt", relation.getJoinedAt());
                result.put("invitedBy", relation.getInvitedBy());
            }
        }
        
        // 获取家庭的所有成员数量
        Integer totalMembers = familyRelationService.countByFamilyId(familyId, 1);
        result.put("totalMembers", totalMembers);
        
        // 获取家庭详情
        Family family = familyService.getById(familyId);
        if (family != null) {
            result.put("familyName", family.getName());
            result.put("familyCreatorId", family.getCreatorId());
            result.put("isCreator", family.getCreatorId().equals(userId));
        }
        
        return result;
    }

    @Operation(summary = "查询Redis会话信息", description = "查询当前用户的Redis会话信息")
    @GetMapping("/redis-session")
    public Map<String, Object> getRedisSessionInfo() {
        Long userId = StpUtil.getLoginIdAsLong();
        String tokenValue = StpUtil.getTokenValue();
        
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("tokenValue", tokenValue);
        
        // 查询Redis中的会话信息
        try {
            // 查询Authorization:login:session:xxx格式的key
            String sessionKeyPattern = "Authorization:login:session:*";
            Set<String> sessionKeys = redisTemplate.keys(sessionKeyPattern);
            result.put("sessionKeysCount", sessionKeys != null ? sessionKeys.size() : 0);
            
            if (sessionKeys != null && !sessionKeys.isEmpty()) {
                // 查找当前用户的会话key
                String userSessionKey = null;
                for (String key : sessionKeys) {
                    Object value = redisTemplate.opsForValue().get(key);
                    if (value != null && value.toString().contains(userId.toString())) {
                        userSessionKey = key;
                        break;
                    }
                }
                
                if (userSessionKey != null) {
                    result.put("userSessionKey", userSessionKey);
                    Object sessionValue = redisTemplate.opsForValue().get(userSessionKey);
                    result.put("userSessionValue", sessionValue);
                    result.put("userSessionExists", true);
                } else {
                    result.put("userSessionExists", false);
                    result.put("userSessionKey", null);
                    result.put("userSessionValue", null);
                }
                
                // 返回前5个会话key作为示例
                result.put("sampleSessionKeys", sessionKeys.stream().limit(5).toList());
            } else {
                result.put("userSessionExists", false);
                result.put("sampleSessionKeys", List.of());
            }
            
            // 查询其他可能的会话相关key
            String loginKeyPattern = "Authorization:login:*";
            Set<String> loginKeys = redisTemplate.keys(loginKeyPattern);
            result.put("loginKeysCount", loginKeys != null ? loginKeys.size() : 0);
            
            if (loginKeys != null && !loginKeys.isEmpty()) {
                result.put("sampleLoginKeys", loginKeys.stream().limit(5).toList());
            } else {
                result.put("sampleLoginKeys", List.of());
            }
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("errorType", e.getClass().getSimpleName());
        }
        
        return result;
    }

    @Operation(summary = "获取家庭在线用户（基于StpUtil.isLogin）", description = "获取家庭所有成员，使用StpUtil.isLogin判断在线状态")
    @GetMapping("/online-from-stp")
    public Map<String, Object> getOnlineUsersFromStp(
            @Parameter(description = "家庭ID", required = true)
            @RequestParam Long familyId) {
        
        Map<String, Object> result = new HashMap<>();
        result.put("familyId", familyId);
        
        try {
            // 获取家庭所有成员
            List<FamilyMemberResponse> allMembers = familyRelationService.getFamilyMemberList(familyId, 1);
            result.put("totalMembers", allMembers.size());
            
            List<Map<String, Object>> onlineUsers = new ArrayList<>();
            List<Map<String, Object>> allMembersInfo = new ArrayList<>();
            
            for (FamilyMemberResponse member : allMembers) {
                Map<String, Object> memberInfo = new HashMap<>();
                memberInfo.put("userId", member.getUserId());
                memberInfo.put("relationId", member.getId());
                memberInfo.put("roleId", member.getRoleId());
                memberInfo.put("roleName", member.getRoleName());
                memberInfo.put("status", member.getStatus());
                memberInfo.put("nickname", member.getNickname());
                memberInfo.put("joinedAt", member.getJoinedAt());
                
                // 使用StpUtil.isLogin判断用户是否在线
                boolean isOnline = StpUtil.isLogin(member.getUserId());
                memberInfo.put("isOnline", isOnline);
                
                if (isOnline) {
                    onlineUsers.add(memberInfo);
                }
                
                allMembersInfo.add(memberInfo);
            }
            
            result.put("onlineUsers", onlineUsers);
            result.put("onlineUsersCount", onlineUsers.size());
            result.put("allMembers", allMembersInfo);
            result.put("allMembersCount", allMembersInfo.size());
            result.put("success", true);
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("errorType", e.getClass().getSimpleName());
            result.put("success", false);
        }
        
        return result;
    }

    @Operation(summary = "查看Redis会话原始数据", description = "查看Redis中会话的原始数据格式")
    @GetMapping("/redis-session-raw")
    public Map<String, Object> getRedisSessionRawData() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 查询Authorization:login:session:xxx格式的key
            String sessionKeyPattern = "Authorization:login:session:*";
            Set<String> sessionKeys = redisTemplate.keys(sessionKeyPattern);
            result.put("totalSessionKeys", sessionKeys != null ? sessionKeys.size() : 0);
            
            if (sessionKeys != null && !sessionKeys.isEmpty()) {
                List<Map<String, Object>> sessionDetails = new ArrayList<>();
                
                for (String sessionKey : sessionKeys) {
                    try {
                        Object sessionValue = redisTemplate.opsForValue().get(sessionKey);
                        if (sessionValue != null) {
                            Map<String, Object> sessionInfo = new HashMap<>();
                            sessionInfo.put("sessionKey", sessionKey);
                            sessionInfo.put("sessionValue", sessionValue.toString());
                            sessionInfo.put("sessionValueType", sessionValue.getClass().getName());
                            sessionInfo.put("sessionValueClass", sessionValue.getClass().getSimpleName());
                            
                            // 如果是Map类型，显示所有键
                            if (sessionValue instanceof Map) {
                                Map<?, ?> sessionMap = (Map<?, ?>) sessionValue;
                                sessionInfo.put("mapKeys", sessionMap.keySet().toArray());
                                sessionInfo.put("mapSize", sessionMap.size());
                            }
                            
                            sessionDetails.add(sessionInfo);
                        }
                    } catch (Exception e) {
                        Map<String, Object> errorInfo = new HashMap<>();
                        errorInfo.put("sessionKey", sessionKey);
                        errorInfo.put("error", e.getMessage());
                        errorInfo.put("errorType", e.getClass().getSimpleName());
                        sessionDetails.add(errorInfo);
                    }
                }
                
                result.put("sessionDetails", sessionDetails);
            } else {
                result.put("sessionDetails", List.of());
            }
            
            result.put("success", true);
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("errorType", e.getClass().getSimpleName());
            result.put("success", false);
        }
        
        return result;
    }
    
    /**
     * 从会话值中提取用户ID
     * 根据Sa-Token会话格式解析
     */
    private Long extractUserIdFromSession(Object sessionValue) {
        try {
            String sessionValueStr = sessionValue.toString();
            
            // 如果直接是数字字符串
            if (sessionValueStr.matches("\\d+")) {
                return Long.parseLong(sessionValueStr);
            }
            
            // 解析Sa-Token会话格式
            // 格式: {"@class":"cn.dev33.satoken.dao.SaSessionForJacksonCustomized","id":"Authorization:login:session:2","type":"Account-Session","loginType":"login","loginId":["java.lang.Long",2],"token":null,...}
            if (sessionValueStr.contains("\"loginId\"")) {
                // 查找loginId字段
                int loginIdIndex = sessionValueStr.indexOf("\"loginId\"");
                if (loginIdIndex != -1) {
                    // 查找loginId后面的数组开始位置
                    int arrayStart = sessionValueStr.indexOf("[", loginIdIndex);
                    if (arrayStart != -1) {
                        // 查找数组结束位置
                        int arrayEnd = sessionValueStr.indexOf("]", arrayStart);
                        if (arrayEnd != -1) {
                            // 提取数组内容: ["java.lang.Long",2]
                            String arrayContent = sessionValueStr.substring(arrayStart + 1, arrayEnd);
                            // 分割数组元素
                            String[] elements = arrayContent.split(",");
                            if (elements.length >= 2) {
                                // 第二个元素应该是用户ID
                                String userIdStr = elements[1].trim();
                                // 移除可能的引号
                                userIdStr = userIdStr.replace("\"", "");
                                return Long.parseLong(userIdStr);
                            }
                        }
                    }
                }
            }
            
            // 如果是Sa-Token的会话对象，尝试从对象属性中获取
            if (sessionValue instanceof Map) {
                Map<?, ?> sessionMap = (Map<?, ?>) sessionValue;
                Object loginIdObj = sessionMap.get("loginId");
                if (loginIdObj != null) {
                    if (loginIdObj instanceof Number) {
                        return ((Number) loginIdObj).longValue();
                    } else if (loginIdObj instanceof String) {
                        return Long.parseLong((String) loginIdObj);
                    } else if (loginIdObj instanceof List) {
                        List<?> loginIdList = (List<?>) loginIdObj;
                        if (loginIdList.size() >= 2) {
                            Object userIdObj = loginIdList.get(1);
                            if (userIdObj instanceof Number) {
                                return ((Number) userIdObj).longValue();
                            } else if (userIdObj instanceof String) {
                                return Long.parseLong((String) userIdObj);
                            }
                        }
                    }
                }
            }
            
            // 尝试从字符串中查找数字（可能是用户ID）
            String[] parts = sessionValueStr.split("[^0-9]+");
            for (String part : parts) {
                if (!part.isEmpty() && part.length() <= 10) { // 用户ID通常不会超过10位
                    try {
                        long userId = Long.parseLong(part);
                        if (userId > 0) {
                            return userId;
                        }
                    } catch (NumberFormatException ignored) {
                        // 继续尝试下一个
                    }
                }
            }
            
        } catch (Exception e) {
            // 解析失败，返回null
        }
        return null;
    }
}