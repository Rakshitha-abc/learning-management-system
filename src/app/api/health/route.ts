import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        version: '1.1.0',
        build_check: 'checking_auto_build',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
}
