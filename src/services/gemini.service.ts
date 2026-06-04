import AsyncStorage from '@react-native-async-storage/async-storage';
import { MCQ, UserStats, VocabWord } from '../types';

const GEMINI_KEY_STORAGE = 'gemini_api_key';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const GeminiService = {
  async saveApiKey(key: string): Promise<void> {
    await AsyncStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  },

  async getApiKey(): Promise<string | null> {
    const key = await AsyncStorage.getItem(GEMINI_KEY_STORAGE);
    if (key === 'disabled') return null;
    return key || process.env.EXPO_PUBLIC_GEMINI_API_KEY || null;
  },

  async deleteApiKey(): Promise<void> {
    await AsyncStorage.setItem(GEMINI_KEY_STORAGE, 'disabled');
  },

  async analyzeProgress(stats: UserStats, examFocus: string, weakAreas: any[]): Promise<string> {
    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error('API Key is missing');

    const prompt = `
Act as an expert study coach for Pakistani competitive exams (KPPSC, FPSC, CSS, ETEA). 
Analyze this student's exam preparation progress:
- Target Exam / Focus: ${examFocus || 'General Competitive Exams'}
- Total Questions Practiced: ${stats.totalQuestionsAnswered}
- Overall Correct Answers: ${stats.correctAnswersCount}
- Overall Streak: ${stats.streak} days
- Weak areas (based on error rates):
${weakAreas.map(w => `  * ${w.category}: Accuracy ${Math.round(w.accuracy_pct)}% (${w.incorrect_count} incorrect responses)`).join('\n')}

Provide a structured, encouraging study plan and recommendations. 
Format your output cleanly in Markdown. Include:
1. Progress Summary & Diagnostics (pointing out strengths and biggest gaps).
2. Actionable Study Strategies for their weakest categories.
3. A milestone schedule for the target exam.
4. Tips for minimizing negative marking.
Use bullet points and bold styling. Keep it professional, highly relevant, and concise. Do not use generic filler.
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to call Gemini API');
      }

      const resJson = await response.json();
      const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No response text received from Gemini');
      return text;
    } catch (e: any) {
      console.error('[GeminiService] Error analyzing progress:', e);
      throw e;
    }
  },

  async generateCustomQuiz(category: string, examFocus: string): Promise<MCQ[]> {
    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error('API Key is missing');

    const prompt = `
Act as an expert curriculum designer for Pakistani competitive exams (specifically: ${examFocus || 'General Prep'}).
Generate exactly 20 challenging, conceptual multiple-choice questions (MCQs) for the category: "${category}".

You MUST respond ONLY with a valid JSON array of objects. Do not include markdown formatting, backticks, or any explanations outside the JSON array. The output must strictly match this TypeScript interface:

interface MCQ {
  question: string;
  options: string[]; // exactly 4 options
  correctAnswer: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string; // clear explanation of why the answer is correct
  category: '${category}';
  subcategory: string; // relevant topic name
  examType: string; // e.g. "CSS Past Paper", "KPPSC Mock", "ETEA Concept"
  importance: 'high' | 'medium' | 'low';
}
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to generate AI Quiz');
      }

      const resJson = await response.json();
      let text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No JSON output returned from Gemini');

      text = text.trim();
      if (text.startsWith('```')) {
        text = text.replace(/^```json/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('Response is not a valid JSON array');

      return parsed.map((item: any) => ({
        id: generateUUID(),
        question: item.question || 'Missing question?',
        options: Array.isArray(item.options) && item.options.length >= 2 ? item.options : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: typeof item.correctAnswer === 'number' ? item.correctAnswer : 0,
        explanation: item.explanation || 'No explanation provided.',
        category: category === 'Mixed Practice' ? 'General Knowledge' : (category as MCQ['category']),
        subcategory: item.subcategory || 'General Topic',
        examType: item.examType || `${examFocus} AI Mock`,
        isRepeated: Math.random() > 0.7,
        importance: item.importance || 'medium',
      }));
    } catch (e: any) {
      console.error('[GeminiService] Error generating quiz:', e);
      throw e;
    }
  },

  async generateConversationalQuiz(params: {
    exam: string;
    post?: string;
    subject: string;
    numQuestions: number;
    difficulty: string;
    language: string;
    weakTopics?: string[];
  }): Promise<MCQ[]> {
    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error('API Key is missing');

    const { exam, post, subject, numQuestions, difficulty, language, weakTopics } = params;

    const weakTopicsText = weakTopics && weakTopics.length > 0
      ? `The user is historically weak in the following topics/subcategories: ${weakTopics.join(', ')}. Please prioritize questions that address these topics.`
      : '';

    const prompt = `
Act as an expert curriculum designer for Pakistani competitive exams (KPPSC, FPSC, CSS, ETEA, NTS, etc.).
Generate exactly ${numQuestions} multiple-choice questions (MCQs) for the exam: "${exam}"${post ? `, targeting the "${post}" post category` : ''}.
Subject: ${subject}
Difficulty: ${difficulty}
Language: ${language} (if "Urdu" or "Both", write the question and options in both English and Urdu, e.g. "What is the capital of Pakistan? / پاکستان کا دارالحکومت کیا ہے؟")
${weakTopicsText}

You MUST respond ONLY with a valid JSON array of objects. Do not include markdown formatting, backticks, or any explanations outside the JSON array. The response must strictly be a JSON array where each object has the following fields:
- question: string (the question text)
- optionA: string (first option)
- optionB: string (second option)
- optionC: string (third option)
- optionD: string (fourth option)
- correctAnswer: string (Must be "A", "B", "C", or "D")
- explanation: string (a clear explanation of why the correct option is right)
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to call Gemini API');
      }

      const resJson = await response.json();
      let text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No JSON output returned from Gemini');

      text = text.trim();
      if (text.startsWith('```')) {
        text = text.replace(/^```json/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('Response is not a valid JSON array');

      const validated: MCQ[] = [];
      for (const item of parsed) {
        // Validate required fields
        if (
          !item.question ||
          !item.optionA ||
          !item.optionB ||
          !item.optionC ||
          !item.optionD ||
          !item.correctAnswer ||
          !item.explanation
        ) {
          continue;
        }

        // Parse correctAnswer string to index 0-3
        let correctIdx = 0;
        const ans = String(item.correctAnswer).trim().toUpperCase();
        if (ans === 'A' || ans === 'OPTIONA') correctIdx = 0;
        else if (ans === 'B' || ans === 'OPTIONB') correctIdx = 1;
        else if (ans === 'C' || ans === 'OPTIONC') correctIdx = 2;
        else if (ans === 'D' || ans === 'OPTIOND') correctIdx = 3;
        else {
          // Fallback matching values
          const opts = [item.optionA, item.optionB, item.optionC, item.optionD];
          const matched = opts.findIndex(o => String(o).trim() === ans);
          if (matched !== -1) {
            correctIdx = matched;
          }
        }

        validated.push({
          id: generateUUID(),
          question: String(item.question),
          options: [
            String(item.optionA),
            String(item.optionB),
            String(item.optionC),
            String(item.optionD),
          ],
          correctAnswer: correctIdx,
          explanation: String(item.explanation),
          category: subject === 'Mixed' ? 'General Knowledge' : (subject as MCQ['category']),
          subcategory: item.subcategory || 'AI Personalized Prep',
          examType: `${exam} AI Prep`,
          isRepeated: Math.random() > 0.8,
          importance: 'medium',
        });
      }

      if (validated.length === 0) {
        throw new Error('All generated questions failed validation check.');
      }

      return validated;
    } catch (e: any) {
      console.error('[GeminiService] generateConversationalQuiz error:', e);
      throw e;
    }
  },

  async generateDailyVocab(): Promise<Omit<VocabWord, 'id' | 'isBookmarked'>[]> {
    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error('API Key is missing');

    const prompt = `
Act as an expert lexicographer and English verbal ability examiner for Pakistani civil services and competitive exams (CSS, PMS, KPPSC, FPSC).
Generate exactly 30 challenging, high-yield vocabulary words that are highly relevant to these exams.

You MUST respond ONLY with a valid JSON array of objects. Do not include markdown formatting, backticks, or any explanations outside the JSON array. The response must strictly match this structure:
[
  {
    "word": "word string",
    "meaning": "clear and concise definition in English",
    "urduMeaning": "Urdu translation/meaning with transliteration in parenthesis, e.g. 'عملی / حقیقت پسندانہ (Amli / Haqeeqat-pasandana)'",
    "synonyms": ["synonym1", "synonym2", "synonym3", "synonym4"],
    "antonyms": ["antonym1", "antonym2", "antonym3", "antonym4"],
    "example": "A sentence demonstrating word usage in a civil service, governance, philosophy, or public administration context",
    "category": "CSS Vocab" or "KPPSC Vocab" or "General Vocabulary"
  }
]
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to call Gemini API');
      }

      const resJson = await response.json();
      let text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No JSON output returned from Gemini');

      text = text.trim();
      if (text.startsWith('```')) {
        text = text.replace(/^```json/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('Response is not a valid JSON array');

      return parsed.map((item: any) => ({
        word: item.word || 'Word',
        meaning: item.meaning || 'Meaning',
        urduMeaning: item.urduMeaning || '',
        synonyms: Array.isArray(item.synonyms) ? item.synonyms : [],
        antonyms: Array.isArray(item.antonyms) ? item.antonyms : [],
        example: item.example || '',
        category: item.category || 'AI Generated Vocab',
      }));
    } catch (e: any) {
      console.error('[GeminiService] generateDailyVocab error:', e);
      throw e;
    }
  },
};
