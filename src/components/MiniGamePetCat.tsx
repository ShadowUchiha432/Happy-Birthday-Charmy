import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { playCatReaction, playHeartFill, playGameComplete, playMeow } from "../utils/sounds";

interface MiniGameProps {
  onComplete: () => void;
}

const catFaces = ["😺", "😸", "🐱", "😻", "😽"];
const reactionEmojis = ["💜", "💖", "✨", "💕", "🩷", "🌟", "🫶", "💝"];

export default function MiniGamePetCat({ onComplete }: MiniGameProps) {
  const [love, setLove] = useState(0);
  const [bouncing, setBouncing] = useState(false);
  const [catFace, setCatFace] = useState(0);
  const [reactions, setReactions] = useState<
    { id: number; emoji: string; x: number; y: number }[]
  >([]);
  const completedRef = useRef(false);
  const reactIdRef = useRef(0);
  const maxLove = 8;

  const pet = () => {
    if (completedRef.current) return;

    // Play cat reaction sound
    playCatReaction();
    playHeartFill();

    // Bounce the cat
    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);

    // Cycle cat face
    setCatFace((prev) => (prev + 1) % catFaces.length);

    // Spawn floating reaction emojis around the cat
    const newReactions: { id: number; emoji: string; x: number; y: number }[] = [];
    for (let i = 0; i < 3; i++) {
      newReactions.push({
        id: reactIdRef.current++,
        emoji: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
        x: (Math.random() - 0.5) * 120,
        y: -40 - Math.random() * 40,
      });
    }
    setReactions((prev) => [...prev, ...newReactions]);
    setTimeout(() => {
      setReactions((prev) => prev.slice(newReactions.length));
    }, 800);

    // Increment love
    setLove((prev) => {
      if (prev >= maxLove) return prev;
      const next = prev + 1;
      if (next >= maxLove && !completedRef.current) {
        completedRef.current = true;
        playMeow();
        setTimeout(() => {
          playGameComplete();
        }, 300);
        setTimeout(onComplete, 900);
      }
      return next;
    });
  };

  const done = love >= maxLove;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 px-4 text-center sm:max-w-md sm:gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="mb-1 text-2xl font-bold text-purple-100 sm:text-3xl">
          Pet the Cat
        </h3>
        <p className="text-xs text-purple-200/70 sm:text-sm">
          Tap the kitty to fill its heart!
        </p>
      </motion.div>

      <button
        onClick={pet}
        disabled={done}
        className="relative select-none transition-transform active:scale-90 sm:active:scale-95"
      >
        <motion.div
          animate={{
            scale: bouncing ? 1.3 : 1,
            rotate: bouncing ? [-12, 12, -6, 0] : 0,
            y: bouncing ? [-8, -16, -4, 0] : 0,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 12 }}
          className="text-7xl sm:text-8xl md:text-9xl"
        >
          {done ? "😻" : catFaces[catFace]}
        </motion.div>

        {/* Floating reactions */}
        {reactions.map((r) => (
          <motion.span
            key={r.id}
            initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
            animate={{
              opacity: 0,
              y: r.y - 50,
              x: r.x,
              scale: 1.4,
              rotate: (Math.random() - 0.5) * 30,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
          >
            {r.emoji}
          </motion.span>
        ))}
      </button>

      {/* Heart bar */}
      <div className="w-full max-w-[200px] sm:max-w-[240px]">
        <div className="flex justify-between gap-1">
          {Array.from({ length: maxLove }).map((_, i) => (
            <motion.span
              key={i}
              animate={{
                scale: i < love ? 1 : 0.7,
                opacity: i < love ? 1 : 0.25,
              }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-base sm:text-lg"
            >
              💜
            </motion.span>
          ))}
        </div>
      </div>

      {done && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-purple-200 sm:text-base"
        >
          Purr-fect! 🐾
        </motion.p>
      )}
    </div>
  );
}
