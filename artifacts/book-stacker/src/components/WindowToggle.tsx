/**
 * Transparent fixed-position button overlaid on the painted window.
 * Rendered at the App level (z-40) so it sits above all page content.
 * Hidden on Kids routes which have their own opaque background.
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useTime } from "@/lib/TimeContext";
import { audio } from "@/lib/audio";
import { Sun, Moon } from "lucide-react";

export function WindowToggle() {
  const { isNight, toggle } = useTime();
  const [location] = useLocation();
  const cooldown = useRef(false);
  const [tooltip, setTooltip] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Show tooltip hint briefly on mount
  useEffect(() => {
    const t = setTimeout(() => setTooltip(true), 800);
    const t2 = setTimeout(() => setTooltip(false), 4800);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  // All hooks called — now safe to conditionally return
  if (location.startsWith("/kids")) return null;

  const handleClick = () => {
    if (cooldown.current) return;
    cooldown.current = true;
    const toNight = !isNight;
    audio.timeToggle(toNight);
    toggle();
    setTimeout(() => {
      cooldown.current = false;
    }, 1800);
  };

  return (
    <>
      {/* ── The clickable window zone ───────────────────────────── */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={isNight ? "Switch to daytime" : "Switch to nighttime"}
        data-testid="window-toggle"
        data-no-click-sound="1"
        style={{
          position: "fixed",
          /* Window occupies roughly the left 4.5–36% wide, top 3–58% tall. */
          left: "4.5%",
          top: "3%",
          width: "31%",
          height: "56%",
          zIndex: 40,
          cursor: "pointer",
          background: "transparent",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {/* Pulsing window glow */}
        <motion.div
          className="absolute inset-0 rounded pointer-events-none"
          animate={{
            boxShadow: hovered
              ? isNight
                ? "inset 0 0 30px 8px rgba(180,200,255,0.28)"
                : "inset 0 0 30px 8px rgba(255,240,120,0.22)"
              : [
                  "inset 0 0 0px 0px rgba(255,255,255,0)",
                  isNight
                    ? "inset 0 0 18px 5px rgba(180,200,255,0.18)"
                    : "inset 0 0 20px 6px rgba(255,240,100,0.16)",
                  "inset 0 0 0px 0px rgba(255,255,255,0)",
                ],
          }}
          transition={
            hovered
              ? { duration: 0.25 }
              : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
          }
        />

        {/* Icon badge — small pill in the window corner */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0.6, scale: hovered ? 1 : 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-sans"
          style={{
            background: isNight
              ? "rgba(20,15,50,0.72)"
              : "rgba(255,245,200,0.75)",
            color: isNight ? "#c8d8ff" : "#7a5c00",
            backdropFilter: "blur(4px)",
          }}
        >
          {isNight ? (
            <Moon className="w-3 h-3" />
          ) : (
            <Sun className="w-3 h-3" />
          )}
          {isNight ? "Night" : "Day"}
        </motion.div>
      </button>

      {/* ── Hint tooltip ────────────────────────────────────────── */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "fixed",
              left: "5%",
              top: "61%",
              zIndex: 41,
              pointerEvents: "none",
            }}
            className="px-2 py-1 rounded bg-black/60 text-white text-xs font-sans backdrop-blur-sm whitespace-nowrap"
          >
            Click the window to{" "}
            {isNight ? "bring back the sun" : "watch the stars"}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
