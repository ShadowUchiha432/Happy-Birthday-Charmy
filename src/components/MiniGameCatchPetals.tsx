import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { playCatchPetal, playGameComplete } from "../utils/sounds";

interface Petal {
  id: number;
  x: number;
  y: number;
  speed: number;
  caught: boolean;
}

interface MiniGameProps {
  onComplete: () => void;
}

export default function MiniGameCatchPetals({ onComplete }: MiniGameProps) {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [score, setScore] = useState(0);
  const idRef = useRef(0);
  const completedRef = useRef(false);
  const goal = 6;
  const done = score >= goal;

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      const id = idRef.current++;
      setPetals((p) => [
        ...p,
        {
          id,
          x: 10 + Math.random() * 80,
          y: -5,
          speed: 0.8 + Math.random() * 1.2,
          caught: false,
        },
      ]);
    }, 900);
    return () => clearInterval(interval);
  }, [done]);

  useEffect(() => {
    const frame = setInterval(() => {
      setPetals((prev) =>
        prev
          .map((p) => (p.caught ? p : { ...p, y: p.y + p.speed }))
          .filter((p) => p.y < 110)
      );
    }, 50);
    return () => clearInterval(frame);
  }, []);

  const catchPetal = (id: number) => {
    if (completedRef.current) return;
    playCatchPetal();
    setPetals((prev) => prev.map((p) => (p.id === id ? { ...p, caught: true } : p)));
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
          Catch the Petals
        </h3>
        <p className="text-xs text-purple-200/70 sm:text-sm">
          Tap the falling petals! ({score}/{goal})
        </p>
      </motion.div>

      <div className="relative h-48 w-full overflow-hidden rounded-xl border border-purple-300/15 bg-purple-900/20 sm:h-56 md:h-64">
        {petals.map((petal) =>
          petal.caught ? (
            <motion.span
              key={`c-${petal.id}`}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.4 }}
              className="absolute text-2xl sm:text-3xl"
              style={{
                left: `${petal.x}%`,
                top: `${petal.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              💜
            </motion.span>
          ) : (
            <button
              key={petal.id}
              onClick={() => catchPetal(petal.id)}
              className="absolute text-2xl transition-transform active:scale-150 sm:text-3xl"
              style={{
                left: `${petal.x}%`,
                top: `${petal.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              🌸
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
            🌸
          </span>
        ))}
      </div>

      {done && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-purple-200 sm:text-base"
        >
          Got them all! 🌸
        </motion.p>
      )}
    </div>
  );
}
