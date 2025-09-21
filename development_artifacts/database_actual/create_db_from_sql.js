const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Database file path
const DB_PATH = path.join(__dirname, 'unite_information.db');

// SQL files directory
const SQL_DIR = path.join(__dirname, 'databaseDump');

// Create a new database or connect to existing one
const db = new sqlite3.Database(DB_PATH);

// Function to execute SQL from file
function executeSqlFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, sql) => {
      if (err) {
        return reject(`Error reading file ${filePath}: ${err.message}`);
      }
      
      console.log(`Executing SQL from: ${path.basename(filePath)}`);
      
      db.exec(sql, (err) => {
        if (err) {
          return reject(`Error executing SQL from ${filePath}: ${err.message}`);
        }
        resolve();
      });
    });
  });
}

// Process all SQL files in directory
async function processAllSqlFiles() {
  try {
    console.log('Starting database creation...');
    
    // Begin transaction for better performance
    await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', err => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // First execute createTables.sql to set up schema
    const createTablesPath = path.join(SQL_DIR, 'createTables.sql');
    if (fs.existsSync(createTablesPath)) {
      await executeSqlFile(createTablesPath);
    } else {
      console.warn('Warning: createTables.sql not found. Schema may not be properly initialized.');
    }
    
    // Then execute all other SQL files (data)
    const files = fs.readdirSync(SQL_DIR);
    
    for (const file of files) {
      if (file.endsWith('.sql') && file !== 'createTables.sql') {
        await executeSqlFile(path.join(SQL_DIR, file));
      }
    }
    
    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.run('COMMIT', err => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('Database creation completed successfully!');
  } catch (error) {
    console.error('Error during database creation:', error);
    
    // Rollback transaction on error
    db.run('ROLLBACK', err => {
      if (err) console.error('Error rolling back transaction:', err);
    });
  } finally {
    // Close database connection
    db.close(err => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

// Execute the process
processAllSqlFiles();
