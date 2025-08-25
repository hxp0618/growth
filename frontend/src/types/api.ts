// API响应通用类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  timestamp: number;
  success: boolean;
  failure: boolean;
}

// 分页请求参数
export interface PageRequest {
  pageNum: number;
  pageSize: number;
}

// 分页响应结果
export interface PageResult<T> {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: T[];
}

// 家庭相关类型
export interface CreateFamilyRequest {
  name: string;
  description?: string;
  avatar?: string;
}

export interface UpdateFamilyRequest {
  id: number;
  name?: string;
  description?: string;
  avatar?: string;
}

export interface JoinFamilyRequest {
  inviteCode: string;
  roleId: number;
}

export interface FamilyResponse {
  id: number;
  name: string;
  description?: string;
  avatar?: string;
  creatorId: number;
  inviteCode: string;
  memberCount: number;
  status: number;
  createTime: string;
  updateTime: string;
  members?: FamilyMemberResponse[];
}

// 家庭成员相关类型
export interface UpdateFamilyMemberRequest {
  id: number;
  roleId?: number;
  nickname?: string;
  permissions?: string[];
}

export interface FamilyMemberResponse {
  id: number;
  familyId: number;
  userId: number;
  roleId: number;
  nickname?: string;
  avatar?: string;
  joinTime: string;
  status: number;
  permissions?: string[];
  role?: FamilyRoleResponse;
  user?: {
    id: number;
    nickname: string;
    phone: string;
    avatar?: string;
  };
}

// 家庭角色相关类型
export interface FamilyRoleResponse {
  id: number;
  roleName: string;
  roleCode: string;
  description?: string;
  permissions?: string[];
  sortOrder: number;
  status: number;
  createTime: string;
  updateTime: string;
}

// 健康检查相关类型
export interface HealthInfo {
  status: string;
  application: string;
  profile: string;
  timestamp: string;
  version: string;
}

export interface SystemInfo {
  application: {
    name: string;
    version: string;
    profile: string;
  };
  jvm: {
    javaVersion: string;
    totalMemory: string;
    freeMemory: string;
    maxMemory: string;
    processors: number;
  };
  os: {
    name: string;
    version: string;
    arch: string;
  };
  timestamp: string;
}

// 用户个人信息相关类型（与后端API保持一致）
export interface UpdateUserProfileRequest {
  birthDate?: string; // yyyy-MM-dd 格式
  height?: number; // 身高（厘米）
  weight?: number; // 体重（千克）
  allergies?: string; // 过敏史
  medicalHistory?: string; // 既往病史
  isPregnant?: number; // 是否怀孕（0-否，1-是）
  expectedDeliveryDate?: string; // 预产期 yyyy-MM-dd 格式
  lastMenstrualPeriod?: string; // 末次月经日期 yyyy-MM-dd 格式
  pregnancyNotes?: string; // 孕期备注信息
}

export interface UserProfileResponse {
  userId: number; // 用户ID
  nickname: string; // 用户昵称
  birthDate?: string; // 出生日期 yyyy-MM-dd 格式
  age?: number; // 年龄（根据出生日期计算）
  height?: number; // 身高（厘米）
  weight?: number; // 体重（千克）
  bmi?: number; // BMI指数
  allergies?: string; // 过敏史
  medicalHistory?: string; // 既往病史
  isPregnant?: number; // 是否怀孕（0-否，1-是）
  expectedDeliveryDate?: string; // 预产期 yyyy-MM-dd 格式
  lastMenstrualPeriod?: string; // 末次月经日期 yyyy-MM-dd 格式
  pregnancyNotes?: string; // 孕期备注信息
  pregnancyWeeks?: number; // 孕周（根据末次月经计算）
  status: number; // 状态（0-禁用，1-启用）
  createTime: string; // 创建时间 yyyy-MM-dd HH:mm:ss 格式
  updateTime: string; // 更新时间 yyyy-MM-dd HH:mm:ss 格式
}

// 孕期进度相关类型
export interface PregnancyProgressResponse {
  pregnancyWeek: number; // 孕期周数
  progressPercentage: number; // 进度百分比
  daysToDelivery: number; // 距离预产期天数
  babyWeight: number; // 宝宝体重（克）
  fruitComparison: string; // 水果对比
  encouragementMessage: string; // 鼓励话语
  pregnancyStage: string; // 孕期阶段描述
  pregnancyTips: string; // 孕期提示信息
}

