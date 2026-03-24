// Add test user to Supabase with correct credentials
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addTestUser() {
  try {
    console.log('🔑 Generating password hash...');
    const passwordHash = await bcrypt.hash('Ricardoquaresma7*', 10);
    console.log('Hash generated:', passwordHash);
    
    console.log('👤 Creating test user in Supabase...');
    const { data, error } = await supabase
      .from('users')
      .upsert({
        username: 'omer3kale',
        email: 'omer3kale@gmail.com',
        password: passwordHash,
        role: 'admin',
        first_name: 'Omer',
        last_name: 'Kale',
        email_verified: true,
        gdpr_consent: true,
        gdpr_consent_date: new Date().toISOString(),
        data_processing_consent: true,
        account_status: 'active'
      }, {
        onConflict: 'email'
      });
    
    if (error) {
      console.error('❌ Error creating user:', error);
    } else {
      console.log('✅ Test user created successfully!');
      console.log('📧 Email: omer3kale@gmail.com');
      console.log('🔐 Password: Ricardoquaresma7*');
      console.log('👨‍💼 Role: admin');
    }
    
  } catch (err) {
    console.error('❌ Failed to create test user:', err.message);
  }
}

addTestUser();
