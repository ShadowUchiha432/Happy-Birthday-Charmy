import { motion } from "framer-motion";

const floatingItems = [
  { type: "lilac", emoji: "🌸", x: "3%", y: "10%", delay: 0, scale: 0.7 },
  { type: "cat", emoji: "🐱", x: "91%", y: "12%", delay: 1.2, scale: 0.75 },
  { type: "lilac", emoji: "💜", x: "5%", y: "84%", delay: 0.6, scale: 0.65 },
  { type: "cat", emoji: "😺", x: "88%", y: "82%", delay: 2.1, scale: 0.8 },
  { type: "lilac", emoji: "🌺", x: "2%", y: "48%", delay: 1.5, scale: 0.6 },
  { type: "cat", emoji: "🐈", x: "93%", y: "48%", delay: 0.3, scale: 0.7 },
];

export default function FloatingElements({ show = true }: { show?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {show &&
        floatingItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.4, 0.85, 0.5, 0.8, 0.4],
              y: [0, -30, 15, -20, 0],
              x: [0, 12, -8, 10, 0],
              rotate: [0, 12, -8, 15, 0],
              scale: [item.scale, item.scale * 1.1, item.scale * 0.95, item.scale],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute text-lg opacity-40 sm:text-xl md:text-2xl"
            style={{ left: item.x, top: item.y }}
          >
            {item.emoji}
          </motion.div>
        ))}
    </div>
  );
}
