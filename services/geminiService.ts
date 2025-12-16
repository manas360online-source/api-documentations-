import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize only if key is present to avoid errors during static render, though checking at usage time is better
const ai = new GoogleGenAI({ apiKey });

export const analyzeMedicalDocument = async (documentText: string) => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are the MedCore Intelligent API Backend. 
    Your role is to process raw medical notes and extract structured data in JSON format.
    
    Output Schema:
    {
      "summary": "Brief summary of the condition",
      "patient_vitals": { "bp": "string", "hr": "number", "temp": "number" },
      "symptoms": ["string"],
      "diagnosis_codes": ["ICD-10 codes if applicable"],
      "recommended_therapist_type": "string",
      "urgency_level": "Low" | "Medium" | "High" | "Critical"
    }
    
    Do not output markdown code blocks. Output raw JSON only.`;

    const response = await ai.models.generateContent({
      model,
      contents: documentText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
