'use server';
/**
 * @fileOverview AI Mushroom Doctor analysis flow powered by Groq Cloud AI.
 * 
 * Uses verified Groq vision models to provide instant multimodal analysis of mushroom images.
 * Includes species identification, health condition diagnosis, visible symptoms, causes, and actionable solutions.
 */

import Groq from 'groq-sdk';
import { z } from 'zod';
import { GROQ_CONFIG } from '@/ai/config';

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
    status: z.string().default('clear'),
    observations: z.array(z.string()).default([]),
  }),
  species: z.object({
    name: z.string().nullable().catch(null),
    identification_status: z.string().default('unknown'),
  }),
  condition: z.object({
    name: z.string().default('Unspecified Condition'),
    type: z.string().default('Environmental'),
    description: z.string().default('Analysis complete.'),
    alternatives: z.array(z.string()).default([]),
  }),
  visible_symptoms: z.array(z.string()).default([]),
  possible_causes: z.array(z.string()).default([]),
  suggested_steps: z.array(z.string()).default([]),
  confidence: z.number().nullable().catch(null),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export async function diagnoseMushroom(input: z.infer<typeof DiagnoseMushroomInputSchema>): Promise<AnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in server environment settings.');
  }

  // 1. Validate Image Input Format & Size
  const dataUriRegex = /^data:(image\/(png|jpeg|jpg|webp|gif));base64,(.+)$/i;
  const match = input.photoDataUri.match(dataUriRegex);

  if (!match) {
    throw new Error('Unsupported image format. Please upload a clear JPG, PNG, or WebP photo of your mushroom.');
  }

  const base64Data = match[3];
  const approximateSizeBytes = (base64Data.length * 3) / 4;
  if (approximateSizeBytes > GROQ_CONFIG.MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Uploaded image exceeds the 10 MB limit. Please select a smaller photo.');
  }

  const groq = new Groq({ apiKey, timeout: GROQ_CONFIG.TIMEOUT_MS });

  const systemPrompt = `You are an expert mycologist and plant disease diagnostic system.
Analyze the provided mushroom image and output ONLY a valid JSON object matching this exact schema:

{
  "image_quality": {
    "status": "clear",
    "observations": ["observation 1"]
  },
  "species": {
    "name": "Species Name (e.g. Oyster Mushroom, Button Mushroom) or null",
    "identification_status": "possible"
  },
  "condition": {
    "name": "Condition Name (e.g. Bacterial Blotch, Trichoderma Green Mold, Over-hydration, Healthy Fruiting)",
    "type": "Pathogen / Environmental / Healthy",
    "description": "Detailed clear explanation of the diagnosed problem or condition",
    "alternatives": ["Alternative diagnosis if any"]
  },
  "visible_symptoms": ["Symptom 1", "Symptom 2"],
  "possible_causes": ["Cause 1", "Cause 2"],
  "suggested_steps": [
    "Step 1: Specific actionable solution",
    "Step 2: Environmental control change",
    "Step 3: Prevention step"
  ],
  "confidence": 0.92
}

Strict requirements:
1. Output MUST be strictly valid JSON without any markdown formatting wrappers or extra text.
2. If the photo is unclear, fuzzy, or not a mushroom crop, set image_quality status to "unclear" or "insufficient" and do NOT invent a false disease diagnosis.
3. Provide clear, highly practical, step-by-step solutions in suggested_steps.`;

  const modelList = [GROQ_CONFIG.PRIMARY_VISION_MODEL, ...GROQ_CONFIG.FALLBACK_MODELS];
  let lastError: any = null;

  for (const modelId of modelList) {
    try {
      console.log(`Diagnosing mushroom image with Groq vision model: ${modelId}...`);

      const completion = await groq.chat.completions.create({
        model: modelId,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: systemPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: input.photoDataUri,
                },
              },
            ],
          },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const rawContent = completion.choices[0]?.message?.content?.trim();
      if (!rawContent) {
        throw new Error('The AI model returned an empty response. Please try again with a clearer photo.');
      }

      // Clean markdown wrappers if present
      const cleanedJson = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsedJson = JSON.parse(cleanedJson);
      const validatedResult = AnalysisResultSchema.parse(parsedJson);

      return validatedResult;
    } catch (error: any) {
      lastError = error;
      console.error(`Groq AI Error with model ${modelId}:`, error?.message || error);

      // Handle specific error conditions
      const errorMsg = error?.message || '';
      const status = error?.status || error?.statusCode;

      if (status === 401 || errorMsg.includes('invalid_api_key') || errorMsg.includes('Unauthorized')) {
        throw new Error('Groq API authentication failed. Please check your GROQ_API_KEY environment variable.');
      }

      if (status === 429 || errorMsg.includes('rate_limit_exceeded') || errorMsg.includes('Quota')) {
        throw new Error('Groq AI rate limit reached. Please wait a moment before trying again.');
      }

      if (errorMsg.includes('model_decommissioned') || errorMsg.includes('model_not_found') || status === 404) {
        console.warn(`Model ${modelId} is decommissioned or unavailable. Trying fallback model if available...`);
        continue;
      }
    }
  }

  // Handle fallback exhaustion
  const finalMessage = lastError?.message || '';
  if (finalMessage.includes('model_decommissioned') || finalMessage.includes('model_not_found')) {
    throw new Error('The configured Groq vision model is decommissioned or unavailable. Please check model configuration.');
  }

  throw new Error(lastError?.message || 'An unexpected error occurred while analyzing the mushroom image.');
}
