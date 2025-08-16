import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { familyService, familyRoleService, FamilyResponse, FamilyRoleResponse } from '../services';
import { useAuth } from './AuthContext';

interface FamilyContextType {
  // 家庭相关状态
  families: FamilyResponse[];
  currentFamily: FamilyResponse | null;
  availableRoles: FamilyRoleResponse[];
  
  // 加载状态
  isLoadingFamilies: boolean;
  isLoadingRoles: boolean;
  
  // 操作方法
  loadUserFamilies: () => Promise<void>;
  loadAvailableRoles: () => Promise<void>;
  setCurrentFamily: (family: FamilyResponse | null) => void;
  createFamily: (familyData: { name: string; description?: string }) => Promise<{ success: boolean; family?: FamilyResponse; error?: string }>;
  joinFamily: (inviteCode: string, roleId: number) => Promise<{ success: boolean; error?: string }>;
  
  // 辅助方法
  hasFamily: boolean;
  isCreator: (family: FamilyResponse) => boolean;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

interface FamilyProviderProps {
  children: ReactNode;
}

export function FamilyProvider({ children }: FamilyProviderProps) {
  const { user } = useAuth();
  const [families, setFamilies] = useState<FamilyResponse[]>([]);
  const [currentFamily, setCurrentFamilyState] = useState<FamilyResponse | null>(null);
  const [availableRoles, setAvailableRoles] = useState<FamilyRoleResponse[]>([]);
  const [isLoadingFamilies, setIsLoadingFamilies] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  // 加载用户参与的家庭列表
  const loadUserFamilies = async () => {
    if (!user) {
      setFamilies([]);
      setCurrentFamilyState(null);
      setIsLoadingFamilies(false);
      return;
    }
    
    setIsLoadingFamilies(true);
    try {
      const response = await familyService.getUserFamilies();
      if (response.success && response.data && Array.isArray(response.data)) {
        const sortedFamilies = response.data.sort((a, b) => {
          // 优先显示自己创建的家庭
          if (a.creatorId === user.id && b.creatorId !== user.id) return -1;
          if (b.creatorId === user.id && a.creatorId !== user.id) return 1;
          // 其次按创建时间排序
          return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
        });
        setFamilies(sortedFamilies);
        
        // 如果有家庭且当前没有选中的家庭，自动选择第一个
        if (sortedFamilies.length > 0 && !currentFamily) {
          setCurrentFamilyState(sortedFamilies[0]);
        }
      } else {
        // 用户没有家庭或者API返回错误
        console.log('用户没有家庭或API返回错误:', response.message);
        setFamilies([]);
        setCurrentFamilyState(null);
      }
    } catch (error) {
      console.error('加载家庭列表失败:', error);
      setFamilies([]);
      setCurrentFamilyState(null);
    } finally {
      setIsLoadingFamilies(false);
    }
  };

  // 加载可用角色列表
  const loadAvailableRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const response = await familyRoleService.listEnabledRoles();
      if (response.success && response.data && Array.isArray(response.data)) {
        setAvailableRoles(response.data);
      } else {
        console.log('角色列表API返回错误:', response.message);
        setAvailableRoles([]);
      }
    } catch (error) {
      console.error('加载角色列表失败:', error);
      setAvailableRoles([]);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // 设置当前选中的家庭
  const setCurrentFamily = (family: FamilyResponse | null) => {
    setCurrentFamilyState(family);
  };

  // 创建家庭
  const createFamily = async (familyData: { name: string; description?: string }) => {
    try {
      const response = await familyService.createFamily(familyData);
      if (response.success && response.data) {
        // 创建成功后重新加载家庭列表
        await loadUserFamilies();
        return { success: true, family: response.data };
      } else {
        return { success: false, error: response.message || '创建家庭失败' };
      }
    } catch (error) {
      console.error('创建家庭失败:', error);
      return { success: false, error: '创建家庭失败，请重试' };
    }
  };

  // 加入家庭
  const joinFamily = async (inviteCode: string, roleId: number) => {
    try {
      const response = await familyService.joinFamily({ inviteCode, roleId });
      if (response.success) {
        // 加入成功后重新加载家庭列表
        await loadUserFamilies();
        return { success: true };
      } else {
        return { success: false, error: response.message || '加入家庭失败' };
      }
    } catch (error) {
      console.error('加入家庭失败:', error);
      return { success: false, error: '加入家庭失败，请重试' };
    }
  };

  // 判断是否有家庭
  const hasFamily = families.length > 0;

  // 判断是否为家庭创建者
  const isCreator = (family: FamilyResponse) => {
    return user ? family.creatorId === user.id : false;
  };

  // 当用户登录状态改变时，重新加载数据
  useEffect(() => {
    if (user) {
      loadUserFamilies();
      loadAvailableRoles();
    } else {
      setFamilies([]);
      setCurrentFamilyState(null);
      setAvailableRoles([]);
    }
  }, [user]);

  const value: FamilyContextType = {
    families,
    currentFamily,
    availableRoles,
    isLoadingFamilies,
    isLoadingRoles,
    loadUserFamilies,
    loadAvailableRoles,
    setCurrentFamily,
    createFamily,
    joinFamily,
    hasFamily,
    isCreator,
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}