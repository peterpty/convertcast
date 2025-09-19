const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function executeSchemaDirectly() {
  console.log('🚀 Executing ConvertCast Database Schema Directly...\n');

  // Use your credentials
  const supabaseUrl = 'https://yedvdwedhoetxukablxf.supabase.co';
  const supabaseServiceKey = 'sb_secret_0vs2_C1wmxbN65Wd509P-A_V9fPYCaq';

  // Create Supabase client with service role
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Read schema file successfully');
    console.log(`   File size: ${(schema.length / 1024).toFixed(1)}KB`);

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .map(stmt => stmt + ';');

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute statements one by one
    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const displayStatement = statement.substring(0, 80) + (statement.length > 80 ? '...' : '');

      try {
        // Use a more direct approach with the REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ sql: statement })
        });

        if (response.ok) {
          console.log(`✅ ${i + 1}/${statements.length}: ${displayStatement}`);
          successCount++;
        } else {
          const errorText = await response.text();

          // Skip certain expected "errors" that are actually OK
          if (errorText.includes('already exists') ||
              errorText.includes('does not exist') ||
              errorText.includes('duplicate key')) {
            console.log(`⏭️  ${i + 1}/${statements.length}: ${displayStatement} (already exists)`);
            skipCount++;
          } else {
            console.log(`❌ ${i + 1}/${statements.length}: ${displayStatement}`);
            console.log(`   Error: ${errorText.substring(0, 100)}...`);
          }
        }

      } catch (error) {
        // Try alternative execution method
        try {
          // Use Supabase client query method
          const { error: supabaseError } = await supabase.from('_dummy').select().eq('dummy', statement);

          if (!supabaseError || supabaseError.message.includes('relation "_dummy" does not exist')) {
            console.log(`⚠️  ${i + 1}/${statements.length}: Could not execute directly`);
          }
        } catch (fallbackError) {
          console.log(`❌ ${i + 1}/${statements.length}: ${displayStatement}`);
          console.log(`   Error: ${error.message.substring(0, 100)}...`);
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📊 Execution Summary:');
    console.log(`   ✅ Successfully executed: ${successCount}`);
    console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
    console.log(`   ❌ Failed: ${statements.length - successCount - skipCount}`);
    console.log(`   📝 Total statements: ${statements.length}`);

    // Verify the setup by checking if key tables exist
    console.log('\n🔍 Verifying database setup...');

    const tablesToCheck = ['users', 'events', 'participants', 'messages'];
    let verifiedCount = 0;

    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);

        if (!error) {
          console.log(`✅ Table '${table}': Ready`);
          verifiedCount++;
        } else {
          console.log(`❌ Table '${table}': ${error.message}`);
        }
      } catch (e) {
        console.log(`❌ Table '${table}': Verification failed`);
      }
    }

    if (verifiedCount === tablesToCheck.length) {
      console.log('\n🎉 Database setup completed successfully!');
      console.log('   All core tables are ready for ConvertCast');
      console.log('\n🚀 Next steps:');
      console.log('   1. Run "npm run dev" to start the development server');
      console.log('   2. Visit http://localhost:3000 to see your platform');
      console.log('   3. Create your first streamer account and event');
    } else {
      console.log('\n⚠️  Database setup partially completed');
      console.log('   Some manual setup may be required');
      console.log('   Consider running the schema manually in Supabase Dashboard');
    }

  } catch (error) {
    console.error('\n❌ Failed to execute schema:', error.message);
    console.log('\n🔧 Fallback: Manual Setup Required');
    console.log('   Please execute the schema manually in Supabase Dashboard');
    console.log('   File: supabase/schema.sql');
  }
}

// Execute the setup
executeSchemaDirectly();