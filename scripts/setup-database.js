const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function setupDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase configuration in .env.local');
    console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    process.exit(1);
  }

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('🚀 Setting up ConvertCast database...\n');

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    console.log(`📝 Executing ${statements.length} database statements...\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });

        if (error) {
          // Try direct execution for DDL statements
          const { error: directError } = await supabase
            .from('_dummy_')
            .select('*')
            .limit(0);

          // Since we can't execute DDL directly, we'll use the SQL editor approach
          console.log(`⚠️  Statement ${i + 1}: Needs manual execution`);
          console.log(`   ${statement.substring(0, 60)}...`);
        } else {
          successCount++;
          console.log(`✅ Statement ${i + 1}: Executed successfully`);
        }
      } catch (err) {
        errorCount++;
        console.log(`❌ Statement ${i + 1}: Error - ${err.message}`);
        console.log(`   ${statement.substring(0, 60)}...`);
      }
    }

    console.log(`\n📊 Database Setup Summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total: ${statements.length}`);

    if (errorCount > 0) {
      console.log('\n⚠️  Some statements could not be executed automatically.');
      console.log('   Please run the schema manually in Supabase Dashboard > SQL Editor');
      console.log('   File location: ./supabase/schema.sql');
    }

    // Test the database connection
    console.log('\n🔍 Testing database connection...');

    const { data, error: testError } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);

    if (testError) {
      console.log('❌ Database connection test failed');
      console.log('   Please execute the schema manually in Supabase Dashboard');
    } else {
      console.log('✅ Database connection successful!');
    }

  } catch (error) {
    console.error('❌ Fatal error setting up database:', error.message);
    process.exit(1);
  }
}

// Manual setup instructions
function printManualInstructions() {
  console.log('\n🔧 MANUAL SETUP INSTRUCTIONS:');
  console.log('   1. Go to https://yedvdwedhoetxukablxf.supabase.co/project/yedvdwedhoetxukablxf');
  console.log('   2. Navigate to SQL Editor in the sidebar');
  console.log('   3. Copy and paste the content from ./supabase/schema.sql');
  console.log('   4. Click "Run" to execute the schema');
  console.log('   5. Wait for all statements to complete');
  console.log('\n✨ Your ConvertCast database will be ready to go!\n');
}

if (require.main === module) {
  setupDatabase()
    .then(() => {
      printManualInstructions();
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      printManualInstructions();
    });
}

module.exports = { setupDatabase };