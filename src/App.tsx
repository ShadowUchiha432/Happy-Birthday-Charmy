import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaterRipple from "./components/WaterRipple";
import FloatingElements from "./components/FloatingElements";
import LilacShower from "./components/LilacShower";
import PageTransition from "./components/PageTransition";
import MiniGamePetCat from "./components/MiniGamePetCat";
import MiniGameCatchPetals from "./components/MiniGameCatchPetals";
import MiniGamePopBubbles from "./components/MiniGamePopBubbles";
import MiniGameLightStars from "./components/MiniGameLightStars";
import Page1Welcome from "./pages/Page1Welcome";
import Page2Lilac from "./pages/Page2Lilac";
import Page3Cats from "./pages/Page3Cats";
import Page4Heart from "./pages/Page4Heart";
import Page5Surprise from "./pages/Page5Surprise";
import { playPageTransition, playTap } from "./utils/sounds";
import MusicPlayer from "./components/MusicPlayer";

// Step definitions: 5 pages + 4 mini-games interleaved
type StepType = "page" | "game";

interface Step {
  type: StepType;
  index: number; // index within its own type array
  label: string; // short label for nav dot
}

const steps: Step[] = [
  { type: "page", index: 0, label: "💜" },
  { type: "game", index: 0, label: "🐱" },
  { type: "page", index: 1, label: "🌸" },
  { type: "game", index: 1, label: "🌿" },
  { type: "page", index: 2, label: "😺" },
  { type: "game", index: 2, label: "🫧" },
  { type: "page", index: 3, label: "💖" },
  { type: "game", index: 3, label: "⭐" },
  { type: "page", index: 4, label: "🎂" },
];

const pageComponents = [
  Page1Welcome,
  Page2Lilac,
  Page3Cats,
  Page4Heart,
  Page5Surprise,
];

