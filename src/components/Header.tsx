import { memo } from "react";
import { Button } from "./ui/button";
import { Settings, Check, ArrowLeft } from "lucide-react";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { conversationAtom } from "@/store/conversation";
import { settingsSavedAtom } from "@/store/settings";

export const Header = memo(() => {
  const [{ currentScreen }, setScreenState] = useAtom(screenAtom);
  const [conversation] = useAtom(conversationAtom);
  const [settingsSaved] = useAtom(settingsSavedAtom);

  const handleSettings = () => {
    if (!conversation) {
      setScreenState({ currentScreen: "settings" });
    }
  };

  const handleBack = () => {
    if (currentScreen === "interviewSetup") {
      setScreenState({ currentScreen: "dashboard" });
    } else if (currentScreen === "instructions") {
      setScreenState({ currentScreen: "interviewSetup" });
    } else {
      setScreenState({ currentScreen: "dashboard" });
    }
  };

  const showBackButton = ["interviewSetup", "instructions", "settings"].includes(currentScreen);

  return (
    <header className="flex w-full items-start justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Source Code Pro, monospace' }}>
            AERIS
          </div>
          <div className="text-sm text-gray-400">AI Career Coach</div>
        </div>
      </div>
      
      <div className="relative">
        {settingsSaved && (
          <div className="absolute -top-2 -right-2 z-20 rounded-full bg-green-500 p-1 animate-fade-in">
            <Check className="size-3" />
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={handleSettings}
          className="relative size-10 sm:size-14 border-0 bg-transparent hover:bg-zinc-800"
        >
          <Settings className="size-4 sm:size-6" />
        </Button>
      </div>
    </header>
  );
});