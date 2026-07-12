import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { createConnection } from 'mysql2/promise';


const envPath = join(__dirname, '../.env');
const envConfig = {};
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      envConfig[key] = value.trim();
    }
  });
}

async function main() {
  const url = envConfig.DATABASE_URL || "mysql://root:@localhost:3306/farmmart";
  console.log("Connecting to database:", url);
  
  let conn;
  try {
    conn = await createConnection(url);
  } catch (err) {
    try {
      const baseUrl = url.substring(0, url.lastIndexOf('/'));
      const tempConn = await createConnection(baseUrl);
      await tempConn.query("CREATE DATABASE IF NOT EXISTS farmmart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
      await tempConn.end();
      conn = await createConnection(url);
    } catch (dbErr) {
      console.error("Failed to connect or create database:", dbErr);
      process.exit(1);
    }
  }

  try {
    console.log("Altering 'users' table to add 'password' column if it doesn't exist...");
    const [columns] = await conn.query("SHOW COLUMNS FROM users LIKE 'password';");
    if (columns.length === 0) {
      await conn.query("ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL;");
      console.log("Added 'password' column to 'users' table.");
    } else {
      console.log("'password' column already exists.");
    }

    console.log("Clearing all existing users, animals, orders, cart, inquiries, and reviews...");
    await conn.query("SET FOREIGN_KEY_CHECKS = 0;");
    await conn.query("TRUNCATE TABLE reviews;");
    await conn.query("TRUNCATE TABLE inquiries;");
    await conn.query("TRUNCATE TABLE orders;");
    await conn.query("TRUNCATE TABLE cart;");
    await conn.query("TRUNCATE TABLE animals;");
    await conn.query("TRUNCATE TABLE users;");
    await conn.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("Database tables cleared successfully.");

    // Seed default admin user
    const adminEmail = "admin@farmmart.ng";
    const adminPassword = "password"; 
    
    console.log("Creating default admin user...");
    const adminId = "admin-user-id";
    await conn.query(
      `INSERT INTO users (id, firebase_uid, name, email, phone, role, password, is_verified) 
       VALUES (?, ?, ?, ?, ?, 'ADMIN', ?, 1)`,
      [adminId, "admin-firebase-uid", "Admin Oyegbile", adminEmail, "08067890123", adminPassword]
    );
    console.log(`Successfully created admin user: ${adminEmail} (password: ${adminPassword})`);
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

main();
