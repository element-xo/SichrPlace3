#!/usr/bin/env node

/**
 * SichrPlace Application Entry Point
 * 
 * This is the main entry point that starts the backend server
 * located in the backend/ directory while serving frontend
 * files from the root directory.
 */

const path = require('path');
const { spawn } = require('child_process');

console.log('🏠 Starting SichrPlace Application...');
console.log('📁 Backend: ./backend/');
console.log('🌐 Frontend: ./');
console.log('');

// Change to backend directory and start the server
process.chdir(path.join(__dirname, 'backend'));

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
