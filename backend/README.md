# Growth Backend

基于 Spring Boot 3 + MyBatis-Plus + Sa-Token + Redis 的后端技术脚手架

## 技术栈

- **框架**: Spring Boot 3.4.5
- **语言**: Java 21
- **数据库**: MySQL 8.0
- **ORM**: MyBatis-Plus 3.5.12
- **权限认证**: Sa-Token 1.39.0
- **缓存**: Redis 8 + Redisson 3.46.0
- **工具**: Lombok
- **文档**: Knife4j (OpenAPI 3.0)
- **部署**: Docker + Docker Compose

## 项目特性

### 🚀 核心特性
- ✅ 统一响应体封装
- ✅ 全局异常处理
- ✅ 参数校验
- ✅ 分页查询
- ✅ 乐观锁支持
- ✅ 逻辑删除
- ✅ 自动填充（创建时间、更新时间等）

### 🔐 安全特性
- ✅ Sa-Token 权限认证
- ✅ JWT Token 支持
- ✅ 密码加密存储
- ✅ 登录状态管理
- ✅ 接口权限控制

### 📚 文档特性
- ✅ Knife4j API 文档
- ✅ 接口在线调试
- ✅ 参数模型展示
- ✅ 响应示例

### 🐳 部署特性
- ✅ Docker 容器化
- ✅ Docker Compose 一键部署
- ✅ 多环境配置
- ✅ 健康检查

## 项目结构

```
src/main/java/com/growth/
├── common/                 # 通用模块
│   ├── advice/            # 全局处理器
│   │   ├── GlobalExceptionHandler.java    # 全局异常处理
│   │   └── ResultHandlerAdvice.java       # 统一响应处理
│   ├── controller/        # 基础控制器
│   │   └── BaseController.java
│   ├── entity/           # 基础实体
│   │   └── BaseEntity.java
│   ├── exception/        # 自定义异常
│   │   └── BusinessException.java
│   └── result/           # 响应结果
│       ├── Result.java
│       └── ResultCode.java
├── config/               # 配置类
│   ├── MetaObjectHandler.java        # 字段自动填充
│   ├── MybatisPlusConfig.java        # MyBatis-Plus配置
│   ├── RedisConfig.java              # Redis配置
│   ├── SaTokenConfig.java            # Sa-Token配置
│   └── SwaggerConfig.java            # Swagger配置
├── controller/           # 控制器
│   ├── AuthController.java           # 认证控制器
│   ├── HealthController.java         # 健康检查
│   └── UserController.java           # 用户控制器
├── entity/              # 实体类
│   └── User.java
├── mapper/              # Mapper接口
│   └── UserMapper.java
├── service/             # 服务层
│   ├── UserService.java
│   └── impl/
│       └── UserServiceImpl.java
└── GrowthBackendApplication.java     # 启动类
```

## 快速开始

### 环境要求

- JDK 21+
- Maven 3.6+
- MySQL 8.0+
- Redis 6.0+

### 本地开发

#### 方式一：快速体验（推荐）
使用内存数据库H2，无需安装MySQL和Redis：

```bash
# 1. 克隆项目
git clone <repository-url>
cd growth-backend

# 2. 使用test配置启动（H2内存数据库）
mvn spring-boot:run -Dspring.profiles.active=test
```

**访问地址**：
- 应用: http://localhost:8080
- API文档: http://localhost:8080/doc.html
- 健康检查: http://localhost:8080/health
- H2控制台: http://localhost:8080/h2-console

#### 方式二：完整环境
需要安装MySQL和Redis：

1. **安装依赖**
   ```bash
   # 安装MySQL 8.0+
   # 安装Redis 6.0+（可选）
   ```

