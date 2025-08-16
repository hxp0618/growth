#!/usr/bin/env node

const http = require('http');

const API_BASE_URL = 'http://localhost:8080';

function checkBackend() {
  console.log('🔍 检查后端服务器状态...');
  
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/health',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ 后端服务器正在运行 (状态码: ${res.statusCode})`);
    console.log('📡 API 基础地址:', API_BASE_URL + '/api');
  });

  req.on('error', (err) => {
    console.log('❌ 后端服务器未运行或无法连接');
    console.log('📋 错误信息:', err.message);
    console.log('');
    console.log('🚀 启动后端服务器的建议步骤:');
    console.log('1. 确保后端项目已下载并配置完成');
    console.log('2. 进入后端项目目录');
    console.log('3. 安装依赖: npm install 或 yarn install');
    console.log('4. 启动服务器: npm start 或 yarn start');
    console.log('5. 确保服务器运行在端口 8080');
    console.log('');
    console.log('💡 如果后端运行在不同端口，请更新 .env.development 文件中的 EXPO_PUBLIC_API_BASE_URL');
  });

  req.on('timeout', () => {
    console.log('⏰ 请求超时 - 后端服务器可能未响应');
    req.destroy();
  });

  req.end();
}

checkBackend();