'use server';
/**
 * @fileOverview AI Mushroom Doctor analysis flow.
 * 
 * Uses Gemini 1.5 Flash via Genkit to provide multimodal analysis of mushroom images.
 * Includes species identification, condition diagnosis, and actionable cultivation advice.
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
  confidence: z.number().nullable().describe('Confidence score between 0 and 1.'),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

const diagnoseMushroomPrompt = ai.definePrompt({
  name: 'diagnoseMushroomPrompt',
  model: 'googleai/gemini-3.8-flash',
  input: { schema: DiagnoseMushroomInputSchema },
  output: { schema: AnalysisResultSchema },
  config: {
    temperature: 0.4,
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are an expert mycologist. Analyze this mushroom image for the purpose of cultivation monitoring.
  
  Language for response: {{language}}
  
  Requirements:
  - Identify the species if possible.
  - Diagnose the health condition (e.g., contamination, pinning, maturity).
  - List visible symptoms and potential environmental causes.
  - Provide prioritized, actionable next steps for the grower.
  
  DISCLAIMER: This analysis is for advisory purposes only. Not a safety guarantee for consumption.
  
  Photo: {{media url=photoDataUri}}`,
});

export async function diagnoseMushroom(input: z.infer<typeof DiagnoseMushroomInputSchema>): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in .env.local.');
  }

  try {
    const { output } = await diagnoseMushroomPrompt(input);
    
    if (!output) {
      throw new Error('The AI model returned an empty response. Please try again with a clearer photo.');
    }

    return output;
  } catch (error: any) {
    console.error("AI Analysis Error:", error);

    if (error.message?.includes('503') || error.message?.includes('high demand')) {
      throw new Error('The AI service is temporarily busy. Please wait a moment and try again.');
    }

    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error(
        'The Gemini model identifier is unreachable. Please check your API key permissions in Google AI Studio.'
      );
    }

    throw new Error(error.message || 'An unexpected error occurred during analysis.');
  }
}
