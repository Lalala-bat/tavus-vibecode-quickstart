import React, { useState } from "react";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { interviewSetupAtom, IInterviewSetup } from "@/store/interview";
import { DialogWrapper, AnimatedTextBlockWrapper } from "@/components/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Clock, Target, Briefcase } from "lucide-react";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-black/20 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={`flex h-10 w-full rounded-md border border-input bg-black/20 backdrop-blur-sm px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
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
      // Save the setup and proceed to interview
      setScreenState({ currentScreen: "instructions" });
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetup = (field: keyof IInterviewSetup, value: string | number) => {
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
        <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4">
          {/* Header */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-white hover:bg-white/10 flex-shrink-0"
            >
              <ArrowLeft className="size-4 sm:size-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Interview Setup</h2>
              <p className="text-sm sm:text-base text-gray-400">Configure your practice interview</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Job Information */}
            <div className="space-y-3 sm:space-y-4 bg-black/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <Briefcase className="size-4 sm:size-5 text-primary flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-white">Job Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-white">Job Title *</label>
                  <Input
                    value={interviewSetup.jobTitle}
                    onChange={(e) => updateSetup('jobTitle', e.target.value)}
                    placeholder="e.g., Software Engineer"
                    className="bg-black/20 text-white placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-white">Company *</label>
                  <Input
                    value={interviewSetup.company}
                    onChange={(e) => updateSetup('company', e.target.value)}
                    placeholder="e.g., Google"
                    className="bg-black/20 text-white placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-white">Job Description</label>
                <Textarea
                  value={interviewSetup.description}
                  onChange={(e) => updateSetup('description', e.target.value)}
                  placeholder="Paste the job description here or describe the role..."
                  rows={3}
                  className="text-sm sm:text-base resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-white">Key Requirements</label>
                <Textarea
                  value={interviewSetup.requirements}
                  onChange={(e) => updateSetup('requirements', e.target.value)}
                  placeholder="List the key skills and requirements for this position..."
                  rows={2}
                  className="text-sm sm:text-base resize-none"
                />
              </div>
            </div>

            {/* Interview Configuration */}
            <div className="space-y-3 sm:space-y-4 bg-black/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <Target className="size-4 sm:size-5 text-primary flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-white">Interview Configuration</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-white">Difficulty Level</label>
                  <Select
                    value={interviewSetup.difficulty}
                    onChange={(e) => updateSetup('difficulty', e.target.value as 'easy' | 'medium' | 'complex')}
                    className="text-sm sm:text-base"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="complex">Complex</option>
                  </Select>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {difficultyDescriptions[interviewSetup.difficulty]}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-white">Interview Type</label>
                  <Select
                    value={interviewSetup.interviewType}
                    onChange={(e) => updateSetup('interviewType', e.target.value as any)}
                    className="text-sm sm:text-base"
                  >
                    <option value="mixed">Mixed</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="technical">Technical</option>
                    <option value="situational">Situational</option>
                  </Select>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {interviewTypeDescriptions[interviewSetup.interviewType]}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-white">Duration</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[15, 30, 45].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => updateSetup('duration', duration)}
                      className={`p-2 sm:p-3 rounded-md border text-xs sm:text-sm font-medium transition-colors ${
                        interviewSetup.duration === duration
                          ? 'bg-primary text-black border-primary'
                          : 'bg-black/20 text-white border-white/20 hover:border-primary/50'
                      }`}
                    >
                      {duration} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Start Interview */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Ready to Start?</h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    AERIS will conduct a {interviewSetup.duration}-minute {interviewSetup.difficulty} {interviewSetup.interviewType} interview
                  </p>
                </div>
                <Button
                  onClick={handleStartInterview}
                  disabled={isLoading || !interviewSetup.jobTitle || !interviewSetup.company}
                  className="bg-primary hover:bg-primary/90 text-black font-semibold flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[140px] h-12 sm:h-14 text-sm sm:text-base"
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