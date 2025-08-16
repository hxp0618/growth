import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeSchedule } from '../constants/Colors';

type ThemeMode = 'light' | 'comfort' | 'dark' | 'auto';
type CurrentTheme = 'light' | 'comfort' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  currentTheme: CurrentTheme;
  isDarkMode: boolean;
  isComfortMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  getRecommendedTheme: () => CurrentTheme;
}

// 智能主题推荐函数
function getRecommendedTheme(): CurrentTheme {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const currentHour = now.getHours();
  
  // 夜间模式：22:00-06:00
  if (currentHour >= 22 || currentHour < 6) {
    return 'dark';
  }
  // 护眼模式：18:00-22:00
  if (currentHour >= 18) {
    return 'comfort';
  }
  // 明亮模式：06:00-18:00
  return 'light';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [currentTheme, setCurrentTheme] = useState<CurrentTheme>('light');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isComfortMode, setIsComfortMode] = useState(false);

  // 加载保存的主题设置
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme && ['light', 'comfort', 'dark', 'auto'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // 根据主题模式设置实际的主题状态
  useEffect(() => {
    let actualTheme: CurrentTheme;
    
    if (themeMode === 'auto') {
      // 智能切换模式
      actualTheme = getRecommendedTheme();
    } else {
      // 手动选择的主题
      actualTheme = themeMode as CurrentTheme;
    }
    
    setCurrentTheme(actualTheme);
    setIsDarkMode(actualTheme === 'dark');
    setIsComfortMode(actualTheme === 'comfort');
  }, [themeMode]);

  // 每分钟检查一次智能切换（仅在auto模式下）
  useEffect(() => {
    if (themeMode !== 'auto') return;
    
    const interval = setInterval(() => {
      const recommendedTheme = getRecommendedTheme();
      if (recommendedTheme !== currentTheme) {
        setCurrentTheme(recommendedTheme);
        setIsDarkMode(recommendedTheme === 'dark');
        setIsComfortMode(recommendedTheme === 'comfort');
      }
    }, 60000); // 每分钟检查一次

    return () => clearInterval(interval);
  }, [themeMode, currentTheme]);

  // 保存主题设置并更新状态
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const value = {
    themeMode,
    currentTheme,
    isDarkMode,
    isComfortMode,
    setThemeMode,
    getRecommendedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};