# Growth - React Native 跨平台应用

一个使用 React Native 和 Expo 构建的现代化跨平台应用，支持 Web、iOS 和 Android。

## 功能特性

- 🚀 **跨平台支持**: 一套代码，支持 Web、iOS 和 Android
- 📊 **数据可视化**: 集成图表库，支持折线图、柱状图和饼图
- 📅 **日历管理**: 完整的日历功能，支持事件管理
- 🎨 **现代化 UI**: 支持明暗主题切换
- 🔧 **TypeScript**: 完整的类型安全支持
- 🧭 **文件路由**: 使用 expo-router 实现基于文件的路由系统

## 技术栈

- **框架**: React Native + Expo
- **语言**: TypeScript
- **路由**: Expo Router
- **图表**: React Native Chart Kit
- **日历**: React Native Calendars
- **状态管理**: React Hooks + Context API
- **样式**: StyleSheet + 主题系统

## 项目结构

```
├── app/                    # 应用页面 (expo-router)
│   ├── (tabs)/            # 标签页导航
│   │   ├── index.tsx      # 首页
│   │   ├── charts.tsx     # 图表页面
│   │   ├── calendar.tsx   # 日历页面
│   │   └── profile.tsx    # 个人页面
│   ├── _layout.tsx        # 根布局
│   ├── modal.tsx          # 模态页面
│   └── settings.tsx       # 设置页面
├── src/                   # 源代码
│   ├── components/        # 可复用组件
│   ├── constants/         # 常量定义
│   ├── hooks/            # 自定义 Hooks
│   ├── types/            # TypeScript 类型定义
│   └── utils/            # 工具函数
├── assets/               # 静态资源
└── 配置文件
```

## 开始使用

### 环境要求

- Node.js 18+
- npm 或 yarn
- Expo CLI

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 运行项目

```bash
# 启动开发服务器
npm start

# 在 Web 浏览器中运行
npm run web

# 在 iOS 模拟器中运行
npm run ios

# 在 Android 模拟器中运行
npm run android
```

## 主要功能

### 1. 首页
- 数据统计卡片
- 快速操作按钮
- 功能模块导航

### 2. 图表页面
- 支持折线图、柱状图、饼图
- 动态数据展示
- 图表类型切换

### 3. 日历页面
- 月历视图
- 事件管理（添加、删除）
- 事件详情展示

### 4. 个人页面
- 用户信息展示
- 设置入口
- 统计数据

### 5. 设置页面
- 通用设置开关
- 账户管理
- 应用信息

## 开发指南

### 添加新页面

1. 在 `app/` 目录下创建新的 `.tsx` 文件
2. 使用 `expo-router` 的文件路由系统自动生成路由

### 添加新组件

1. 在 `src/components/` 目录下创建组件文件
2. 遵循项目的 TypeScript 和样式约定

### 主题系统

项目使用统一的主题系统，支持明暗主题：

```typescript
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const colors = Colors[useColorScheme()];
```

### 类型定义

所有类型定义都在 `src/types/index.ts` 中，确保类型安全。

## 构建部署

### Web 部署

```bash
npm run build:web
```

### 移动端构建

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！