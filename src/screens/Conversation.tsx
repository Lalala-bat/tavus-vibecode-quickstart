import { DialogWrapper } from "@/components/DialogWrapper";
import {
  DailyAudio,
  useDaily,
  useLocalSessionId,
  useParticipantIds,
  useVideoTrack,
  useAudioTrack,
} from "@daily-co/daily-react";
import React, { useCallback, useEffect, useState } from "react";
import Video from "@/components/Video";
import { conversationAtom } from "@/store/conversation";
import { currentInterviewAtom } from "@/store/interview";
import { useAtom, useAtomValue } from "jotai";
import { screenAtom } from "@/store/screens";
import { Button } from "@/components/ui/button";
import { endConversation } from "@/api/endConversation";
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  PhoneIcon,
} from "lucide-react";
import {
  clearSessionTime,
  getSessionTime,
  setSessionStartTime,
  updateSessionEndTime,
} from "@/utils";
import { Timer } from "@/components/Timer";
import { TIME_LIMIT } from "@/config";
import { apiTokenAtom } from "@/store/tokens";
import { quantum } from 'ldrs';
import { cn } from "@/lib/utils";

quantum.register();

const interviewEndPhrases = [
  "Thank you for taking the time to interview with us today. We'll be in touch soon with next steps.",
  "That concludes our interview. You've provided some great insights, and we appreciate your time.",
  "We've covered all our questions for today. Thank you for your thoughtful responses.",
];

