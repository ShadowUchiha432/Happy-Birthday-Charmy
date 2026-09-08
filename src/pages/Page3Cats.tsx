import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import ContentCard from "../components/ContentCard";

const cats = [
  { emoji: "🐱", delay: 0, orbit: 1 },
  { emoji: "🐈", delay: 0.4, orbit: 1.15 },
  { emoji: "😺", delay: 0.8, orbit: 1.3 },
  { emoji: "🐾", delay: 1.2, orbit: 1.45 },
];

export default function Page3Cats() {
  return (
    <PageShell>
      <div className="relative mx-auto flex aspect-square h-28 w-28 items-center justify-center sm:h-36 sm:w-36 md:h-48 md:w-48">
        {cats.map((cat, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ rotate: i * 90 }}
            animate={{ rotate: i * 90 + 360 }}
            transition={{
              duration: 12,
              delay: cat.delay * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span
              className="absolute text-xl sm:text-2xl md:text-3xl"
              style={{
                left: `${50 + 28 * cat.orbit}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {cat.emoji}
            </span>
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="text-4xl sm:text-5xl md:text-6xl"
        >
          💜
        </motion.div>
      </div>

      <ContentCard delay={0.5}>
        <h2 className="mb-2 text-2xl font-bold text-purple-100 sm:mb-3 sm:text-3xl md:text-4xl">
          Same Energy
        </h2>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-purple-100/85 sm:text-base">
          You and cats have the exact same vibe — cozy, a little curious, and
          honestly impossible not to love. Here's to lazy afternoons, random
          adventures, and always having someone to cuddle with.
        </p>
      </ContentCard>
    </PageShell>
  );
}
