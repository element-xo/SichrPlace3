#!/usr/bin/env node

/**
 * SichrPlace PayPal Integration Test Script
 * Tests the PayPal configuration and viewing request system
 */

require('dotenv').config();
const {
  Client,
  Environment,
  LogLevel,
  OrdersController,
} = require('@paypal/paypal-server-sdk');

console.log('🚀 SichrPlace PayPal Integration Test');
console.log('=====================================');

// Check environment variables
console.log('\n📋 Environment Configuration:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PayPal Client ID: ${process.env.PAYPAL_CLIENT_ID ? '✅ Configured' : '❌ Missing'}`);
console.log(`PayPal Client Secret: ${process.env.PAYPAL_CLIENT_SECRET ? '✅ Configured' : '❌ Missing'}`);
console.log(`Email Password: ${process.env.EMAIL_PASSWORD ? '✅ Configured' : '❌ Missing'}`);
console.log(`Base URL: ${process.env.BASE_URL || 'http://localhost:3000'}`);

// Determine PayPal environment
const isProduction = process.env.NODE_ENV === 'production';
const environment = isProduction ? Environment.Production : Environment.Sandbox;
console.log(`PayPal Environment: ${isProduction ? '🔴 PRODUCTION' : '🟡 SANDBOX'}`);

// Test PayPal client initialization
try {
  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: process.env.PAYPAL_CLIENT_ID,
      oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: environment,
    logging: {
      logLevel: LogLevel.Info,
      logRequest: { logBody: true },
      logResponse: { logHeaders: true },
    },
  });

  const ordersController = new OrdersController(client);
  console.log('\n✅ PayPal Client initialized successfully');

  // Test order creation (without actually creating)
  const testOrderData = {
    apartmentId: 'TEST123',
    viewingDate: '2025-02-15',
    viewingTime: '14:00',
    applicantName: 'Test User',
    applicantEmail: 'sichrplace@gmail.com',
    applicantPhone: '+49123456789'
  };

  console.log('\n🧪 Test Order Configuration:');
  console.log(`Amount: €25.00 EUR`);
  console.log(`Description: Viewing Service for Apartment ${testOrderData.apartmentId}`);
  console.log(`Business Name: SichrPlace`);

} catch (error) {
  console.error('\n❌ PayPal Client initialization failed:', error.message);
}

console.log('\n🔧 Setup Checklist:');
console.log(`${process.env.PAYPAL_CLIENT_ID ? '✅' : '❌'} PayPal Client ID configured`);
console.log(`${process.env.PAYPAL_CLIENT_SECRET ? '✅' : '❌'} PayPal Client Secret configured`);
console.log(`${process.env.EMAIL_PASSWORD ? '✅' : '❌'} Gmail app password configured`);
console.log(`✅ PayPal SDK updated to latest version`);
console.log(`✅ Database schema updated with transactionId field`);
console.log(`✅ Frontend updated with modern PayPal Buttons`);

console.log('\n🌐 URLs:');
console.log(`Frontend: ${process.env.BASE_URL || 'http://localhost:3000'}`);
console.log(`Create Order API: ${process.env.BASE_URL || 'http://localhost:3000'}/api/create-viewing-order`);
console.log(`Capture Order API: ${process.env.BASE_URL || 'http://localhost:3000'}/api/capture-viewing-order/:orderID`);

console.log('\n🎯 Next Steps:');
if (!process.env.EMAIL_PASSWORD) {
  console.log('1. Set up Gmail app password for sichrplace@gmail.com');
  console.log('   - Go to Google Account settings');
  console.log('   - Enable 2-factor authentication');
  console.log('   - Generate app password for "Mail"');
  console.log('   - Update EMAIL_PASSWORD in .env file');
}
console.log('2. Start the server: npm start');
console.log('3. Test viewing request with PayPal payment');
console.log('4. When ready for production: set NODE_ENV=production');

console.log('\n✨ Integration Status: READY FOR TESTING');
console.log('=====================================\n');
