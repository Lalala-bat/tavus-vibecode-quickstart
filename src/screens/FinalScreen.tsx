import { DialogWrapper, AnimatedTextBlockWrapper } from "@/components/DialogWrapper";
import React from "react";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { currentInterviewAtom, interviewHistoryAtom } from "@/store/interview";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  TrendingUp, 
  Clock, 
  Target,
  RotateCcw,
  Home,
  Star
} from "lucide-react";

export const FinalScreen: React.FC = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [currentInterview] = useAtom(currentInterviewAtom);
  const [interviewHistory, setInterviewHistory] = useAtom(interviewHistoryAtom);

  React.useEffect(() => {
    // Add current interview to history
    if (currentInterview && !interviewHistory.find(i => i.id === currentInterview.id)) {
      setInterviewHistory(prev => [...prev, currentInterview]);
    }
  }, [currentInterview, interviewHistory, setInterviewHistory]);

  const handleReturnToDashboard = () => {
    setScreenState({ currentScreen: "dashboard" });
  };

  const handlePracticeAgain = () => {
    setScreenState({ currentScreen: "interviewSetup" });
  };

  const mockFeedback = {
    strengths: [
      "Clear and confident communication",
      "Good examples from past experience",
      "Professional demeanor throughout"
    ],
    improvements: [
      "Provide more specific metrics in answers",
      "Ask more questions about the role",
      "Elaborate on technical skills"
    ],
    overallScore: currentInterview?.score || 85
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-blue-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent performance! You're ready for the real thing.";
    if (score >= 75) return "Great job! A few tweaks and you'll be perfect.";
    if (score >= 60) return "Good effort! Keep practicing to improve your confidence.";
    return "Keep practicing! Every interview makes you stronger.";
  };

  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <div className="w-full max-w-3xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Award className="size-16 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white">Interview Complete!</h1>
            <p className="text-lg text-gray-300">
              Here's how you performed with AERIS
            </p>
          </div>

          {/* Score Section */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 backdrop-blur-sm rounded-xl p-8 border border-primary/20 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Star className="size-8 text-yellow-400" />
                <span className={`text-6xl font-bold ${getScoreColor(mockFeedback.overallScore)}`}>
                  {mockFeedback.overallScore}%
                </span>
                <Star className="size-8 text-yellow-400" />
              </div>
              <p className="text-xl text-white font-medium">
                {getScoreMessage(mockFeedback.overallScore)}
              </p>
            </div>
          </div>

          {/* Interview Details */}
          {currentInterview && (
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="size-5" />
                Interview Summary
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Position</p>
                  <p className="text-white font-medium">{currentInterview.setup.jobTitle}</p>
                </div>
                <div>
                  <p className="text-gray-400">Company</p>
                  <p className="text-white font-medium">{currentInterview.setup.company}</p>
                </div>
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-white font-medium">{currentInterview.setup.duration} minutes</p>
                </div>
                <div>
                  <p className="text-gray-400">Difficulty</p>
                  <p className="text-white font-medium capitalize">{currentInterview.setup.difficulty}</p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <TrendingUp className="size-5" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {mockFeedback.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <Target className="size-5" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {mockFeedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handlePracticeAgain}
              className="bg-primary hover:bg-primary/90 text-black font-semibold flex items-center gap-2"
            >
              <RotateCcw className="size-4" />
              Practice Again
            </Button>
            <Button
              onClick={handleReturnToDashboard}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="size-4" />
              Return to Dashboard
            </Button>
          </div>

          {/* Motivational Quote */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-6 border border-primary/20">
            <p className="text-lg text-white font-medium">
              "Success is where preparation and opportunity meet."
            </p>
            <p className="text-sm text-gray-400 mt-2">Keep practicing with AERIS to land your dream job!</p>
          </div>
        </div>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};