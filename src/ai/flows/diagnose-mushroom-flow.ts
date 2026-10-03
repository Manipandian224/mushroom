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

/**
 * Prompt definition for mushroom diagnosis.
 * Uses the stable Gemini 1.5 Flash model identifier.
 */
const diagnoseMushroomPrompt = ai.definePrompt({
  name: 'diagnoseMushroomPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: DiagnoseMushroomInputSchema },
  output: { schema: AnalysisResultSchema },
  config: {
    temperature: 0.4,
    topP: 0.8,
    topK: 40,
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

/**
 * Wrapper function to call the mushroom diagnosis flow.
 * Includes detailed error handling for API and configuration issues.
 */
export async function diagnoseMushroom(input: z.infer<typeof DiagnoseMushroomInputSchema>): Promise<AnalysisResult> {
  // 1. Verify API Key presence
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add it to your .env.local file from Google AI Studio.'
    );
  }

  try {
    // 2. Execute the prompt
    const { output } = await diagnoseMushroomPrompt(input);
    
    if (!output) {
      throw new Error('The AI model returned an empty response. Please try with a clearer image.');
    }

    return output;
  } catch (error: any) {
    console.error("MushroomSense AI Doctor Error:", error);

    // 3. Handle specific 404/Authentication errors
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error(
        'The Gemini model "gemini-1.5-flash" is not available for your API key or region. ' +
        'Please ensure your API key from Google AI Studio has the "Generative Language API" enabled.'
      );
    }

    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error('AI analysis quota exceeded. Please wait a minute before trying again.');
    }

    // 4. Fallback for generic errors
    throw new Error(
      error.message || 'An unexpected error occurred during AI analysis. Please check your connection and try again.'
    );
  }
}
