import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/affirmation", async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood || typeof mood !== "string") {
      return res.status(400).json({ error: "Mood is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `
Create one short, warm, uplifting affirmation for someone feeling this way:

"${mood}"

Also choose ONE peaceful background theme from this exact list:
ocean, mountains, clouds, forest, sunrise, lavender

Return ONLY valid JSON in this exact format:
{
  "affirmation": "your affirmation here",
  "theme": "one theme from the list"
}

Rules:
- Affirmation under 45 words
- Gentle and emotionally supportive
- No medical advice
- No markdown
- No explanation
`,
    });

    const rawText = response.text || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanedText);

    res.json({
      affirmation: parsed.affirmation,
      theme: parsed.theme,
    });
  } catch (error) {
    console.error(error);

    res.json({
      affirmation:
        "You are doing your best, and that is enough for this moment.",
      theme: "clouds",
    });
  }
});

app.post("/api/journal", async (req, res) => {
  try {
    const { entry } = req.body;

    if (!entry || typeof entry !== "string") {
      return res.status(400).json({ error: "Journal entry is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `
You are a gentle wellness journaling assistant.

User journal entry:
"${entry}"

Return ONLY valid JSON in this exact format:
{
  "reflection": "a warm, validating reflection",
  "question": "one thoughtful reflection question",
  "action": "one tiny practical action for today or tomorrow"
}

Rules:
- No medical advice
- No therapy diagnosis
- Keep each field under 45 words
- Be gentle, warm, and practical
- No markdown
- No explanation
`,
    });

    const rawText = response.text || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanedText);

    res.json({
      reflection: parsed.reflection,
      question: parsed.question,
      action: parsed.action,
    });
  } catch (error) {
    console.error(error);

    res.json({
      reflection:
        "You showed up for yourself by writing this down, and that already matters.",
      question: "What is one small thing you handled better than you think?",
      action: "Take one slow breath and choose just one next step.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});