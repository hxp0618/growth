import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Button } from '@/components/Button';

const screenWidth = Dimensions.get('window').width;

export default function ChartsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'pie'>('line');

  const lineData = {
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 67],
      },
    ],
  };

  const pieData = [
    {
      name: '工作',
      population: 40,
      color: colors.primary,
      legendFontColor: colors.text,
      legendFontSize: 15,
    },
    {
      name: '学习',
      population: 30,
      color: colors.success,
      legendFontColor: colors.text,
      legendFontSize: 15,
    },
    {
      name: '娱乐',
      population: 20,
      color: colors.warning,
      legendFontColor: colors.text,
      legendFontSize: 15,
    },
    {
      name: '其他',
      population: 10,
      color: colors.error,
      legendFontColor: colors.text,
      legendFontSize: 15,
    },
  ];

  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary.replace(')', `, ${opacity})`).replace('rgb', 'rgba'),
    labelColor: (opacity = 1) => colors.text.replace(')', `, ${opacity})`).replace('rgb', 'rgba'),
    style: {
      borderRadius: BorderRadius.md,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'line':
        return (
          <LineChart
            data={lineData}
            width={screenWidth - Spacing.lg * 2}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      case 'bar':
        return (
          <BarChart
            data={barData}
            width={screenWidth - Spacing.lg * 2}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=""
          />
        );
      case 'pie':
        return (
          <PieChart
            data={pieData}
            width={screenWidth - Spacing.lg * 2}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>数据图表</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            查看你的数据趋势和分析
          </Text>
        </View>

        {/* Chart Type Selector */}
        <View style={styles.selectorContainer}>
          <Button
            title="折线图"
            onPress={() => setSelectedChart('line')}
            variant={selectedChart === 'line' ? 'primary' : 'outline'}
            size="small"
            style={styles.selectorButton}
          />
          <Button
            title="柱状图"
            onPress={() => setSelectedChart('bar')}
            variant={selectedChart === 'bar' ? 'primary' : 'outline'}
            size="small"
            style={styles.selectorButton}
          />
          <Button
            title="饼图"
            onPress={() => setSelectedChart('pie')}
            variant={selectedChart === 'pie' ? 'primary' : 'outline'}
            size="small"
            style={styles.selectorButton}
          />
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          {renderChart()}
        </View>

        {/* Chart Description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.descriptionTitle, { color: colors.text }]}>
            图表说明
          </Text>
          <Text style={[styles.description, { color: colors.icon }]}>
            {selectedChart === 'line' && '显示过去6个月的数据趋势变化'}
            {selectedChart === 'bar' && '显示一周内每日的数据对比'}
            {selectedChart === 'pie' && '显示时间分配的百分比分布'}
          </Text>
        </View>

        {/* Stats Summary */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>156</Text>
            <Text style={[styles.summaryLabel, { color: colors.icon }]}>总数据点</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>+23%</Text>
            <Text style={[styles.summaryLabel, { color: colors.icon }]}>增长率</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>78%</Text>
            <Text style={[styles.summaryLabel, { color: colors.icon }]}>完成度</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
  },
  selectorContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  selectorButton: {
    flex: 1,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  chart: {
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  descriptionContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  descriptionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    flex: 1,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
});