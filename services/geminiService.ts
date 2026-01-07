import { GoogleGenAI } from "@google/genai";
import { Employee, HistoryRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Summarizes an employee's career history into a professional biography.
 */
export const generateEmployeeBio = async (employee: Employee): Promise<string> => {
  try {
    const prompt = `
      You are an expert HR assistant. Write a professional, concise executive summary (bio) in Thai language for the following employee based on their history.
      
      Name: ${employee.firstName} ${employee.lastName}
      Position: ${employee.position}
      Department: ${employee.department}
      Start Date: ${employee.startDate}
      
      History Records:
      ${employee.history.map(h => `- [${h.date}] ${h.type}: ${h.title} - ${h.description}`).join('\n')}
      
      Keep the tone formal, encouraging, and professional. Length: around 100-150 words.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "ไม่สามารถสร้างประวัติโดยย่อได้ในขณะนี้";
  } catch (error) {
    console.error("Error generating bio:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI";
  }
};

/**
 * Enhances a raw note into a professional performance review or history description.
 */
export const enhanceHistoryDescription = async (rawText: string, type: string): Promise<string> => {
  try {
    const prompt = `
      You are a professional HR editor. Rewrite the following rough notes into a polite, professional, and clear record description in Thai language.
      Context: This is a "${type}" record for an employee history file.
      
      Rough Notes: "${rawText}"
      
      Output only the rewritten text.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || rawText;
  } catch (error) {
    console.error("Error enhancing text:", error);
    return rawText;
  }
};
