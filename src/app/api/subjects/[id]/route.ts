import { NextRequest, NextResponse } from 'next/server';
import * as subjectService from '@/backend/modules/subjects/subject.service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const subject = await subjectService.getSubjectTree(parseInt(id));

        if (!subject) {
            return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
        }

        return NextResponse.json(subject);
    } catch (error: any) {
        console.error('Subject fetch error:', error);
        return NextResponse.json({ message: 'Error fetching subject details' }, { status: 500 });
    }
}
