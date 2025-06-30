import { atom } from "jotai";

export interface InterviewSetup {
  jobTitle: string;
  company: string;
  description: string;
  requirements: string;
  difficulty: 'easy' | 'medium' | 'complex';
  interviewType: 'behavioral' | 'technical' | 'situational' | 'mixed';
  duration: number; // in minutes
}

export interface InterviewSession {
  id: string;
  setup: InterviewSetup;
  startTime: Date;
  endTime?: Date;
  score?: number;
  feedback?: string;
  questions: string[];
  responses: Array<{
    question: string;
    response: string;
    timestamp: Date;
  }>;
}

const initialInterviewSetup: InterviewSetup = {
  jobTitle: '',
  company: '',
  description: '',
  requirements: '',
  difficulty: 'medium',
  interviewType: 'mixed',
  duration: 30
};

export const interviewSetupAtom = atom<InterviewSetup>(initialInterviewSetup);
export const currentInterviewAtom = atom<InterviewSession | null>(null);
export const interviewHistoryAtom = atom<InterviewSession[]>([]);