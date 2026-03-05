import { NextRequest, NextResponse } from 'next/server';
import * as progressService from '@/backend/modules/progress/progress.service';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = getAuthUser(request);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get('subjectId');
        const videoId = searchParams.get('videoId');

        if (subjectId) {
            const progress = await progressService.getSubjectProgress(user.id, parseInt(subjectId));
            const details = await progressService.getSubjectProgressDetails(user.id, parseInt(subjectId));
            return NextResponse.json({ ...progress, details });
        }

        if (videoId) {
            const progress = await progressService.getVideoProgress(user.id, parseInt(videoId));
            return NextResponse.json(progress);
        }

        return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = getAuthUser(request);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { video_id, last_position_seconds, is_completed } = await request.json();

        await progressService.updateVideoProgress(
            user.id,
            video_id,
            last_position_seconds,
            is_completed
        );

        return NextResponse.json({ message: 'Progress updated' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
