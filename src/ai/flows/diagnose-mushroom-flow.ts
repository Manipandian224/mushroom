'use server';
/**
 * @fileOverview AI Mushroom Doctor analysis flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { gemini15Flash } from '@genkit-ai/google-genai';

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
  model: gemini15Flash,
  input: { schema: DiagnoseMushroomInputSchema },
  output: { schema: AnalysisResultSchema },
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
  const { output } = await diagnoseMushroomPrompt(input);
  if (!output) {
    throw new Error('AI failed to generate a diagnosis.');
  }
  return output;
}
