import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Title from "@/pages/Title";
import LevelSelect from "@/pages/LevelSelect";
import Game from "@/pages/Game";
import HowToPlay from "@/pages/HowToPlay";
import Settings from "@/pages/Settings";
import { loadProgress } from "@/lib/storage";
import { audio } from "@/lib/audio";

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
    return () => {
      window.removeEventListener("pointerdown", boot);
      window.removeEventListener("keydown", boot);
      window.removeEventListener("touchstart", boot);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
