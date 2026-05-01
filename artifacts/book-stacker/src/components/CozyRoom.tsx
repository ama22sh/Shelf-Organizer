/**
 * Cozy reading room background — uses real painted images.
 * Default: daytime. Clicking the window toggles day ↔ night
 * with a crossfade animation, a flash overlay, and a time-of-day
 * sound effect from the audio engine.
 *
 * The TimeContext at app level owns the isNight flag so every page
 * shares the same state.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTime } from "@/lib/TimeContext";

export function CozyRoom() {
  const { isNight, transitioning } = useTime();
  const [flashVisible, setFlashVisible] = useState(false);

  // Trigger flash when transitioning starts
  useEffect(() => {
    if (!transitioning) return;
    setFlashVisible(true);
    const t = setTimeout(() => setFlashVisible(false), 800);
    return () => clearTimeout(t);
  }, [transitioning]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 overflow-hidden"
    >
      {/* ── Background images (crossfade) ─────────────────────── */}
      <img
        src="/day_time.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] pointer-events-none select-none"
        style={{ opacity: isNight ? 0 : 1 }}
        aria-hidden
        draggable={false}
      />
      <img
        src="/night_time.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] pointer-events-none select-none"
        style={{ opacity: isNight ? 1 : 0 }}
        aria-hidden
        draggable={false}
      />

      {/* ── Overall tint overlay — slightly dims the scene ──────── */}
      <div
        className="absolute inset-0 transition-all duration-[1200ms]"
        style={{
          background: isNight
            ? "linear-gradient(180deg, rgba(10,5,30,0.45) 0%, rgba(10,5,30,0.25) 100%)"
            : "linear-gradient(180deg, rgba(255,245,220,0.08) 0%, rgba(200,160,80,0.06) 100%)",
        }}
      />

      {/* ── Night: twinkling stars layer ────────────────────────── */}
      <AnimatePresence>
        {isNight && (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
            style={{ pointerEvents: "none" }}
          >
            {STARS.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: s.x + "%",
                  top: s.y + "%",
                  width: s.r + "px",
                  height: s.r + "px",
                  opacity: 0,
                  animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Transition flash overlay ─────────────────────────────── */}
      <AnimatePresence>
        {flashVisible && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: isNight ? 0.55 : 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
            style={{
              background: isNight
                ? "radial-gradient(ellipse at 22% 35%, rgba(180,200,255,0.7), rgba(10,10,60,0.6) 70%)"
                : "radial-gradient(ellipse at 22% 35%, rgba(255,240,180,0.9), rgba(255,200,60,0.3) 70%)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// ── Pre-generated star positions ─────────────────────────────────────────────
// Stars are positioned within the arched window area (top-left of the scene).
const STARS = Array.from({ length: 22 }, (_, i) => ({
  x: 5 + Math.abs(Math.sin(i * 2.37) * 29),
  y: 4 + Math.abs(Math.cos(i * 1.77) * 46),
  r: 0.8 + Math.abs(Math.sin(i * 0.93)) * 1.4,
  dur: 1.6 + (i % 4) * 0.5,
  delay: (i * 0.31) % 2.5,
}));
