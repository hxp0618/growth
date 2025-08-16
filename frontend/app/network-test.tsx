import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NetworkDiagnosticsService, NetworkDiagnostics } from '../src/utils/networkDiagnostics';

export default function NetworkTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<NetworkDiagnostics | null>(null);

  const runBasicDiagnostics = async () => {
    setIsLoading(true);
    try {
      console.log('开始基本网络诊断...');
      const result = await NetworkDiagnosticsService.runDiagnostics();
      setDiagnostics(result);
      console.log('基本诊断完成:', result);
    } catch (error) {
      console.error('诊断失败:', error);
      Alert.alert('错误', '网络诊断失败: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setDiagnostics(null);
  };

  const renderDiagnostics = () => {
    if (!diagnostics) return null;

    const getQualityColor = (quality?: string) => {
      switch (quality) {
        case 'excellent': return '#4CAF50';
        case 'good': return '#8BC34A';
        case 'fair': return '#FF9800';
        case 'poor': return '#F44336';
        default: return '#757575';
      }
    };

    const getQualityEmoji = (quality?: string) => {
      switch (quality) {
        case 'excellent': return '🟢';
        case 'good': return '🟡';
        case 'fair': return '🟠';
        case 'poor': return '🔴';
        default: return '⚪';
      }
    };

    return (
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>网络诊断结果</Text>
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>服务器连接:</Text>
          <Text style={[styles.resultValue, { color: diagnostics.serverReachable ? '#4CAF50' : '#F44336' }]}>
            {diagnostics.serverReachable ? '✅ 正常' : '❌ 异常'}
          </Text>
        </View>

        {diagnostics.networkType && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>网络类型:</Text>
            <Text style={styles.resultValue}>{diagnostics.networkType}</Text>
          </View>
        )}

        {diagnostics.connectionQuality && diagnostics.connectionQuality !== 'unknown' && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>连接质量:</Text>
            <Text style={[styles.resultValue, { color: getQualityColor(diagnostics.connectionQuality) }]}>
              {getQualityEmoji(diagnostics.connectionQuality)} {diagnostics.connectionQuality}
            </Text>
          </View>
        )}

        {diagnostics.latency && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>当前延迟:</Text>
            <Text style={styles.resultValue}>{diagnostics.latency}ms</Text>
          </View>
        )}

        {diagnostics.averageLatency && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>平均延迟:</Text>
            <Text style={styles.resultValue}>{diagnostics.averageLatency}ms</Text>
          </View>
        )}

        {diagnostics.jitter !== undefined && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>延迟抖动:</Text>
            <Text style={styles.resultValue}>{diagnostics.jitter}ms</Text>
          </View>
        )}

        {diagnostics.packetLoss !== undefined && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>丢包率:</Text>
            <Text style={[styles.resultValue, { color: diagnostics.packetLoss > 5 ? '#F44336' : '#4CAF50' }]}>
              {diagnostics.packetLoss}%
            </Text>
          </View>
        )}

        {diagnostics.speedTest?.downloadSpeed && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>下载速度:</Text>
            <Text style={styles.resultValue}>{diagnostics.speedTest.downloadSpeed}Mbps</Text>
          </View>
        )}

        {diagnostics.retryAttempts !== undefined && diagnostics.retryAttempts > 0 && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>重试次数:</Text>
            <Text style={styles.resultValue}>{diagnostics.retryAttempts}</Text>
          </View>
        )}

        {diagnostics.errorMessage && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>错误信息:</Text>
            <Text style={[styles.resultValue, { color: '#F44336' }]}>{diagnostics.errorMessage}</Text>
          </View>
        )}

        {diagnostics.lastSuccessfulConnection && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>最后成功连接:</Text>
            <Text style={styles.resultValue}>
              {diagnostics.lastSuccessfulConnection.toLocaleTimeString()}
            </Text>
          </View>
        )}

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>状态描述:</Text>
          <Text style={styles.descriptionText}>
            {NetworkDiagnosticsService.getNetworkStatusDescription(diagnostics)}
          </Text>
        </View>

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>建议:</Text>
          {NetworkDiagnosticsService.getNetworkTroubleshootingSuggestions(diagnostics).map((suggestion, index) => (
            <Text key={index} style={styles.suggestionText}>
              • {suggestion}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>网络诊断测试</Text>
        <Text style={styles.subtitle}>测试网络诊断功能的各项能力</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={runBasicDiagnostics}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>运行网络诊断</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearResults}
            disabled={isLoading}
          >
            <Text style={[styles.buttonText, { color: '#F44336' }]}>清除结果</Text>
          </TouchableOpacity>
        </View>

        {renderDiagnostics()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  suggestionsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#856404',
  },
  suggestionText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
    marginBottom: 4,
  },
});