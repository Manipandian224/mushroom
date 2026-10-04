/**
 * @fileOverview Centralized AI Configuration for Groq Cloud Integration.
 * 
 * Model selection is configured here to avoid hardcoding across the codebase.
 * Official Groq Vision Docs: https://console.groq.com/docs/vision
 */

export const GROQ_CONFIG = {
  /**
   * Primary vision-capable model supported by Groq Cloud.
   * `qwen/qwen3.8-27b` is the active vision model on Groq.
   */
  PRIMARY_VISION_MODEL: process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b',

  /**
   * Fallback vision model if configured in environment variables.
   */
  FALLBACK_MODELS: process.env.GROQ_FALLBACK_VISION_MODEL 
    ? [process.env.GROQ_FALLBACK_VISION_MODEL]
    : [],

  /**
   * Maximum image file size allowed (10 MB).
   */
  MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024,

  /**
   * Request timeout in milliseconds (30 seconds).
   */
  TIMEOUT_MS: 30000,
};
