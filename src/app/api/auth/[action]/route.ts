import { NextRequest, NextResponse } from 'next/server';
import * as authService from '@/backend/modules/auth/auth.service';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ action: string }> }
) {
    const { action } = await params;
    const body = await request.json();

    try {
        if (action === 'register') {
            const { email, password, name } = body;
            const result = await authService.register(email, password, name);

            const response = NextResponse.json({
                user: result.user,
                accessToken: result.accessToken
            }, { status: 201 });

            // Set cookie
            response.cookies.set('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60
            });

            return response;
        }

        if (action === 'login') {
            const { email, password } = body;
            const result = await authService.login(email, password);

            if (!result) {
                return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
            }

            const response = NextResponse.json({
                user: result.user,
                accessToken: result.accessToken
            });

            response.cookies.set('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60
            });

            return response;
        }

        return NextResponse.json({ message: 'Not Found' }, { status: 404 });

    } catch (error: any) {
        console.error(`Auth Error (${action}):`, error);
        return NextResponse.json({
            message: 'Authentication internal error',
            details: error.message
        }, { status: 500 });
    }
}
