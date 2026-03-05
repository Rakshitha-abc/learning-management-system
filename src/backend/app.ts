import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import videoRoutes from './modules/videos/video.routes';
import progressRoutes from './modules/progress/progress.routes';
import healthRoutes from './modules/health/health.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || true, // true allows the request's origin
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/subjects', '/subjects'], subjectRoutes);
app.use(['/api/videos', '/videos'], videoRoutes);
app.use(['/api/progress', '/progress'], progressRoutes);
app.use(['/api/health', '/health'], healthRoutes);

// Error Handling
app.use(errorHandler);

export default app;