const gameComponents = [
  MiniGamePetCat,
  MiniGameCatchPetals,
  MiniGamePopBubbles,
  MiniGameLightStars,
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedGames, setCompletedGames] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // A step is accessible if all games before it are completed
  const isStepAccessible = useCallback(
    (stepIdx: number): boolean => {
      for (let i = 0; i < stepIdx; i++) {
        if (steps[i].type === "game" && !completedGames.has(steps[i].index)) {
          return false;
        }
      }
      return true;
    },
    [completedGames]
  );

  const goNext = useCallback(() => {
    let next = currentStep + 1;
    while (next < steps.length) {
      if (!isStepAccessible(next)) break;
      const s = steps[next];
      // Skip completed games
      if (s.type === "game" && completedGames.has(s.index)) {
        next++;
        continue;
      }
      playPageTransition();
      setCurrentStep(next);
      return;
    }
    // If all remaining are completed games, go to last step
    if (next <= steps.length - 1 && isStepAccessible(next)) {
      playPageTransition();
      setCurrentStep(next);
    }
  }, [currentStep, isStepAccessible, completedGames]);

  const goPrev = useCallback(() => {
    let prev = currentStep - 1;
    while (prev >= 0) {
      const s = steps[prev];
      // Skip completed games
      if (s.type === "game" && completedGames.has(s.index)) {
        prev--;
        continue;
      }
      playPageTransition();
      setCurrentStep(prev);
      return;
    }
    if (prev >= 0) {
      playPageTransition();
      setCurrentStep(prev);
    }
  }, [currentStep, completedGames]);

  const goToStep = useCallback(
    (stepIdx: number) => {
      if (!isStepAccessible(stepIdx)) return;
      playTap();
      // If navigating to a completed game, skip to the next page instead
      const s = steps[stepIdx];
      if (s.type === "game" && completedGames.has(s.index) && stepIdx + 1 < steps.length) {
        setCurrentStep(stepIdx + 1);
      } else {
        setCurrentStep(stepIdx);
      }
    },
    [isStepAccessible, completedGames]
  );

  const onGameComplete = useCallback(
    (gameIndex: number) => {
      setCompletedGames((prev) => {
        const next = new Set(prev);
        next.add(gameIndex);
        return next;
      });
      // Auto-advance to the next step (the page after this game)
      setTimeout(() => {
        playPageTransition();
        setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
      }, 800);
    },
    []
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const step = steps[currentStep];
  const isGameStep = step.type === "game";
  const isPageStep = step.type === "page";

  // Determine which page index for lilac shower / floating elements
  const activePageIndex = isPageStep
    ? step.index
    : steps[currentStep - 1]?.type === "page"
      ? steps[currentStep - 1].index
      : -1;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-violet-950 text-white selection:bg-purple-400/40">
      <WaterRipple />
      <FloatingElements show={!isGameStep && activePageIndex !== 1 && activePageIndex !== 4} />
      <LilacShower active={!isGameStep && activePageIndex === 1} />
      <MusicPlayer />

      <main className="relative z-20 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 pb-24 pt-12 sm:pb-28 sm:pt-14">
        <AnimatePresence mode="wait">
          {isGameStep ? (
            <motion.div
              key={`game-${step.index}`}
              initial={{ opacity: 0, scale: 0.92, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.92, y: -30, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex w-full flex-col items-center justify-center px-4 py-2"
            >
              {(() => {
                const GameComp = gameComponents[step.index];
                return (
                  <GameComp onComplete={() => onGameComplete(step.index)} />
                );
              })()}
            </motion.div>
          ) : (
            <PageTransition key={`page-${step.index}`} pageKey={currentStep}>
              {(() => {
                const PageComp = pageComponents[step.index];
                return <PageComp />;
              })()}
            </PageTransition>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-purple-300/20 bg-purple-900/60 px-2.5 py-2 shadow-2xl shadow-purple-950/50 backdrop-blur-xl sm:bottom-5 sm:gap-2 sm:px-4 sm:py-2.5">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="rounded-full p-1.5 text-purple-200 transition hover:bg-purple-500/30 disabled:cursor-not-allowed disabled:opacity-30 sm:p-2"
          aria-label="Previous"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {steps.map((s, i) => {
            const isActive = i === currentStep;
            const accessible = isStepAccessible(i);
            const isGame = s.type === "game";
            const isCompleted = isGame && completedGames.has(s.index);

            return (
              <button
                key={i}
                onClick={() => goToStep(i)}
                disabled={!accessible}
                className={`relative p-0.5 transition-all sm:p-1 ${
                  !accessible ? "cursor-not-allowed opacity-30" : ""
                }`}
                aria-label={
                  isGame
                    ? `Game ${s.index + 1}: ${s.label}`
                    : `Page ${s.index + 1}`
                }
              >
                {isGame ? (
                  // Game dot: small emoji-based
                  <span
                    className={`flex items-center justify-center text-[10px] transition-all duration-300 sm:text-xs ${
                      isActive
                        ? "scale-125 drop-shadow-[0_0_6px_rgba(217,70,239,0.8)]"
                        : isCompleted
                          ? "opacity-90"
                          : "opacity-50"
                    }`}
                  >
                    {isCompleted ? "✅" : s.label}
                  </span>
                ) : (
                  // Page dot: circle
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isGame ? "h-1.5 w-1.5 sm:h-2 sm:w-2" : "h-2 w-2 sm:h-2.5 sm:w-2.5"
                    } ${
                      isActive
                        ? "scale-125 bg-purple-300 shadow-[0_0_10px_rgba(216,180,254,0.8)]"
                        : accessible
                          ? "bg-purple-500/50 group-hover:bg-purple-400/70"
                          : "bg-purple-800/30"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={goNext}
          disabled={currentStep === steps.length - 1 || !isStepAccessible(currentStep + 1)}
          className="rounded-full p-1.5 text-purple-200 transition hover:bg-purple-500/30 disabled:cursor-not-allowed disabled:opacity-30 sm:p-2"
          aria-label="Next"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      {/* Game instruction hint */}
      <AnimatePresence>
        {isGameStep && !completedGames.has(step.index) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-16 left-1/2 z-40 max-w-[90vw] -translate-x-1/2 rounded-full border border-fuchsia-300/20 bg-fuchsia-900/50 px-3 py-1.5 text-xs text-fuchsia-200/80 backdrop-blur-md sm:bottom-20 sm:px-4 sm:py-2 sm:text-sm"
          >
            Complete the mini-game to unlock the next page! 🎮
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      <AnimatePresence>
        {showHint && !isGameStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-16 left-1/2 z-40 max-w-[90vw] -translate-x-1/2 rounded-full border border-purple-300/20 bg-purple-900/60 px-3 py-1.5 text-xs text-purple-200/80 backdrop-blur-md sm:bottom-24 sm:px-4 sm:py-2 sm:text-sm"
          >
            Use arrow keys or tap arrows to navigate
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step counter */}
      <div className="fixed right-3 top-3 z-40 rounded-full border border-purple-300/20 bg-purple-900/40 px-2.5 py-1 text-[10px] text-purple-200/80 backdrop-blur-md sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
        {isGameStep ? (
          <>🎮 Game {step.index + 1}</>
        ) : (
          <>
            {step.index + 1} / {pageComponents.length}
          </>
        )}
      </div>
    </div>
  );
}
