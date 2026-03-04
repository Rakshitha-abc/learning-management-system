import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    domain: process.env.COOKIE_DOMAIN,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        const result = await authService.register(email, password, name);

        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
        res.status(201).json({
            user: result.user,
            accessToken: result.accessToken
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        if (!result) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
        res.json({
            user: result.user,
            accessToken: result.accessToken
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const user = (req as any).user;

        if (refreshToken && user) {
            await authService.logout(user.id, refreshToken);
        }

        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        res.json({ message: 'Logged out' });
    } catch (error) {
        next(error);
    }
};
