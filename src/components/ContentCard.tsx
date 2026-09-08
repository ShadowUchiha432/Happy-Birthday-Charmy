import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ContentCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ContentCard({
  children,
  delay = 0.2,
  className = "",
}: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      className={`w-full rounded-xl border border-purple-300/15 bg-purple-900/35 p-3.5 shadow-lg shadow-purple-950/30 backdrop-blur-xl sm:rounded-2xl sm:p-5 md:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
