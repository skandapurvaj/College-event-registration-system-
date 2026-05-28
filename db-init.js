// ============================================================
// db-init.js – Initialize MySQL database with schema
// Run once: node db-init.js
// ============================================================

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  try {
    // Connect to MySQL without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    console.log('✓ Connected to MySQL');

    // Create database
    try {
      await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
      console.log(`✓ Dropped database ${process.env.DB_NAME}`);
    } catch (err) {
      console.log(`  (Database did not exist, creating...)`);
    }

    await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`✓ Created database ${process.env.DB_NAME}`);

    // Use database
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log(`✓ Using database ${process.env.DB_NAME}`);

    // Load and execute schema.sql
    const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split and execute statements
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (err) {
          console.error('Error executing statement:', err.message);
        }
      }
    }
    console.log(`✓ Schema initialized`);

    // Load and execute sample_data.sql
    const dataPath = path.join(__dirname, 'sql', 'sample_data.sql');
    const data = fs.readFileSync(dataPath, 'utf8');
    
    const dataStatements = data.split(';').filter(stmt => stmt.trim());
    for (const statement of dataStatements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (err) {
          console.error('Error executing data statement:', err.message);
        }
      }
    }
    console.log(`✓ Sample data loaded`);

    await connection.end();
    console.log('\n✓ Database initialization complete!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  }
}

initializeDatabase();
