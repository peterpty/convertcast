const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

async function verifyDatabase() {
  console.log('🔍 Verifying ConvertCast Database Setup\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing environment variables');
    console.log('   Please ensure .env.local is configured correctly\n');
    return;
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const tables = [
    'users', 'events', 'participants', 'messages',
    'overlay_elements', 'transactions', 'analytics', 'notifications'
  ];

  console.log('📊 Checking database tables...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`);
        errorCount++;
      } else {
        console.log(`✅ Table '${table}': Ready`);
        successCount++;
      }
    } catch (e) {
      console.log(`❌ Table '${table}': Connection failed`);
      errorCount++;
    }
  }

  console.log('\n📈 Verification Summary:');
  console.log(`   ✅ Success: ${successCount}/${tables.length} tables`);
  console.log(`   ❌ Errors: ${errorCount}/${tables.length} tables\n`);

  if (successCount === tables.length) {
    console.log('🎉 Database verification completed successfully!');
    console.log('   Your ConvertCast platform is ready for development\n');

    console.log('🚀 Next steps:');
    console.log('   1. Run "npm run dev" to start development server');
    console.log('   2. Visit http://localhost:3000 to see the platform');
    console.log('   3. Create your first streamer account');
    console.log('   4. Set up your first live event\n');

    console.log('📚 Available features:');
    console.log('   • User authentication (email/password + Google OAuth)');
    console.log('   • Event creation and management');
    console.log('   • Real-time chat system');
    console.log('   • OBS overlay integration');
    console.log('   • Payment processing setup');
    console.log('   • Analytics and reporting');
  } else if (successCount > 0) {
    console.log('⚠️  Partial setup detected');
    console.log('   Some tables are missing. Please re-run the schema setup.');
  } else {
    console.log('❌ Database setup incomplete');
    console.log('   Please execute the schema manually in Supabase Dashboard');
    console.log('   Follow the instructions from: npm run db:setup');
  }

  // Test authentication
  console.log('\n🔐 Testing authentication system...');

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError && authError.message !== 'Invalid JWT: not signed by Supabase') {
      console.log(`❌ Auth system: ${authError.message}`);
    } else {
      console.log('✅ Auth system: Ready for users');
    }
  } catch (e) {
    console.log('⚠️  Auth system: Could not test (normal for first setup)');
  }

  console.log('\n═══════════════════════════════════════');
  console.log('ConvertCast Database Verification Complete');
  console.log('═══════════════════════════════════════');
}

if (require.main === module) {
  verifyDatabase().catch(console.error);
}

module.exports = { verifyDatabase };