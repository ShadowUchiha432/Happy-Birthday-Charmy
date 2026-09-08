import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import PageShell from "../components/PageShell";
import ContentCard from "../components/ContentCard";
import SurprisePopup from "../components/SurprisePopup";
import { playBlow, playFanfare } from "../utils/sounds";

export default function Page5Surprise() {
  const [candlesLit, setCandlesLit] = useState([true, true, true]);
  const [smokePuffs, setSmokePuffs] = useState<
    { id: number; x: number; candle: number }[]
  >([]);
  const [showPopup, setShowPopup] = useState(false);
  const [blowMode, setBlowMode] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [cursorActive, setCursorActive] = useState(false);
  const firedRef = useRef(false);
  const candleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zoneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#a855f7", "#d8b4fe", "#f0abfc", "#e879f9", "#c084fc"];

    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors, disableForReducedMotion: true });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors, disableForReducedMotion: true });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const allBlown = candlesLit.every((c) => !c);

  useEffect(() => {
    if (allBlown) {
      playFanfare();
      const timer = setTimeout(() => setShowPopup(true), 1800);
      return () => clearTimeout(timer);
    }
  }, [allBlown]);

  // Disable text selection globally when blow mode is on
  useEffect(() => {
    if (blowMode) {
      document.body.classList.add("select-none");
    } else {
      document.body.classList.remove("select-none");
    }
    return () => document.body.classList.remove("select-none");
  }, [blowMode]);

  const blowCandle = (index: number) => {
    if (!candlesLit[index]) return;
    playBlow();
    setCandlesLit((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
    setSmokePuffs((prev) => [
      ...prev,
      { id: Date.now() + index, x: Math.random() * 10 - 5, candle: index },
    ]);
    setTimeout(() => {
      setSmokePuffs((prev) => prev.slice(1));
    }, 1200);
    confetti({
      particleCount: 24,
      spread: 50,
      origin: { y: 0.55 },
      colors: ["#a855f7", "#d8b4fe", "#f0abfc"],
      disableForReducedMotion: true,
    });
  };

  const checkProximity = (clientX: number, clientY: number) => {
    const threshold = 40; // px distance from flame center
    candleRefs.current.forEach((el, i) => {
      if (!el || !candlesLit[i]) return;
      const rect = el.getBoundingClientRect();
      const flameX = rect.left + rect.width / 2;
      const flameY = rect.top + rect.height * 0.2;
      const dist = Math.hypot(clientX - flameX, clientY - flameY);
      if (dist < threshold) {
        blowCandle(i);
      }
    });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!blowMode || allBlown) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setCursorPos({ x: clientX, y: clientY });
    setCursorActive(true);
    checkProximity(clientX, clientY);
  };

  const handleEnd = () => {
    setCursorActive(false);
    setCursorPos(null);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!blowMode || allBlown) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setCursorPos({ x: clientX, y: clientY });
    setCursorActive(true);
    checkProximity(clientX, clientY);
  };

  const toggleBlowMode = () => {
    setBlowMode((prev) => !prev);
    setCursorActive(false);
    setCursorPos(null);
  };

  return (
    <PageShell>
      <ContentCard delay={0.2}>
        <h2 className="mb-1 text-xl font-bold text-purple-100 sm:mb-2 sm:text-2xl md:text-3xl">
          Happy Birthday!
        </h2>
        <p className="mx-auto mb-3 max-w-xl text-xs leading-relaxed text-purple-100/85 sm:mb-4 sm:text-sm">
          Okay so here's the deal — you're one of those people who just makes
          everything better by being there. No big speech, just... thank you
          for being you. Now blow out those candles! 🎂
        </p>

        {/* Blow mode toggle */}
        <div className="mb-3 flex justify-center sm:mb-4">
          <button
            onClick={toggleBlowMode}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm ${
              blowMode
                ? "border-fuchsia-400/40 bg-fuchsia-600/30 text-fuchsia-100 shadow-lg shadow-fuchsia-500/20"
                : "border-purple-300/20 bg-purple-800/30 text-purple-200/80 hover:bg-purple-700/30"
            }`}
          >
            <span>{blowMode ? "💨" : "🌬️"}</span>
            <span>{blowMode ? "Blow Mode ON" : "Turn on Blow Mode"}</span>
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full transition-colors sm:h-3 sm:w-3 ${
                blowMode ? "bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.6)]" : "bg-purple-500/50"
              }`}
            />
          </button>
        </div>

        <div className="mb-3 flex justify-center sm:mb-4">
          <div
            ref={zoneRef}
            className={`relative flex flex-col items-center rounded-2xl ${
              blowMode ? "select-none" : ""
            }`}
            style={blowMode ? { touchAction: "none" } : undefined}
            onMouseMove={handleMove}
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
          >
            {/* Candles */}
            <div className="mb-1 flex items-end gap-2 sm:gap-4">
              {candlesLit.map((lit, i) => (
                <div
                  key={i}
                  ref={(el) => { candleRefs.current[i] = el; }}
                  className="relative flex flex-col items-center"
                >
                  {lit && (
                    <motion.div
                      animate={{
                        scale: cursorActive && blowMode
                          ? [1, 1.3, 0.85, 1.2, 0.95, 1]
                          : [1, 1.15, 0.95, 1.1, 1],
                        opacity: cursorActive && blowMode
                          ? [0.9, 0.5, 1, 0.6, 0.85, 0.9]
                          : [0.9, 1, 0.85, 1, 0.95],
                        y: cursorActive && blowMode
                          ? [0, -4, 2, -3, 1, 0]
                          : [0, -2, 1, -1, 0],
                      }}
                      transition={{ duration: cursorActive && blowMode ? 0.25 : 0.9, repeat: Infinity }}
                      className="absolute -top-6 left-1/2 z-10 -translate-x-1/2 sm:-top-8"
                    >
                      <span className="relative block text-base sm:text-lg">
                        🔥
                        <span className="absolute inset-0 -z-10 rounded-full bg-yellow-300/30 blur-md" />
                      </span>
                    </motion.div>
                  )}
                  {smokePuffs
                    .filter((p) => p.candle === i)
                    .map((puff) => (
                      <motion.span
                        key={puff.id}
                        initial={{ opacity: 0.7, y: 0, scale: 0.5 }}
                        animate={{ opacity: 0, y: -20, scale: 1.4, x: puff.x }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute -top-6 left-1/2 text-xs text-purple-200/60 sm:-top-8"
                      >
                        💨
                      </motion.span>
                    ))}
                  {/* Candle with stripe detail */}
                  <div className="relative h-6 w-1.5 overflow-hidden rounded bg-gradient-to-b from-purple-200 via-purple-400 to-purple-700 sm:h-8 sm:w-2">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(88,28,135,0.25)_2px,rgba(88,28,135,0.25)_3px)]" />
                  </div>
                  <div className="mt-0.5 h-0.5 w-2 rounded-full bg-purple-300/40 sm:w-2.5" />
                </div>
              ))}
            </div>

            {/* Beautiful layered cake */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.98, 1.01, 0.98] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative w-28 sm:w-40"
            >
              {/* Decorative base plate */}
              <div className="absolute -bottom-2 left-1/2 h-2.5 w-36 -translate-x-1/2 rounded-[100%] bg-purple-300/20 sm:w-48" />
              <div className="absolute -bottom-1 left-1/2 h-1 w-32 -translate-x-1/2 rounded-[100%] bg-gradient-to-r from-purple-300/40 via-fuchsia-300/40 to-purple-300/40 sm:w-44" />

              {/* Top tier */}
              <div className="relative mx-auto w-20 rounded-t-xl border-b-2 border-purple-400/30 bg-gradient-to-b from-purple-100 to-purple-300 px-2 pb-1.5 pt-4 shadow-md sm:w-28 sm:border-b-4 sm:pb-2 sm:pt-5">
                <div className="absolute inset-x-0 top-1.5 flex justify-around">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx} className="text-[8px] text-purple-500/50 sm:text-[10px]">✦</span>
                  ))}
                </div>
                <div className="absolute -bottom-1.5 inset-x-0 flex justify-around">
                  {[...Array(4)].map((_, idx) => (
                    <span
                      key={idx}
                      className="block h-2 w-1 rounded-full bg-purple-200/80 sm:h-3 sm:w-1.5"
                      style={{ marginTop: idx % 2 === 0 ? "0px" : "4px" }}
                    />
                  ))}
                </div>
              </div>

              {/* Middle tier */}
              <div className="relative mx-auto w-24 rounded-t-lg border-b-2 border-purple-400/30 bg-gradient-to-b from-purple-300 to-purple-400 px-1.5 pb-2 pt-4 shadow-md sm:w-32 sm:border-b-4 sm:pb-3 sm:pt-5">
                <div className="absolute inset-x-0 top-1.5 flex justify-around">
                  {[...Array(7)].map((_, idx) => (
                    <span key={idx} className="text-[8px] text-purple-600/40 sm:text-[10px]">✦</span>
                  ))}
                </div>
                <div className="absolute -bottom-0.5 inset-x-0 h-2 bg-gradient-to-r from-purple-200 via-fuchsia-200 to-purple-200 sm:h-2.5" />
                <div className="absolute -bottom-2.5 inset-x-0 flex justify-around px-1">
                  {[...Array(7)].map((_, idx) => (
                    <span key={idx} className="block h-1 w-1 rounded-full bg-purple-100/80 shadow-sm sm:h-1.5 sm:w-1.5" />
                  ))}
                </div>
              </div>

              {/* Bottom tier */}
              <div className="relative mx-auto w-28 rounded-t-lg rounded-b-xl border-b-2 border-purple-500/30 bg-gradient-to-b from-purple-400 to-purple-500 px-2 pb-3 pt-5 shadow-lg sm:w-40 sm:border-b-4 sm:pb-4 sm:pt-6">
                <div className="absolute inset-x-0 top-1.5 flex justify-around">
                  {[...Array(9)].map((_, idx) => (
                    <span key={idx} className="text-[8px] text-purple-700/30 sm:text-[10px]">✦</span>
                  ))}
                </div>
                <div className="absolute -bottom-0.5 inset-x-0 h-2.5 rounded-b-xl bg-gradient-to-r from-purple-200 via-fuchsia-200 to-purple-200 sm:h-3" />
                <div className="absolute -bottom-2.5 inset-x-0 flex justify-around px-2">
                  {[...Array(9)].map((_, idx) => (
                    <span key={idx} className="block h-1 w-1 rounded-full bg-purple-100/80 shadow-sm sm:h-1.5 sm:w-1.5" />
                  ))}
                </div>
                <p className="mt-2 text-center text-[7px] font-bold tracking-widest text-purple-900/60 sm:mt-3 sm:text-[9px]">
                  HAPPY BIRTHDAY
                </p>
                <p className="text-center text-[6px] font-semibold tracking-widest text-purple-900/40 sm:text-[8px]">
                  CHARMY
                </p>
              </div>

              <motion.div
                animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-2 top-3 text-sm text-purple-200/60 sm:text-base"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ y: [0, -4, 0], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-2 top-10 text-xs text-purple-200/50 sm:text-sm"
              >
                💫
              </motion.div>
            </motion.div>

            {/* Portal blow cursor — rendered at body level so it's not clipped by transforms */}
          </div>
        </div>

        <motion.p
          key={allBlown ? "blown" : "lit"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-purple-200 sm:text-xs"
        >
          {allBlown
            ? "All out! Something's waiting for you... ✨"
            : blowMode
              ? "Move the wind emoji near a flame to blow it out! 💨"
              : "Tap the button above to activate blow mode 💨"}
        </motion.p>
      </ContentCard>

      <SurprisePopup show={showPopup} />

      {/* Portal blow cursor at body level */}
      {blowMode && !showPopup && cursorPos && createPortal(
        <div
          className="pointer-events-none fixed z-[999] text-3xl sm:text-4xl"
          style={{
            left: cursorPos.x - 18,
            top: cursorPos.y - 18,
            opacity: cursorActive ? 1 : 0.6,
          }}
        >
          💨
        </div>,
        document.body
      )}
    </PageShell>
  );
}
