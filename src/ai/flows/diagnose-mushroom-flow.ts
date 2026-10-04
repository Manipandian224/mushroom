'use server';
/**
 * @fileOverview AI Mushroom Doctor analysis flow.
 * 
 * This flow uses the Gemini 1.5 Flash model via Genkit to analyze mushroom images.
 * It provides structured output including species identification, condition diagnosis,
 * visible symptoms, possible causes, and suggested next steps.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiagnoseMushroomInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a mushroom, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.enum(['en', 'ta']).default('en'),
});

const AnalysisResultSchema = z.object({
  image_quality: z.object({
    status: z.enum(['clear', 'unclear', 'insufficient']),
    observations: z.array(z.string()),
  }),
  species: z.object({
    name: z.string().nullable(),
    identification_status: z.enum(['possible', 'unknown']),
  }),
  condition: z.object({
    name: z.string(),
    type: z.string(),
    description: z.string(),
    alternatives: z.array(z.string()),
  }),
  visible_symptoms: z.array(z.string()),
  possible_causes: z.array(z.string()),
  suggested_steps: z.array(z.string()),
  confidence: z.number().nullable().describe('Confidence score between 0 and 1, if available.'),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

const diagnoseMushroomPrompt = ai.definePrompt({
  name: 'diagnoseMushroomPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: DiagnoseMushroomInputSchema },
  output: { schema: AnalysisResultSchema },
  config: {
    temperature: 0.4,
    topP: 0.8,
    topK: 40,
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are an expert mycologist and agricultural specialist.
  Analyze the provided mushroom image carefully.
  
  Language for response: {{language}}
  
  Requirements:
  - Assess image quality for mycological analysis.
  - Identify the most likely species if possible.
  - Predict the current health condition or possible disease.
  - List specific visible symptoms (e.g., discoloration, mold growth, spots, shriveling).
  - Suggest plausible environmental or biological causes.
  - Provide prioritized, actionable next steps for the grower.
  
  DISCLAIMER: This analysis is for advisory purposes only. It is not a definitive laboratory diagnosis.
  
  Photo: {{media url=photoDataUri}}`,
});

export async function diagnoseMushroom(input: z.infer<typeof DiagnoseMushroomInputSchema>): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env.local file.');
  }

  try {
    const { output } = await diagnoseMushroomPrompt(input);
    
    if (!output) {
      throw new Error('The AI model returned an empty response. Please try with a clearer image.');
    }

    return output;
  } catch (error: any) {
    console.error("MushroomSense AI Doctor Error:", error);

    if (error.message?.includes('503') || error.message?.includes('high demand') || error.message?.includes('Service Unavailable')) {
      throw new Error(
        'The AI service is currently experiencing high demand. Please wait a few seconds and try again.'
      );
    }

    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error(
        'The Gemini model is not available for your API key or region. Please ensure your API key from Google AI Studio has the "Generative Language API" enabled.'
      );
    }

    throw new Error(
      error.message || 'An unexpected error occurred during AI analysis.'
    );
  }
}