// 通知相关类型
export interface SendOneClickNotificationRequest {
  title: string; // 通知标题
  content: string; // 通知内容
  svgIcon?: string; // SVG图标
  familyId: number; // 家庭ID
  receiverIds?: number[]; // 接收者ID列表，为空则发送给所有家庭成员
  priority?: number; // 优先级（1-低，2-中，3-高）
  scheduledTime?: string; // 定时发送时间 yyyy-MM-dd HH:mm:ss 格式
}

export interface CreateNotificationRequest {
  title: string; // 通知标题
  content: string; // 通知内容
  svgIcon?: string; // SVG图标
  familyId: number; // 家庭ID
  type?: number; // 通知类型（1：系统通知，2：用户通知，3：紧急通知）
  priority?: number; // 优先级（1-低，2-中，3-高）
  scheduledTime?: string; // 定时发送时间 yyyy-MM-dd HH:mm:ss 格式
  remark?: string; // 备注信息
  isTemplate?: boolean; // 是否为自定义模板
}

export interface NotificationResponse {
  id: number; // 通知ID
  title: string; // 通知标题
  content: string; // 通知内容
  svgIcon?: string; // SVG图标
  senderId: number; // 发送者ID
  familyId: number; // 家庭ID
  type: number; // 通知类型（1：系统通知，2：用户通知，3：紧急通知）
  priority: number; // 优先级（1-低，2-中，3-高）
  status: number; // 通知状态（0：草稿，1：已发送，2：发送失败）
  scheduledTime?: string; // 定时发送时间
  sentTime?: string; // 实际发送时间
  remark?: string; // 备注信息
  isTemplate?: boolean; // 是否为自定义模板
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  sender?: {
    id: number;
    nickname: string;
    avatar?: string;
  };
}

// 家庭通知模板类型
export interface FamilyNotification {
  id: number; // 通知模板ID
  title: string; // 通知标题
  content: string; // 通知内容
  description?: string; // 通知描述
  svgIcon?: string; // SVG图标
  cardBackColor?: string; // 卡片背景颜色
  creatorId: number; // 创建者用户ID
  familyId: number; // 所属家庭ID
  type: number; // 通知类型（1：系统通知，2：用户通知，3：紧急通知）
  category: string; // 模板分类（custom：自定义，system：系统预设）
  usageCount: number; // 使用次数
  isActive: boolean; // 是否启用
  receiverUserIds?: number[]; // 接收人用户ID列表
  remark?: string; // 备注信息
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

// 通知模板类型
export interface NotificationTemplate {
  id: string;
  title: string;
  content: string;
  icon: string;
  type: number; // 1-一般提醒，2-重要通知，3-紧急情况
  priority: number;
  category: 'health' | 'emergency' | 'reminder' | 'sharing' | 'custom';
  description?: string;
}

// 家庭任务相关类型
export interface CreateFamilyTaskRequest {
  title: string;
  description?: string;
  assignedUserIds: number[];
  familyId: number;
  priority?: number;
  expectedCompletionTime?: string;
  remark?: string;
}

export interface UpdateFamilyTaskRequest {
  id: number;
  title?: string;
  description?: string;
  status?: number;
  assignedUserIds?: number[];
  priority?: number;
  expectedCompletionTime?: string;
  actualCompletionTime?: string;
  remark?: string;
}

export interface FamilyTaskResponse {
  id: number;
  title: string;
  description?: string;
  status: number;
  statusText: string;
  assignedUserIds: number[];
  assignedUserNicknames: string; // 逗号分隔的字符串
  creatorId: number;
  creatorNickname: string;
  familyId: number;
  priority: number;
  priorityText: string;
  expectedCompletionTime?: string;
  actualCompletionTime?: string;
  remark?: string;
  createTime: string;
  updateTime: string;
  createBy: number;
  updateBy: number;
  isDeleted: boolean;
  version: number;
}

export interface ReassignFamilyTaskRequest {
  taskId: number;
  newAssignedUserId: number;
  reason?: string;
}