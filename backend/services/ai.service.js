import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import z from "zod";

import zodToJsonSchema from "zod-to-json-schema";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const interviewReportSchemaForGemini = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Overall match score between candidate profile and job description from 0 to 100",
    ),

  technicalQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that can be asked in the interview",
          ),

        intension: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question",
          ),

        answer: z
          .string()
          .describe(
            "How to answer the question, key points to cover, and recommended approach",
          ),
      }),
    )
    .describe(
      "List of technical questions that may be asked during the interview",
    ),

  behaviorQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that can be asked in the interview",
          ),

        intension: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question",
          ),

        answer: z
          .string()
          .describe("Suggested answer structure, key points, and approach"),
      }),
    )
    .describe(
      "List of behavioral questions that may be asked during the interview",
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe("The skill that the candidate is lacking"),

        severity: z
          .enum(["low", "med", "high"])
          .describe("Severity level of the skill gap"),
      }),
    )
    .describe("List of all skill gaps identified in the candidate profile"),

  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("Day number in the preparation roadmap"),

        focus: z.string().describe("Primary focus area for the day"),

        tasks: z
          .array(z.string())
          .describe("Tasks that should be completed on that day"),
      }),
    )
    .describe("Day-wise preparation plan to improve interview readiness"),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical recruiter, hiring manager, and interview coach.

Analyze the following candidate profile and job describe.

Resume:
${resume}

Self describe:
${ selfDescription}

Job describe:
${jobDescription}

Instructions:
1. Compare the candidate's profile with the job describe.
2. Give an overall match score from 0 to 100.
3. Generate realistic technical interview questions based on the candidate's skills and the job requirements.
4. For each technical question provide:
   - question
   - intention behind asking it
   - ideal answer approach

5. Generate realistic behavioral interview questions.
6. For each behavioral question provide:
   - question
   - intention behind asking it
   - ideal answer approach

7. Identify all important skill gaps in the candidate profile.
8. Assign a severity level for each skill gap:
   - low
   - med
   - high

9. Create a detailed 7-day preparation plan.
10. Each day must include:
    - day number
    - focus area
    - list of actionable tasks

Return ONLY valid JSON matching the provided schema.
Do not include markdown, explanations, code blocks, or extra text.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchemaForGemini),
    },
  });

return JSON.parse(response.text)
}


export default generateInterviewReport
