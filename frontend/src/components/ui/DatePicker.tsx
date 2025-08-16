import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useColorScheme';

interface DatePickerProps {
  label?: string;
  value?: string; // YYYY-MM-DD format
  onDateChange?: (date: string) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: any;
}

export function DatePicker({
  label,
  value,
  onDateChange,
  placeholder = '请选择日期',
  minimumDate,
  maximumDate,
  style,
}: DatePickerProps) {
  const colors = useThemeColors();
  const [showPicker, setShowPicker] = useState(false);

  // 格式化日期显示
  const formatDateDisplay = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}年${month}月${day}日`;
    } catch {
      return dateString;
    }
  };

  // 处理日期选择
  const handleDateSelect = () => {
    console.log('DatePicker clicked, Platform:', Platform.OS);
    
    if (Platform.OS === 'web') {
      // Web平台使用自定义选择器，因为原生HTML5日期输入在React Native Web中可能有问题
      setShowPicker(true);
    } else {
      // 移动端使用原生日期选择器
      setShowPicker(true);
    }
  };

  // 处理原生日期选择器的变化
  const handleNativeDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (event.type === 'set' && selectedDate && onDateChange) {
      const dateString = selectedDate.toISOString().split('T')[0];
      onDateChange(dateString);
    }
    
    if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  // iOS 确认按钮处理
  const handleIOSConfirm = () => {
    setShowPicker(false);
  };

  // 生成年月日选择器（移动端使用）
  const renderCustomPicker = () => {
    const currentYear = new Date().getFullYear();
    const startYear = minimumDate ? minimumDate.getFullYear() : currentYear - 100;
    const endYear = maximumDate ? maximumDate.getFullYear() : currentYear + 10;
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).reverse();
    
    const selectedDate = value ? new Date(value) : new Date();
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedDay = selectedDate.getDate();
    
    // 计算选中月份的天数
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const handleDateChange = (newYear: number, newMonth: number, newDay: number) => {
      // 确保日期有效
      const maxDay = new Date(newYear, newMonth, 0).getDate();
      const validDay = Math.min(newDay, maxDay);
      
      const newDate = new Date(newYear, newMonth - 1, validDay);
      
      // 检查日期范围
      if (minimumDate && newDate < minimumDate) return;
      if (maximumDate && newDate > maximumDate) return;
      
      const dateString = newDate.toISOString().split('T')[0];
      onDateChange?.(dateString);
    };

    return (
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.customPicker, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>取消</Text>
              </TouchableOpacity>
              <Text style={[styles.pickerTitle, { color: colors.text }]}>选择日期</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={[styles.confirmButton, { color: colors.primary }]}>确定</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContent}>
              {/* 年份选择 */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.columnTitle, { color: colors.text }]}>年</Text>
                <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.option,
                        selectedYear === year && { backgroundColor: colors.primary }
                      ]}
                      onPress={() => handleDateChange(year, selectedMonth, selectedDay)}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: selectedYear === year ? colors.background : colors.text }
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* 月份选择 */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.columnTitle, { color: colors.text }]}>月</Text>
                <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.option,
                        selectedMonth === month && { backgroundColor: colors.primary }
                      ]}
                      onPress={() => handleDateChange(selectedYear, month, selectedDay)}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: selectedMonth === month ? colors.background : colors.text }
                      ]}>
                        {month}月
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* 日期选择 */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.columnTitle, { color: colors.text }]}>日</Text>
                <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.option,
                        selectedDay === day && { backgroundColor: colors.primary }
                      ]}
                      onPress={() => handleDateChange(selectedYear, selectedMonth, day)}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: selectedDay === day ? colors.background : colors.text }
                      ]}>
                        {day}日
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: colors.background, borderColor: colors.border }]}
        onPress={handleDateSelect}
      >
        <Text style={[
          styles.dateText,
          { color: value ? colors.text : colors.textSecondary }
        ]}>
          {value ? formatDateDisplay(value) : placeholder}
        </Text>
        <Text style={[styles.calendarIcon, { color: colors.textSecondary }]}>📅</Text>
      </TouchableOpacity>

      {/* 日期选择器 */}
      {showPicker && (
        <>
          {Platform.OS === 'web' ? (
            // Web平台使用自定义选择器
            renderCustomPicker()
          ) : Platform.OS === 'ios' ? (
            // iOS使用原生日期选择器
            <Modal
              visible={showPicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowPicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.customPicker, { backgroundColor: colors.background }]}>
                  <View style={styles.pickerHeader}>
                    <TouchableOpacity onPress={() => setShowPicker(false)}>
                      <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>取消</Text>
                    </TouchableOpacity>
                    <Text style={[styles.pickerTitle, { color: colors.text }]}>选择日期</Text>
                    <TouchableOpacity onPress={handleIOSConfirm}>
                      <Text style={[styles.confirmButton, { color: colors.primary }]}>确定</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleNativeDateChange}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    style={{ height: 200 }}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            // Android使用原生日期选择器
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode="date"
              display="default"
              onChange={handleNativeDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minHeight: 48,
  },
  dateText: {
    fontSize: FontSizes.md,
    flex: 1,
  },
  calendarIcon: {
    fontSize: 20,
    marginLeft: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  customPicker: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.lg,
    maxHeight: 400,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  pickerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  cancelButton: {
    fontSize: FontSizes.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  confirmButton: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: Spacing.sm,
  },
  pickerContent: {
    flexDirection: 'row',
    gap: Spacing.sm,
    height: 200,
  },
  pickerColumn: {
    flex: 1,
  },
  columnTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  optionsList: {
    flex: 1,
  },
  option: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: 2,
    alignItems: 'center',
  },
  optionText: {
    fontSize: FontSizes.sm,
  },
});