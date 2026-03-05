import { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/backend/utils/jwt';

export function getAuthUser(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    try {
        return verifyAccessToken(token) as any;
    } catch (error) {
        return null;
    }
}
