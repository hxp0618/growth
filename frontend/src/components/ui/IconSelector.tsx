import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, Shadows } from '@/constants/Colors';

export interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  style?: any;
}

// 预定义的图标分类
const iconCategories = {
  '医疗健康': ['🏥', '💊', '🩺', '🚑', '⚕️', '🧬', '🦷', '👶', '🤱', '🍼'],
  '情感表达': ['😊', '😍', '🥰', '😘', '😇', '🤗', '😌', '😴', '😷', '🤒'],
  '紧急状况': ['🚨', '⚠️', '🆘', '📢', '🔥', '⛑️', '🚪', '📞', '🔴', '❗'],
  '生活日常': ['🍎', '🥛', '🛏️', '🚿', '🧘', '🚶', '🏃', '🎵', '📚', '🎨'],
  '家庭关系': ['👨‍👩‍👧‍👦', '👶', '👵', '👴', '💕', '❤️', '💖', '🏠', '👪', '🤝'],
  '提醒通知': ['⏰', '📅', '📋', '✅', '📝', '💡', '🔔', '📱', '💬', '📊'],
};

export function IconSelector({ selectedIcon, onIconSelect, style }: IconSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(iconCategories)[0]);

  const handleIconSelect = (icon: string) => {
    onIconSelect(icon);
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.selectorButton,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          style,
        ]}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.selectedIcon}>{selectedIcon || '📱'}</Text>
        <Text style={[styles.selectorText, { color: colors.textSecondary }]}>
          点击选择图标
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={[styles.cancelButton, { color: colors.text }]}>取消</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>选择图标</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Category Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryTabs}
            contentContainerStyle={styles.categoryTabsContent}
          >
            {Object.keys(iconCategories).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  selectedCategory === category && {
                    backgroundColor: colors.primary,
                  },
                  { borderColor: colors.border }
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    {
                      color: selectedCategory === category ? '#FFFFFF' : colors.text,
                    },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Icon Grid */}
          <ScrollView style={styles.iconGrid} showsVerticalScrollIndicator={false}>
            <View style={styles.iconsContainer}>
              {iconCategories[selectedCategory as keyof typeof iconCategories].map((icon, index) => (
                <TouchableOpacity
                  key={`${icon}-${index}`}
                  style={[
                    styles.iconButton,
                    selectedIcon === icon && {
                      backgroundColor: colors.primary + '20',
                      borderColor: colors.primary,
                    },
                    { backgroundColor: colors.card, borderColor: colors.border }
                  ]}
                  onPress={() => handleIconSelect(icon)}
                >
                  <Text style={styles.icon}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Current Selection */}
          <View style={[styles.currentSelection, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <Text style={[styles.currentSelectionLabel, { color: colors.textSecondary }]}>
              当前选择:
            </Text>
            <Text style={styles.currentSelectionIcon}>{selectedIcon || '📱'}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    ...Shadows.sm,
  },
  selectedIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  selectorText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  cancelButton: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  modalTitle: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.semibold,
  },
  placeholder: {
    width: 40,
  },
  categoryTabs: {
    maxHeight: 60,
  },
  categoryTabsContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  categoryTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  categoryTabText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  iconGrid: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  iconButton: {
    width: '18%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  icon: {
    fontSize: 28,
  },
  currentSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  currentSelectionLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.md,
  },
  currentSelectionIcon: {
    fontSize: 32,
  },
});