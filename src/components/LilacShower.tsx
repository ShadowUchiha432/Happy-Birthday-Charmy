import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function getCount() {
  if (typeof window === "undefined") return 20;
  return window.innerWidth < 640 ? 14 : 24;
}

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  emoji: string;
  sway: number;
  rotation: number;
}

export default function LilacShower({ active = true }: { active?: boolean }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const items: Petal[] = [];
    const count = getCount();
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        size: 14 + Math.random() * 18,
        emoji: Math.random() > 0.7 ? "🌸" : Math.random() > 0.4 ? "💜" : "✨",
        sway: 30 + Math.random() * 50,
        rotation: Math.random() * 360,
      });
    }
    setPetals(items);
  }, []);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{
            y: "-10vh",
            x: `${petal.x}vw`,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: "110vh",
            x: [
              `${petal.x}vw`,
              `${petal.x + petal.sway * 0.3}vw`,
              `${petal.x - petal.sway * 0.3}vw`,
              `${petal.x + petal.sway * 0.2}vw`,
              `${petal.x}vw`,
            ],
            opacity: [0, 0.85, 0.85, 0.6, 0],
            rotate: [0, petal.rotation, -petal.rotation, petal.rotation * 0.5],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute"
          style={{
            fontSize: petal.size,
            textShadow: "0 0 12px rgba(216,180,254,0.6)",
          }}
        >
          {petal.emoji}
        </motion.div>
      ))}
    </div>
  );
}
