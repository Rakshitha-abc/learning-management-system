import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST?.trim(),
  port: parseInt((process.env.DB_PORT || '18152').trim()),
  user: process.env.DB_USER?.trim(),
  password: process.env.DB_PASSWORD?.trim(),
  database: process.env.DB_NAME?.trim(),
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000 // Increased timeout for serverless wake-up
});

console.log(`[DB] Attempting connection to: ${process.env.DB_HOST?.trim() || 'undefined'}`);

export default pool;
