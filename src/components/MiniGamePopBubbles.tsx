import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { playBubblePop, playGameComplete } from "../utils/sounds";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  popped: boolean;
}

interface MiniGameProps {
  onComplete: () => void;
}

export default function MiniGamePopBubbles({ onComplete }: MiniGameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const idRef = useRef(0);
  const completedRef = useRef(false);
  const goal = 7;
  const done = score >= goal;

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      const id = idRef.current++;
      setBubbles((prev) => [
        ...prev,
        {
          id,
          x: 8 + Math.random() * 84,
          y: 95 + Math.random() * 10,
          size: 28 + Math.random() * 16,
          popped: false,
        },
      ]);
    }, 700);
    return () => clearInterval(interval);
  }, [done]);

  useEffect(() => {
    const frame = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((b) => (b.popped ? b : { ...b, y: b.y - 0.6 - Math.random() * 0.4 }))
          .filter((b) => b.y > -10)
      );
    }, 50);
    return () => clearInterval(frame);
  }, []);

  const pop = (id: number) => {
    if (completedRef.current) return;
    playBubblePop();
    setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    setScore((prev) => {
      if (prev >= goal) return prev;
      const next = prev + 1;
      if (next >= goal && !completedRef.current) {
        completedRef.current = true;
        playGameComplete();
        setTimeout(onComplete, 700);
      }
      return next;
    });
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 px-4 text-center sm:max-w-md sm:gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="mb-1 text-2xl font-bold text-purple-100 sm:text-3xl">
          Pop the Bubbles
        </h3>
        <p className="text-xs text-purple-200/70 sm:text-sm">
          Tap the floating bubbles! ({score}/{goal})
        </p>
      </motion.div>

      <div className="relative h-48 w-full overflow-hidden rounded-xl border border-purple-300/15 bg-purple-900/20 sm:h-56 md:h-64">
        {bubbles.map((bubble) =>
          bubble.popped ? (
            <motion.span
              key={`p-${bubble.id}`}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.35 }}
              className="absolute flex items-center justify-center text-sm"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              💥
            </motion.span>
          ) : (
            <button
              key={bubble.id}
              onClick={() => pop(bubble.id)}
              className="absolute flex items-center justify-center"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: bubble.size,
                height: bubble.size,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span
                className="flex items-center justify-center rounded-full border-2 border-purple-300/40 bg-purple-400/20 transition-transform active:scale-0"
                style={{ width: bubble.size, height: bubble.size }}
              >
                <span className="text-[10px] sm:text-xs">✨</span>
              </span>
            </button>
          )
        )}
      </div>

      <div className="flex gap-1.5 sm:gap-2">
        {Array.from({ length: goal }).map((_, i) => (
          <span
            key={i}
            className={`text-base transition-all duration-300 sm:text-lg ${
              i < score ? "scale-110 opacity-100" : "scale-75 opacity-30"
            }`}
          >
            💜
          </span>
        ))}
      </div>

      {done && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-purple-200 sm:text-base"
        >
          All popped! 💥
        </motion.p>
      )}
    </div>
  );
}
