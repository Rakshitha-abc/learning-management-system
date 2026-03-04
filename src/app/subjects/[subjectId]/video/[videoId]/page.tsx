'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import VideoPlayer from '@/components/Video/VideoPlayer';
import { ChevronLeft, ChevronRight, CheckCircle, Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VideoViewPage() {
    const { subjectId, videoId } = useParams();
    const router = useRouter();
    const [video, setVideo] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (videoId) {
            setLoading(true);
            Promise.all([
                apiClient.get(`/videos/${videoId}`),
                apiClient.get(`/progress/videos/${videoId}`)
            ]).then(([videoRes, progressRes]) => {
                setVideo(videoRes.data);
                setProgress(progressRes.data);
            }).catch(err => {
                console.error(err);
                if (err.response?.status === 401) router.push('/auth/login');
            }).finally(() => setLoading(false));
        }
    }, [videoId, router]);

    const handleProgressUpdate = (time: number) => {
        apiClient.post(`/progress/videos/${videoId}`, {
            last_position_seconds: Math.floor(time),
            is_completed: false
        }).catch(e => console.error('Save progress failed', e));
    };

    const handleVideoCompleted = () => {
        apiClient.post(`/progress/videos/${videoId}`, {
            last_position_seconds: video.duration_seconds || 0,
            is_completed: true
        }).then(() => {
            // Auto-navigate to next video after short delay
            setTimeout(() => {
                if (video.next_video_id) {
                    router.push(`/subjects/${subjectId}/video/${video.next_video_id}`);
                }
            }, 1500);
        }).catch(e => console.error('Mark completed failed', e));
    };

    if (loading) return (
        <div className="p-12 space-y-8 animate-pulse">
            <div className="aspect-video bg-gray-100 rounded-3xl" />
            <div className="h-10 w-1/2 bg-gray-100 rounded-lg" />
            <div className="h-20 w-full bg-gray-100 rounded-lg" />
        </div>
    );

    if (!video) return <div className="p-12">Video not found.</div>;

    if (video.locked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center bg-gray-50/30 rounded-3xl m-8 border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mb-8">
                    <Lock className="text-gray-400" size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Access Locked</h2>
                <p className="text-secondary max-w-sm mb-10 leading-relaxed">
                    To maintain structured learning, you need to complete the previous lesson before accessing this content.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => router.back()} className="btn-secondary px-8 py-3 rounded-xl flex items-center gap-2">
                        <ArrowLeft size={18} /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 md:p-8 flex-1 max-w-6xl mx-auto w-full">
                <div className="mb-6 flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest">
                    <Link href={`/subjects/${subjectId}`} className="hover:underline flex items-center gap-1">
                        <ArrowLeft size={12} /> Course Details
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span>Lesson {video.order_index}</span>
                </div>

                <div className="bg-black rounded-[2rem] overflow-hidden shadow-2xl relative group">
                    <VideoPlayer
                        youtubeUrl={video.youtube_url}
                        onProgress={handleProgressUpdate}
                        onCompleted={handleVideoCompleted}
                        startAt={progress?.last_position_seconds || 0}
                    />
                </div>

                <div className="mt-10 mb-16">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-4xl font-extrabold tracking-tight text-black">{video.title}</h1>
                                {progress?.is_completed && (
                                    <div className="flex items-center gap-1.5 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border border-green-100">
                                        <CheckCircle size={12} /> Completed
                                    </div>
                                )}
                            </div>
                            <p className="text-lg text-secondary leading-relaxed max-w-3xl">
                                {video.description || "In this session, we will explore the practical implementation and theoretical foundations of our current topic."}
                            </p>
                        </div>

                        <div className="shrink-0 flex md:flex-col gap-3">
                            <button
                                disabled={!video.previous_video_id}
                                onClick={() => router.push(`/subjects/${subjectId}/video/${video.previous_video_id}`)}
                                className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-black py-3 px-6 rounded-2xl font-bold transition-all disabled:opacity-30 disabled:pointer-events-none"
                            >
                                <ChevronLeft size={20} /> <span className="hidden md:inline">Previous</span>
                            </button>
                            <button
                                disabled={!video.next_video_id}
                                onClick={() => router.push(`/subjects/${subjectId}/video/${video.next_video_id}`)}
                                className="flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white py-3 px-6 rounded-2xl font-bold transition-all disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-black/10"
                            >
                                <span className="hidden md:inline">Next Lesson</span> <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 p-8">
                <div className="max-w-6xl mx-auto flex items-start gap-4 text-sm text-secondary leading-relaxed">
                    <Info className="shrink-0 text-accent mt-1" size={18} />
                    <div>
                        <span className="font-bold text-black">Learning Tip:</span> Taking notes while watching increases retention by up to 50%. You can pause the video at any time to jot down key points. Your progress is saved automatically every 5 seconds.
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Lock } from 'lucide-react';
