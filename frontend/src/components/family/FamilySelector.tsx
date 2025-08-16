import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useFamily } from '../../contexts/FamilyContext';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Button } from '../Button';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

interface FamilySelectorProps {
  onFamilySelected?: () => void;
  onCreateFamily?: () => void;
  onJoinFamily?: () => void;
}

export function FamilySelector({ onFamilySelected, onCreateFamily, onJoinFamily }: FamilySelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const {
    families,
    currentFamily,
    hasFamily,
    isLoadingFamilies,
    setCurrentFamily,
    isCreator,
  } = useFamily();
  
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(
    currentFamily?.id || null
  );

  const handleFamilySelect = (familyId: number) => {
    const selectedFamily = families.find(f => f.id === familyId);
    if (selectedFamily) {
      setSelectedFamilyId(familyId);
      setCurrentFamily(selectedFamily);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedFamilyId && currentFamily) {
      onFamilySelected?.();
    }
  };

  const handleCreateFamily = () => {
    onCreateFamily?.();
  };

  const handleJoinFamily = () => {
    onJoinFamily?.();
  };

  if (isLoadingFamilies) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>加载家庭信息中...</ThemedText>
      </ThemedView>
    );
  }

  // 如果用户没有家庭，显示引导页面
  if (!hasFamily) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.welcomeContainer}>
          <ThemedText type="title" style={styles.welcomeTitle}>
            欢迎使用家庭成长记录
          </ThemedText>
          <ThemedText style={styles.welcomeDescription}>
            您还没有加入任何家庭。请选择创建新家庭或加入现有家庭来开始您的家庭成长记录之旅。
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.actionContainer}>
          <Button
            title="创建家庭"
            onPress={handleCreateFamily}
            variant="primary"
            size="large"
          />
          
          <Button
            title="加入家庭"
            onPress={handleJoinFamily}
            variant="outline"
            size="large"
          />
        </ThemedView>
      </ThemedView>
    );
  }

  // 如果用户有家庭，显示家庭选择器
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.selectorContainer}>
        <ThemedText type="subtitle" style={styles.selectorTitle}>
          选择家庭
        </ThemedText>
        
        <ScrollView style={styles.familyList} showsVerticalScrollIndicator={false}>
          {families.map((family) => (
            <TouchableOpacity
              key={family.id}
              style={[
                styles.familyItem,
                {
                  borderColor: colors.border,
                  backgroundColor: selectedFamilyId === family.id ? colors.tint + '20' : 'transparent',
                }
              ]}
              onPress={() => handleFamilySelect(family.id)}
            >
              <ThemedView style={styles.familyItemContent}>
                <ThemedText style={styles.familyItemName}>
                  {family.name}
                  {isCreator(family) && <ThemedText style={styles.creatorBadge}> (创建者)</ThemedText>}
                </ThemedText>
                {family.description && (
                  <ThemedText style={styles.familyItemDescription}>
                    {family.description}
                  </ThemedText>
                )}
                <ThemedText style={styles.familyItemMemberCount}>
                  成员数量: {family.memberCount}
                </ThemedText>
              </ThemedView>
              {selectedFamilyId === family.id && (
                <ThemedView style={[styles.selectedIndicator, { backgroundColor: colors.tint }]} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {currentFamily && (
          <ThemedView style={[styles.familyInfo, { backgroundColor: colors.tint + '10' }]}>
            <ThemedText style={styles.currentFamilyLabel}>当前选择的家庭:</ThemedText>
            <ThemedText style={styles.familyName}>{currentFamily.name}</ThemedText>
            <ThemedText style={styles.roleInfo}>
              {isCreator(currentFamily) ? '您是家庭创建者' : '您是家庭成员'}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.actionContainer}>
        <Button
          title="确认选择"
          onPress={handleConfirmSelection}
          disabled={!selectedFamilyId}
          variant="primary"
          size="large"
        />

        <TouchableOpacity
          style={styles.linkButton}
          onPress={handleCreateFamily}
        >
          <ThemedText style={[styles.linkText, { color: colors.tint }]}>
            创建新家庭
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={handleJoinFamily}
        >
          <ThemedText style={[styles.linkText, { color: colors.tint }]}>
            加入其他家庭
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeDescription: {
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  selectorContainer: {
    flex: 1,
    marginBottom: 20,
  },
  selectorTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  familyList: {
    flex: 1,
    marginBottom: 20,
  },
  familyItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  familyItemContent: {
    flex: 1,
  },
  familyItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  creatorBadge: {
    fontSize: 14,
    fontWeight: 'normal',
    opacity: 0.7,
  },
  familyItemDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  familyItemMemberCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  familyInfo: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  currentFamilyLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  familyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roleInfo: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionContainer: {
    gap: 16,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
});