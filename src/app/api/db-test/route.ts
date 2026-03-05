import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
    console.log("DB Test Route Triggered");

    const config = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '18152'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    };

    try {
        console.log("Attempting to connect to:", config.host);
        if (!config.host || !config.password) {
            return NextResponse.json({ error: "Environment variables missing", config_keys: Object.keys(config).filter(k => !(config as any)[k]) }, { status: 500 });
        }

        const connection = await mysql.createConnection(config);
        console.log("Connected successfully");

        const [rows] = await connection.query("SELECT 1 as val");
        await connection.end();

        return NextResponse.json({
            status: 'ok',
            message: 'Database connected successfully',
            db_response: rows
        });
    } catch (error: any) {
        console.error("DB Connection Error:", error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack,
            config_used: { ...config, password: '****' }
        }, { status: 500 });
    }
}
