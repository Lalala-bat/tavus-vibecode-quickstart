import React from "react";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { interviewHistoryAtom } from "@/store/interview";
import { DialogWrapper, AnimatedTextBlockWrapper } from "@/components/DialogWrapper";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  TrendingUp, 
  Clock, 
  Award,
  BarChart3,
  Calendar
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [interviewHistory] = useAtom(interviewHistoryAtom);

  const stats = {
    totalInterviews: interviewHistory.length,
    averageScore: interviewHistory.length > 0 
      ? Math.round(interviewHistory.reduce((acc, interview) => acc + (interview.score || 0), 0) / interviewHistory.length)
      : 0,
    improvementRate: 15, // Mock data for now
    hoursSpent: Math.round(interviewHistory.reduce((acc, interview) => {
      if (interview.endTime && interview.startTime) {
        return acc + (interview.endTime.getTime() - interview.startTime.getTime()) / (1000 * 60 * 60);
      }
      return acc;
    }, 0) * 10) / 10
  };

  const handleStartInterview = () => {
    setScreenState({ currentScreen: "interviewSetup" });
  };

  const handleViewProgress = () => {
    setScreenState({ currentScreen: "progress" });
  };

  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <div className="w-full max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Welcome to <span className="text-primary">AERIS</span>
            </h1>
            <p className="text-lg text-gray-300">
              Your AI Career Coach - Ready to ace your next interview?
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <PlayCircle className="size-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalInterviews}</p>
                  <p className="text-sm text-gray-400">Interviews</p>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <Award className="size-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.averageScore}%</p>
                  <p className="text-sm text-gray-400">Avg Score</p>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <TrendingUp className="size-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">+{stats.improvementRate}%</p>
                  <p className="text-sm text-gray-400">Improvement</p>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <Clock className="size-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.hoursSpent}h</p>
                  <p className="text-sm text-gray-400">Practice Time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <PlayCircle className="size-8 text-primary" />
                  <h3 className="text-xl font-semibold text-white">Start Interview Practice</h3>
                </div>
                <p className="text-gray-300">
                  Practice with AI-powered interviews tailored to your target job and company.
                </p>
                <Button 
                  onClick={handleStartInterview}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
                >
                  Start New Interview
                </Button>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="size-8 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">View Progress</h3>
                </div>
                <p className="text-gray-300">
                  Track your improvement over time and identify areas for growth.
                </p>
                <Button 
                  onClick={handleViewProgress}
                  variant="outline"
                  className="w-full"
                >
                  View Analytics
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Interviews */}
          {interviewHistory.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="size-5" />
                Recent Interviews
              </h3>
              <div className="space-y-3">
                {interviewHistory.slice(0, 3).map((interview, index) => (
                  <div 
                    key={interview.id} 
                    className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium text-white">{interview.setup.jobTitle}</h4>
                      <p className="text-sm text-gray-400">{interview.setup.company}</p>
                      <p className="text-xs text-gray-500">
                        {interview.startTime.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{interview.score || 'N/A'}%</p>
                      <p className="text-xs text-gray-400 capitalize">{interview.setup.difficulty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Motivational Message */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-6 border border-primary/20">
            <p className="text-lg text-white font-medium">
              "Every expert was once a beginner. Keep practicing!"
            </p>
            <p className="text-sm text-gray-400 mt-2">- AERIS AI Career Coach</p>
          </div>
        </div>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};