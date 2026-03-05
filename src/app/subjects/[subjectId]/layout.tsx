'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import SubjectSidebar from '@/components/Sidebar/SubjectSidebar';

export default function SubjectLayout({ children }: { children: React.ReactNode }) {
    const { subjectId } = useParams();
    const [tree, setTree] = useState<any>(null);
    const [progress, setProgress] = useState<any>({ percent: 0, completed: 0, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (subjectId) {
            const fetchData = async () => {
                try {
                    // Try fetching all data, but allow progress to fail for guests
                    const [treeRes, progressRes] = await Promise.allSettled([
                        apiClient.get(`/subjects/${subjectId}`),
                        apiClient.get(`/progress?subjectId=${subjectId}`)
                    ]);

                    if (treeRes.status === 'rejected') throw treeRes.reason;

                    const treeData = treeRes.value.data;
                    const progressData = progressRes.status === 'fulfilled' ? progressRes.value.data : { percent: 0, completed: 0, total: 0 };
                    const detailsData = progressData.details || []; // Extract details from combined progressData object

                    // Map progress details to tree structure
                    const progressMap = new Map(detailsData.map((d: any) => [d.id, d.is_completed]));

                    let lastCompleted = true; // First video is always unlocked
                    const enrichedTree = {
                        ...treeData,
                        sections: treeData.sections.map((section: any) => ({
                            ...section,
                            videos: section.videos.map((video: any) => {
                                const is_completed = !!progressMap.get(video.id);
                                const is_locked = !lastCompleted;
                                // If guest (progress failed), we don't lock everything, let them preview
                                const finalLocked = progressRes.status === 'fulfilled' ? is_locked : false;
                                lastCompleted = is_completed;
                                return { ...video, is_completed, is_locked: finalLocked };
                            })
                        }))
                    };

                    setTree(enrichedTree);
                    setProgress(progressData);
                } catch (err) {
                    console.error('Failed to load course:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [subjectId]);

    if (loading) return <div className="flex items-center justify-center p-24 animate-pulse">Loading course tools...</div>;
    if (!tree) return <div className="p-24">Course not found.</div>;

    return (
        <div className="flex min-h-[calc(100vh-64px)]">
            <SubjectSidebar tree={tree} progress={progress} />
            <div className="flex-1 bg-white">
                {children}
            </div>
        </div>
    );
}
