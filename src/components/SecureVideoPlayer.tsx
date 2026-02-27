import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, CheckCircle, Loader2, Settings
} from 'lucide-react';

interface SecureVideoPlayerProps {
  videoUrl: string;
  videoType: string;
  videoId: string;
  userId: string;
  onComplete: () => void;
  initialPosition?: number;
  maxWatchedSeconds?: number;
  autoPlay?: boolean;
  onThresholdMet?: () => void;
}

const COMPLETION_THRESHOLD = 0.95; // 95%

export default function SecureVideoPlayer({
  videoUrl,
  videoType,
  videoId,
  userId,
  onComplete,
  initialPosition = 0,
  maxWatchedSeconds = 0,
  autoPlay = false,
  onThresholdMet,
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
  const [thresholdNotified, setThresholdNotified] = useState(false);
  const [showResMenu, setShowResMenu] = useState(false);
  const [selectedRes, setSelectedRes] = useState('auto');
  const hideControlsTimer = useRef<NodeJS.Timeout>();
  const progressSaveTimer = useRef<NodeJS.Timeout>();

  // Disable right-click
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  // Intro splash (3s) then auto-play
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      if (autoPlay && videoRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [autoPlay]);

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
    
    if (video.currentTime > highestWatched) {
      setHighestWatched(video.currentTime);
    }

    // Check 95% threshold
    if (duration > 0 && video.currentTime / duration >= COMPLETION_THRESHOLD && !thresholdNotified) {
      setThresholdNotified(true);
      onThresholdMet?.();
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
    // Anti-forward-seek
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
    setIsMuted(value[0] === 0);
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

  // Resolution options for Cloudinary
  const resolutions = [
    { label: 'Auto', value: 'auto' },
    { label: '1080p', value: '1080' },
    { label: '720p', value: '720' },
    { label: '480p', value: '480' },
    { label: '360p', value: '360' },
  ];

  const getVideoUrl = () => {
    if (selectedRes === 'auto' || !videoUrl.includes('cloudinary')) return videoUrl;
    // Cloudinary transformation for resolution
    return videoUrl.replace('/upload/', `/upload/q_auto,h_${selectedRes}/`);
  };

  const changeResolution = (res: string) => {
    const video = videoRef.current;
    const time = video?.currentTime || 0;
    const wasPlaying = !video?.paused;
    setSelectedRes(res);
    setShowResMenu(false);
    // After src changes, restore time
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        if (wasPlaying) videoRef.current.play();
      }
    }, 100);
  };

  // YouTube/Vimeo iframe fallback
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
        <iframe src={getEmbedUrl()} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black rounded-lg overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Logo Intro Splash */}
      {showIntro && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-center animate-pulse">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-3 dark:invert" />
            <p className="text-white/80 text-sm font-medium">AlphaZero Academy</p>
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={getVideoUrl()}
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

      {/* Center Play Button (when paused) */}
      {!isPlaying && !isLoading && !showIntro && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-10 group"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
          </div>
        </button>
      )}

      {/* Loading Spinner */}
      {isLoading && !showIntro && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Progress Bar */}
        <div className="mb-3">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          {!isCompleted && highestWatched > 0 && duration > 0 && (
            <div className="relative h-0.5 -mt-2 mb-2 pointer-events-none">
              <div className="absolute h-full bg-emerald-500/40 rounded" style={{ width: `${(highestWatched / duration) * 100}%` }} />
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

          {/* Resolution Selector */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="h-7 text-xs text-white hover:bg-white/20 px-2 gap-1" onClick={() => setShowResMenu(!showResMenu)}>
              <Settings className="w-3 h-3" />
              {selectedRes === 'auto' ? 'Auto' : `${selectedRes}p`}
            </Button>
            {showResMenu && (
              <div className="absolute bottom-full right-0 mb-1 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg py-1 min-w-[100px] z-50">
                {resolutions.map(res => (
                  <button
                    key={res.value}
                    onClick={() => changeResolution(res.value)}
                    className={`w-full px-3 py-1.5 text-xs text-left hover:bg-white/10 transition-colors ${selectedRes === res.value ? 'text-primary font-semibold' : 'text-white/80'}`}
                  >
                    {res.label}
                  </button>
                ))}
              </div>
            )}
          </div>

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

      {/* 95% Threshold Indicator */}
      {thresholdNotified && !isCompleted && (
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs flex items-center gap-1 animate-bounce z-30">
          <CheckCircle className="w-3 h-3" /> Ready to complete!
        </div>
      )}

      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 z-30">
          <CheckCircle className="w-3 h-3" /> Completed
        </div>
      )}
    </div>
  );
}
