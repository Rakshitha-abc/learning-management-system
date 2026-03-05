import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        version: '1.0.1',
        build_trigger: Date.now(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
}
