import pool from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';

export const register = async (email: string, password_raw: string, name: string) => {
    const hash = await hashPassword(password_raw);
    const [result]: any = await pool.query(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
        [email, hash, name]
    );

    const userId = result.insertId;
    const user = { id: userId, email, name, role: 'student' };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken({ id: userId });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await pool.query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
        [userId, refreshToken, expiresAt]
    );

    return { user, accessToken, refreshToken };
};

export const login = async (email: string, password_raw: string) => {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return null;

    const userRow = rows[0];
    const isValid = await comparePassword(password_raw, userRow.password_hash);
    if (!isValid) return null;

    const user = { id: userRow.id, email: userRow.email, name: userRow.name, role: userRow.role };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken({ id: userRow.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await pool.query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
        [userRow.id, refreshToken, expiresAt]
    );

    return { user, accessToken, refreshToken };
};

export const logout = async (userId: number, token: string) => {
    await pool.query(
        'UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND token_hash = ?',
        [userId, token]
    );
};
