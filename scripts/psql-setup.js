const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function setupDatabaseWithPsql() {
  console.log('🚀 Setting up ConvertCast Database with PostgreSQL...\n');

  const dbPassword = '6sWoecfvgYgbC0y';
  const dbHost = 'db.yedvdwedhoetxukablxf.supabase.co';
  const dbPort = '5432';
  const dbName = 'postgres';
  const dbUser = 'postgres';

  // Connection string
  const connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

  console.log('📋 Database Connection Details:');
  console.log(`   Host: ${dbHost}`);
  console.log(`   Port: ${dbPort}`);
  console.log(`   Database: ${dbName}`);
  console.log(`   User: ${dbUser}\n`);

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Schema file loaded successfully');
    console.log(`   File size: ${(schema.length / 1024).toFixed(1)}KB\n`);

    // Create a temporary SQL file for execution
    const tempSqlPath = path.join(__dirname, 'temp-schema.sql');
    fs.writeFileSync(tempSqlPath, schema);

    console.log('🔧 Attempting to execute schema using psql...\n');

    // Try to execute using psql
    const psqlProcess = spawn('psql', [connectionString, '-f', tempSqlPath], {
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    psqlProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    psqlProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    await new Promise((resolve, reject) => {
      psqlProcess.on('close', (code) => {
        // Clean up temp file
        try {
          fs.unlinkSync(tempSqlPath);
        } catch (e) {
          // Ignore cleanup errors
        }

        if (code === 0) {
          console.log('✅ Schema executed successfully with psql!');
          console.log('\n📊 Output:');
          console.log(output);
          resolve();
        } else {
          console.log('❌ psql execution failed');
          if (errorOutput) {
            console.log('\n📊 Error Output:');
            console.log(errorOutput);
          }
          reject(new Error(`psql exited with code ${code}`));
        }
      });

      psqlProcess.on('error', (error) => {
        // Clean up temp file
        try {
          fs.unlinkSync(tempSqlPath);
        } catch (e) {
          // Ignore cleanup errors
        }
        reject(error);
      });
    });

  } catch (error) {
    console.log('❌ Direct psql execution not available');
    console.log(`   Error: ${error.message}\n`);

    // Fallback: Provide manual setup instructions
    console.log('🔧 MANUAL SETUP REQUIRED\n');
    console.log('Since automated execution failed, please set up manually:');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📋 OPTION 1: Supabase Dashboard (Recommended)');
    console.log('   1. Go to: https://yedvdwedhoetxukablxf.supabase.co/project/yedvdwedhoetxukablxf');
    console.log('   2. Click "SQL Editor" in the sidebar');
    console.log('   3. Copy all content from: supabase/schema.sql');
    console.log('   4. Paste into SQL Editor and click "Run"\n');

    console.log('📋 OPTION 2: Direct PostgreSQL Connection');
    console.log('   If you have psql installed:');
    console.log(`   psql "${connectionString}" -f supabase/schema.sql\n`);

    console.log('📋 OPTION 3: Database Client');
    console.log('   Use any PostgreSQL client (pgAdmin, DBeaver, etc.):');
    console.log(`   Host: ${dbHost}`);
    console.log(`   Port: ${dbPort}`);
    console.log(`   Database: ${dbName}`);
    console.log(`   Username: ${dbUser}`);
    console.log(`   Password: ${dbPassword}\n`);

    console.log('🎯 WHAT TO EXECUTE:');
    console.log('   Execute the complete content of: supabase/schema.sql');
    console.log('   This will create all tables, policies, and functions\n');

    console.log('✅ AFTER SETUP:');
    console.log('   Run "npm run db:verify" to confirm everything works');
    console.log('   Then run "npm run dev" to start development\n');
  }
}

// Execute the setup
setupDatabaseWithPsql();