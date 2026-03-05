import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ action: string }> }
) {
    const { action } = await params;
    return NextResponse.json({
        message: 'Bypass mode',
        action,
        status: 'ok'
    });
}

export async function GET() {
    return NextResponse.json({ status: 'ok', source: 'Bypass' });
}
