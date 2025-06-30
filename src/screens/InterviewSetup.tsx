import React, { useState } from "react";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { interviewSetupAtom, InterviewSetup } from "@/store/interview";
import { DialogWrapper, AnimatedTextBlockWrapper } from "@/components/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Clock, Target, Briefcase } from "lucide-react";

// ✅ FIXED: Proper forwardRef with props typed for Textarea
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-black/20 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

// ✅ FIXED: Proper forwardRef with props typed for Select
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-input bg-black/20 backdrop-blur-sm px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export const InterviewSetup: React.FC = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [interviewSetup, setInterviewSetup] = useAtom(interviewSetupAtom);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    setScreenState({ currentScreen: "dashboard" });
  };

  const handleStartInterview = async () => {
    if (!interviewSetup.jobTitle || !interviewSetup.company) {
      alert("Please fill in at least the job title and company name.");
      return;
    }

    setIsLoading(true);
    try {
      setScreenState({ currentScreen: "instructions" });
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetup = (field: keyof InterviewSetup, value: string | number) => {
    setInterviewSetup(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const difficultyDescriptions = {
    easy: "Entry-level questions focusing on motivation and basic skills",
    medium: "Mid-level questions covering experience and problem-solving",
    complex: "Senior-level questions requiring deep expertise and leadership"
  };

  const interviewTypeDescriptions = {
    behavioral: "Questions about past experiences using the STAR method",
    technical: "Role-specific technical questions and problem-solving",
    situational: "Hypothetical scenarios and how you'd handle them",
    mixed: "A balanced combination of all interview question types"
  };

  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-white">Interview Setup</h2>
              <p className="text-gray-400">Configure your practice interview</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Job Information */}
            <div className="space-y-4 bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">Job Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Job Title *</label>
                  <Input
                    value={interviewSetup.jobTitle}
                    onChange={(e) => updateSetup('jobTitle', e.target.value)}
                    placeholder="e.g., Software Engineer"
                    className="bg-black/20 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Company *</label>
                  <Input
                    value={interviewSetup.company}
                    onChange={(e) => updateSetup('company', e.target.value)}
                    placeholder="e.g., Google"
                    className="bg-black/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Job Description</label>
                <Textarea
                  value={interviewSetup.description}
                  onChange={(e) => updateSetup('description', e.target.value)}
                  placeholder="Paste the job description here or describe the role..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Key Requirements</label>
                <Textarea
                  value={interviewSetup.requirements}
                  onChange={(e) => updateSetup('requirements', e.target.value)}
                  placeholder="List the key skills and requirements for this position..."
                  rows={3}
                />
              </div>
            </div>

            {/* Interview Configuration */}
            <div className="space-y-4 bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Target className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">Interview Configuration</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Difficulty Level</label>
                  <Select
                    value={interviewSetup.difficulty}
                    onChange={(e) => updateSetup('difficulty', e.target.value as 'easy' | 'medium' | 'complex')}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="complex">Complex</option>
                  </Select>
                  <p className="text-xs text-gray-400">
                    {difficultyDescriptions[interviewSetup.difficulty]}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Interview Type</label>
                  <Select
                    value={interviewSetup.interviewType}
                    onChange={(e) => updateSetup('interviewType', e.target.value as any)}
                  >
                    <option value="mixed">Mixed</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="technical">Technical</option>
                    <option value="situational">Situational</option>
                  </Select>
                  <p className="text-xs text-gray-400">
                    {interviewTypeDescriptions[interviewSetup.interviewType]}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Duration</label>
                <Select
                  value={interviewSetup.duration.toString()}
                  onChange={(e) => updateSetup('duration', parseInt(e.target.value))}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                </Select>
              </div>
            </div>

            {/* Start Interview */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Ready to Start?</h3>
                  <p className="text-gray-300">
                    AERIS will conduct a {interviewSetup.duration}-minute {interviewSetup.difficulty} {interviewSetup.interviewType} interview
                  </p>
                </div>
                <Button
                  onClick={handleStartInterview}
                  disabled={isLoading || !interviewSetup.jobTitle || !interviewSetup.company}
                  className="bg-primary hover:bg-primary/90 text-black font-semibold flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Clock className="size-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="size-4" />
                      Start Interview
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};
