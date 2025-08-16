import React, { useState } from 'react';
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

export interface CompactFamilySelectorProps {
  selectedFamilyId?: number;
  onFamilyChange: (familyId: number | undefined) => void;
}

export function CompactFamilySelector({
  selectedFamilyId,
  onFamilyChange,
}: CompactFamilySelectorProps) {
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
      </View>
    );
  }

  if (families.length === 0) {
    return null; // 没有家庭时不显示
  }

  if (families.length === 1) {
    // 只有一个家庭时，直接显示家庭名，不需要下拉
    return (
      <View style={styles.singleFamilyContainer}>
        <Text style={[styles.singleFamilyText, { color: colors.textSecondary }]}>
          👨‍👩‍👧‍👦 {selectedFamily?.name || families[0].name}
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
        <Text style={[styles.selectedText, { color: colors.textSecondary }]} numberOfLines={1}>
          👨‍👩‍👧‍👦 {selectedFamily ? selectedFamily.name : '选择家庭'}
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
              <Text style={[styles.optionText, { color: colors.text }]} numberOfLines={1}>
                {family.name}
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
    maxWidth: 160,
    zIndex: 1000,
    elevation: 1000, // Android elevation
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    minHeight: 28,
  },
  singleFamilyContainer: {
    maxWidth: 160,
  },
  singleFamilyText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    minHeight: 28,
    maxWidth: 160,
  },
  selectedText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    flex: 1,
    marginRight: Spacing.xs,
  },
  arrow: {
    fontSize: 10,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginTop: 2,
    maxHeight: 120,
    zIndex: 1001,
    elevation: 1001, // Android elevation
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  option: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  optionText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
});