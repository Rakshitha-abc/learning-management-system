import { NextRequest, NextResponse } from 'next/server';
import * as authService from '@/backend/modules/auth/auth.service';
import { getAuthUser } from '@/lib/auth';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ action: string }> }
) {
    const { action } = await params;

    try {
        const body = await request.json().catch(() => ({}));

        if (action === 'register') {
            const { email, password, name } = body;
            if (!email || !password || !name) {
                return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
            }
            const result = await authService.register(email, password, name);

            const response = NextResponse.json({
                user: result.user,
                accessToken: result.accessToken
            }, { status: 201 });

            response.cookies.set('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 24 * 60 * 60
            });

            return response;
        }

        if (action === 'login') {
            const { email, password } = body;
            if (!email || !password) {
                return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
            }
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
                path: '/',
                maxAge: 30 * 24 * 60 * 60
            });

            return response;
        }

        if (action === 'logout') {
            const user = getAuthUser(request);
            const refreshToken = request.cookies.get('refreshToken')?.value;

            if (user && refreshToken) {
                await authService.logout(user.id, refreshToken);
            }

            const response = NextResponse.json({ message: 'Logged out' });
            response.cookies.delete('refreshToken');
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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ action: string }> }
) {
    const { action } = await params;

    if (action === 'me') {
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }
        return NextResponse.json({ user });
    }

    return NextResponse.json({ message: 'Not Found' }, { status: 404 });
}
