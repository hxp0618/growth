// 孕期家庭协作应用 - 色彩系统和设计令牌
// 基于UI-UX设计规范文档

// 主色调 - 温馨粉色系
const primaryColor = '#FF8A9B';
const primaryLight = '#FFB3C1';
const primaryDark = '#E6677A';

// 辅助色 - 柔和蓝色系
const secondaryColor = '#7FB3D3';
const secondaryLight = '#A5C9E0';
const secondaryDark = '#5A9BC4';

export const Colors = {
  light: {
    // 主要颜色
    primary: primaryColor,
    primaryLight: primaryLight,
    primaryDark: primaryDark,
    secondary: secondaryColor,
    secondaryLight: secondaryLight,
    secondaryDark: secondaryDark,
    
    // 中性色系
    neutral100: '#FFFFFF',
    neutral200: '#F8F9FA',
    neutral300: '#E9ECEF',
    neutral400: '#DEE2E6',
    neutral500: '#ADB5BD',
    neutral600: '#6C757D',
    neutral700: '#495057',
    neutral800: '#343A40',
    neutral900: '#212529',
    
    // 功能色彩
    success: '#28A745',
    successLight: '#D4EDDA',
    warning: '#FFC107',
    warningLight: '#FFF3CD',
    error: '#DC3545',
    errorLight: '#F8D7DA',
    info: '#17A2B8',
    infoLight: '#D1ECF1',
    
    // 角色专属色彩
    pregnant: '#FF8A9B',
    partner: '#4A90E2',
    grandparent: '#F5A623',
    family: '#7ED321',
    
    // 界面元素
    text: '#343A40',
    textSecondary: '#6C757D',
    textLight: '#ADB5BD',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    surface: '#FFFFFF',
    border: '#E9ECEF',
    card: '#FFFFFF',
    
    // Tab导航
    tint: primaryColor,
    tabIconDefault: '#ADB5BD',
    tabIconSelected: primaryColor,
    icon: '#6C757D',
  },
  comfort: {
    // 主要颜色 (护眼模式 - 稍微调暖)
    primary: '#F4758A',
    primaryLight: '#F89FAE',
    primaryDark: primaryDark,
    secondary: secondaryColor,
    secondaryLight: secondaryLight,
    secondaryDark: secondaryDark,
    
    // 中性色系 (米色/暖灰系)
    neutral100: '#FBF9F6',
    neutral200: '#F5F2EC',
    neutral300: '#EFEBE3',
    neutral400: '#E8E4DC',
    neutral500: '#ADB5BD',
    neutral600: '#6C757D',
    neutral700: '#495057',
    neutral800: '#343A40',
    neutral900: '#212529',
    
    // 功能色彩 (护眼模式调整)
    success: '#28A745',
    successLight: '#D4EDDA',
    warning: '#E6A700',
    warningLight: '#F4E8B8',
    error: '#DC3545',
    errorLight: '#F8D7DA',
    info: '#17A2B8',
    infoLight: '#D1ECF1',
    
    // 角色专属色彩
    pregnant: '#F4758A',
    partner: '#4A90E2',
    grandparent: '#E09900',
    family: '#7ED321',
    
    // 界面元素 (温暖的米色系)
    text: '#2C2A26',
    textSecondary: '#5C5A56',
    textLight: '#8B8985',
    background: '#FBF9F6',
    backgroundSecondary: '#F5F2EC',
    surface: '#FBF9F6',
    border: '#E8E4DC',
    card: '#FBF9F6',
    
    // Tab导航
    tint: '#F4758A',
    tabIconDefault: '#8B8985',
    tabIconSelected: '#F4758A',
    icon: '#5C5A56',
  },
  dark: {
    // 主要颜色 (暗色模式调整)
    primary: primaryLight,
    primaryLight: '#FFCDD6',
    primaryDark: primaryColor,
    secondary: secondaryLight,
    secondaryLight: '#C4DCE8',
    secondaryDark: secondaryColor,
    
    // 中性色系 (暗色模式) - 温暖深蓝灰系
    neutral100: '#252730',
    neutral200: '#2D2F3A',
    neutral300: '#3A3C47',
    neutral400: '#4A4D5A',
    neutral500: '#ADB5BD',
    neutral600: '#DEE2E6',
    neutral700: '#E9ECEF',
    neutral800: '#F8F9FA',
    neutral900: '#FFFFFF',
    
    // 功能色彩 (暗色模式调整)
    success: '#30D158',
    successLight: '#1E3A26',
    warning: '#FF9F0A',
    warningLight: '#332A1A',
    error: '#FF453A',
    errorLight: '#331A1C',
    info: '#64D2FF',
    infoLight: '#1A2B33',
    
    // 角色专属色彩 (暗色模式调整)
    pregnant: primaryLight,
    partner: '#6BB6FF',
    grandparent: '#FFD60A',
    family: '#A6E83A',
    
    // 界面元素 - 温暖的深蓝灰背景
    text: '#F0F0F0',
    textSecondary: '#B8B9BB',
    textLight: '#8E8E93',
    background: '#1A1B23',
    backgroundSecondary: '#252730',
    surface: '#2D2F3A',
    border: '#3A3C47',
    card: '#252730',
    
    // Tab导航
    tint: primaryLight,
    tabIconDefault: '#8E8E93',
    tabIconSelected: primaryLight,
    icon: '#8E8E93',
  },
};

// 间距系统
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// 字体大小系统
export const FontSizes = {
  // 标题层级
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  
  // 正文层级
  bodyLarge: 16,
  body: 14,
  bodySmall: 12,
  
  // 辅助文字
  caption: 11,
  overline: 10,
  
  // 向后兼容的旧属性名
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

// 字重规范
export const FontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// 圆角系统
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 50,
};

// 阴影系统
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
};

// 情感色彩系统 - 所有主题共享
export const EmotionalColors = {
  love: '#FFE4E6',      // 爱心粉
  hope: '#E8F5E8',      // 希望绿
  calm: '#E6F3FF',      // 宁静蓝
  warm: '#FFF4E6',      // 温暖橙
  comfort: '#F0E6FF',   // 舒适紫
  joy: '#FFF0E6',       // 喜悦橙
};

// 智能主题切换配置
export const ThemeSchedule = {
  light: { start: '06:00', end: '18:00', name: '明亮模式' },
  comfort: { start: '18:00', end: '22:00', name: '护眼模式' },
  dark: { start: '22:00', end: '06:00', name: '夜间模式' },
};

// 主题过渡动画配置
export const ThemeTransition = {
  duration: 300,
  easing: 'ease-in-out',
  properties: ['background-color', 'color', 'border-color'],
};

// 字体系统
export const FontFamilies = {
  // 中文主字体
  chinese: 'PingFang SC',
  chineseFallback: ['PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
  
  // 英文字体
  english: 'SF Pro Display',
  englishFallback: ['SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif'],
  
  // 数字字体
  mono: 'SF Mono',
  monoFallback: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
};