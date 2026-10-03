'use server';
/**
 * @fileOverview AI Mushroom Doctor analysis flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiagnoseMushroomInputSchema = z.object({
  photoDataUri: z.string().describe("Base64 data URI of the mushroom photo."),
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
  confidence: z.number().nullable(),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

const diagnoseMushroomPrompt = ai.definePrompt({
  name: 'diagnoseMushroomPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: DiagnoseMushroomInputSchema },
  output: { schema: AnalysisResultSchema },
  config: {
    temperature: 0.4,
  },
  prompt: `You are an expert mycologist and agricultural specialist.
  Analyze the provided mushroom image.
  
  Language for response: {{language}}
  
  Requirements:
  - Assess image quality.
  - Identify possible species.
  - Predict condition/disease.
  - List visible symptoms (e.g., spots, mold, drying).
  - Suggest practical causes (environmental stress, infection).
  - Provide actionable next steps for the grower.
  
  DISCLAIMER: State clearly that this is advisory and not a definitive diagnosis.
  
  Photo: {{media url=photoDataUri}}`,
});

export async function diagnoseMushroom(input: z.infer<typeof DiagnoseMushroomInputSchema>): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  try {
    const { output } = await diagnoseMushroomPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate a diagnosis.');
    }
    return output;
  } catch (error: any) {
    console.error("Genkit Error:", error);
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error('The AI model "gemini-1.5-flash" could not be reached. Please check your API key permissions and region availability.');
    }
    throw error;
  }
}
