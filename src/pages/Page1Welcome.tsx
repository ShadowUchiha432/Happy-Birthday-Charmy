import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import ContentCard from "../components/ContentCard";

export default function Page1Welcome() {
  return (
    <PageShell>
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
        className="text-5xl sm:text-6xl md:text-8xl"
      >
        💜
      </motion.div>

      <ContentCard delay={0.5}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mb-3 bg-gradient-to-r from-purple-200 via-fuchsia-200 to-violet-200 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl"
        >
          Hey, Charmy!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mx-auto max-w-xl text-sm leading-relaxed text-purple-100/85 sm:text-base"
        >
          Made something just for you — a little corner of the internet with
          your favorite things. Flowers, cats, and a whole lot of purple. Tap
          around, scroll through, and just enjoy.
        </motion.p>
      </ContentCard>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="rounded-2xl border border-purple-300/20 bg-purple-500/10 px-5 py-3 backdrop-blur-md sm:px-6 sm:py-4"
      >
        <p className="text-sm text-purple-200/80 sm:text-base">
          Tap anywhere for ripples, then hit the arrow to start 💫
        </p>
      </motion.div>
    </PageShell>
  );
}
