import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing } from '@/constants/Colors';
import { useFamily } from '@/contexts/FamilyContext';

export interface SimpleFamilySelectorProps {
  selectedFamilyId?: number;
  onFamilyChange: (familyId: number | undefined) => void;
}

export function SimpleFamilySelector({
  selectedFamilyId,
  onFamilyChange,
}: SimpleFamilySelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { families, isLoadingFamilies } = useFamily();

  const [isOpen, setIsOpen] = useState(false);

  const selectedFamily = families.find(f => f.id === selectedFamilyId);

  const handleFamilySelect = (familyId: number) => {
    onFamilyChange(familyId);
    setIsOpen(false);
  };

  if (isLoadingFamilies) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>加载中...</Text>
      </View>
    );
  }

  if (families.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
          暂无家庭，请先创建或加入家庭
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.selectedText, { color: colors.text }]}>
          {selectedFamily ? selectedFamily.name : '请选择家庭'}
        </Text>
        <Text style={[styles.arrow, { color: colors.textSecondary }]}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {families.map((family) => (
            <TouchableOpacity
              key={family.id}
              style={[
                styles.option,
                selectedFamilyId === family.id && { backgroundColor: colors.primary + '20' },
              ]}
              onPress={() => handleFamilySelect(family.id)}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>
                {family.name}
              </Text>
              <Text style={[styles.memberCount, { color: colors.textSecondary }]}>
                {family.memberCount} 人
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minHeight: 50,
  },
  loadingText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.body,
  },
  placeholderText: {
    fontSize: FontSizes.body,
    textAlign: 'center',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minHeight: 50,
  },
  selectedText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    flex: 1,
  },
  arrow: {
    fontSize: FontSizes.body,
    marginLeft: Spacing.sm,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: 2,
    maxHeight: 200,
    zIndex: 1000,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  optionText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    flex: 1,
  },
  memberCount: {
    fontSize: FontSizes.bodySmall,
  },
});