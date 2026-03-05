'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { Play, CheckCircle, User, BookOpen, Clock, FileText, ChevronDown } from 'lucide-react';

export default function SubjectPage() {
    const { subjectId } = useParams();
    const router = useRouter();
    const [subject, setSubject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (subjectId) {
            apiClient.get(`/subjects/${subjectId}`)
                .then(res => setSubject(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [subjectId]);

    if (loading) return <div className="p-24 flex justify-center items-center"><div className="animate-pulse flex items-center gap-2"><div className="w-4 h-4 bg-accent rounded-full animate-bounce"></div> Loading course info...</div></div>;
    if (!subject) return <div className="p-24 text-center text-red-500">Course not found.</div>;

    const firstVideoId = subject.sections?.[0]?.videos?.[0]?.id || '';

    // Calculate total videos count
    const totalVideos = subject.sections?.reduce((acc: number, section: any) => acc + (section.videos?.length || 0), 0) || 0;

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-8 py-12 md:py-16">
            <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-accent font-bold text-sm mb-4 uppercase tracking-widest">
                        <BookOpen size={16} /> Course Overview
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-black">{subject.title}</h1>
                    <p className="text-lg text-secondary leading-relaxed mb-8">
                        {subject.description || "Master this subject with our step-by-step curriculum designed for both beginners and professionals."}
                    </p>

                    <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                                <User size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] text-secondary uppercase font-bold tracking-tighter">Instructor</div>
                                <div className="text-sm font-bold">{subject.instructor_name}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="text-secondary" size={20} />
                            <div>
                                <div className="text-[10px] text-secondary uppercase font-bold tracking-tighter">Duration</div>
                                <div className="text-sm font-bold">Self-paced</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FileText className="text-secondary" size={20} />
                            <div>
                                <div className="text-[10px] text-secondary uppercase font-bold tracking-tighter">Content</div>
                                <div className="text-sm font-bold">{subject.sections?.length || 0} Sections • {totalVideos} Videos</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-80 glass border border-border rounded-3xl p-8 shadow-2xl sticky top-24 bg-white/50 backdrop-blur-xl">
                    <h3 className="text-lg font-bold mb-4">Course Included</h3>
                    <ul className="space-y-3 mb-8">
                        {['Full curriculum access', 'Progress tracking', 'Completion certificate', 'Exercise files'].map(feature => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-secondary">
                                <CheckCircle size={16} className="text-green-500" /> {feature}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => router.push(`/subjects/${subjectId}/video/${firstVideoId}`)}
                        disabled={!firstVideoId}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 rounded-2xl shadow-lg hover:shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                        <Play size={18} fill="white" /> {firstVideoId ? 'Start Learning' : 'No Videos Available'}
                    </button>
                </div>
            </div>

            <div className="space-y-12">
                <div className="bg-gray-50/50 rounded-3xl p-8 md:p-10 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6">What you will learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {(subject.learning_outcomes || "Fundamental concepts;Practical applications;Advanced techniques;Industry best practices").split(';').map((outcome: string, idx: number) => (
                            <div key={idx} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-secondary transition-all hover:border-gray-200">
                                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0"></div>
                                {outcome}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-bold mb-8">Course Curriculum</h2>
                    <div className="space-y-4">
                        {subject.sections && subject.sections.length > 0 ? (
                            subject.sections.map((section: any, sIdx: number) => (
                                <div key={section.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-gray-200 transition-all">
                                    <div className="bg-gray-50/50 px-6 py-4 flex justify-between items-center cursor-pointer border-b border-gray-100">
                                        <div>
                                            <h3 className="font-bold text-lg text-black">Section {sIdx + 1}: {section.title}</h3>
                                            <p className="text-xs text-secondary mt-1">{section.videos?.length || 0} Lessons</p>
                                        </div>
                                        <ChevronDown className="text-secondary" size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        {section.videos && section.videos.length > 0 ? (
                                            section.videos.map((video: any, vIdx: number) => (
                                                <div
                                                    key={video.id}
                                                    className="px-6 py-4 hover:bg-gray-50 flex items-center gap-4 border-b border-gray-50 last:border-b-0 cursor-pointer transition-colors"
                                                    onClick={() => router.push(`/subjects/${subjectId}/video/${video.id}`)}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                                        <Play size={14} className="text-accent" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-black">{video.title}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-6 py-4 text-sm text-secondary italic">No videos in this section yet.</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-secondary">Curriculum not available yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
