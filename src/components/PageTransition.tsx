import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

const variants = {
  initial: {
    opacity: 0,
    scale: 0.92,
    y: 80,
    filter: "blur(12px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.08,
    y: -60,
    filter: "blur(16px)",
    transition: {
      duration: 0.6,
      ease: "easeInOut" as const,
    },
  },
};

export default function PageTransition({
  children,
  pageKey,
}: {
  children: ReactNode;
  pageKey: number;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-20 flex w-full flex-col items-center justify-center px-4 py-3 sm:px-6 sm:py-6 md:px-8"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