2. **创建数据库**
   ```sql
   -- 执行 src/main/resources/sql/schema.sql
   CREATE DATABASE growth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **修改配置**
   ```yaml
   # src/main/resources/application-dev.yml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/growth
       username: root
       password: your_password
   ```

4. **启动服务**
   ```bash
   # 使用开发环境配置
   mvn spring-boot:run -Dspring.profiles.active=dev
   ```

#### 启动问题解决

**Redis连接错误**：
如果遇到Redis连接错误，有以下解决方案：

1. **启动Redis服务**：
   ```bash
   # macOS
   brew services start redis
   
   # Linux
   sudo systemctl start redis
   
   # Windows
   redis-server.exe
   ```

2. **使用test配置**（推荐）：
   ```bash
   mvn spring-boot:run -Dspring.profiles.active=test
   ```

3. **移除Redis配置**：
   在`application-dev.yml`中注释掉Redis相关配置

### Docker 部署

1. **构建镜像**
   ```bash
   mvn clean package -DskipTests
   docker build -t growth-backend:latest .
   ```

2. **使用 Docker Compose**
   ```bash
   # 启动所有服务
   docker-compose up -d
   
   # 仅启动应用和依赖
   docker-compose up -d mysql redis app
   
   # 包含 Nginx 反向代理
   docker-compose --profile nginx up -d
   ```

3. **查看服务状态**
   ```bash
   docker-compose ps
   docker-compose logs app
   ```

## API 接口

### 认证接口

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 用户登录 | POST | `/auth/login` | 用户名密码登录 |
| 用户注册 | POST | `/auth/register` | 新用户注册 |
| 用户登出 | POST | `/auth/logout` | 退出登录 |
| 获取用户信息 | GET | `/auth/me` | 获取当前登录用户信息 |
| 刷新Token | POST | `/auth/refresh` | 刷新访问令牌 |

### 用户管理

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 用户列表 | GET | `/api/users` | 分页查询用户列表 |
| 用户详情 | GET | `/api/users/{id}` | 获取用户详情 |
| 创建用户 | POST | `/api/users` | 创建新用户 |
| 更新用户 | PUT | `/api/users/{id}` | 更新用户信息 |
| 删除用户 | DELETE | `/api/users/{id}` | 删除用户 |
| 修改密码 | PUT | `/api/users/{id}/password` | 修改用户密码 |
| 重置密码 | PUT | `/api/users/{id}/reset-password` | 重置用户密码 |
| 修改状态 | PUT | `/api/users/{id}/status` | 启用/禁用用户 |

### 健康检查

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 健康检查 | GET | `/health` | 检查系统运行状态 |
| 系统信息 | GET | `/health/info` | 获取系统基本信息 |

## 默认账号

- **用户名**: admin
- **密码**: 123456

## 配置说明

### 数据库配置
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/growth
    username: root
    password: 123456
```

### Redis配置
```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      database: 0
```

### Sa-Token配置
```yaml
sa-token:
  token-name: Authorization
  timeout: 2592000  # 30天
  is-concurrent: true
  token-style: uuid
```

## 开发规范

### 代码风格
- 使用 Lombok 减少样板代码
- 统一使用 `Result<T>` 作为响应体
- 异常使用 `BusinessException` 抛出
- 实体类继承 `BaseEntity`
- 控制器继承 `BaseController`

### 命名规范
- 类名使用 PascalCase
- 方法名和变量名使用 camelCase
- 常量使用 ALL_CAPS
- 包名使用小写

### 数据库规范
- 表名使用下划线分隔
- 字段名使用下划线分隔
- 必须包含基础字段（id、create_time、update_time等）
- 使用逻辑删除

## 常见问题

### 1. 启动失败
- 检查 JDK 版本是否为 21+
- 检查数据库连接配置
- 检查 Redis 连接配置

### 2. 接口返回 401
- 检查是否已登录
- 检查 Token 是否有效
- 检查接口是否在白名单中

### 3. Docker 部署问题
- 检查端口是否被占用
- 检查 Docker 和 Docker Compose 版本
- 查看容器日志排查问题

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目地址: [GitHub Repository]
- 问题反馈: [Issues]
- 邮箱: admin@example.com

---

**Growth Backend** - 让后端开发更简单高效！ 🚀