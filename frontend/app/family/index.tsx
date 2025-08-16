import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FamilySelector } from '../../src/components/family';
import { ThemedView } from '../../src/components/ThemedView';

export default function FamilySelectScreen() {
  const handleFamilySelected = () => {
    // 家庭选择完成后，跳转到主页面
    router.replace('/(tabs)');
  };

  const handleCreateFamily = () => {
    router.push('/family/create' as any);
  };

  const handleJoinFamily = () => {
    router.push('/family/join' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <FamilySelector
          onFamilySelected={handleFamilySelected}
          onCreateFamily={handleCreateFamily}
          onJoinFamily={handleJoinFamily}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});