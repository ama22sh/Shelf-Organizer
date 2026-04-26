import { useMemo } from "react";

type Particle = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
};

export function AmbientDust({ count = 28 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    const out: Particle[] = [];
    for (let i = 0; i < count; i++) {
      out.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: -Math.random() * 20,
        duration: 18 + Math.random() * 22,
        drift: (Math.random() - 0.5) * 80,
        opacity: 0.15 + Math.random() * 0.35,
      });
    }
    return out;
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-amber-200/70 dust-mote"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--drift" as string]: `${p.drift}px`,
            boxShadow: "0 0 4px rgba(255, 220, 150, .6)",
          }}
        />
      ))}
    </div>
  );
}
