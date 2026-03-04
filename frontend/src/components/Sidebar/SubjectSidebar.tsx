'use client';

import { ChevronDown, ChevronRight, PlayCircle, Lock, CheckCircle2, Trophy } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Video {
    id: number;
    title: string;
    order_index: number;
    is_completed?: boolean;
    is_locked?: boolean;
}

interface Section {
    id: number;
    title: string;
    order_index: number;
    videos: Video[];
}

interface Tree {
    id: number;
    title: string;
    sections: Section[];
}

interface Progress {
    percent: number;
    completed: number;
    total: number;
}

export default function SubjectSidebar({ tree, progress }: { tree: Tree, progress: Progress }) {
    const { videoId } = useParams();
    const currentVideoId = videoId ? parseInt(videoId as string) : null;

    return (
        <aside className="w-80 border-r border-border h-[calc(100vh-64px)] overflow-y-auto bg-gray-50/50 sticky top-16">
            <div className="p-6">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold truncate">{tree.title}</h2>
                        <span className="text-xs font-bold text-accent">{progress.percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent transition-all duration-1000"
                            style={{ width: `${progress.percent}%` }}
                        />
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[10px] uppercase font-bold text-secondary tracking-wider">
                        <Trophy size={10} /> {progress.completed} of {progress.total} Lessons
                    </div>
                </div>

                <div className="space-y-4">
                    {tree.sections.map((section) => (
                        <SectionItem
                            key={section.id}
                            section={section}
                            currentVideoId={currentVideoId}
                            subjectId={tree.id}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
}

function SectionItem({ section, currentVideoId, subjectId }: { section: Section, currentVideoId: number | null, subjectId: number }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left p-2 hover:bg-white rounded-lg transition-colors group"
            >
                <span className="text-sm font-bold truncate">{section.title}</span>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {isOpen && (
                <div className="mt-1 ml-2 space-y-1">
                    {section.videos.map((video) => (
                        <Link
                            key={video.id}
                            href={video.is_locked ? '#' : `/subjects/${subjectId}/video/${video.id}`}
                            className={`flex items-center gap-3 p-2 px-3 rounded-lg text-sm transition-all ${currentVideoId === video.id
                                ? 'bg-black text-white shadow-lg'
                                : video.is_locked
                                    ? 'opacity-50 cursor-not-allowed text-gray-400'
                                    : 'hover:bg-white text-secondary hover:text-black'
                                }`}
                        >
                            <div className="shrink-0">
                                {video.is_completed ? (
                                    <CheckCircle2 size={16} className="text-green-500" />
                                ) : video.is_locked ? (
                                    <Lock size={16} className="text-gray-400" />
                                ) : (
                                    <PlayCircle size={16} className={currentVideoId === video.id ? 'text-white' : 'text-gray-400'} />
                                )}
                            </div>
                            <span className="truncate">{video.title}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
