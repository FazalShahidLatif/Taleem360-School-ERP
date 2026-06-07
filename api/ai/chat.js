import { GoogleGenAI } from '@google/genai';

let aiClientInstance = null;

function getAiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  if (!aiClientInstance) {
    aiClientInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({ 
        text: "I am ready and online to assist you! However, the **GEMINI_API_KEY** secret has not been configured in your environment variables yet.\n\nPlease configure it in your environment variables. After that, I will be fully functional to answer questions and analyze your school data!"
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
