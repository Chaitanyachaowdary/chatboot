// gemini-chatbot/api/gemini-chat.js

// IMPORTANT: Make sure you've installed this: npm install @google/generative-ai
import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key as an environment variable.
// NEVER hardcode your API key directly in this file in production code.
// For local development: create a .env file in your project root: GEMINI_API_KEY=YOUR_KEY_HERE
// For deployment (Vercel/Netlify): Set this in your project's environment variables settings.
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  // Return a 500 error if API key is missing (only relevant during runtime)
  // This will only log during local vercel/netlify dev, or in serverless logs upon deployment.
  console.error('GEMINI_API_KEY environment variable is not set. Please configure it.');
  // For a deployed function, you might want to throw an error for cold start issues
  // throw new Error('Server configured incorrectly: Missing API Key.');
}

// Initialize the Generative AI model
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-pro' }) : null;

export default async function handler(req, res) {
  // Only allow POST requests for this API endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Check if API_KEY was successfully loaded
  if (!model) {
    return res.status(500).json({ error: 'Server is not configured with Gemini API key.' });
  }

  // Parse the request body to get the user's message
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required in the request body.' });
  }

  try {
    // Generate content using the Gemini model
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text(); // Extract the plain text content from the AI's response

    // Send the AI's response back to the frontend
    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    // Provide a more generic error message to the client for security/simplicity
    res.status(500).json({ error: 'Failed to get response from AI. Please check server logs for details.' });
  }
}