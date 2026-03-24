#!/usr/bin/env node

/**
 * SichrPlace Application Entry Point
 * 
 * This is the main entry point that starts the backend server
 * located in the backend/ directory while serving frontend
 * files from the root directory.
 */

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

console.log('🏠 Starting SichrPlace Application...');
console.log('📁 Current Directory:', __dirname);

// Check if backend directory exists
const backendPath = path.join(__dirname, 'backend');
console.log('🔍 Backend Path:', backendPath);

if (!fs.existsSync(backendPath)) {
  console.error('❌ Backend directory not found at:', backendPath);
  console.log('📁 Available directories:');
  const dirs = fs.readdirSync(__dirname, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  console.log(dirs.join(', '));
  process.exit(1);
}

// Check if backend server.js exists
const backendServerPath = path.join(backendPath, 'server.js');
if (!fs.existsSync(backendServerPath)) {
  console.error('❌ Backend server.js not found at:', backendServerPath);
  process.exit(1);
}

console.log('✅ Backend found');
console.log('📁 Backend: ./backend/');
console.log('🌐 Frontend: ./');
console.log('');

// Change to backend directory and start the server
try {
  process.chdir(backendPath);
  console.log('📂 Changed to directory:', process.cwd());
} catch (err) {
  console.error('❌ Failed to change directory:', err);
  process.exit(1);
}

// Start the backend server
const serverProcess = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
});

serverProcess.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`🛑 Server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down SichrPlace...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down SichrPlace...');
  serverProcess.kill('SIGTERM');
});
