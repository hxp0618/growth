import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateFamilyForm } from '../../src/components/family';
import { ThemedView } from '../../src/components/ThemedView';

export default function CreateFamilyScreen() {
  const handleSuccess = (familyId: number) => {
    // 创建成功后，跳转到主页面
    router.replace('/(tabs)');
  };

  const handleCancel = () => {
    // 取消创建，返回家庭选择页面
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <CreateFamilyForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
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