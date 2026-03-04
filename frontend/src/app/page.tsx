'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';

interface Subject {
  id: number;
  title: string;
  description: string;
  slug: string;
  instructor_name: string;
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/subjects')
      .then(res => setSubjects(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Curated Courses</h1>
        <p className="text-secondary text-lg max-w-2xl">
          Master the most in-demand skills with our structured, video-based learning paths. From web development to machine learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject) => (
          <div key={subject.id} className="group relative bg-white border border-border rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent"></div>
              <BookOpen size={48} className="text-gray-300 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4">
                <span className="px-2 py-1 bg-white/90 glass text-[10px] font-bold uppercase tracking-widest rounded">Course</span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">
                  {subject.instructor_name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-secondary">{subject.instructor_name}</span>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{subject.title}</h3>
              <p className="text-secondary text-sm mb-6 line-clamp-2 h-10">{subject.description}</p>

              <div className="flex items-center gap-4 mb-6 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1 text-xs text-secondary font-medium">
                  <PlayCircle size={14} className="text-accent" /> 15 Lessons
                </div>
                <div className="flex items-center gap-1 text-xs text-secondary font-medium">
                  <Clock size={14} className="text-accent" /> 4.5 Hours
                </div>
              </div>

              <Link href={`/subjects/${subject.id}`} className="w-full btn-primary block text-center py-3 rounded-xl shadow-sm hover:shadow-lg transition-all active:scale-95">
                Enroll Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
