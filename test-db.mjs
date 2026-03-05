import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function testConnection() {
    console.log("Testing connection to:", process.env.DB_HOST);
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '18152'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
                rejectUnauthorized: false
            }
        });
        console.log("SUCCESS: Connected to database.");

        const [rows] = await connection.query("DESCRIBE users;");
        console.log("Schema of 'users' table:\n" + JSON.stringify(rows, null, 2));

        await connection.end();
    } catch (error) {
        console.error("FAILURE: Could not connect to database:", error);
    }
}

testConnection();
