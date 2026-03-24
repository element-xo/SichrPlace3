// Simple Supabase connection test
require('dotenv').config();
const { supabase } = require('./config/supabase');

console.log('🧪 Testing Supabase connection...');
console.log('📍 Current working directory:', process.cwd());
console.log('🌐 Supabase URL:', process.env.SUPABASE_URL ? 'Configured' : 'Missing');

async function testSupabaseConnection() {
  try {
    console.log('🔌 Attempting to connect to Supabase...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Database is accessible');
    
    // Now start the server
    console.log('🚀 Starting SichrPlace server...');
    require('./server');
    
  } catch (err) {
    console.error('💥 Connection test failed:', err.message);
    process.exit(1);
  }
}

testSupabaseConnection();
