import { GoogleGenAI } from "@google/genai";
import { Job, JobStage } from "../types";

const getAIClient = () => {
  // Safety check: process.env might be empty in browser if not configured in Vite
  const apiKey = process.env?.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateShopReport = async (jobs: Job[]): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Configuration Missing. Please set up the API Key in your environment to use this feature.";

  // Filter for active jobs to reduce token count and focus context
  const activeJobs = jobs.filter(j => j.currentStage !== JobStage.COMPLETED);
  const completedToday = jobs.filter(j => 
    j.currentStage === JobStage.COMPLETED && 
    j.completedAt && 
    j.completedAt > Date.now() - 86400000
  );

  const prompt = `
    You are a clever shop manager assistant for a printing shop in India.
    Analyze the following job data and provide a concise status report.
    Currency is in Indian Rupees (₹).
    
    Data Summary:
    - Active Jobs: ${JSON.stringify(activeJobs.map(j => ({ id: j.id, stage: j.currentStage, assignee: j.assignedTo, priority: j.priority })))}
    - Completed Today Count: ${completedToday.length}

    Please provide:
    1. A quick summary of the shop floor status (who is overloaded?).
    2. Identify any bottlenecks (e.g., too many jobs in Design or Finishing).
    3. Suggest which 2 jobs should be prioritized immediately.
    4. A motivational quote for the team.

    Keep the tone professional but encouraging. Limit to 200 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate AI report at this time. Please try again later.";
  }
};
