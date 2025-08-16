import React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/register');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FF8A9B" />
      <LinearGradient
        colors={['#FFB3C1', '#FF8A9B', '#E6677A']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>👶</Text>
            <Text style={styles.brandText}>家有孕宝</Text>
          </View>

          {/* Main Content */}
          <View style={styles.contentContainer}>
            {/* Pregnancy Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Text style={styles.pregnancyIcon}>🤱</Text>
              </View>
            </View>

            {/* Main Title */}
            <Text style={styles.title}>陪伴每一个{'\n'}美好时刻</Text>

            {/* Description */}
            <Text style={styles.description}>
              记录孕期点滴，分享成长喜悦{'\n'}
              让家人参与，共同迎接新生命{'\n'}
              专业指导，贴心关怀，温暖陪伴
            </Text>

            {/* Page Indicator */}
            <View style={styles.pageIndicator}>
              <View style={styles.indicatorDot} />
              <View style={[styles.indicatorDot, styles.activeDot]} />
              <View style={styles.indicatorDot} />
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomContainer}>
            <Button
              title="开始美好孕期之旅"
              onPress={handleGetStarted}
              size="large"
              style={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            />
            
            <Text style={styles.signInText} onPress={handleSignIn}>
              已有账户？立即登录
            </Text>
          </View>

          {/* Home Indicator */}
          {/* <View style={styles.homeIndicator} /> */}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  logoText: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  brandText: {
    fontSize: FontSizes.h2,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'PingFang SC',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pregnancyIcon: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 40,
    fontFamily: 'PingFang SC',
  },
  description: {
    fontSize: FontSizes.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
    fontFamily: 'PingFang SC',
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  bottomContainer: {
    paddingBottom: Spacing.xl,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    marginBottom: Spacing.lg,
    borderRadius: 12,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FF8A9B',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'PingFang SC',
  },
  signInText: {
    fontSize: FontSizes.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'PingFang SC',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
});