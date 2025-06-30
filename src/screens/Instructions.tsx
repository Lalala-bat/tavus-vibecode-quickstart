import { createConversation } from "@/api";
import {
  DialogWrapper,
  AnimatedTextBlockWrapper,
} from "@/components/DialogWrapper";
import { screenAtom } from "@/store/screens";
import { conversationAtom } from "@/store/conversation";
import { interviewSetupAtom, currentInterviewAtom, InterviewSession } from "@/store/interview";
import React, { useCallback, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { AlertTriangle, Mic, Video, VolumeX } from "lucide-react";
import { useDaily, useDailyEvent, useDevices } from "@daily-co/daily-react";
import { ConversationError } from "./ConversationError";
import zoomSound from "@/assets/sounds/zoom.mp3";
import { Button } from "@/components/ui/button";
import { apiTokenAtom } from "@/store/tokens";
import { quantum } from 'ldrs';
import gloriaVideo from "@/assets/video/gloria.mp4";

quantum.register();

const useCreateConversationMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setScreenState] = useAtom(screenAtom);
  const [, setConversation] = useAtom(conversationAtom);
  const [, setCurrentInterview] = useAtom(currentInterviewAtom);
  const interviewSetup = useAtomValue(interviewSetupAtom);
  const token = useAtomValue(apiTokenAtom);

  const createConversationRequest = async () => {
    try {
      if (!token) {
        throw new Error("API token is required");
      }
      
      setIsLoading(true);
      
      // Create the interview session
      const interviewSession: InterviewSession = {
        id: Date.now().toString(),
        setup: interviewSetup,
        startTime: new Date(),
        questions: [],
        responses: []
      };
      
      setCurrentInterview(interviewSession);
      
      const conversation = await createConversation(token, interviewSetup);
      setConversation(conversation);
      setScreenState({ currentScreen: "conversation" });
    } catch (error) {
      console.error("Error creating conversation:", error);
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createConversationRequest,
  };
};

