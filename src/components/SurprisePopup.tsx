import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { playLetterOpen, playBouquet, playTap } from "../utils/sounds";

interface SurprisePopupProps {
  show: boolean;
}

const letterText = `Hey Charmy,

I just wanted to take a moment to tell you something — you're honestly one of the kindest, warmest people I know. You make the people around you feel seen and heard, and that's not something everyone can do.

I hope you never lose that spark you carry. The way you light up when you talk about things you love, the way you care so deeply about the people in your life — that's what makes you, you. And that's pretty amazing.

Happy birthday, Charmy. You deserve all the good things coming your way.

— Rex 💜`;

export default function SurprisePopup({ show }: SurprisePopupProps) {
  const [choice, setChoice] = useState<"none" | "letter" | "bouquet">("none");
  const [bouquetPage, setBouquetPage] = useState(0);

  const handleLetter = () => {
    playLetterOpen();

    setChoice("letter");

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#a855f7", "#d8b4fe", "#f0abfc"],
      disableForReducedMotion: true,
    });
  };

  const handleBouquet = () => {
    playBouquet();

    setChoice("bouquet");
    setBouquetPage(0);

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#a855f7", "#d8b4fe", "#c084fc"],
      disableForReducedMotion: true,
    });
  };

  const handleClose = () => {
    playTap();

    setChoice("none");
    setBouquetPage(0);
  };

  return (
    <AnimatePresence>
      {/* =========================================
          MAIN SURPRISE SELECTION POPUP
      ========================================== */}
      {show && choice === "none" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
            className="w-full max-w-sm rounded-2xl border border-purple-300/20 bg-purple-900/90 p-5 shadow-2xl shadow-purple-950/60 backdrop-blur-xl sm:p-7"
          >
            <h3 className="mb-2 text-center text-xl font-bold text-purple-100 sm:text-2xl">
              You did it! 🎉
            </h3>

            <p className="mb-5 text-center text-sm text-purple-200/80 sm:mb-6 sm:text-base">
              Someone left something for you. Choose one:
            </p>

            <div className="flex gap-3 sm:gap-4">
              {/* LETTER BUTTON */}
              <button
                onClick={handleLetter}
                className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-purple-300/20 bg-purple-800/40 p-4 transition hover:bg-purple-700/40 active:scale-95 sm:p-5"
              >
                <span className="text-3xl sm:text-4xl">💌</span>

                <span className="text-sm font-medium text-purple-100 sm:text-base">
                  A Letter
                </span>
              </button>

              {/* BOUQUET BUTTON */}
              <button
                onClick={handleBouquet}
                className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-purple-300/20 bg-purple-800/40 p-4 transition hover:bg-purple-700/40 active:scale-95 sm:p-5"
              >
                <span className="text-3xl sm:text-4xl">💐</span>

                <span className="text-sm font-medium text-purple-100 sm:text-base">
                  A Bouquet
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* =========================================
          LETTER POPUP
      ========================================== */}
      {show && choice === "letter" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{
              scale: 0.8,
              y: 40,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl border border-purple-300/20 bg-purple-900/90 p-5 shadow-2xl shadow-purple-950/60 backdrop-blur-xl sm:p-7"
          >
            {/* Letter icon */}
            <div className="mb-4 text-center text-3xl sm:text-4xl">
              💌
            </div>

            {/* Letter */}
            <div className="whitespace-pre-line text-xs leading-relaxed text-purple-100/90 sm:text-sm md:text-base">
              {letterText}
            </div>

            {/* Close button */}
            <div className="mt-5 flex justify-center sm:mt-6">
              <button
                onClick={handleClose}
                className="rounded-full border border-purple-300/20 bg-purple-700/40 px-5 py-2 text-sm text-purple-100 transition hover:bg-purple-600/40 active:scale-95 sm:text-base"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* =========================================
          BOUQUET POPUP
      ========================================== */}
      {show && choice === "bouquet" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{
              scale: 0.8,
              y: 40,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
            className="flex max-h-[80vh] w-full max-w-md flex-col items-center overflow-y-auto rounded-2xl border border-purple-300/20 bg-purple-900/90 p-5 shadow-2xl shadow-purple-950/60 backdrop-blur-xl sm:p-7"
          >
            {/* Bouquet icon */}
            <div className="mb-3 text-3xl sm:text-4xl">
              💐
            </div>

            <AnimatePresence mode="wait">
              {/* =========================================
                  BOUQUET PAGE 1
              ========================================== */}
              {bouquetPage === 0 ? (
                <motion.div
                  key="page1"
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 20,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="flex w-full flex-col items-center"
                >
                  {/* Bouquet image */}

                  <div className="mb-3 w-full overflow-hidden rounded-xl border border-purple-300/15 sm:mb-4">
                    <img
                      src={`${import.meta.env.BASE_URL}bouquet.png`}
                      alt="A boy holding a glass, offering a bouquet of lilac flowers"
                      className="h-auto w-full object-cover"
                    />
                  </div>

                  <p className="mb-4 text-center text-sm text-purple-200/80 sm:mb-5 sm:text-base">
                    For you, Charmy — from someone who cares 🌸
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        playTap();
                        setBouquetPage(1);
                      }}
                      className="rounded-full border border-purple-300/20 bg-purple-700/40 px-5 py-2 text-sm text-purple-100 transition hover:bg-purple-600/40 active:scale-95 sm:text-base"
                    >
                      Next ➜
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* =========================================
                   BOUQUET PAGE 2
                ========================================== */
                <motion.div
                  key="page2"
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="flex w-full flex-col items-center"
                >
                  {/* Group image */}

                  <div className="mb-3 w-full max-w-[280px] overflow-hidden rounded-xl border border-purple-300/15 sm:mb-4 sm:max-w-[340px]">
                    <img
                      src={`${import.meta.env.BASE_URL}we-all-here.png`}
                      alt="We are all here with you"
                      className="h-auto w-full object-cover"
                    />
                  </div>

                  <p className="mb-4 text-center text-sm text-purple-200/80 sm:mb-5 sm:text-base">
                    We are all here with you 💜
                  </p>

                  <div className="flex gap-3">
                    {/* Back */}
                    <button
                      onClick={() => {
                        playTap();
                        setBouquetPage(0);
                      }}
                      className="rounded-full border border-purple-300/20 bg-purple-700/40 px-5 py-2 text-sm text-purple-100 transition hover:bg-purple-600/40 active:scale-95 sm:text-base"
                    >
                      ⬅ Back
                    </button>

                    {/* Close */}
                    <button
                      onClick={handleClose}
                      className="rounded-full border border-purple-300/20 bg-purple-700/40 px-5 py-2 text-sm text-purple-100 transition hover:bg-purple-600/40 active:scale-95 sm:text-base"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}