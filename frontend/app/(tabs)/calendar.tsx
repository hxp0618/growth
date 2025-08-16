import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Button } from '@/components/Button';
import { CalendarEvent } from '@/types';

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: '团队会议',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '11:30',
      description: '讨论项目进度和下一步计划',
    },
    {
      id: '2',
      title: '客户演示',
      date: '2024-01-16',
      startTime: '14:00',
      endTime: '15:00',
      description: '向客户展示最新功能',
    },
    {
      id: '3',
      title: '代码审查',
      date: '2024-01-17',
      startTime: '16:00',
      endTime: '17:00',
      description: '审查本周提交的代码',
    },
  ]);

  const getMarkedDates = () => {
    const marked: any = {};
    events.forEach(event => {
      marked[event.date] = {
        marked: true,
        dotColor: colors.primary,
      };
    });
    
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: colors.primary,
      };
    }
    
    return marked;
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const addEvent = () => {
    if (!selectedDate) {
      Alert.alert('提示', '请先选择一个日期');
      return;
    }
    
    // 这里可以打开一个模态框来添加事件
    Alert.alert('添加事件', `为 ${selectedDate} 添加新事件的功能即将推出`);
  };

  const deleteEvent = (eventId: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这个事件吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setEvents(events.filter(event => event.id !== eventId));
          },
        },
      ]
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>日历</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            管理你的日程安排
          </Text>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={getMarkedDates()}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.text,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.icon,
              dotColor: colors.primary,
              selectedDotColor: '#ffffff',
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              indicatorColor: colors.primary,
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
            style={[styles.calendar, { borderColor: colors.border }]}
          />
        </View>

        {/* Selected Date Info */}
        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <Text style={[styles.selectedDateTitle, { color: colors.text }]}>
              {selectedDate}
            </Text>
            <Button
              title="添加事件"
              onPress={addEvent}
              size="small"
              style={styles.addButton}
            />
          </View>
        )}

        {/* Events List */}
        <View style={styles.eventsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedDate ? `${selectedDate} 的事件` : '所有事件'}
          </Text>
          
          {(selectedDate ? selectedDateEvents : events).length === 0 ? (
            <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.icon }]}>
                {selectedDate ? '这一天没有安排事件' : '还没有任何事件'}
              </Text>
            </View>
          ) : (
            (selectedDate ? selectedDateEvents : events).map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onLongPress={() => deleteEvent(event.id)}
              >
                <View style={styles.eventHeader}>
                  <Text style={[styles.eventTitle, { color: colors.text }]}>
                    {event.title}
                  </Text>
                  <Text style={[styles.eventTime, { color: colors.primary }]}>
                    {event.startTime} - {event.endTime}
                  </Text>
                </View>
                {event.description && (
                  <Text style={[styles.eventDescription, { color: colors.icon }]}>
                    {event.description}
                  </Text>
                )}
                <Text style={[styles.eventDate, { color: colors.icon }]}>
                  {event.date}
                </Text>
              </TouchableOpacity>
            ))
          )}
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
  calendarContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  calendar: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.sm,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  selectedDateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  addButton: {
    minWidth: 100,
  },
  eventsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
  },
  eventCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  eventTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    flex: 1,
  },
  eventTime: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  eventDescription: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  eventDate: {
    fontSize: FontSizes.xs,
  },
});