
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

// Always use process.env.API_KEY directly for initialization as per @google/genai guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async optimizeTaskDescription(title: string, currentDesc: string): Promise<{ title: string, description: string }> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional business analyst. Refine this task. 
      Title: "${title}"
      Description: "${currentDesc}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Improved formal title" },
            description: { type: Type.STRING, description: "Structured, formal description in Russian" }
          },
          required: ["title", "description"]
        },
        systemInstruction: "You are a professional business analyst for the 1C Matrix system. You transform casual task descriptions into formal, structured business requirements in Russian language. Use professional terminology similar to SBIS or 1C."
      }
    });
    
    try {
      // The text property is used to extract the response content
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return { title, description: response.text || currentDesc };
    }
  },

  async suggestTeamSynergy(tasks: Task[], teamCount: number): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze current workload: ${tasks.length} tasks for ${teamCount} members. 
      Provide a brief 3-sentence summary of team health and potential bottlenecks in the style of a corporate reports. 
      Language: Russian.`
    });
    // The text property is used to extract the response content
    return response.text || "Данные анализируются...";
  }
};
