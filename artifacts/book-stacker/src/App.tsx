import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Title from "@/pages/Title";
import LevelSelect from "@/pages/LevelSelect";
import Game from "@/pages/Game";
import HowToPlay from "@/pages/HowToPlay";
import Settings from "@/pages/Settings";
import StoryLibrary from "@/pages/StoryLibrary";
import StoryReader from "@/pages/StoryReader";
import Kids from "@/pages/Kids";
import KidsListen from "@/pages/KidsListen";
import KidsQuiz from "@/pages/KidsQuiz";
import { loadProgress } from "@/lib/storage";
import { audio } from "@/lib/audio";
import { TimeProvider } from "@/lib/TimeContext";
import { WindowToggle } from "@/components/WindowToggle";
import { CozyRoom } from "@/components/CozyRoom";

/** Painted background + window toggle — only on the home/title screen. */
function HomeLayer() {
  const [location] = useLocation();
  if (location !== "/") return null;
  return (
    <>
      <CozyRoom />
      <WindowToggle />
    </>
  );
}

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Title} />
      <Route path="/levels" component={LevelSelect} />
      <Route path="/play/:id">
        {(params) => <Game levelId={params.id} />}
      </Route>
      <Route path="/how" component={HowToPlay} />
      <Route path="/settings" component={Settings} />
      <Route path="/library" component={StoryLibrary} />
      <Route path="/read/:id">
        {(params) => <StoryReader id={params.id} />}
      </Route>
      <Route path="/kids" component={Kids} />
      <Route path="/kids/listen" component={KidsListen} />
      <Route path="/kids/quiz" component={KidsQuiz} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    const { settings } = loadProgress();
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    audio.setEnabled(settings.sound);

    // Browsers block audio until the user has interacted with the page.
    // Bootstrap music + the audio context on the very first interaction
    // anywhere in the app — works regardless of which page the user lands on.
    const boot = () => {
      const { settings: s } = loadProgress();
      audio.setEnabled(s.sound);
      if (s.sound) audio.startMusic();
      window.removeEventListener("pointerdown", boot);
      window.removeEventListener("keydown", boot);
      window.removeEventListener("touchstart", boot);
    };
    window.addEventListener("pointerdown", boot);
    window.addEventListener("keydown", boot);
    window.addEventListener("touchstart", boot);

    // Global button-click sound. Fires on any <button>, link styled as
    // a button, or shadcn switch/checkbox interactions.
    let lastClickAt = 0;
    const onPointerDownGlobal = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'button, [role="button"], [role="switch"], [role="checkbox"], a[href]',
      );
      if (!interactive) return;
      // Skip clicks that originate inside the gameplay area (books / cells)
      // — those have their own dedicated sounds.
      if (
        target.closest('[data-cell="1"]') ||
        target.closest("[data-book]") ||
        target.closest("[data-no-click-sound]")
      ) {
        return;
      }
      const now = Date.now();
      if (now - lastClickAt < 60) return;
      lastClickAt = now;
      audio.click();
    };
    window.addEventListener("pointerdown", onPointerDownGlobal, true);

    return () => {
      window.removeEventListener("pointerdown", boot);
      window.removeEventListener("keydown", boot);
      window.removeEventListener("touchstart", boot);
      window.removeEventListener("pointerdown", onPointerDownGlobal, true);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TimeProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <HomeLayer />
            <Router />
          </WouterRouter>
          <Toaster />
        </TimeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
