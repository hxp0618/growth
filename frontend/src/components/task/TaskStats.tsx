import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { useThemeColors } from '../../hooks/useColorScheme';
import { Spacing, BorderRadius, Shadows } from '../../constants/Colors';

interface Task {
  id: number;
  status: number;
  assignedUserId: number;
}

interface TaskStatsProps {
  tasks: Task[];
  currentUserId: number;
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks, currentUserId }) => {
  const colors = useThemeColors();
  
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === 1).length;
  const inProgressTasks = tasks.filter(task => task.status === 2).length;
  const completedTasks = tasks.filter(task => task.status === 3).length;
  const cancelledTasks = tasks.filter(task => task.status === 4).length;
  const myTasks = tasks.filter(task => task.assignedUserId === currentUserId).length;
  const myPendingTasks = tasks.filter(task => 
    task.assignedUserId === currentUserId && task.status === 1
  ).length;
  const myInProgressTasks = tasks.filter(task => 
    task.assignedUserId === currentUserId && task.status === 2
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.card,
        borderColor: colors.border,
        ...Shadows.md
      }
    ]}>
      <ThemedText style={[styles.title, { color: colors.text }]}>任务统计</ThemedText>
      
      <View style={styles.statsGrid}>
        {/* 总体统计 */}
        <View style={styles.statCard}>
          <ThemedText style={[styles.statNumber, { color: colors.text }]}>{totalTasks}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>总任务数</ThemedText>
        </View>
        
        <View style={styles.statCard}>
          <ThemedText style={[styles.statNumber, { color: colors.warning }]}>{pendingTasks}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>待开始</ThemedText>
        </View>
        
        <View style={styles.statCard}>
          <ThemedText style={[styles.statNumber, { color: colors.info }]}>{inProgressTasks}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>进行中</ThemedText>
        </View>
        
        <View style={styles.statCard}>
          <ThemedText style={[styles.statNumber, { color: colors.success }]}>{completedTasks}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>已完成</ThemedText>
        </View>
      </View>

      {/* 我的任务统计 */}
      <View style={styles.myTasksSection}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>我的任务</ThemedText>
        <View style={styles.myTasksStats}>
          <View style={styles.myTaskItem}>
            <ThemedText style={[styles.myTaskNumber, { color: colors.text }]}>{myTasks}</ThemedText>
            <ThemedText style={[styles.myTaskLabel, { color: colors.textSecondary }]}>总任务</ThemedText>
          </View>
          <View style={styles.myTaskItem}>
            <ThemedText style={[styles.myTaskNumber, { color: colors.warning }]}>{myPendingTasks}</ThemedText>
            <ThemedText style={[styles.myTaskLabel, { color: colors.textSecondary }]}>待开始</ThemedText>
          </View>
          <View style={styles.myTaskItem}>
            <ThemedText style={[styles.myTaskNumber, { color: colors.info }]}>{myInProgressTasks}</ThemedText>
            <ThemedText style={[styles.myTaskLabel, { color: colors.textSecondary }]}>进行中</ThemedText>
          </View>
        </View>
      </View>

      {/* 完成率 */}
      <View style={styles.completionSection}>
        <View style={styles.completionHeader}>
          <ThemedText style={[styles.completionLabel, { color: colors.text }]}>完成率</ThemedText>
          <ThemedText style={[styles.completionRate, { color: colors.primary }]}>{completionRate}%</ThemedText>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.backgroundSecondary }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${completionRate}%`,
                backgroundColor: colors.primary
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  myTasksSection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    marginBottom: Spacing.sm,
  },
  myTasksStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  myTaskItem: {
    alignItems: 'center',
  },
  myTaskNumber: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  myTaskLabel: {
    fontSize: 12,
  },
  completionSection: {
    marginTop: Spacing.sm,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  completionLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  completionRate: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  progressBar: {
    height: 8,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
});

export default TaskStats;
