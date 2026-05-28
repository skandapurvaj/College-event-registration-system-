// ============================================================
// db-init-simple.js â€“ Initialize MySQL directly
// ============================================================

const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
});

connection.connect((err) => {
  if (err) {
    console.error('âœ— Connection error:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_FOR_USER') {
      console.log('\nMySQL requires a password. Please set DB_PASSWORD in .env file.');
      console.log('To find your MySQL password, check your MySQL installation notes.');
    }
    process.exit(1);
  }
  
  console.log('âœ“ Connected to MySQL');
  
  // Create database
  connection.query('DROP DATABASE IF EXISTS college_event_registration', (err) => {
    if (err) console.error('Error dropping database:', err.message);
    
    connection.query('CREATE DATABASE college_event_registration', (err) => {
      if (err) {
        console.error('âœ— Error creating database:', err.message);
        connection.end();
        process.exit(1);
      }
      console.log('âœ“ Database created');
      
      // Use database
      connection.query('USE college_event_registration', (err) => {
        if (err) {
          console.error('âœ— Error using database:', err.message);
          connection.end();
          process.exit(1);
        }
        
        // Load and execute schema
        const fs = require('fs');
        const schema = fs.readFileSync('./sql/schema.sql', 'utf8');
        const statements = schema.split(';').filter(s => s.trim());
        
        let count = 0;
        const executeStatements = (index) => {
          if (index >= statements.length) {
            console.log('âœ“ Schema loaded');
            
            // Load sample data
            const data = fs.readFileSync('./sql/sample_data.sql', 'utf8');
            const dataStatements = data.split(';').filter(s => s.trim());
            
            let dataCount = 0;
            const executeDataStatements = (dIndex) => {
              if (dIndex >= dataStatements.length) {
                console.log('âœ“ Sample data loaded');
                console.log('\nâœ“ Database initialization complete!');
                connection.end();
                process.exit(0);
              } else {
                connection.query(dataStatements[dIndex], (err) => {
                  if (err && !err.message.includes('Duplicate entry')) {
                    console.error(`Error in data statement ${dIndex + 1}:`, err.message);
                  }
                  executeDataStatements(dIndex + 1);
                });
              }
            };
            executeDataStatements(0);
          } else {
            connection.query(statements[index], (err) => {
              if (err) {
                console.error(`Error in schema statement ${index + 1}:`, err.message);
              }
              executeStatements(index + 1);
            });
          }
        };
        executeStatements(0);
      });
    });
  });
});

connection.on('error', (err) => {
  console.error('âœ— MySQL Error:', err.message);
  process.exit(1);
});


