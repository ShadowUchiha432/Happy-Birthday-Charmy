import { motion } from "framer-motion";
import { useState } from "react";
import PageShell from "../components/PageShell";
import ContentCard from "../components/ContentCard";
import { playSparkle, playTap } from "../utils/sounds";

const wishes = [
  "I hope you always find reasons to laugh, even on the boring days.",
  "I hope life keeps surprising you in the best ways.",
  "I hope you know how much you matter to the people around you.",
  "I hope this year brings you something you didn't even know you needed.",
];

export default function Page4Heart() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleOpen = (i: number) => {
    if (openIndex === i) {
      playTap();
      setOpenIndex(null);
    } else {
      playSparkle();
      setOpenIndex(i);
    }
  };

  return (
    <PageShell>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
        className="text-4xl sm:text-5xl md:text-6xl"
      >
        💜
      </motion.div>

      <ContentCard delay={0.4}>
        <h2 className="mb-2 text-2xl font-bold text-purple-100 sm:text-3xl md:text-4xl">
          Some Things I Hope For You
        </h2>
        <p className="mb-4 text-xs text-purple-200/70 sm:mb-5 sm:text-sm">
          Tap each heart — there's something inside ✨
        </p>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {wishes.map((wish, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.button
                key={i}
                onClick={() => handleOpen(i)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex min-h-[72px] flex-col items-start justify-center overflow-hidden rounded-lg border border-purple-300/20 p-3 text-left transition-colors duration-500 sm:min-h-[88px] sm:p-4 ${
                  isOpen
                    ? "bg-purple-500/30 shadow-md shadow-purple-500/20"
                    : "bg-purple-800/30 backdrop-blur-md"
                }`}
              >
                <motion.div
                  animate={{
                    scale: isOpen ? [1, 1.25, 1] : 1,
                    rotate: isOpen ? [0, -8, 8, 0] : 0,
                  }}
                  transition={{ duration: 0.45 }}
                  className="mb-1 text-xl sm:text-2xl"
                >
                  {isOpen ? "💖" : "💜"}
                </motion.div>
                <p
                  className={`text-xs font-medium transition-all duration-500 sm:text-sm ${
                    isOpen
                      ? "translate-y-0 text-purple-50"
                      : "translate-y-1 text-purple-200/60"
                  }`}
                >
                  {isOpen ? wish : "Tap to open"}
                </p>
              </motion.button>
            );
          })}
        </div>
      </ContentCard>
    </PageShell>
  );
}
