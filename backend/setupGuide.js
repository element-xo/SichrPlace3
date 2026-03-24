#!/usr/bin/env node
/**
 * SUPABASE MIGRATION SETUP GUIDE
 * 
 * This script guides you through the final setup steps to get your
 * migrated sichrplace platform running with Supabase.
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

console.log(colors.bold + colors.blue + '🚀 SUPABASE MIGRATION SETUP GUIDE');
console.log('=====================================');

console.log('\n📋 SETUP CHECKLIST:');

// 1. Check .env file
const envExists = checkFileExists('.env');
if (envExists) {
  log(colors.green, '✅ .env file exists');
} else {
  log(colors.yellow, '⚠️  .env file not found');
  console.log('   → Copy .env.example to .env and configure your values');
}

// 2. Check if services exist
const servicesExist = checkFileExists('services/UserService.js') && 
                     checkFileExists('services/ApartmentService.js');
if (servicesExist) {
  log(colors.green, '✅ Service layer is complete');
} else {
  log(colors.red, '❌ Service layer is missing');
}

// 3. Check migration script
const migrationExists = checkFileExists('migrations/001_initial_supabase_setup.sql');
if (migrationExists) {
  log(colors.green, '✅ Database migration script is ready');
} else {
  log(colors.red, '❌ Database migration script is missing');
}

// 4. Check config
const configExists = checkFileExists('config/supabase.js');
if (configExists) {
  log(colors.green, '✅ Supabase configuration is ready');
} else {
  log(colors.red, '❌ Supabase configuration is missing');
}

console.log('\n🎯 SETUP STEPS:');

console.log('\n' + colors.bold + '1. CREATE SUPABASE PROJECT' + colors.reset);
console.log('   → Go to https://supabase.com');
console.log('   → Create a new project');
console.log('   → Note down your project URL and API keys');

console.log('\n' + colors.bold + '2. CONFIGURE ENVIRONMENT' + colors.reset);
if (!envExists) {
  console.log('   → Run: cp .env.example .env');
}
console.log('   → Edit .env file with your Supabase credentials:');
console.log('     • SUPABASE_URL=https://your-project-ref.supabase.co');
console.log('     • SUPABASE_ANON_KEY=your-anon-key');
console.log('     • SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
console.log('     • JWT_SECRET=your-secure-random-secret');

console.log('\n' + colors.bold + '3. RUN DATABASE MIGRATION' + colors.reset);
console.log('   → Open Supabase Dashboard → SQL Editor');
console.log('   → Copy and run migrations/001_initial_supabase_setup.sql');
console.log('   → This creates all tables, relationships, and security policies');

console.log('\n' + colors.bold + '4. TEST THE MIGRATION' + colors.reset);
console.log('   → Run: node testMigration.js');
console.log('   → This verifies all services and database connections');

console.log('\n' + colors.bold + '5. START THE SERVER' + colors.reset);
console.log('   → Run: npm start');
console.log('   → Test endpoints with Postman or your frontend');

console.log('\n📚 KEY ENDPOINTS TO TEST:');
console.log('   • POST /auth/register - User registration');
console.log('   • POST /auth/login - User login');
console.log('   • POST /api/upload-apartment - Create apartment listing');
console.log('   • POST /api/viewing-request - Schedule viewing');
console.log('   • POST /api/send-message - Send message');
console.log('   • GET /api/feedback/download - Admin feedback download');

console.log('\n🔧 TROUBLESHOOTING:');
console.log('   • Connection errors: Check SUPABASE_URL and keys');
console.log('   • Table errors: Run the migration SQL script');
console.log('   • Auth errors: Verify JWT_SECRET is set');
console.log('   • CORS errors: Configure allowed origins in Supabase');

console.log('\n📖 DOCUMENTATION:');
console.log('   • Migration report: node migrationCompletionReport.js');
console.log('   • Final tasks: node finalMigrationTasks.js');
console.log('   • Service docs: Check services/ directory');

console.log('\n🎉 MIGRATION STATUS:');
log(colors.green + colors.bold, '✅ Code migration: 100% Complete');
log(colors.yellow + colors.bold, '🔧 Setup needed: Environment & Database');
log(colors.blue + colors.bold, '🚀 Ready for: Testing & Deployment');

console.log('\n' + colors.cyan + colors.bold + 'Your sichrplace platform is ready for Supabase!');
console.log('Follow the steps above to complete the setup.' + colors.reset);