export const Conversation: React.FC = () => {
  const [conversation, setConversation] = useAtom(conversationAtom);
  const [currentInterview, setCurrentInterview] = useAtom(currentInterviewAtom);
  const [, setScreenState] = useAtom(screenAtom);
  const token = useAtomValue(apiTokenAtom);

  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const localVideo = useVideoTrack(localSessionId);
  const localAudio = useAudioTrack(localSessionId);
  const isCameraEnabled = !localVideo.isOff;
  const isMicEnabled = !localAudio.isOff;
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });
  const [start, setStart] = useState(false);
  const [interviewDuration, setInterviewDuration] = useState(0);

  useEffect(() => {
    if (remoteParticipantIds.length && !start) {
      setStart(true);
      setTimeout(() => daily?.setLocalAudio(true), 4000);
    }
  }, [remoteParticipantIds, start]);

  useEffect(() => {
    if (!remoteParticipantIds.length || !start || !currentInterview) return;

    setSessionStartTime();
    const targetDuration = currentInterview.setup.duration * 60; // Convert to seconds
    
    const interval = setInterval(() => {
      const time = getSessionTime();
      setInterviewDuration(time);
      
      // Warning at 2 minutes before end
      if (time === targetDuration - 120) {
        daily?.sendAppMessage({
          message_type: "conversation",
          event_type: "conversation.echo",
          conversation_id: conversation?.conversation_id,
          properties: {
            modality: "text",
            text: "We have about 2 minutes remaining. Do you have any final questions for me?",
          },
        });
      }
      
      // End interview
      if (time >= targetDuration) {
        daily?.sendAppMessage({
          message_type: "conversation",
          event_type: "conversation.echo",
          conversation_id: conversation?.conversation_id,
          properties: {
            modality: "text",
            text: interviewEndPhrases[Math.floor(Math.random() * interviewEndPhrases.length)],
          },
        });
        
        setTimeout(() => {
          leaveConversation();
        }, 3000);
        clearInterval(interval);
      } else {
        updateSessionEndTime();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [remoteParticipantIds, start, currentInterview]);

  useEffect(() => {
    if (conversation?.conversation_url) {
      daily
        ?.join({
          url: conversation.conversation_url,
          startVideoOff: false,
          startAudioOff: true,
        })
        .then(() => {
          daily?.setLocalVideo(true);
          daily?.setLocalAudio(false);
        });
    }
  }, [conversation?.conversation_url]);

  const toggleVideo = useCallback(() => {
    daily?.setLocalVideo(!isCameraEnabled);
  }, [daily, isCameraEnabled]);

  const toggleAudio = useCallback(() => {
    daily?.setLocalAudio(!isMicEnabled);
  }, [daily, isMicEnabled]);

  const leaveConversation = useCallback(() => {
    daily?.leave();
    daily?.destroy();
    
    if (conversation?.conversation_id && token) {
      endConversation(token, conversation.conversation_id);
    }
    
    // Update interview session with end time
    if (currentInterview) {
      const updatedInterview = {
        ...currentInterview,
        endTime: new Date(),
        score: Math.floor(Math.random() * 30) + 70, // Mock score for demo
      };
      setCurrentInterview(updatedInterview);
    }
    
    setConversation(null);
    clearSessionTime();
    setScreenState({ currentScreen: "finalScreen" });
  }, [daily, token, currentInterview]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = currentInterview 
    ? Math.max(0, (currentInterview.setup.duration * 60) - interviewDuration)
    : 0;

  return (
    <DialogWrapper>
      <div className="absolute inset-0 size-full">
        {remoteParticipantIds?.length > 0 ? (
          <>
            {/* Interview Timer */}
            <div className="absolute left-4 top-4 rounded-full bg-black/60 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Time Remaining: {formatTime(remainingTime)}</span>
              </div>
            </div>

            {/* Interview Info */}
            {currentInterview && (
              <div className="absolute right-4 top-4 rounded-lg bg-black/60 backdrop-blur-sm px-4 py-3 text-sm text-white border border-primary/20">
                <div className="text-right">
                  <p className="font-semibold">{currentInterview.setup.jobTitle}</p>
                  <p className="text-gray-300">{currentInterview.setup.company}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {currentInterview.setup.difficulty} • {currentInterview.setup.interviewType}
                  </p>
                </div>
              </div>
            )}

            <Video
              id={remoteParticipantIds[0]}
              className="size-full"
              tileClassName="!object-cover"
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center flex-col gap-4">
            <l-quantum
              size="45"
              speed="1.75"
              color="white"
            ></l-quantum>
            <p className="text-white text-lg">Connecting to AERIS...</p>
          </div>
        )}
        
        {localSessionId && (
          <Video
            id={localSessionId}
            tileClassName="!object-cover"
            className={cn(
              "absolute bottom-20 right-4 aspect-video h-40 w-24 overflow-hidden rounded-lg border-2 border-primary shadow-[0_0_20px_rgba(34,197,254,0.3)] sm:bottom-12 lg:h-auto lg:w-52"
            )}
          />
        )}
        
        <div className="absolute bottom-8 right-1/2 z-10 flex translate-x-1/2 justify-center gap-4">
          <Button
            size="icon"
            className="border border-primary shadow-[0_0_20px_rgba(34,197,254,0.2)]"
            variant="secondary"
            onClick={toggleAudio}
          >
            {!isMicEnabled ? (
              <MicOffIcon className="size-6" />
            ) : (
              <MicIcon className="size-6" />
            )}
          </Button>
          <Button
            size="icon"
            className="border border-primary shadow-[0_0_20px_rgba(34,197,254,0.2)]"
            variant="secondary"
            onClick={toggleVideo}
          >
            {!isCameraEnabled ? (
              <VideoOffIcon className="size-6" />
            ) : (
              <VideoIcon className="size-6" />
            )}
          </Button>
          <Button
            size="icon"
            className="bg-[rgba(251,36,71,0.80)] backdrop-blur hover:bg-[rgba(251,36,71,0.60)] border border-[rgba(251,36,71,0.9)] shadow-[0_0_20px_rgba(251,36,71,0.3)]"
            variant="secondary"
            onClick={leaveConversation}
          >
            <PhoneIcon className="size-6 rotate-[135deg]" />
          </Button>
        </div>
        <DailyAudio />
      </div>
    </DialogWrapper>
  );
};