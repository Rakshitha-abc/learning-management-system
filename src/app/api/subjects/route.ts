import { NextRequest, NextResponse } from 'next/server';
import * as subjectService from '@/backend/modules/subjects/subject.service';

export async function GET() {
    try {
        const subjects = await subjectService.getAllPublishedSubjects();
        return NextResponse.json(subjects);
    } catch (error: any) {
        console.error('Subjects fetch error:', error);
        return NextResponse.json({ message: 'Error fetching subjects' }, { status: 500 });
    }
}
