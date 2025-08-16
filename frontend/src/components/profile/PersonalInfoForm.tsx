import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { Card } from '@/components/ui/Card';
import { FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { DatePicker } from '@/components/ui/DatePicker';

interface PersonalInfoFormProps {
  initialData?: {
    birthDate?: string;
    height?: number;
    weight?: number;
    allergies?: string;
    medicalHistory?: string;
    isPregnant?: number; // 0-否，1-是
    expectedDeliveryDate?: string;
    lastMenstrualPeriod?: string;
    pregnancyNotes?: string;
  };
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export function PersonalInfoForm({ initialData, onSave, onCancel }: PersonalInfoFormProps) {
  const colors = useThemeColors();
  const router = useRouter();
  const { updateUserProfile, isLoading } = useAuth();

  // 基本信息
  const [birthDate, setBirthDate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  
  // 健康信息
  const [allergies, setAllergies] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  
  // 孕期信息
  const [isPregnant, setIsPregnant] = useState(false);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [lastMenstrualPeriod, setLastMenstrualPeriod] = useState('');
  const [pregnancyNotes, setPregnancyNotes] = useState('');

  // 监听initialData变化，更新表单状态
  useEffect(() => {
    if (initialData) {
      console.log('PersonalInfoForm: 更新初始数据', initialData);
      setBirthDate(initialData.birthDate || '');
      setHeight(initialData.height?.toString() || '');
      setWeight(initialData.weight?.toString() || '');
      setAllergies(initialData.allergies || '');
      setMedicalHistory(initialData.medicalHistory || '');
      setIsPregnant((initialData.isPregnant === 1) || false);
      setExpectedDeliveryDate(initialData.expectedDeliveryDate || '');
      setLastMenstrualPeriod(initialData.lastMenstrualPeriod || '');
      setPregnancyNotes(initialData.pregnancyNotes || '');
    }
  }, [initialData]);


  const handleSave = async () => {
    try {
      const profileData = {
        birthDate: birthDate || undefined,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        allergies: allergies || undefined,
        medicalHistory: medicalHistory || undefined,
        isPregnant: isPregnant ? 1 : 0,
        expectedDeliveryDate: isPregnant ? (expectedDeliveryDate || undefined) : undefined,
        lastMenstrualPeriod: isPregnant ? (lastMenstrualPeriod || undefined) : undefined,
        pregnancyNotes: isPregnant ? (pregnancyNotes || undefined) : undefined,
      };

      const response = await updateUserProfile(profileData);
      
      if (response.success) {
        Alert.alert('成功', '个人信息已更新', [
          { text: '确定', onPress: () => onSave?.(profileData) || router.back() }
        ]);
      } else {
        Alert.alert('错误', response.message || '更新失败');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('错误', '更新失败，请重试');
    }
  };

  const handleCancel = () => {
    onCancel?.() || router.back();
  };

  const renderSectionHeader = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionIcon, { color: colors.primary }]}>{icon}</Text>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 基本信息 */}
          <Card variant="default" style={styles.section}>
            {renderSectionHeader('基本信息', '👤')}

            <DatePicker
              label="出生日期"
              value={birthDate}
              onDateChange={setBirthDate}
              placeholder="请选择出生日期"
              maximumDate={new Date()} // 不能选择未来日期
            />

            <View style={styles.row}>
              <TextInput
                label="身高 (cm)"
                value={height}
                onChangeText={setHeight}
                placeholder="请输入身高"
                keyboardType="numeric"
                style={styles.halfInput}
              />
              <TextInput
                label="体重 (kg)"
                value={weight}
                onChangeText={setWeight}
                placeholder="请输入体重"
                keyboardType="numeric"
                style={styles.halfInput}
              />
            </View>
          </Card>

          {/* 健康信息 */}
          <Card variant="default" style={styles.section}>
            {renderSectionHeader('健康信息', '🏥')}
            
            <TextInput
              label="过敏史"
              value={allergies}
              onChangeText={setAllergies}
              placeholder="请输入过敏史（如：青霉素过敏）"
              multiline
              numberOfLines={3}
            />

            <TextInput
              label="既往病史"
              value={medicalHistory}
              onChangeText={setMedicalHistory}
              placeholder="请输入既往病史"
              multiline
              numberOfLines={3}
            />
          </Card>

          {/* 孕期信息 */}
          <Card variant="default" style={styles.section}>
            {renderSectionHeader('孕期信息', '🤱')}
            
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>当前是否怀孕</Text>
              <Switch
                value={isPregnant}
                onValueChange={setIsPregnant}
                trackColor={{ false: colors.neutral300, true: colors.primary + '50' }}
                thumbColor={isPregnant ? colors.primary : colors.neutral500}
              />
            </View>

            {isPregnant && (
              <>
                <DatePicker
                  label="预产期"
                  value={expectedDeliveryDate}
                  onDateChange={setExpectedDeliveryDate}
                  placeholder="请选择预产期"
                  minimumDate={new Date()} // 不能选择过去日期
                />

                <DatePicker
                  label="末次月经"
                  value={lastMenstrualPeriod}
                  onDateChange={setLastMenstrualPeriod}
                  placeholder="请选择末次月经日期"
                  maximumDate={new Date()} // 不能选择未来日期
                />

                <TextInput
                  label="备注"
                  value={pregnancyNotes}
                  onChangeText={setPregnancyNotes}
                  placeholder="请输入其他备注信息"
                  multiline
                  numberOfLines={3}
                />
              </>
            )}
          </Card>

          {/* 操作按钮 */}
          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? "保存中..." : "保存"}
              onPress={handleSave}
              disabled={isLoading}
              style={styles.saveButton}
            />
            <Button
              title="取消"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  inputLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  switchLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  buttonContainer: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  saveButton: {
    marginBottom: Spacing.sm,
  },
  cancelButton: {
    marginBottom: Spacing.sm,
  },
});