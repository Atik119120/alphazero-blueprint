import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, CheckCircle, Loader2
} from 'lucide-react';

interface SecureVideoPlayerProps {
  videoUrl: string;
  videoType: string;
  videoId: string;
  userId: string;
  onComplete: () => void;
  initialPosition?: number;
  maxWatchedSeconds?: number;
}

export default function SecureVideoPlayer({
  videoUrl,
  videoType,
  videoId,
  userId,
  onComplete,
  initialPosition = 0,
  maxWatchedSeconds = 0,
}: SecureVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [highestWatched, setHighestWatched] = useState(maxWatchedSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const hideControlsTimer = useRef<NodeJS.Timeout>();
  const progressSaveTimer = useRef<NodeJS.Timeout>();

  // Disable right-click
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  // Auto-hide intro after 4s
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Set initial position
  useEffect(() => {
    if (videoRef.current && initialPosition > 0 && !showIntro) {
      videoRef.current.currentTime = initialPosition;
    }
  }, [initialPosition, showIntro]);

  // Save progress periodically
  const saveProgress = useCallback(async (seconds: number, completed: boolean) => {
    const percent = duration > 0 ? Math.round((seconds / duration) * 100) : 0;
    await supabase.from('video_progress').upsert({
      user_id: userId,
      video_id: videoId,
      progress_percent: Math.min(percent, 100),
      is_completed: completed,
      last_watched_at: new Date().toISOString(),
      watched_seconds: Math.round(seconds),
      last_position: Math.round(seconds),
    }, { onConflict: 'user_id,video_id' });
  }, [userId, videoId, duration]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    
    setCurrentTime(video.currentTime);
    
    // Update highest watched
    if (video.currentTime > highestWatched) {
      setHighestWatched(video.currentTime);
    }

    // Periodic save (every 10s)
    if (progressSaveTimer.current) clearTimeout(progressSaveTimer.current);
    progressSaveTimer.current = setTimeout(() => {
      saveProgress(Math.max(video.currentTime, highestWatched), isCompleted);
    }, 10000);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const seekTo = value[0];
    
    // Anti-forward-seek: can't go beyond highest watched (unless completed)
    if (!isCompleted && seekTo > highestWatched + 2) {
      toast.error('আপনি এখনো এই অংশ পর্যন্ত দেখেননি');
      video.currentTime = highestWatched;
      return;
    }
    
    video.currentTime = seekTo;
    setCurrentTime(seekTo);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    saveProgress(duration, true);
    onComplete();
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const changeVolume = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value[0];
    setVolume(value[0]);
    if (value[0] === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const changePlaybackRate = () => {
    const video = videoRef.current;
    if (!video) return;
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const idx = rates.indexOf(playbackRate);
    const next = rates[(idx + 1) % rates.length];
    video.playbackRate = next;
    setPlaybackRate(next);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipBack = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // For YouTube/Vimeo, fallback to iframe
  if (videoType === 'youtube' || videoType === 'vimeo') {
    const getEmbedUrl = () => {
      if (videoType === 'youtube') {
        const id = videoUrl.includes('youtu.be')
          ? videoUrl.split('/').pop()?.split('?')[0]
          : videoUrl.includes('v=')
            ? videoUrl.split('v=')[1]?.split('&')[0]
            : videoUrl;
        return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&iv_load_policy=3&fs=1`;
      }
      const id = videoUrl.split('/').pop();
      return `https://player.vimeo.com/video/${id}`;
    };

    return (
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden" onContextMenu={e => e.preventDefault()}>
        <iframe
          src={getEmbedUrl()}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Cloudinary / direct video
  const streamUrl = videoUrl;

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black rounded-lg overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Logo Intro */}
      {showIntro && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center animate-fade-in">
          <div className="text-center animate-pulse">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-3 dark:invert" />
            <p className="text-white/80 text-sm font-medium">AlphaZero Academy</p>
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={streamUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setIsLoading(false);
          }
        }}
        onEnded={handleEnded}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onClick={togglePlay}
        controlsList="nodownload"
        disablePictureInPicture
        playsInline
      />

      {/* Loading Spinner */}
      {isLoading && !showIntro && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Progress Bar */}
        <div className="mb-3">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          {/* Watched indicator */}
          {!isCompleted && highestWatched > 0 && duration > 0 && (
            <div className="relative h-0.5 -mt-2 mb-2 pointer-events-none">
              <div
                className="absolute h-full bg-emerald-500/40 rounded"
                style={{ width: `${(highestWatched / duration) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-2 text-white">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={togglePlay}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={skipBack}>
            <SkipBack className="w-4 h-4" />
          </Button>

          <span className="text-xs tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>

          <div className="flex-1" />

          {/* Playback Speed */}
          <Button variant="ghost" size="sm" className="h-7 text-xs text-white hover:bg-white/20 px-2" onClick={changePlaybackRate}>
            {playbackRate}x
          </Button>

          {/* Volume */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <div className="w-16 hidden md:block">
              <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={changeVolume} />
            </div>
          </div>

          {/* Fullscreen */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Completed
        </div>
      )}
    </div>
  );
}
