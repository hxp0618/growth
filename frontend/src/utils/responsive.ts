import { Dimensions, PixelRatio } from 'react-native';

// 获取屏幕尺寸
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 设计稿基准尺寸（iPhone 12 Pro）
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// 响应式尺寸计算
export const responsive = {
  // 基于宽度的响应式计算
  width: (size: number): number => {
    return PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size);
  },

  // 基于高度的响应式计算
  height: (size: number): number => {
    return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASE_HEIGHT) * size);
  },

  // 基于最小尺寸的响应式计算（推荐用于字体）
  font: (size: number): number => {
    const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
    return PixelRatio.roundToNearestPixel(size * scale);
  },

  // 获取屏幕信息
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isSmallScreen: SCREEN_WIDTH < 375,
    isMediumScreen: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
    isLargeScreen: SCREEN_WIDTH >= 414,
    isTablet: SCREEN_WIDTH >= 768,
  },

  // 断点判断
  breakpoints: {
    xs: SCREEN_WIDTH < 375,  // 小屏手机
    sm: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414, // 中等手机
    md: SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 768,  // 大屏手机
    lg: SCREEN_WIDTH >= 768 && SCREEN_WIDTH < 1024, // 小平板
    xl: SCREEN_WIDTH >= 1024, // 大平板/桌面
  },
};

// 响应式间距
export const responsiveSpacing = {
  xs: responsive.width(4),
  sm: responsive.width(8),
  md: responsive.width(16),
  lg: responsive.width(24),
  xl: responsive.width(32),
  xxl: responsive.width(48),
};

// 响应式字体大小
export const responsiveFontSizes = {
  // 标题层级
  h1: responsive.font(28),
  h2: responsive.font(24),
  h3: responsive.font(20),
  h4: responsive.font(18),
  
  // 正文层级
  bodyLarge: responsive.font(16),
  body: responsive.font(14),
  bodySmall: responsive.font(12),
  
  // 辅助文字
  caption: responsive.font(11),
  overline: responsive.font(10),
};

// 触摸目标最小尺寸（无障碍要求）
export const MINIMUM_TOUCH_SIZE = 44;

// 确保触摸目标符合无障碍标准
export const ensureAccessibleTouchSize = (size: number): number => {
  return Math.max(size, MINIMUM_TOUCH_SIZE);
};

// 响应式布局工具
export const layout = {
  // 卡片间距
  cardMargin: responsive.screen.isSmallScreen ? responsiveSpacing.sm : responsiveSpacing.md,
  cardPadding: responsive.screen.isSmallScreen ? responsiveSpacing.md : responsiveSpacing.lg,
  
  // 页面边距
  pageHorizontalPadding: responsive.screen.isSmallScreen ? responsiveSpacing.md : responsiveSpacing.lg,
  
  // 列表项高度
  listItemHeight: responsive.screen.isSmallScreen ? 60 : 72,
  
  // 底部导航栏高度
  tabBarHeight: responsive.screen.isSmallScreen ? 60 : 72,
  
  // 头部高度
  headerHeight: responsive.screen.isSmallScreen ? 56 : 64,
};

// 响应式网格系统
export const grid = {
  // 获取列数
  getColumns: (): number => {
    if (responsive.breakpoints.xs) return 1;
    if (responsive.breakpoints.sm) return 2;
    if (responsive.breakpoints.md) return 2;
    if (responsive.breakpoints.lg) return 3;
    return 4;
  },
  
  // 获取网格间距
  getGutter: (): number => {
    return responsive.screen.isSmallScreen ? responsiveSpacing.sm : responsiveSpacing.md;
  },
  
  // 计算网格项宽度
  getItemWidth: (columns?: number): number => {
    const cols = columns || grid.getColumns();
    const gutter = grid.getGutter();
    const totalGutter = gutter * (cols - 1);
    const availableWidth = SCREEN_WIDTH - (layout.pageHorizontalPadding * 2) - totalGutter;
    return availableWidth / cols;
  },
};

// 响应式组件尺寸
export const componentSizes = {
  // 按钮
  button: {
    height: ensureAccessibleTouchSize(responsive.screen.isSmallScreen ? 44 : 48),
    borderRadius: responsive.width(8),
    paddingHorizontal: responsive.width(16),
  },
  
  // 输入框
  input: {
    height: ensureAccessibleTouchSize(responsive.screen.isSmallScreen ? 44 : 48),
    borderRadius: responsive.width(8),
    paddingHorizontal: responsive.width(12),
  },
  
  // 卡片
  card: {
    borderRadius: responsive.width(12),
    minHeight: responsive.screen.isSmallScreen ? 80 : 100,
  },
  
  // 头像
  avatar: {
    small: responsive.width(32),
    medium: responsive.width(48),
    large: responsive.width(64),
    xlarge: responsive.width(80),
  },
  
  // 图标
  icon: {
    small: responsive.width(16),
    medium: responsive.width(20),
    large: responsive.width(24),
    xlarge: responsive.width(32),
  },
};

// 监听屏幕尺寸变化
export const addScreenChangeListener = (callback: () => void) => {
  const subscription = Dimensions.addEventListener('change', callback);
  return subscription;
};