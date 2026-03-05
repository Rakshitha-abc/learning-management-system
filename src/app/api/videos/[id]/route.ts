import { NextRequest, NextResponse } from 'next/server';
import * as videoService from '@/backend/modules/videos/video.service';
import { getAuthUser } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = getAuthUser(request);

        if (!user) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const video = await videoService.getVideoById(parseInt(id), user.id);

        if (!video) {
            return NextResponse.json({ message: 'Video not found' }, { status: 404 });
        }

        return NextResponse.json(video);
    } catch (error: any) {
        console.error('Video fetch error:', error);
        return NextResponse.json({ message: 'Error fetching video details' }, { status: 500 });
    }
}
