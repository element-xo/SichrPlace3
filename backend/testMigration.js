#!/usr/bin/env node
/**
 * SUPABASE MIGRATION TEST SUITE
 * 
 * This script tests all the migrated services and endpoints to ensure
 * the Supabase migration is working correctly.
 */

const { supabase } = require('./config/supabase');

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testSupabaseConnection() {
  console.log('\n🔌 Testing Supabase Connection...');
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    log(colors.green, '✅ Supabase connection successful');
    return true;
  } catch (error) {
    log(colors.red, `❌ Supabase connection failed: ${error.message}`);
    return false;
  }
}

async function testServices() {
  console.log('\n🔧 Testing Service Layer...');
  const services = [
    { name: 'UserService', path: './services/UserService' },
    { name: 'ApartmentService', path: './services/ApartmentService' },
    { name: 'ViewingRequestService', path: './services/ViewingRequestService' },
    { name: 'MessageService', path: './services/MessageService' },
    { name: 'GdprService', path: './services/GdprService' }
  ];

  let allPassed = true;
  
  for (const service of services) {
    try {
      const ServiceClass = require(service.path);
      
      // Check if service has basic CRUD methods
      const methods = ['findById', 'create'];
      const hasBasicMethods = methods.some(method => 
        typeof ServiceClass[method] === 'function' || 
        (ServiceClass.UserService && typeof ServiceClass.UserService[method] === 'function') ||
        (ServiceClass.FeedbackService && typeof ServiceClass.FeedbackService[method] === 'function')
      );
      
      if (hasBasicMethods) {
        log(colors.green, `✅ ${service.name} loaded successfully`);
      } else {
        log(colors.yellow, `⚠️  ${service.name} loaded but missing standard methods`);
      }
    } catch (error) {
      log(colors.red, `❌ ${service.name} failed to load: ${error.message}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function testDatabaseSchema() {
  console.log('\n🗄️  Testing Database Schema...');
  const tables = [
    'users', 'apartments', 'viewing_requests', 'messages', 
    'conversations', 'feedback', 'gdpr_requests', 'consent_purposes'
  ];
  
  let allTablesExist = true;
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error && error.code === 'PGRST116') {
        log(colors.red, `❌ Table '${table}' does not exist`);
        allTablesExist = false;
      } else {
        log(colors.green, `✅ Table '${table}' exists`);
      }
    } catch (error) {
      log(colors.red, `❌ Error checking table '${table}': ${error.message}`);
      allTablesExist = false;
    }
  }
  
  return allTablesExist;
}

async function testCriticalRoutes() {
  console.log('\n🛣️  Testing Critical Route Files...');
  const routes = [
    { name: 'Authentication', path: './routes/auth.js' },
    { name: 'Messages', path: './routes/messages.js' },
    { name: 'Admin', path: './routes/admin.js' },
    { name: 'Viewing Request', path: './api/viewing-request.js' },
    { name: 'Feedback', path: './api/feedback.js' },
    { name: 'Upload Apartment', path: './api/upload-apartment.js' }
  ];
  
  let allPassed = true;
  
  for (const route of routes) {
    try {
      require(route.path);
      log(colors.green, `✅ ${route.name} route loaded successfully`);
    } catch (error) {
      log(colors.red, `❌ ${route.name} route failed: ${error.message}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function checkEnvironmentConfig() {
  console.log('\n⚙️  Checking Environment Configuration...');
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET'
  ];
  
  let allConfigured = true;
  
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      log(colors.green, `✅ ${varName} is configured`);
    } else {
      log(colors.yellow, `⚠️  ${varName} is not configured (check .env file)`);
      if (varName.includes('SUPABASE')) {
        allConfigured = false;
      }
    }
  }
  
  return allConfigured;
}

async function runMigrationTests() {
  console.log(colors.bold + '🧪 SUPABASE MIGRATION TEST SUITE');
  console.log('=====================================');
  
  const results = {
    connection: await testSupabaseConnection(),
    environment: await checkEnvironmentConfig(),
    services: await testServices(),
    schema: await testDatabaseSchema(),
    routes: await testCriticalRoutes()
  };
  
  console.log('\n📊 TEST RESULTS SUMMARY:');
  console.log('========================');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    const color = passed ? colors.green : colors.red;
    log(color, `${test.toUpperCase()}: ${status}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n🎯 OVERALL STATUS:');
  if (allPassed) {
    log(colors.green + colors.bold, '🎉 ALL TESTS PASSED - MIGRATION READY!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Set up your Supabase project and add credentials to .env');
    console.log('2. Run the database migration script in Supabase');
    console.log('3. Test endpoints with your frontend or Postman');
  } else {
    log(colors.yellow + colors.bold, '⚠️  SOME TESTS FAILED - NEEDS ATTENTION');
    console.log('\n🔧 Required Actions:');
    if (!results.connection || !results.environment) {
      console.log('• Configure .env file with Supabase credentials');
    }
    if (!results.schema) {
      console.log('• Run database migration script in Supabase');
    }
    if (!results.services || !results.routes) {
      console.log('• Check service imports and route configurations');
    }
  }
  
  console.log('\n📖 Documentation:');
  console.log('• Migration guide: See migrationCompletionReport.js');
  console.log('• Environment setup: Copy .env.example to .env');
  console.log('• Database schema: migrations/001_initial_supabase_setup.sql');
  
  process.exit(allPassed ? 0 : 1);
}

// Run the tests
runMigrationTests().catch(error => {
  log(colors.red, `Fatal error: ${error.message}`);
  process.exit(1);
});
