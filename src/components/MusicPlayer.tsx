import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ===== MUSIC SETUP =====
// Place your MP3 file at:
//
// public/song.mp3
//
// The BASE_URL makes this work correctly on both:
// - localhost
// - GitHub Pages
// ========================

const SONG_PATH = `${import.meta.env.BASE_URL}song.mp3`;

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const labelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTemporaryLabel = (duration: number) => {
    setShowLabel(true);

    if (labelTimerRef.current) {
      clearTimeout(labelTimerRef.current);
    }

    labelTimerRef.current = setTimeout(() => {
      setShowLabel(false);
    }, duration);
  };

  const toggle = async () => {
    // =========================================
    // PLAY MUSIC
    // =========================================

    if (!playing) {
      if (!audioRef.current) {
        const audio = new Audio(SONG_PATH);

        audio.loop = true;
        audio.volume = 0.6;
        audio.preload = "auto";

        audioRef.current = audio;
      }

      try {
        await audioRef.current.play();

        setPlaying(true);
        showTemporaryLabel(3000);
      } catch (error) {
        console.error("Unable to play music:", error);

        setPlaying(false);
        showTemporaryLabel(3000);
      }

      return;
    }

    // =========================================
    // PAUSE MUSIC
    // =========================================

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setPlaying(false);
    showTemporaryLabel(2000);
  };

  // =========================================
  // CLEANUP
  // =========================================

  useEffect(() => {
    return () => {
      if (labelTimerRef.current) {
        clearTimeout(labelTimerRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed left-3 top-3 z-40 sm:left-4 sm:top-4">
      <button
        onClick={toggle}
        className="group relative flex items-center gap-2"
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {/* =====================================
            MUSIC BUTTON
        ====================================== */}

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 sm:h-10 sm:w-10 ${
            playing
              ? "border-purple-300/30 bg-purple-600/40 shadow-lg shadow-purple-500/30"
              : "border-purple-300/20 bg-purple-900/50"
          }`}
        >
          {playing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <span className="text-base sm:text-lg">🎵</span>
            </motion.div>
          ) : (
            <span className="text-base opacity-70 sm:text-lg">
              🎵
            </span>
          )}
        </motion.div>

        {/* =====================================
            MUSIC LABEL
        ====================================== */}

        <AnimatePresence>
          {showLabel && (
            <motion.span
              initial={{
                opacity: 0,
                x: -8,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: -8,
                scale: 0.8,
              }}
              transition={{
                duration: 0.3,
              }}
              className="whitespace-nowrap rounded-full border border-purple-300/20 bg-purple-900/70 px-2.5 py-1 text-[10px] text-purple-200/80 backdrop-blur-md sm:text-xs"
            >
              {playing ? "Clover — THE BOYZ" : "Play music"}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}