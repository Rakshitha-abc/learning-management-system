import { Request, Response, NextFunction } from 'express';
import * as progressService from './progress.service';

export const getSubjectProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const progress = await progressService.getSubjectProgress(userId, parseInt(req.params.subjectId as string));
        res.json(progress);
    } catch (error) {
        next(error);
    }
};

export const getVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const progress = await progressService.getVideoProgress(userId, parseInt(req.params.videoId as string));
        res.json(progress);
    } catch (error) {
        next(error);
    }
};

export const updateVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { last_position_seconds, is_completed } = req.body;
        await progressService.updateVideoProgress(userId, parseInt(req.params.videoId as string), last_position_seconds, is_completed);
        res.json({ message: 'Progress updated' });
    } catch (error) {
        next(error);
    }
};
export const getSubjectProgressDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const progress = await progressService.getSubjectProgressDetails(userId, parseInt(req.params.subjectId as string));
        res.json(progress);
    } catch (error) {
        next(error);
    }
};
