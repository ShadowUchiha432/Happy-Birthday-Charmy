import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { playStarLight, playGameComplete } from "../utils/sounds";

interface MiniGameProps {
  onComplete: () => void;
}

const starPositions = [
  { x: 20, y: 25 },
  { x: 75, y: 20 },
  { x: 50, y: 55 },
  { x: 15, y: 70 },
  { x: 80, y: 65 },
  { x: 45, y: 15 },
  { x: 65, y: 80 },
];

export default function MiniGameLightStars({ onComplete }: MiniGameProps) {
  const [lit, setLit] = useState<boolean[]>(new Array(starPositions.length).fill(false));
  const completedRef = useRef(false);

  const toggle = (index: number) => {
    if (completedRef.current) return;
    playStarLight();
    setLit((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      const count = next.filter(Boolean).length;
      if (count >= starPositions.length && !completedRef.current) {
        completedRef.current = true;
        playGameComplete();
        setTimeout(onComplete, 800);
      }
      return next;
    });
  };

  const count = lit.filter(Boolean).length;
  const done = count >= starPositions.length;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 px-4 text-center sm:max-w-md sm:gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="mb-1 text-2xl font-bold text-purple-100 sm:text-3xl">
          Light the Stars
        </h3>
        <p className="text-xs text-purple-200/70 sm:text-sm">
          Tap each star to light it up! ({count}/{starPositions.length})
        </p>
      </motion.div>

      <div className="relative h-48 w-full overflow-hidden rounded-xl border border-purple-300/15 bg-purple-900/20 sm:h-56 md:h-64">
        {starPositions.map((pos, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="absolute transition-transform active:scale-125"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.span
              animate={{
                scale: lit[i] ? [1, 1.4, 1] : 1,
                rotate: lit[i] ? [0, 180, 360] : 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`block text-2xl transition-all duration-300 sm:text-3xl ${
                lit[i] ? "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" : "opacity-40 grayscale"
              }`}
            >
              ⭐
            </motion.span>
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 sm:gap-2">
        {starPositions.map((_, i) => (
          <span
            key={i}
            className={`text-base transition-all duration-300 sm:text-lg ${
              lit[i] ? "scale-110 opacity-100" : "scale-75 opacity-30"
            }`}
          >
            ⭐
          </span>
        ))}
      </div>

      {done && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-purple-200 sm:text-base"
        >
          All stars shining! ✨
        </motion.p>
      )}
    </div>
  );
}
