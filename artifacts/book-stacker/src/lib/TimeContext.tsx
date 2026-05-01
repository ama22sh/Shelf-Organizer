import { createContext, useCallback, useContext, useRef, useState } from "react";

type TimeCtx = {
  isNight: boolean;
  toggle: () => void;
  transitioning: boolean;
};

const Ctx = createContext<TimeCtx>({ isNight: false, toggle: () => {}, transitioning: false });

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const [isNight, setIsNight] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const cooldown = useRef(false);

  const toggle = useCallback(() => {
    if (cooldown.current) return;
    cooldown.current = true;
    setTransitioning(true);

    // Kick off transition; the flash peaks at 150ms, image swap at 300ms.
    setTimeout(() => {
      setIsNight((n) => !n);
    }, 300);

    setTimeout(() => {
      setTransitioning(false);
      cooldown.current = false;
    }, 1600);
  }, []);

  return (
    <Ctx.Provider value={{ isNight, toggle, transitioning }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTime() {
  return useContext(Ctx);
}
