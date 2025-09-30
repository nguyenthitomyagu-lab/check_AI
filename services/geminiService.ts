
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisOptions, AnalysisResultData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    conclusion: {
      type: Type.STRING,
      enum: ['AI Written', 'Human Written', 'Uncertain'],
      description: "The final classification of the text.",
    },
    aiProbability: {
      type: Type.NUMBER,
      description: "Estimated probability (0-100) that the text is AI-written.",
    },
    evidence: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          signal: { type: Type.STRING, description: "The name of the feature detected, e.g., 'Sentence Rhythm'." },
          explanation: { type: Type.STRING, description: "Why this feature points towards the conclusion." },
        },
        required: ["signal", "explanation"],
      },
    },
    suspiciousExcerpts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          excerpt: { type: Type.STRING, description: "The exact quote from the text that is suspicious." },
          reason: { type: Type.STRING, description: "Why this specific excerpt is suspicious." },
        },
        required: ["excerpt", "reason"],
      },
    },
    humanizeSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          problem: { type: Type.STRING, description: "The issue identified in the text." },
          fix: { type: Type.STRING, description: "The specific way to fix the issue." },
          example: { type: Type.STRING, description: "A rewritten version of a sentence or two illustrating the fix." },
          why: { type: Type.STRING, description: "The reason this fix makes the text more human-like." },
        },
        required: ["problem", "fix", "example", "why"],
      },
    },
    limitations: {
      type: Type.STRING,
      description: "A brief note on the confidence of the analysis and any limiting factors (e.g., short text)."
    }
  },
  required: ["conclusion", "aiProbability", "evidence", "suspiciousExcerpts", "humanizeSuggestions", "limitations"],
};

const createPrompt = (text: string, options: AnalysisOptions) => {
  return `
    As a senior ML/NLP engineer, your task is to analyze the following text to determine if it was written by an AI or a human.

    **Analysis Rules:**
    1.  **Burstiness & Rhythm:** Humans mix short and long sentences. AI often maintains a uniform sentence length.
    2.  **Perplexity:** AI text can be overly predictable or "smooth".
    3.  **Stylometry:** Analyze vocabulary complexity, punctuation diversity, and use of "textbook" transition phrases (e.g., 'moreover', 'in conclusion').
    4.  **AI Templates:** Look for repetitive, formulaic structures (intro-body-conclusion in every paragraph), and a lack of specific, concrete details (times, places, numbers).
    5.  **Personal Experience:** Human writing often contains small, personal observations, emotions, and specific sensory details. AI writing is often detached and generic.
    6.  **Decision Logic:**
        - Conclude "AI Written" only with strong, consistent evidence.
        - Conclude "Human Written" if it shows clear signs of human authorship (e.g., burstiness, personal voice, minor natural errors).
        - Conclude "Uncertain" if signals are mixed, the text is too short (<120 words), or it seems heavily edited.

    **Input Text (Language: ${options.language === 'auto' ? 'Auto-detect' : options.language}):**
    \`\`\`
    ${text}
    \`\`\`

    **Your Task:**
    Provide a detailed analysis based on the rules. Your response MUST be in the language of the input text and conform to the provided JSON schema.
    - **conclusion**: Classify as "AI Written", "Human Written", or "Uncertain".
    - **aiProbability**: Provide a percentage from 0 to 100.
    - **evidence**: List the 3-5 strongest signals that led to your conclusion.
    - **suspiciousExcerpts**: Quote 1-3 specific excerpts from the text and explain why they are suspicious.
    - **humanizeSuggestions**: Give 5 concrete, actionable suggestions to make the text sound more human. For each suggestion, provide the (1) problem, (2) fix, (3) a rewritten example, and (4) why it works.
    - **limitations**: Note any limitations, especially if the text is short.

    Produce ONLY the JSON output. Do not include any explanatory text before or after the JSON object.
    `;
};


export const analyzeText = async (
  text: string,
  options: AnalysisOptions
): Promise<AnalysisResultData> => {
  const prompt = createPrompt(text, options);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonString = response.text.trim();
    // In case the model wraps the JSON in markdown
    const cleanedJsonString = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    const result = JSON.parse(cleanedJsonString) as AnalysisResultData;
    return result;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Failed to get a valid analysis from the AI model.");
  }
};
