import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization for MushroomSense AI.
 * Uses the Google AI plugin to access Gemini models.
 */
export const ai = genkit({
  plugins: [
    googleAI({
      // Ensure the API key is provided from environment variables
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});