export const Instructions: React.FC = () => {
  const daily = useDaily();
  const { currentMic, setMicrophone, setSpeaker } = useDevices();
  const { createConversationRequest } = useCreateConversationMutation();
  const [getUserMediaError, setGetUserMediaError] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [audioOnlyMode, setAudioOnlyMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [error, setError] = useState(false);
  const interviewSetup = useAtomValue(interviewSetupAtom);
  
  const audio = useMemo(() => {
    const audioObj = new Audio(zoomSound);
    audioObj.volume = 0.7;
    return audioObj;
  }, []);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  useDailyEvent(
    "camera-error",
    useCallback(() => {
      console.log("Camera error detected, switching to audio-only mode");
      setCameraError(true);
      setAudioOnlyMode(true);
    }, []),
  );

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setIsPlayingSound(true);
      
      audio.currentTime = 0;
      await audio.play();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsPlayingSound(false);
      setIsLoadingConversation(true);
      
      let micDeviceId = currentMic?.device?.deviceId;
      
      try {
        // Try to start with camera first
        const res = await daily?.startCamera({
          startVideoOff: false,
          startAudioOff: false,
          audioSource: "default",
        });
        
        // @ts-expect-error deviceId exists in the MediaDeviceInfo
        const isDefaultMic = res?.mic?.deviceId === "default";
        // @ts-expect-error deviceId exists in the MediaDeviceInfo
        const isDefaultSpeaker = res?.speaker?.deviceId === "default";
        // @ts-expect-error deviceId exists in the MediaDeviceInfo
        micDeviceId = res?.mic?.deviceId;

        if (isDefaultMic) {
          if (!isDefaultMic) {
            setMicrophone("default");
          }
          if (!isDefaultSpeaker) {
            setSpeaker("default");
          }
        }
      } catch (cameraErr) {
        console.log("Camera not available, trying audio-only mode");
        setCameraError(true);
        setAudioOnlyMode(true);
        
        try {
          // Try audio-only mode
          const res = await daily?.startCamera({
            startVideoOff: true,
            startAudioOff: false,
            audioSource: "default",
          });
          
          // @ts-expect-error deviceId exists in the MediaDeviceInfo
          micDeviceId = res?.mic?.deviceId;
          
          if (!micDeviceId) {
            setMicrophone("default");
          }
        } catch (audioErr) {
          console.error("Audio also failed:", audioErr);
          setGetUserMediaError(true);
          return;
        }
      }
      
      if (micDeviceId || audioOnlyMode) {
        await createConversationRequest();
      } else {
        setGetUserMediaError(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setIsLoading(false);
      setIsLoadingConversation(false);
    }
  };

  const handleAudioOnlyClick = async () => {
    setAudioOnlyMode(true);
    setCameraError(false);
    setGetUserMediaError(false);
    await handleClick();
  };

  if (isPlayingSound || isLoadingConversation) {
    return (
      <DialogWrapper>
        <video
          src={gloriaVideo}
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 h-full w-full object-cover"
        />
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <AnimatedTextBlockWrapper>
          <div className="flex flex-col items-center justify-center gap-4">
            <l-quantum
              size="45"
              speed="1.75"
              color="white"
            ></l-quantum>
            <p className="text-white text-lg">
              {audioOnlyMode ? "Preparing your audio interview with AERIS..." : "Preparing your interview with AERIS..."}
            </p>
            {audioOnlyMode && (
              <p className="text-gray-300 text-sm text-center max-w-md">
                Audio-only mode enabled. Your interview will proceed without video.
              </p>
            )}
          </div>
        </AnimatedTextBlockWrapper>
      </DialogWrapper>
    );
  }

  if (error) {
    return <ConversationError onClick={handleClick} />;
  }

  return (
    <DialogWrapper>
      <video
        src={gloriaVideo}
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 h-full w-full object-cover"
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <AnimatedTextBlockWrapper>
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Ready for Your Interview?
            </h1>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
              <h2 className="text-xl font-semibold text-primary mb-2">Interview Details</h2>
              <div className="space-y-2 text-left">
                <p className="text-white"><span className="text-gray-400">Position:</span> {interviewSetup.jobTitle}</p>
                <p className="text-white"><span className="text-gray-400">Company:</span> {interviewSetup.company}</p>
                <p className="text-white"><span className="text-gray-400">Difficulty:</span> <span className="capitalize">{interviewSetup.difficulty}</span></p>
                <p className="text-white"><span className="text-gray-400">Type:</span> <span className="capitalize">{interviewSetup.interviewType}</span></p>
                <p className="text-white"><span className="text-gray-400">Duration:</span> {interviewSetup.duration} minutes</p>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            AERIS will conduct a professional interview simulation. Be yourself, stay confident, and remember - this is practice to help you succeed!
          </p>

          {/* Camera Error Warning */}
          {cameraError && !audioOnlyMode && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <AlertTriangle className="size-5" />
                <span className="font-medium">Camera Not Available</span>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Your camera couldn't be accessed, but you can continue with audio-only interview.
              </p>
              <Button
                onClick={handleAudioOnlyClick}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100 border border-yellow-500/30"
              >
                <VolumeX className="size-4 mr-2" />
                Continue Audio-Only
              </Button>
            </div>
          )}

          {/* Main Start Button */}
          {!cameraError && (
            <Button
              onClick={handleClick}
              className="relative z-20 flex items-center justify-center gap-2 rounded-3xl border border-[rgba(255,255,255,0.3)] px-8 py-3 text-lg font-semibold text-white transition-all duration-200 hover:text-black mb-8 disabled:opacity-50 bg-primary/20 hover:bg-primary"
              disabled={isLoading}
              style={{
                height: '56px',
                transition: 'all 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 197, 254, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Video className="size-5" />
              Start Interview with AERIS
            </Button>
          )}

          {/* Audio-Only Mode Indicator */}
          {audioOnlyMode && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <VolumeX className="size-5" />
                <span className="font-medium">Audio-Only Mode</span>
              </div>
              <p className="text-gray-300 text-sm">
                Your interview will proceed with audio only. AERIS will still provide the same quality coaching experience.
              </p>
            </div>
          )}

          {/* Permission Error */}
          {getUserMediaError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertTriangle className="size-5" />
                <span className="font-medium">Media Access Required</span>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Please allow microphone access to continue with your interview practice.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleClick}
                  className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleAudioOnlyClick}
                  className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border border-gray-500/30"
                >
                  Audio Only
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8 text-gray-400 justify-center">
            <div className="flex items-center gap-3 bg-[rgba(0,0,0,0.2)] px-4 py-2 rounded-full">
              <Mic className="size-5 text-primary" />
              Microphone required
            </div>
            <div className="flex items-center gap-3 bg-[rgba(0,0,0,0.2)] px-4 py-2 rounded-full">
              <Video className="size-5 text-gray-400" />
              Camera optional
            </div>
          </div>

          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Your interview will be analyzed in real-time to provide personalized feedback and help you improve your interview skills.
            {audioOnlyMode && " Audio-only interviews still provide comprehensive feedback on your responses and communication skills."}
          </p>
        </div>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};