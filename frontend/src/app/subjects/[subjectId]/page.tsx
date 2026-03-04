'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { Play, CheckCircle, User, BookOpen, Clock } from 'lucide-react';

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

    if (loading) return <div className="p-24 animate-pulse">Loading course info...</div>;
    if (!subject) return <div className="p-24">Course not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 py-16">
            <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-accent font-bold text-sm mb-4 uppercase tracking-widest">
                        <BookOpen size={16} /> Course Overview
                    </div>
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-black">{subject.title}</h1>
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
                                <div className="text-sm font-bold">4.5 Hours</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-80 glass border border-border rounded-3xl p-8 shadow-2xl sticky top-24">
                    <h3 className="text-lg font-bold mb-4">Course Content</h3>
                    <ul className="space-y-3 mb-8">
                        {['Full curriculum access', 'Progress tracking', 'Completion certificate', 'Exercise files'].map(feature => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-secondary">
                                <CheckCircle size={16} className="text-green-500" /> {feature}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => router.push(`/subjects/${subjectId}/video/${subject.firstVideoId || ''}`)}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 rounded-2xl shadow-lg hover:shadow-black/20"
                    >
                        <Play size={18} fill="white" /> Start Watching
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-10">
                <h2 className="text-2xl font-bold mb-6">What you will learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(subject.learning_outcomes || "Fundamental concepts;Practical applications;Advanced techniques;Industry best practices").split(';').map((outcome: string) => (
                        <div key={outcome} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 italic text-secondary">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0"></div>
                            {outcome}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
