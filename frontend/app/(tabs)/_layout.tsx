import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 84, // 增加高度以容纳更多标签
            paddingBottom: 20, // 为safe area留出空间
          },
          default: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderTopColor: Colors[colorScheme ?? 'light'].border,
            height: 70, // 增加高度
            paddingBottom: 10,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 10, // 缩小字体以节省空间
          marginTop: -2,
        },
        tabBarItemStyle: {
          paddingVertical: 2, // 减少垂直padding
        },
        tabBarShowLabel: true, // 确保显示标签
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? "house.fill" : "house"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: '健康',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? "heart.fill" : "heart"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="collaboration"
        options={{
          title: '协作',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? "person.3.fill" : "person.3"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="knowledge"
        options={{
          title: '知识',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? "book.fill" : "book.closed"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? "person.crop.circle.fill" : "person.crop.circle"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: '图表',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? "chart.bar.fill" : "chart.bar"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '日历',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? "calendar.badge.plus" : "calendar"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}