import { Router } from 'express';
import * as videoController from './video.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.get('/:id', authMiddleware, videoController.getVideoById);

export default router;
