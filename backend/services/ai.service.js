import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical recruiter and interview coach.

Analyze the candidate and return ONLY valid JSON.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Generate:

{
  "matchScore": number,

  "technicalQuestion": [
    {
      "question": "real question",
      "intension": "why interviewer asks this",
      "answer": "ideal answer approach"
    }
  ],

  "behaviorQuestion": [
    {
      "question": "real question",
      "intension": "why interviewer asks this",
      "answer": "ideal answer approach"
    }
  ],

  "skillGaps": [
    {
      "skill": "skill name",
      "severity": "low | med | high"
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "topic name",
      "tasks": [
        "task 1",
        "task 2"
      ]
    }
  ]
}

Requirements:
- Generate 8 technical questions.
- Generate 5 behavioral questions.
- Generate realistic content.
- Generate a 7-day preparation plan.
- Return ONLY JSON.
- Do NOT return placeholders like "question", "answer", "day_number", etc.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const data = JSON.parse(response.text);

  // console.log("AI RESPONSE:");
  // console.log(JSON.stringify(data, null, 2));

  return data;
}

export default generateInterviewReport;
