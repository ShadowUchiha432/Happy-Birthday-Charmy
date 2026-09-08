import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import ContentCard from "../components/ContentCard";

export default function Page2Lilac() {
  return (
    <PageShell>
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
        className="text-5xl sm:text-6xl md:text-7xl"
      >
        🌸
      </motion.div>

      <ContentCard delay={0.4}>
        <h2 className="mb-2 text-2xl font-bold text-purple-100 sm:mb-3 sm:text-3xl md:text-4xl">
          Soft &amp; Lovely
        </h2>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-purple-100/85 sm:text-base">
          You know how some flowers just make everything feel softer? That's
          kind of what you do too, Charmy. You walk in and everything just
          feels... calmer. Keep being that person.
        </p>
      </ContentCard>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-sm text-purple-200/70 sm:text-base"
      >
        🌸 Stay soft, stay you 🌸
      </motion.div>
    </PageShell>
  );
}
