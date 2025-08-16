import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { NetworkDiagnosticsService, NetworkDiagnostics } from '../../utils/networkDiagnostics';
import { healthService } from '../../services/healthService';
import { notificationService } from '../../services/notificationService';

interface NetworkStatusIndicatorProps {
  showDetails?: boolean;
  onRetry?: () => void;
  autoCheck?: boolean; // 是否自动检查网络状态
  checkInterval?: number; // 检查间隔（毫秒）
  useLightweightCheck?: boolean; // 是否使用轻量级检查
}

export function NetworkStatusIndicator({ 
  showDetails = false, 
  onRetry,
  autoCheck = false,
  checkInterval = 30000, // 默认30秒检查一次
  useLightweightCheck = true // 默认使用轻量级检查
}: NetworkStatusIndicatorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [diagnostics, setDiagnostics] = useState<NetworkDiagnostics | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [isServerReachable, setIsServerReachable] = useState<boolean | null>(null);

  const checkNetworkStatus = useCallback(async (forceCheck = false) => {
    // 防止频繁检查
    if (isChecking) {
      console.log('网络状态检查正在进行中，跳过');
      return;
    }

    // 如果不是强制检查，且距离上次检查时间不足间隔时间，则跳过
    if (!forceCheck && lastCheckTime) {
      const timeSinceLastCheck = Date.now() - lastCheckTime.getTime();
      if (timeSinceLastCheck < checkInterval) {
        console.log('距离上次检查时间不足，跳过网络状态检查');
        return;
      }
    }

    setIsChecking(true);
    try {
      console.log('开始检查网络状态...');
      
      if (useLightweightCheck) {
        // 使用轻量级健康检查
        const healthResponse = await healthService.health();
        const reachable = healthResponse.success;
        setIsServerReachable(reachable);
        
        // 创建简化的诊断结果
        const simpleDiagnostics: NetworkDiagnostics = {
          serverReachable: reachable,
          connectionQuality: reachable ? 'good' : 'unknown',
          retryAttempts: 0,
          errorMessage: reachable ? undefined : healthResponse.message,
        };
        
        setDiagnostics(simpleDiagnostics);
      } else {
        // 使用完整的网络诊断
        const result = await NetworkDiagnosticsService.runDiagnostics();
        setDiagnostics(result);
        setIsServerReachable(result.serverReachable);
      }
      
      setLastCheckTime(new Date());
      console.log('网络状态检查完成');
    } catch (error) {
      console.error('网络状态检查失败:', error);
      setIsServerReachable(false);
      setDiagnostics({
        serverReachable: false,
        connectionQuality: 'unknown',
        retryAttempts: 0,
        errorMessage: error instanceof Error ? error.message : '网络检查失败',
      });
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, lastCheckTime, checkInterval, useLightweightCheck]);

  // 初始化时检查一次网络状态
  useEffect(() => {
    if (autoCheck) {
      checkNetworkStatus(true);
    }
  }, [autoCheck, checkNetworkStatus]);

  // 自动检查网络状态（仅在autoCheck为true时）
  useEffect(() => {
    if (!autoCheck) return;

    const interval = setInterval(() => {
      // 只在网络异常时进行定期检查
      if (isServerReachable === false) {
        checkNetworkStatus();
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [autoCheck, checkInterval, isServerReachable, checkNetworkStatus]);

  const handleRetry = async () => {
    await checkNetworkStatus(true);
    
    // 如果服务器可达，尝试重新注册推送令牌
    if (isServerReachable) {
      const success = await notificationService.retryPushTokenRegistration();
      if (success) {
        Alert.alert('重试成功', '推送通知服务已恢复正常');
      }
    }
    
    onRetry?.();
  };

  const handleShowDetails = () => {
    if (!diagnostics) return;
    
    const statusDescription = NetworkDiagnosticsService.getNetworkStatusDescription(diagnostics);
    const suggestions = NetworkDiagnosticsService.getNetworkTroubleshootingSuggestions(diagnostics);
    
    const message = [
      statusDescription,
      '',
      '解决建议:',
      ...suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`)
    ].join('\n');
    
    Alert.alert('网络状态详情', message, [
      { text: '重试', onPress: handleRetry },
      { text: '关闭', style: 'cancel' }
    ]);
  };

  // 网络正常时不显示指示器
  if (isServerReachable !== false) {
    return null;
  }

  const statusColor = '#ff6b6b';
  const statusIcon = '❌';
  const statusText = isChecking ? '检查中...' : '网络异常';

  return (
    <ThemedView style={[styles.container, { backgroundColor: statusColor + '20', borderColor: statusColor }]}>
      <View style={styles.content}>
        <ThemedText style={[styles.statusIcon, { color: statusColor }]}>
          {statusIcon}
        </ThemedText>
        <ThemedText style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </ThemedText>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { borderColor: statusColor }]}
            onPress={handleRetry}
            disabled={isChecking}
          >
            <ThemedText style={[styles.buttonText, { color: statusColor }]}>
              重试
            </ThemedText>
          </TouchableOpacity>
          
          {showDetails && (
            <TouchableOpacity
              style={[styles.button, { borderColor: statusColor }]}
              onPress={handleShowDetails}
            >
              <ThemedText style={[styles.buttonText, { color: statusColor }]}>
                详情
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {showDetails && diagnostics?.latency && (
        <ThemedText style={[styles.latencyText, { color: colors.text + '80' }]}>
          延迟: {diagnostics.latency}ms
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  latencyText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});