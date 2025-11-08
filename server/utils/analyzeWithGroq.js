import Groq from "groq-sdk";
export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// List of models to try (fallback)
const models = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "openai/gpt-oss-20b"
];

const allowedMoods = ["happy", "sad", "angry", "anxious", "neutral", "excited"];

// 
// Try to find allowed mood in AI text
const extractMood = (text) => {
  if (!text) return "neutral";

  const lowerText = text.toLowerCase();
  for (let moodd of allowedMoods) {
    if (lowerText.includes(moodd)) {
      return moodd;
    }
  }
  return "neutral";
};


const analyzeWithGroq = async (text) => {
  for (let modelName of models) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `
You are a mental health assistant. Analyze the following journal entry and extract:
1. mood:{"happy", "sad", "angry", "anxious", "neutral", "excited"}
2. summary: One-liner summary of the entry
3. Advice: your own advice based on text
4. Quote: best quote to overcome if in bad mood.
write advice/answer as u are talking and guiding the person who is writing not as third person.
analyze the text and return json only.

Journal Entry: """${text}"""
`
          }
        ],
        model: modelName
      });

      // Return text if successful
      //mood
      const aiText = completion.choices[0]?.message?.content || "No response from model";
       
      const moodd =  extractMood(aiText);
      
      return {
        text: aiText,
        moodd
      };
      
    } catch (err) {
      console.warn(`Model ${modelName} failed:`, err.message);
      // Continue to next model
    }
  }

  throw new Error("All models failed. Please try again later.");
};

export default analyzeWithGroq;
