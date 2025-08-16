import { Platform } from 'react-native';

export interface NetworkDiagnostics {
  serverReachable: boolean;
  latency?: number;
  errorMessage?: string;
  networkType?: string;
  connectionQuality?: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  retryAttempts?: number;
  averageLatency?: number;
  jitter?: number;
  packetLoss?: number;
  lastSuccessfulConnection?: Date;
  speedTest?: {
    downloadSpeed?: number; // Mbps
    uploadSpeed?: number;   // Mbps
  };
  diagnosticDetails?: {
    dnsResolution?: number;
    tcpHandshake?: number;
    sslHandshake?: number;
    firstByteTime?: number;
  };
}

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface NetworkConnectionInfo {
  type: string;
  effective: string;
  downlink?: number;
  rtt?: number;
}

export class NetworkDiagnosticsService {
  private static API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.31.60:8080/api';
  
  // 默认重试配置
  private static DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 2, // 减少重试次数
    initialDelay: 1000,  // 1秒
    maxDelay: 5000,     // 减少最大延迟到5秒
    backoffMultiplier: 2
  };
  
  // 网络状态缓存
  private static lastNetworkCheck: Date | null = null;
  private static cachedNetworkInfo: NetworkDiagnostics | null = null;
  private static readonly CACHE_DURATION = 60000; // 增加到60秒缓存
  private static isDiagnosing = false; // 防止并发诊断

  /**
   * 执行全面的网络诊断
   */
  static async runDiagnostics(config?: Partial<RetryConfig>): Promise<NetworkDiagnostics> {
    // 防止并发诊断
    if (this.isDiagnosing) {
      console.log('网络诊断正在进行中，返回缓存结果');
      return this.cachedNetworkInfo || this.getDefaultDiagnostics();
    }

    // 检查缓存
    if (this.cachedNetworkInfo && this.lastNetworkCheck) {
      const timeSinceLastCheck = Date.now() - this.lastNetworkCheck.getTime();
      if (timeSinceLastCheck < this.CACHE_DURATION) {
        console.log('使用缓存的网络诊断结果');
        return this.cachedNetworkInfo;
      }
    }

    this.isDiagnosing = true;
    const retryConfig = { ...this.DEFAULT_RETRY_CONFIG, ...config };
    const diagnostics: NetworkDiagnostics = {
      serverReachable: false,
      connectionQuality: 'unknown',
      retryAttempts: 0,
    };

    console.log('开始网络诊断...');

    try {
      // 1. 获取网络连接信息
      const networkInfo = await this.getNetworkConnectionInfo();
      diagnostics.networkType = networkInfo.type;

      // 2. 测试服务器连接（带重试机制）
      const serverTest = await this.testServerConnectionWithRetry(retryConfig);
      diagnostics.serverReachable = serverTest.reachable;
      diagnostics.latency = serverTest.latency;
      diagnostics.errorMessage = serverTest.errorMessage;
      diagnostics.retryAttempts = serverTest.retryAttempts;

      // 3. 如果服务器可达，进行更详细的测试（减少测试次数）
      if (serverTest.reachable) {
        diagnostics.lastSuccessfulConnection = new Date();
        
        // 执行简化的ping测试（减少到3次）
        const pingResults = await this.performSimplifiedPingTests();
        diagnostics.averageLatency = pingResults.averageLatency;
        diagnostics.jitter = pingResults.jitter;
        diagnostics.packetLoss = pingResults.packetLoss;

        // 评估连接质量
        diagnostics.connectionQuality = this.evaluateConnectionQuality(pingResults);

        // 只在需要时执行速度测试
        if (pingResults.averageLatency && pingResults.averageLatency > 200) {
          const speedTest = await this.performSpeedTest();
          diagnostics.speedTest = speedTest;
        }
      }

      // 缓存结果
      this.cachedNetworkInfo = diagnostics;
      this.lastNetworkCheck = new Date();

      console.log('网络诊断完成:', diagnostics);
      return diagnostics;

    } catch (error) {
      console.error('网络诊断失败:', error);
      diagnostics.errorMessage = error instanceof Error ? error.message : '未知网络错误';
      
      // 缓存失败结果（但缓存时间较短）
      this.cachedNetworkInfo = diagnostics;
      this.lastNetworkCheck = new Date();
      
      return diagnostics;
    } finally {
      this.isDiagnosing = false;
    }
  }

  /**
   * 获取默认诊断结果
   */
  private static getDefaultDiagnostics(): NetworkDiagnostics {
    return {
      serverReachable: false,
      connectionQuality: 'unknown',
      retryAttempts: 0,
      errorMessage: '网络诊断服务不可用',
    };
  }

  /**
   * 获取网络连接信息
   */
  private static async getNetworkConnectionInfo(): Promise<NetworkConnectionInfo> {
    try {
      // 尝试使用Web API的网络连接信息
      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        const connection = (navigator as any).connection;
        return {
          type: connection.type || connection.effectiveType || 'unknown',
          effective: connection.effectiveType || 'unknown',
          downlink: connection.downlink,
          rtt: connection.rtt,
        };
      }

      // 在React Native环境中，通过Platform判断
      if (Platform.OS === 'web') {
        return { type: 'wifi', effective: 'unknown' };
      } else {
        return { type: 'cellular', effective: 'unknown' };
      }
    } catch (error) {
      console.log('无法获取网络连接信息:', error);
      return { type: 'unknown', effective: 'unknown' };
    }
  }

  /**
   * 带重试机制的服务器连接测试
   */
  private static async testServerConnectionWithRetry(config: RetryConfig): Promise<{
    reachable: boolean;
    latency?: number;
    errorMessage?: string;
    retryAttempts: number;
  }> {
    let lastError: Error | null = null;
    let delay = config.initialDelay;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const result = await this.testServerConnection();
        return { ...result, retryAttempts: attempt };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('未知错误');
        console.log(`连接尝试 ${attempt + 1}/${config.maxRetries + 1} 失败:`, lastError.message);

        if (attempt < config.maxRetries) {
          console.log(`${delay}ms 后重试...`);
          await this.sleep(delay);
          delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
        }
      }
    }

    return {
      reachable: false,
      errorMessage: lastError?.message || '连接失败',
      retryAttempts: config.maxRetries + 1,
    };
  }

  /**
   * 执行简化的ping测试（减少到3次）
   */
  private static async performSimplifiedPingTests(): Promise<{
    averageLatency: number;
    jitter: number;
    packetLoss: number;
    latencies: number[];
  }> {
    const pingCount = 3; // 减少到3次
    const latencies: number[] = [];
    let successCount = 0;

    console.log(`执行 ${pingCount} 次ping测试...`);

    for (let i = 0; i < pingCount; i++) {
      try {
        const result = await this.testServerConnection();
        if (result.reachable && result.latency) {
          latencies.push(result.latency);
          successCount++;
        }
        // 间隔300ms进行下一次测试（减少间隔）
        if (i < pingCount - 1) {
          await this.sleep(300);
        }
      } catch (error) {
        console.log(`Ping ${i + 1} 失败:`, error);
      }
    }

    const packetLoss = ((pingCount - successCount) / pingCount) * 100;
    
    if (latencies.length === 0) {
      return {
        averageLatency: 0,
        jitter: 0,
        packetLoss: 100,
        latencies: [],
      };
    }

    const averageLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    
    // 计算抖动（标准差）
    const variance = latencies.reduce((sum, lat) => sum + Math.pow(lat - averageLatency, 2), 0) / latencies.length;
    const jitter = Math.sqrt(variance);

    return {
      averageLatency: Math.round(averageLatency),
      jitter: Math.round(jitter),
      packetLoss: Math.round(packetLoss),
      latencies,
    };
  }

  /**
   * 评估连接质量
   */
  private static evaluateConnectionQuality(pingResults: {
    averageLatency: number;
    jitter: number;
    packetLoss: number;
  }): 'excellent' | 'good' | 'fair' | 'poor' | 'unknown' {
    const { averageLatency, jitter, packetLoss } = pingResults;

    // 如果丢包率过高，直接判定为差
    if (packetLoss > 10) return 'poor';
    if (packetLoss > 5) return 'fair';

    // 根据延迟和抖动评估
    if (averageLatency <= 50 && jitter <= 10) return 'excellent';
    if (averageLatency <= 100 && jitter <= 20) return 'good';
    if (averageLatency <= 200 && jitter <= 50) return 'fair';
    if (averageLatency <= 500) return 'poor';

    return 'poor';
  }

  /**
   * 执行简单的速度测试
   */
  private static async performSpeedTest(): Promise<{
    downloadSpeed?: number;
    uploadSpeed?: number;
  }> {
    try {
      // 下载速度测试 - 请求一个小文件
      const downloadSpeed = await this.testDownloadSpeed();
      
      // 上传速度测试暂时不实现，因为需要服务器支持
      return {
        downloadSpeed,
        uploadSpeed: undefined,
      };
    } catch (error) {
      console.log('速度测试失败:', error);
      return {};
    }
  }

  /**
   * 测试下载速度
   */
  private static async testDownloadSpeed(): Promise<number | undefined> {
    try {
      let testUrl = `${this.API_BASE_URL}/health`;
      if (testUrl.includes('localhost')) {
        testUrl = testUrl.replace('localhost', '127.0.0.1');
      }

      const startTime = performance.now();
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      const data = await response.text();
      const endTime = performance.now();
      
      const duration = (endTime - startTime) / 1000; // 转换为秒
      const sizeInBytes = new Blob([data]).size;
      const sizeInBits = sizeInBytes * 8;
      const speedMbps = (sizeInBits / duration) / (1024 * 1024); // 转换为Mbps

      return Math.round(speedMbps * 100) / 100; // 保留两位小数
    } catch (error) {
      console.log('下载速度测试失败:', error);
      return undefined;
    }
  }

  /**
   * 延迟工具方法
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 测试服务器连接
   */
  private static async testServerConnection(): Promise<{ reachable: boolean; latency?: number; errorMessage?: string }> {
    try {
      const startTime = Date.now();
      
      // 构建测试URL，优先使用127.0.0.1而不是localhost以避免DNS解析问题
      let testUrl = `${this.API_BASE_URL}/health`;
      if (testUrl.includes('localhost')) {
        testUrl = testUrl.replace('localhost', '127.0.0.1');
      }
      
      console.log('Testing server connection to:', testUrl);
      
      // 使用AbortController实现超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 减少超时时间到5秒
      
      try {
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Growth-Frontend/1.0.0',
            'Accept': '*/*',
            'Connection': 'keep-alive',
          },
          mode: 'cors',
          credentials: 'include',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        const latency = Date.now() - startTime;
        
        console.log(`Server response: ${response.status} ${response.statusText}, latency: ${latency}ms`);
        
        // 任何HTTP响应都表示服务器可达（包括401、404等）
        return {
          reachable: true,
          latency,
        };
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      const latency = Date.now() - Date.now();
      console.error('服务器连接测试失败:', error);
      
      let errorMessage = '未知网络错误';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '连接超时 (5秒)';
        } else if (error.message.includes('fetch')) {
          errorMessage = '网络请求失败，请检查网络连接或服务器状态';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        reachable: false,
        errorMessage,
      };
    }
  }

  /**
   * 清除缓存
   */
  static clearCache(): void {
    this.cachedNetworkInfo = null;
    this.lastNetworkCheck = null;
    console.log('网络诊断缓存已清除');
  }

  /**
   * 获取网络状态描述
   */
  static getNetworkStatusDescription(diagnostics: NetworkDiagnostics): string {
    if (!diagnostics.serverReachable) {
      return diagnostics.errorMessage || '无法连接到应用服务器，请检查服务器是否正在运行或稍后重试';
    }

    const latencyText = diagnostics.latency ? `（延迟: ${diagnostics.latency}ms）` : '';
    return `服务器连接正常 ${latencyText}`;
  }

  /**
   * 获取网络问题的解决建议
   */
  static getNetworkTroubleshootingSuggestions(diagnostics: NetworkDiagnostics): string[] {
    const suggestions: string[] = [];

    if (!diagnostics.serverReachable) {
      if (diagnostics.errorMessage?.includes('Network request failed')) {
        suggestions.push('检查设备的网络连接是否正常');
        suggestions.push('确认WiFi或移动数据已开启');
        suggestions.push('尝试连接到其他网络');
      }
      
      suggestions.push('检查应用服务器是否正在运行');
      suggestions.push('确认服务器地址配置正确');
      suggestions.push('检查防火墙或安全软件设置');
      suggestions.push('稍后重试，服务器可能临时不可用');
    }

    return suggestions;
  }

  /**
   * 检查是否为网络连接问题
   */
  static isNetworkError(error: Error): boolean {
    const networkErrorMessages = [
      'Network request failed',
      'fetch',
      'timeout',
      'connection',
      'ECONNREFUSED',
      'ENOTFOUND',
    ];
    
    return networkErrorMessages.some(msg =>
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
  }
}