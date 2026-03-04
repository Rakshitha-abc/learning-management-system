import { Request, Response, NextFunction } from 'express';
import * as videoService from './video.service';

export const getVideoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const video = await videoService.getVideoById(parseInt(req.params.id), userId);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        res.json(video);
    } catch (error) {
        next(error);
    }
};
