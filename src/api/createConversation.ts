import { IConversation } from "@/types";
import { InterviewSetup } from "@/store/interview";

const generateInterviewPrompt = (setup: InterviewSetup): string => {
  const difficultyContext = {
    easy: "entry-level position with basic questions focusing on motivation and cultural fit",
    medium: "mid-level position with moderate complexity questions covering both experience and problem-solving",
    complex: "senior-level position with challenging questions requiring deep expertise and leadership examples"
  };

  const typeContext = {
    behavioral: "behavioral questions using the STAR method (Situation, Task, Action, Result)",
    technical: "technical questions specific to the role requirements and industry standards",
    situational: "hypothetical scenarios and problem-solving questions",
    mixed: "a balanced mix of behavioral, technical, and situational questions"
  };

  return `You are AERIS, a professional AI career coach conducting a ${setup.difficulty} ${setup.interviewType} interview for a ${setup.jobTitle} position at ${setup.company}.

ROLE CONTEXT:
- Position: ${setup.jobTitle}
- Company: ${setup.company}
- Job Description: ${setup.description}
- Key Requirements: ${setup.requirements}
- Interview Level: ${difficultyContext[setup.difficulty]}
- Interview Type: ${typeContext[setup.interviewType]}

INTERVIEW GUIDELINES:
1. Maintain a professional, confident, and encouraging demeanor throughout
2. Ask 5-8 relevant questions based on the job requirements
3. Only ask follow-up questions when necessary for clarification or deeper insight
4. Tailor questions to the specific role and company
5. Provide brief, supportive feedback between questions when appropriate
6. Keep the conversation flowing naturally while staying focused on the interview

QUESTION STRATEGY:
- Start with a warm introduction and an easy opening question
- Progress to more challenging questions based on the difficulty level
- Focus on the specific requirements mentioned in the job description
- End with an opportunity for the candidate to ask questions

Remember: You're here to help the candidate practice and improve, so be encouraging while maintaining professional interview standards.`;
};

export const createConversation = async (
  token: string,
  interviewSetup: InterviewSetup
): Promise<IConversation> => {
  const conversationalContext = generateInterviewPrompt(interviewSetup);
  
  const payload = {
    persona_id: "pd43ffef", // Professional interviewer persona
    custom_greeting: `Hello! I'm AERIS, your AI career coach. I'm excited to help you practice for your ${interviewSetup.jobTitle} interview at ${interviewSetup.company}. Let's begin with a brief introduction - please tell me a bit about yourself and why you're interested in this position.`,
    conversational_context: conversationalContext,
    properties: {
      interview_type: interviewSetup.interviewType,
      difficulty: interviewSetup.difficulty,
      job_title: interviewSetup.jobTitle,
      company: interviewSetup.company
    }
  };
  
  console.log('Creating interview conversation with setup:', interviewSetup);
  
  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token,
    },
    body: JSON.stringify(payload),
  });

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};