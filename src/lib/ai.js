const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama3-70b-8192';

// Generic text generation using Groq
export const generateInterviewContent = async (prompt) => {
  if (!GROQ_API_KEY) {
    throw new Error("Groq API key not found. Please add VITE_GROQ_API_KEY to your environment variables.");
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { 
            role: "system", 
            content: "You are an expert technical interviewer. Provide high-quality, professional interview content." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`[GROQ] API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

// Parse JSON safely from AI response (handles markdown code fences)
export const parseJsonFromAI = (text) => {
  // Remove possible markdown code blocks
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Try to extract just the JSON array or object
  const start = cleaned.indexOf('[') !== -1 ? cleaned.indexOf('[') : cleaned.indexOf('{');
  const end = cleaned.lastIndexOf(']') !== -1 ? cleaned.lastIndexOf(']') + 1 : cleaned.lastIndexOf('}') + 1;
  
  if (start === -1 || end === -1) {
    console.error("Failed to parse JSON. Raw text:", text);
    throw new Error("Could not find valid JSON in AI response");
  }

  const jsonSlice = cleaned.slice(start, end);
  return JSON.parse(jsonSlice);
};

// Generate interview questions for a role
export const generateQuestions = async (role, level) => {
  const prompt = `Generate exactly 10 interview questions for a ${level}-level ${role}.
Return ONLY a valid JSON array. Format:
[
  {
    "question": "...",
    "category": "Behavioral",
    "difficulty": "Medium",
    "tips": "..."
  }
]`;

  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};

// Generate MCQ questions for a role
export const generateMCQs = async (role, level) => {
  const prompt = `Generate exactly 10 multiple choice questions for a ${level}-level ${role}.
Return ONLY a valid JSON array. Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "..."
  }
]`;

  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};
