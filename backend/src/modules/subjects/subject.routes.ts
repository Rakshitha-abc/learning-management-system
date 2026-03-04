import { Router } from 'express';
import * as subjectController from './subject.controller';

const router = Router();

router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.get('/:id/tree', subjectController.getSubjectTree);

export default router;
