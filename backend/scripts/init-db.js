/**
 * Database Initialization Script
 * สร้างตาราง users และ movies
 * 
 * Usage: npm run db:init
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
};

const DB_NAME = process.env.DB_NAME || 'moviesdb';

const createTables = async () => {
  let connection;

  try {
    console.log('🔧 Connecting to MySQL server...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected to MySQL server');

    // Create database if not exists
    console.log(`📦 Creating database "${DB_NAME}" if not exists...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.execute(`USE \`${DB_NAME}\``);
    console.log('✅ Database ready');

    // Create users table
    console.log('📋 Creating "users" table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ "users" table created');

    // Create movies table
    console.log('📋 Creating "movies" table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        source_url VARCHAR(500) NOT NULL,
        thumb_url VARCHAR(500),
        subtitle VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_title (title),
        FULLTEXT INDEX idx_search (title, description)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ "movies" table created');

    console.log('');
    console.log('🎉 Database initialization completed!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Run: npm run db:seed   (to add sample data)');
    console.log('  2. Run: npm start         (to start the server)');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

createTables();

