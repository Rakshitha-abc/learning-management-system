'use client';

import YouTube, { YouTubeProps } from 'react-youtube';
import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
    youtubeUrl: string;
    onProgress: (time: number) => void;
    onCompleted: () => void;
    startAt?: number;
}

export default function VideoPlayer({ youtubeUrl, onProgress, onCompleted, startAt = 0 }: VideoPlayerProps) {
    const playerRef = useRef<any>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Extract ID and start time from URL
    const videoId = youtubeUrl.includes('v=')
        ? youtubeUrl.split('v=')[1].split('&')[0]
        : youtubeUrl.split('/').pop()?.split('?')[0];

    // Extract start time from t= parameter
    const tMatch = youtubeUrl.match(/[?&]t=(\d+)/);
    const urlStartTime = tMatch ? parseInt(tMatch[1]) : 0;

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target;
        const initialSeek = startAt > 0 ? startAt : urlStartTime;
        if (initialSeek > 0) {
            event.target.seekTo(initialSeek);
        }
    };

    const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
        // 1 is playing
        if (event.data === 1) {
            intervalRef.current = setInterval(() => {
                if (playerRef.current) {
                    const currentTime = playerRef.current.getCurrentTime();
                    onProgress(currentTime);
                }
            }, 5000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        // 0 is ended
        if (event.data === 0) {
            onCompleted();
        }
    };

    const opts: YouTubeProps['opts'] = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
        },
    };

    return (
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl">
            <YouTube
                videoId={videoId}
                opts={opts}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}
