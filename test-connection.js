#!/usr/bin/env node

/**
 * Test Database Connection
 *
 * This script checks if your database connection is properly configured.
 * Run with: node test-connection.js
 */

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Testing database connection...\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('\n📝 Please set DATABASE_URL in packages/database/.env');
    console.log('   Format: postgresql://postgres:[PASSWORD]@db.zzxfdjoxddjmzhhytxzx.supabase.co:5432/postgres');
    process.exit(1);
  }

  // Check if password placeholder is still there
  if (process.env.DATABASE_URL.includes('[YOUR-PASSWORD]')) {
    console.error('❌ DATABASE_URL still contains placeholder password');
    console.log('\n📝 Please replace [YOUR-PASSWORD] with your actual Supabase password');
    console.log('   Get it from: https://supabase.com/dashboard/project/zzxfdjoxddjmzhhytxzx/settings/database');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL is configured\n');

  // Try to connect
  const prisma = new PrismaClient();

  try {
    console.log('🔌 Attempting to connect to database...');
    await prisma.$connect();
    console.log('✅ Successfully connected to database!\n');

    // Try a simple query
    console.log('📊 Checking database tables...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database\n`);

    console.log('🎉 Database connection test passed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run db:push (if you haven\'t already)');
    console.log('   2. Run: cd packages/database && npm run seed');
    console.log('   3. Run: npm run dev:web');

  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(error.message);

    if (error.message.includes('password authentication failed')) {
      console.log('\n📝 Password is incorrect. Please check your Supabase dashboard.');
    } else if (error.message.includes('Table') && error.message.includes('does not exist')) {
      console.log('\n📝 Tables not created yet. Run: npm run db:push');
    } else {
      console.log('\n📝 Please check your DATABASE_URL configuration.');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Load environment variables from packages/database/.env
require('dotenv').config({ path: './packages/database/.env' });

testConnection().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
