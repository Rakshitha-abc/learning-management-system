import { NextResponse } from 'next/server';
import pool from '@/backend/config/db';

export async function GET() {
    console.log("Diagnostic Route /api/test triggered");

    // Check missing environment variables
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_ACCESS_SECRET'];
    const missingVars = requiredVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
        return NextResponse.json({
            status: 'error',
            message: 'Your Vercel deployment is missing environment variables!',
            missing_variables: missingVars,
            action: 'Please add these keys to your Vercel Project Settings > Environment Variables'
        }, { status: 500 });
    }

    try {
        console.log("Attempting to test DB connection...");
        const [rows]: any = await pool.query("SELECT 1 as connection_test");

        return NextResponse.json({
            status: 'ok',
            message: 'Perfect! Both API and Database are connected correctly.',
            db_connection: 'Verified',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("Diagnostic DB error:", error);
        return NextResponse.json({
            status: 'error',
            message: 'API is working, but could not connect to the database.',
            error_details: error.message,
            tip: 'Ensure your database is active and allows connections from any IP if necessary.'
        }, { status: 500 });
    }
}
