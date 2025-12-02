/**
 * Input Validation Utilities
 * 
 * Centralized validation for user inputs to prevent:
 * - XSS attacks
 * - SQL injection
 * - Invalid data processing
 * - Email spam/abuse
 */

import { z } from 'zod';

// =============================================================================
// EMAIL VALIDATION
// =============================================================================

/**
 * Robust email validation using Zod
 * More strict than simple regex
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(254, 'Email too long')
  .transform((email) => email.toLowerCase().trim());

/**
 * Validate and normalize email
 */
export function validateEmail(email: string): { 
  valid: boolean; 
  email?: string; 
  error?: string 
} {
  try {
    const validated = emailSchema.parse(email);
    return { valid: true, email: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message || 'Invalid email' };
    }
    return { valid: false, error: 'Invalid email' };
  }
}

// =============================================================================
// TEXT INPUT VALIDATION
// =============================================================================

/**
 * Sanitize text input - removes potential XSS vectors
 */
export function sanitizeText(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script-related content
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ');
}

/**
 * Feedback message schema
 */
export const feedbackSchema = z.object({
  type: z.enum(['love', 'idea', 'issue', 'general']),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message too long')
    .transform(sanitizeText),
  rating: z.number().int().min(1).max(5).optional(),
  pageContext: z.string().max(100).optional(),
  email: emailSchema.optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

// =============================================================================
// NEWSLETTER SUBSCRIPTION
// =============================================================================

export const subscribeSchema = z.object({
  email: emailSchema,
  firstName: z
    .string()
    .max(50)
    .optional()
    .transform((val) => val ? sanitizeText(val, 50) : undefined),
  source: z
    .string()
    .max(50)
    .optional()
    .default('website'),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;

// =============================================================================
// WAITLIST
// =============================================================================

export const VALID_FEATURES = [
  'risk-quiz',
  'portfolio-builder',
  'risk-roulette',
  'fo-certification',
  'ai-mentor',
  'premium-missions',
  'discord-community',
  'mobile-app',
] as const;

export const waitlistSchema = z.object({
  email: emailSchema,
  feature: z.enum(VALID_FEATURES),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

// =============================================================================
// API KEY / AUTH VALIDATION
// =============================================================================

/**
 * Validate API key format (basic check)
 */
export function isValidApiKey(key: string | null | undefined): boolean {
  if (!key || typeof key !== 'string') return false;
  // Minimum length and no whitespace
  return key.length >= 16 && !/\s/.test(key);
}

/**
 * Safe comparison to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// =============================================================================
// TRADING / FINANCIAL INPUTS
// =============================================================================

export const ALLOWED_TICKERS = [
  'apple',
  'microsoft',
  'nvidia',
  'tesla',
  'sp500',
  'etf',
  'bitcoin',
  'ethereum',
] as const;

export type AllowedTicker = typeof ALLOWED_TICKERS[number];

/**
 * Validate ticker symbol
 */
export function isValidTicker(ticker: string): ticker is AllowedTicker {
  return ALLOWED_TICKERS.includes(ticker.toLowerCase() as AllowedTicker);
}

/**
 * Filter array to only valid tickers
 */
export function filterValidTickers(tickers: string[]): AllowedTicker[] {
  return tickers
    .map((t) => t.toLowerCase())
    .filter(isValidTicker) as AllowedTicker[];
}

/**
 * Trade amount schema
 */
export const tradeSchema = z.object({
  ticker: z.string().refine(isValidTicker, 'Invalid ticker'),
  amount: z.number().positive('Amount must be positive').max(1000000, 'Amount too large'),
  type: z.enum(['buy', 'sell']),
});

export type TradeInput = z.infer<typeof tradeSchema>;

// =============================================================================
// HELPER: VALIDATE WITH RESPONSE
// =============================================================================

/**
 * Generic validation helper that returns a standardized response
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.errors.map(
    (err) => `${err.path.join('.')}: ${err.message}`
  );
  
  return { success: false, errors };
}

export default {
  validateEmail,
  sanitizeText,
  isValidApiKey,
  secureCompare,
  isValidTicker,
  filterValidTickers,
  validate,
  schemas: {
    email: emailSchema,
    feedback: feedbackSchema,
    subscribe: subscribeSchema,
    waitlist: waitlistSchema,
    trade: tradeSchema,
  },
};


