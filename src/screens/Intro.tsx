import { AnimatedWrapper } from "@/components/DialogWrapper";
import React from "react";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { Play } from "lucide-react";
import AudioButton from "@/components/AudioButton";
import gloriaVideo from "@/assets/video/gloria.mp4";

export const Intro: React.FC = () => {
  const [, setScreenState] = useAtom(screenAtom);

  const handleClick = () => {
    setScreenState({ currentScreen: "dashboard" });
  };

  return (
    <AnimatedWrapper>
      <div className="flex size-full flex-col items-center justify-center">
        <video
          src={gloriaVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-overlay backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center gap-6 py-8 px-6 rounded-xl border border-[rgba(255,255,255,0.2)]" 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            background: 'rgba(0,0,0,0.4)'
          }}>
          
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Source Code Pro, monospace' }}>
              <span className="text-primary">AERIS</span>
            </h1>
            <p className="text-xl text-white font-medium">AI Career Coach</p>
            <p className="text-lg text-gray-300 max-w-md">
              Practice interviews with AI-powered coaching tailored to your dream job
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <AudioButton 
              onClick={handleClick}
              className="relative z-20 flex items-center justify-center gap-3 rounded-3xl border border-primary/50 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:text-black bg-primary/20 hover:bg-primary"
              style={{
                height: '56px',
                transition: 'all 0.3s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 25px rgba(34, 197, 254, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Play className="size-5" />
              Start Your Journey
            </AudioButton>

            <p className="text-sm text-gray-400 text-center max-w-sm">
              Get personalized feedback, build confidence, and land your dream job with AI-powered interview practice
            </p>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};