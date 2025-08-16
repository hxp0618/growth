import { AccessibilityInfo, Platform } from 'react-native';

// 无障碍功能工具类
export class AccessibilityUtils {
  // 检查屏幕阅读器是否开启
  static async isScreenReaderEnabled(): Promise<boolean> {
    try {
      return await AccessibilityInfo.isScreenReaderEnabled();
    } catch (error) {
      console.warn('Failed to check screen reader status:', error);
      return false;
    }
  }

  // 检查是否启用了减少动画
  static async isReduceMotionEnabled(): Promise<boolean> {
    try {
      return await AccessibilityInfo.isReduceMotionEnabled();
    } catch (error) {
      console.warn('Failed to check reduce motion status:', error);
      return false;
    }
  }

  // 检查是否启用了减少透明度
  static async isReduceTransparencyEnabled(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        return await AccessibilityInfo.isReduceTransparencyEnabled();
      }
      return false;
    } catch (error) {
      console.warn('Failed to check reduce transparency status:', error);
      return false;
    }
  }

  // 宣布给屏幕阅读器
  static announceForAccessibility(message: string): void {
    try {
      AccessibilityInfo.announceForAccessibility(message);
    } catch (error) {
      console.warn('Failed to announce for accessibility:', error);
    }
  }

  // 设置焦点到指定元素
  static setAccessibilityFocus(reactTag: number): void {
    try {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    } catch (error) {
      console.warn('Failed to set accessibility focus:', error);
    }
  }
}

// 无障碍属性生成器
export const createAccessibilityProps = {
  // 按钮无障碍属性
  button: (label: string, hint?: string, disabled?: boolean) => ({
    accessible: true,
    accessibilityRole: 'button' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: { disabled: !!disabled },
  }),

  // 文本无障碍属性
  text: (label?: string, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'text' as const,
    ...(label && { accessibilityLabel: label }),
    ...(hint && { accessibilityHint: hint }),
  }),

  // 图片无障碍属性
  image: (label: string, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'image' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
  }),

  // 链接无障碍属性
  link: (label: string, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'link' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
  }),

  // 输入框无障碍属性
  textInput: (label: string, hint?: string, value?: string) => ({
    accessible: true,
    accessibilityRole: 'none' as const, // React Native TextInput 自动处理
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityValue: value ? { text: value } : undefined,
  }),

  // 开关无障碍属性
  switch: (label: string, isOn: boolean, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'switch' as const,
    accessibilityLabel: label,
    accessibilityState: { checked: isOn },
    accessibilityHint: hint,
  }),

  // 进度条无障碍属性
  progressBar: (label: string, progress: number, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'progressbar' as const,
    accessibilityLabel: label,
    accessibilityValue: {
      min: 0,
      max: 100,
      now: progress,
      text: `${Math.round(progress)}%`,
    },
    accessibilityHint: hint,
  }),

  // 标题无障碍属性
  header: (level: 1 | 2 | 3 | 4 | 5 | 6, label?: string) => ({
    accessible: true,
    accessibilityRole: 'header' as const,
    accessibilityLevel: level,
    ...(label && { accessibilityLabel: label }),
  }),

  // 列表无障碍属性
  list: (label?: string) => ({
    accessible: true,
    accessibilityRole: 'list' as const,
    ...(label && { accessibilityLabel: label }),
  }),

  // 列表项无障碍属性
  listItem: (label: string, hint?: string, selected?: boolean) => ({
    accessible: true,
    accessibilityRole: 'menuitem' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: { selected: !!selected },
  }),

  // 选项卡无障碍属性
  tab: (label: string, selected: boolean, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'tab' as const,
    accessibilityLabel: label,
    accessibilityState: { selected },
    accessibilityHint: hint,
  }),

  // 模态框无障碍属性
  modal: (label: string) => ({
    accessible: true,
    accessibilityViewIsModal: true,
    accessibilityLabel: label,
  }),

  // 警告/提示无障碍属性
  alert: (label: string, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'alert' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityLiveRegion: 'assertive' as const,
  }),
};

// 颜色对比度检查
export const colorContrast = {
  // 计算相对亮度
  getRelativeLuminance: (color: string): number => {
    // 简化的亮度计算，实际应用中可能需要更精确的算法
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  },

  // 计算对比度
  getContrastRatio: (color1: string, color2: string): number => {
    const lum1 = colorContrast.getRelativeLuminance(color1);
    const lum2 = colorContrast.getRelativeLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  // 检查是否符合 WCAG AA 标准
  meetsWCAGAA: (textColor: string, backgroundColor: string, isLargeText = false): boolean => {
    const ratio = colorContrast.getContrastRatio(textColor, backgroundColor);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  },

  // 检查是否符合 WCAG AAA 标准
  meetsWCAGAAA: (textColor: string, backgroundColor: string, isLargeText = false): boolean => {
    const ratio = colorContrast.getContrastRatio(textColor, backgroundColor);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  },
};

// 语义化标签
export const semanticLabels = {
  // 孕期相关标签
  pregnancy: {
    week: (week: number) => `孕期第${week}周`,
    dueDate: (date: string) => `预产期${date}`,
    fetalMovement: (count: number) => `胎动${count}次`,
    weight: (weight: string) => `体重${weight}`,
    bloodPressure: (pressure: string) => `血压${pressure}`,
    checkup: (date: string) => `产检时间${date}`,
  },

  // 健康相关标签
  health: {
    normal: '正常',
    abnormal: '异常',
    attention: '需要注意',
    completed: '已完成',
    pending: '待完成',
    inProgress: '进行中',
  },

  // 家庭相关标签
  family: {
    online: '在线',
    offline: '离线',
    task: (title: string) => `家庭任务：${title}`,
    member: (name: string, role: string) => `家庭成员${name}，角色${role}`,
  },

  // 导航相关标签
  navigation: {
    home: '首页，查看孕期概况和今日任务',
    health: '健康管理，记录和查看健康数据',
    collaboration: '家庭协作，管理家庭任务和成员',
    knowledge: '孕期知识，学习孕期相关知识',
    profile: '个人中心，管理个人信息和设置',
  },

  // 操作相关标签
  actions: {
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    open: '打开',
    add: '添加',
    remove: '移除',
    share: '分享',
    like: '点赞',
    bookmark: '收藏',
  },
};

// 无障碍测试工具
export const accessibilityTesting = {
  // 检查元素是否有无障碍标签
  hasAccessibilityLabel: (props: any): boolean => {
    return !!(props.accessibilityLabel || props.accessibilityHint);
  },

  // 检查触摸目标是否足够大
  hasSufficientTouchTarget: (width: number, height: number): boolean => {
    const minSize = 44; // iOS HIG 推荐的最小触摸目标
    return width >= minSize && height >= minSize;
  },

  // 生成无障碍测试报告
  generateReport: (component: any): string[] => {
    const issues: string[] = [];
    
    if (!accessibilityTesting.hasAccessibilityLabel(component.props)) {
      issues.push('缺少无障碍标签 (accessibilityLabel 或 accessibilityHint)');
    }
    
    // 可以添加更多检查...
    
    return issues;
  },
};