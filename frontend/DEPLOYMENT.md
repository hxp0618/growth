# Growth App 部署指南

## 🚀 部署选项

### Web 部署

#### 1. 构建 Web 版本
```bash
npm run build:web
```

#### 2. 部署到 Vercel
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

#### 3. 部署到 Netlify
```bash
# 构建后将 dist 文件夹上传到 Netlify
npm run build:web
```

### 移动端部署

#### iOS 部署

1. **使用 Expo Application Services (EAS)**
```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账户
eas login

# 配置构建
eas build:configure

# 构建 iOS 应用
eas build --platform ios
```

2. **提交到 App Store**
```bash
eas submit --platform ios
```

#### Android 部署

1. **构建 Android APK/AAB**
```bash
# 构建 Android 应用
eas build --platform android

# 或构建 APK 用于测试
eas build --platform android --profile preview
```

2. **提交到 Google Play Store**
```bash
eas submit --platform android
```

## 📋 部署前检查清单

### 必需配置
- [ ] 更新 `app.json` 中的应用信息
- [ ] 设置正确的 `bundleIdentifier` (iOS) 和 `package` (Android)
- [ ] 准备应用图标和启动屏幕
- [ ] 配置应用权限
- [ ] 设置环境变量

### 资源文件
- [ ] 替换占位符图标 (`assets/icon.png`)
- [ ] 替换启动屏幕图标 (`assets/splash-icon.png`)
- [ ] 添加自适应图标 (`assets/adaptive-icon.png`)
- [ ] 添加网站图标 (`assets/favicon.png`)

### 性能优化
- [ ] 启用代码分割
- [ ] 优化图片资源
- [ ] 配置缓存策略
- [ ] 测试加载性能

## 🔧 EAS 配置文件

创建 `eas.json` 文件：

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 🌍 环境变量

创建 `.env` 文件（不要提交到版本控制）：

```env
# API 配置
API_BASE_URL=https://api.yourapp.com
API_KEY=your_api_key_here

# 功能开关
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true

# 第三方服务
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=your_ga_id
```

## 📱 应用商店资源

### iOS App Store
- 应用图标: 1024x1024px
- 截图: 多种设备尺寸
- 应用描述和关键词
- 隐私政策 URL

### Google Play Store  
- 应用图标: 512x512px
- 功能图片: 1024x500px
- 截图: 多种设备尺寸
- 应用描述和分类
- 隐私政策 URL

## 🔍 测试部署

### 内部测试
```bash
# 构建预览版本
eas build --profile preview

# 使用 Expo Go 测试
npx expo start --dev-client
```

### Beta 测试
- iOS: TestFlight
- Android: Google Play Console 内部测试

## 📊 监控和分析

推荐集成的服务：
- **错误监控**: Sentry
- **分析**: Google Analytics, Mixpanel
- **性能监控**: Flipper, Reactotron
- **崩溃报告**: Crashlytics

## 🔄 CI/CD 流水线

GitHub Actions 示例：

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx eas build --platform all --non-interactive
```

## 🚨 注意事项

1. **权限配置**: 确保在 `app.json` 中正确配置所需权限
2. **版本管理**: 每次发布都要增加版本号
3. **测试**: 在真实设备上充分测试
4. **备份**: 保留构建文件和签名证书
5. **文档**: 维护更新日志和用户文档

## 📞 技术支持

如果在部署过程中遇到问题：
- 查看 [Expo 官方文档](https://docs.expo.dev/)
- 访问 [Expo 社区论坛](https://forums.expo.dev/)
- 检查 [EAS 构建状态](https://expo.dev/accounts/[username]/projects/[project]/builds)