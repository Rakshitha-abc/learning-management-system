import { NextResponse } from 'next/server';
import pool from '@/backend/config/db';

export async function GET() {
    try {
        // 1. Test basic connection
        await pool.query("SELECT 1");

        // 2. Check if tables exist
        const [tables]: any = await pool.query("SHOW TABLES");
        const tableNames = tables.map((t: any) => Object.values(t)[0]);

        const requiredTables = ['users', 'subjects', 'sections', 'videos'];
        const missingTables = requiredTables.filter(t => !tableNames.includes(t));

        if (missingTables.length > 0) {
            return NextResponse.json({
                status: 'error',
                message: 'Database connection ok, but tables are missing!',
                found_tables: tableNames,
                missing_tables: missingTables,
                solution: 'You need to run the database initialization script to create the tables.'
            }, { status: 500 });
        }

        return NextResponse.json({
            status: 'ok',
            message: 'All systems go! Database is connected and tables exist.',
            tables: tableNames
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Database check failed',
            details: error.message
        }, { status: 500 });
    }
}
