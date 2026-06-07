import { GoogleGenAI } from '@google/genai';

let aiClientInstance = null;

function getApiKey() {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.VITE_API_KEY;
  if (!key || key === "AIzaSyAYtZocTPfSdCQ8T3brgMwV7YVIAQd_Eck") {
    return null;
  }
  return key;
}

function getAiClient() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Google Gemini API Key is required but was not found in environment');
  }
  if (!aiClientInstance) {
    aiClientInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClientInstance;
}

export default async function handler(req, res) {
  // CORS Headers for serverless compatibility
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  try {
    let { contents, systemInstruction } = req.body || {};

    // Fallback parsing for different body payloads if needed
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        contents = parsed.contents;
        systemInstruction = parsed.systemInstruction;
      } catch (err) {
        // use default
      }
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(200).json({ 
        text: "I am ready and online to assist you! However, the **GEMINI_API_KEY** secret has not been configured in your environment variables yet.\n\nPlease configure it in your Vercel or environment variables dashboard (as `GEMINI_API_KEY`). After that, I will be fully functional to answer questions and analyze your school data!"
      });
    }

    const client = getAiClient();
    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.status(200).json({ text: response.text });
  } catch (err) {
    console.error('[api/ai/chat.js] Error:', err);
    return res.status(500).json({ detail: err.message || 'Error processing AI chat' });
  }
}
