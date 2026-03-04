import { Request, Response, NextFunction } from 'express';
import * as subjectService from './subject.service';

export const getAllSubjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subjects = await subjectService.getAllPublishedSubjects();
        res.json(subjects);
    } catch (error) {
        next(error);
    }
};

export const getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subject = await subjectService.getSubjectById(parseInt(req.params.id as string));
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json(subject);
    } catch (error) {
        next(error);
    }
};

export const getSubjectTree = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tree = await subjectService.getSubjectTree(parseInt(req.params.id as string));
        if (!tree) return res.status(404).json({ message: 'Subject tree not found' });
        res.json(tree);
    } catch (error) {
        next(error);
    }
};
