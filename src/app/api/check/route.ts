import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Next.js App Router API is working',
        env: {
            has_host: !!process.env.DB_HOST,
            has_user: !!process.env.DB_USER,
            node_env: process.env.NODE_ENV
        }
    });
}
