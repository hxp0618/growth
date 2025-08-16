import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { FontSizes, Spacing } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileEditScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { userProfile, getUserProfile, isLoading } = useAuth();

  // 组件加载时获取用户个人信息
  useEffect(() => {
    getUserProfile();
  }, []);

  const handleSave = (data: any) => {
    // 保存成功后返回
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>‹ 返回</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>编辑个人信息</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Form */}
      <PersonalInfoForm
        initialData={userProfile ? {
          birthDate: userProfile.birthDate,
          height: userProfile.height,
          weight: userProfile.weight,
          allergies: userProfile.allergies,
          medicalHistory: userProfile.medicalHistory,
          isPregnant: userProfile.isPregnant,
          expectedDeliveryDate: userProfile.expectedDeliveryDate,
          lastMenstrualPeriod: userProfile.lastMenstrualPeriod,
          pregnancyNotes: userProfile.pregnancyNotes,
        } : undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    fontSize: FontSizes.xl,
    fontWeight: '300',
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
});