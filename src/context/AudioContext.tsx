import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import music from "~/configs/music";

/* ------------------------------------------------------------------
   Shared now-playing player. One <audio> element for the whole OS:
   Spotify, Music, Siri, TopBar and the Dynamic Island all read the
   same audioState, so the playbar and the island always agree.
------------------------------------------------------------------- */

export interface PlayerTrack {
  title: string;
  artist: string;
  cover: string;
  src: string;
}

interface AudioState {
  playing: boolean;
  track: PlayerTrack;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
}

interface AudioContextType {
  audio: HTMLAudioElement;
  audioState: AudioState;
  controls: {
    play: () => Promise<void> | void;
    pause: () => void;
    toggle: (play?: boolean) => Promise<void> | void;
    volume: (value: number) => void;
    seek: (ratio: number) => void;
    playTrack: (track: PlayerTrack, queue?: PlayerTrack[]) => Promise<void> | void;
    next: () => void;
    prev: () => void;
  };
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const DEFAULT_TRACK: PlayerTrack = {
  title: music.title,
  artist: music.artist,
  cover: music.cover,
  src: music.audio,
};

function notifyIsland(t: PlayerTrack) {
  window.dispatchEvent(
    new CustomEvent("island:notify", {
      detail: { type: "music", message: `${t.title} — ${t.artist}` },
    })
  );
}

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const queueRef = useRef<{ list: PlayerTrack[]; index: number }>({ list: [], index: -1 });
  const errCount = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<PlayerTrack>(DEFAULT_TRACK);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const advance = () => {
      const q = queueRef.current;
      if (q.index >= 0 && q.index + 1 < q.list.length) {
        const nt = q.list[q.index + 1];
        queueRef.current = { list: q.list, index: q.index + 1 };
        el.src = nt.src;
        setTrack(nt);
        setProgress(0);
        setCurrentTime(0);
        el.play().catch(() => {});
        notifyIsland(nt);
        return true;
      }
      return false;
    };
    const onPlay = () => {
      errCount.current = 0;
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    const onTime = () => {
      const d = el.duration || 0;
      setCurrentTime(el.currentTime);
      setDuration(d);
      setProgress(d > 0 ? el.currentTime / d : 0);
    };
    const onEnded = () => {
      if (!advance()) {
        el.currentTime = 0;
        el.play().catch(() => {});
      }
    };
    const onError = () => {
      // Dead preview? Skip forward instead of going silent (with a loop guard).
      errCount.current += 1;
      if (errCount.current > 8) {
        errCount.current = 0;
        el.pause();
        return;
      }
      advance();
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
  }, []);

  const play = () => audioRef.current?.play().catch(() => {});

  const pause = () => audioRef.current?.pause();

  const toggle = (want?: boolean) => {
    const el = audioRef.current;
    if (!el) return;
    if (want ?? el.paused) return el.play().catch(() => {});
    el.pause();
  };

  const setVol = (value: number) => {
    const v = Math.min(1, Math.max(0, value));
    if (audioRef.current) audioRef.current.volume = v;
    setVolume(v);
  };

  const seek = (ratio: number) => {
    const el = audioRef.current;
    if (el && el.duration) el.currentTime = Math.min(1, Math.max(0, ratio)) * el.duration;
  };

  const playTrack = (t: PlayerTrack, queue?: PlayerTrack[]) => {
    if (queue && queue.length) {
      const i = queue.findIndex((x) => x.src === t.src);
      queueRef.current = { list: queue, index: i >= 0 ? i : 0 };
    }
    const el = audioRef.current;
    if (!el) return;
    el.src = t.src;
    el.currentTime = 0;
    setTrack(t);
    setProgress(0);
    setCurrentTime(0);
    notifyIsland(t);
    return el.play().catch(() => {});
  };

  const step = (dir: 1 | -1) => {
    const el = audioRef.current;
    const q = queueRef.current;
    if (!el || q.index < 0) return;
    if (dir === -1 && el.currentTime > 3) {
      el.currentTime = 0;
      return;
    }
    const ni = q.index + dir;
    if (ni < 0 || ni >= q.list.length) return;
    const nt = q.list[ni];
    queueRef.current = { list: q.list, index: ni };
    el.src = nt.src;
    el.currentTime = 0;
    setTrack(nt);
    setProgress(0);
    setCurrentTime(0);
    notifyIsland(nt);
    el.play().catch(() => {});
  };

  const audioState: AudioState = { playing, track, progress, currentTime, duration, volume };

  return (
    <AudioContext.Provider
      value={{
        audio: audioRef.current as HTMLAudioElement,
        audioState,
        controls: {
          play,
          pause,
          toggle,
          volume: setVol,
          seek,
          playTrack,
          next: () => step(1),
          prev: () => step(-1),
        },
        audioRef,
      }}
    >
      <audio ref={audioRef} src={music.audio} preload="metadata" style={{ display: "none" }} />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
