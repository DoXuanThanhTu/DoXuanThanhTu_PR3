"use client";
import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import MenuController from "./MenuController";
// ✅ Hook lưu và khôi phục trạng thái phát
function usePlaybackMemory(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const wasPlayingRef = useRef(false);

  // Ghi nhớ trạng thái trước hành động (seek/change quality)
  const rememberPlaybackState = () => {
    const video = videoRef.current;
    wasPlayingRef.current = video ? !video.paused : false;
  };

  // Phục hồi trạng thái sau hành động
  const restorePlaybackState = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (wasPlayingRef.current) {
      try {
        const p = video.play();
        if (p && typeof (p as any).catch === "function") p.catch(() => {});
      } catch {}
    } else {
      video.pause();
    }
  };

  return { rememberPlaybackState, restorePlaybackState };
}

export default function ModernPlayer({ linkEmbed }: { linkEmbed: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const seekTokenRef = useRef(0);

  // new refs for drag-seek state
  const isSeekingRef = useRef(false);
  const pendingSeekValueRef = useRef<number | null>(null);
  const seekWasPlayingRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState<
    "main" | "speed" | "quality"
  >("main");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [qualities, setQualities] = useState<number[]>([]);
  const [currentQuality, setCurrentQuality] = useState("auto");

  const { rememberPlaybackState, restorePlaybackState } =
    usePlaybackMemory(videoRef);

  // ✅ Format time helper
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // ✅ Wait for event with timeout helper
  const waitForEvent = (
    el: EventTarget,
    eventName: string,
    timeout = 1500
  ): Promise<Event | null> =>
    new Promise((resolve) => {
      let done = false;
      const onEvent = (ev: Event) => {
        if (done) return;
        done = true;
        el.removeEventListener(eventName, onEvent as any);
        clearTimeout(timer);
        resolve(ev);
      };
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        el.removeEventListener(eventName, onEvent as any);
        resolve(null);
      }, timeout);
      el.addEventListener(eventName, onEvent as any);
    });

  // ✅ safeSeek — tối ưu, chia 2 đường: đang play / đang pause
  const safeSeek = async (time: number) => {
    const video = videoRef.current;
    const hls = hlsRef.current;
    if (!video) return;

    const token = ++seekTokenRef.current;
    const wasPlaying = !video.paused;
    setIsLoading(true);

    const tryFlush = () => {
      if (!hls) return;
      try {
        const bufferController = (hls as any).bufferController;
        const sourceBufferMap = bufferController?.sourceBuffer;
        if (sourceBufferMap) {
          Object.values(sourceBufferMap).forEach((sb: any) => {
            try {
              if (sb?.buffered?.length) {
                const end = sb.buffered.end(sb.buffered.length - 1);
                sb.remove(0, end);
              }
            } catch {}
          });
        }
      } catch {}
    };

    // check if target time already in buffer
    let inBuffer = false;
    try {
      const b = video.buffered;
      for (let i = 0; i < b.length; i++) {
        if (time >= b.start(i) && time <= b.end(i)) {
          inBuffer = true;
          break;
        }
      }
    } catch {}

    const seekOffset = inBuffer ? 0.08 : 0;
    const targetTime = Math.max(0, time + seekOffset);

    // ✅ OPTIMISTIC PATH — nếu đang play
    if (wasPlaying) {
      try {
        video.currentTime = targetTime;
      } catch {
        setTimeout(() => {
          try {
            video.currentTime = targetTime;
          } catch {}
        }, 20);
      }

      try {
        const p = video.play();
        if (p && typeof (p as any).catch === "function")
          (p as any).catch(() => {});
      } catch {}

      setIsPlaying(true);

      if (hls && !inBuffer) {
        tryFlush();
        try {
          if (typeof hls.startLoad === "function") hls.startLoad(time);
        } catch {}
      }

      await waitForEvent(video, "seeked", 1200);
      if (seekTokenRef.current !== token) return setIsLoading(false);

      await waitForEvent(video, "canplay", 1500);
      if (seekTokenRef.current !== token) return setIsLoading(false);

      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => setTimeout(r, 30));

      if (seekTokenRef.current !== token) return setIsLoading(false);
      setIsLoading(false);
      return;
    }

    // ✅ CONSERVATIVE PATH — nếu đang pause
    try {
      video.pause();
    } catch {}

    if (hls && !inBuffer) {
      tryFlush();
      try {
        if (typeof hls.startLoad === "function") hls.startLoad(time);
      } catch {}
    }

    try {
      video.currentTime = targetTime;
    } catch {
      await new Promise((r) => setTimeout(r, 20));
      video.currentTime = targetTime;
    }

    await waitForEvent(video, "seeked", 1200);
    if (seekTokenRef.current !== token) return setIsLoading(false);
    await waitForEvent(video, "canplay", 1500);
    if (seekTokenRef.current !== token) return setIsLoading(false);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await new Promise((r) => setTimeout(r, 30));

    if (seekTokenRef.current !== token) return setIsLoading(false);
    try {
      video.pause();
    } catch {}
    setIsPlaying(false);
    setIsLoading(false);
  };

  // ✅ setup HLS
  // ✅ setup HLS khi đổi link
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 🔹 Reset trạng thái mỗi khi đổi link
    setIsPlaying(false);
    setIsLoading(true);
    setProgress(0);
    setBuffered(0);
    setCurrentTime(0);
    setDuration(0);

    // Nếu Hls cũ còn, hủy trước khi tạo mới
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // ✅ Tạo HLS mới
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 5,
      maxBufferLength: 15,
      maxMaxBufferLength: 30,
      liveSyncDuration: 2,
      liveMaxLatencyDuration: 4,
      maxFragLookUpTolerance: 0.5,
    });
    hlsRef.current = hls;

    hls.attachMedia(video);
    hls.loadSource(linkEmbed);

    // Khi manifest tải xong
    hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
      const availableQualities = data.levels
        .map((l: any) => l.height)
        .filter(Boolean)
        .sort((a: number, b: number) => a - b);
      setQualities(availableQualities);
    });

    // Khi video sẵn sàng để play
    const onCanPlay = () => {
      setIsLoading(false);
      setIsPlaying(false); // ⛔ vẫn ở trạng thái dừng, chờ user bấm Play
    };

    video.addEventListener("canplay", onCanPlay);

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      hls.destroy();
    };
  }, [linkEmbed]);

  // ✅ Update progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
    };
    const updateBuffer = () => {
      if (video.buffered.length > 0 && video.duration) {
        const end = video.buffered.end(video.buffered.length - 1);
        setBuffered((end / video.duration) * 100);
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("progress", updateBuffer);
    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("progress", updateBuffer);
    };
  }, []);

  // ✅ Toggle play/pause
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

  // ✅ Seek handlers
  const handleSeekStart = (e: React.PointerEvent<HTMLInputElement>) => {
    isSeekingRef.current = true;
    seekWasPlayingRef.current = !videoRef.current?.paused;
    pendingSeekValueRef.current = Number((e.target as HTMLInputElement).value);
  };

  const handleSeekMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    pendingSeekValueRef.current = val;
    setProgress(val);
  };

  const handleSeekEnd = (e: React.PointerEvent<HTMLInputElement>) => {
    isSeekingRef.current = false;
    const val =
      pendingSeekValueRef.current ??
      Number((e.target as HTMLInputElement).value);
    pendingSeekValueRef.current = null;

    const video = videoRef.current;
    if (!video || !video.duration) return;
    const newTime = (val / 100) * video.duration;
    if (seekWasPlayingRef.current) {
      try {
        video.play().catch(() => {});
      } catch {}
    }
    safeSeek(newTime);
  };

  // ✅ Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // ✅ Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  // ✅ Fullscreen toggle
  const toggleFullScreen = () => {
    const player = videoRef.current?.parentElement;
    if (!player) return;
    if (!document.fullscreenElement) {
      player.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // ✅ Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowControls(false), 2500);
  };

  // ✅ Change speed
  const changeSpeed = (speed: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
      setPlaybackRate(speed);
    }
  };

  // ✅ Change quality
  const changeQuality = (quality: number | "auto") => {
    const hls = hlsRef.current;
    const video = videoRef.current;
    if (!hls || !video) return;

    rememberPlaybackState(); // 💾 lưu trạng thái phát

    const ct = video.currentTime;
    setProgress(0);
    setBuffered(0);
    setDuration(0);
    setIsLoading(true);

    const resumePlayback = async () => {
      await safeSeek(ct);
      await restorePlaybackState();
      const video = videoRef.current;
      if (video) setIsPlaying(!video.paused); // ✅ fix icon
    };

    video.pause();

    if (quality === "auto") {
      hls.currentLevel = -1;
      setCurrentQuality("auto");
      resumePlayback();
      return;
    }

    const levelIndex = hls.levels.findIndex((l) => l.height === quality);
    if (levelIndex === -1) {
      console.warn(`⚠️ Không tìm thấy chất lượng ${quality}px`);
      setIsLoading(false);
      return;
    }

    hls.loadLevel = levelIndex;
    hls.currentLevel = levelIndex;
    setCurrentQuality(String(quality));
    hls.startLoad();
    video.currentTime = ct;

    const onLevelLoaded = () => {
      hls.off(Hls.Events.LEVEL_LOADED, onLevelLoaded);
      setIsLoading(false);
      resumePlayback();
    };

    const onCanPlay = () => {
      video.removeEventListener("canplay", onCanPlay);
      setIsLoading(false);
      resumePlayback();
    };

    hls.on(Hls.Events.LEVEL_LOADED, onLevelLoaded);
    video.addEventListener("canplay", onCanPlay);
  };

  // ✅ Open settings
  const openSettings = () => {
    setSettingsView("main");
    setShowSettings(true);
  };

  // ✅ Close settings
  const onSettingsWrapperClick = () => {
    setShowSettings(false);
    setTimeout(() => setSettingsView("main"), 260);
  };

  return (
    <div
      className={`relative w-full aspect-video bg-black rounded-xl overflow-hidden ${
        showControls ? "cursor-auto" : "cursor-none"
      }`}
      onMouseMove={handleMouseMove}
    >
      <video ref={videoRef} className="w-full h-full" playsInline />

      {/* click area toggles playback */}
      <div className="absolute inset-0" onClick={togglePlay} />

      {/* center loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 pointer-events-none">
          <Loader2 className="animate-spin text-purple-400" size={42} />
        </div>
      )}

      {/* controls area */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white p-3 flex flex-col gap-2 transition-opacity duration-300 z-30 ${
          showControls ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* progress bar */}
        <div className="relative w-full h-1.5 bg-gray-700 rounded overflow-hidden mb-1">
          <div
            className="absolute top-0 left-0 h-full bg-gray-500/40"
            style={{ width: `${buffered}%` }}
          />
          <div
            className="absolute top-0 left-0 h-full bg-purple-500"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onPointerDown={handleSeekStart}
            onChange={handleSeekMove}
            onPointerUp={handleSeekEnd}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* controls */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="p-1">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button onClick={toggleMute} className="p-1">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-purple-400"
            />

            <div className="text-gray-300 text-xs select-none">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* settings & fullscreen */}
          <div className="flex items-center gap-3 relative">
            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                openSettings();
              }}
              className="p-1"
            >
              <Settings size={20} />
            </button> */}
            {/* Settings menu */}
            <MenuController
              isLoading={isLoading}
              showSettings={showSettings}
              settingsView={settingsView}
              currentQuality={currentQuality}
              playbackRate={playbackRate}
              qualities={qualities}
              onChangeView={(v) => setSettingsView(v)}
              onChangeSpeed={changeSpeed}
              onChangeQuality={changeQuality}
              onClose={() => {
                setShowSettings(false);
                setTimeout(() => setSettingsView("main"), 260);
              }}
              onOpen={(e) => {
                e.stopPropagation();
                setShowSettings(true);
                setSettingsView("main");
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullScreen();
              }}
              className="p-1"
            >
              {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
