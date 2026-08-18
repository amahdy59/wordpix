import { z } from "zod";

/**
 * Shared validation schemas for the WordPix application.
 * Use these with react-hook-form via @hookform/resolvers/zod
 * and for validating API responses.
 */

// Example: User profile settings schema
export const userSettingsSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
  preferredMode: z.enum(["child", "adult"]),
  accessibility: z
    .object({
      reduceMotion: z.boolean().default(false),
      highContrast: z.boolean().default(false),
    })
    .optional(),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;

// Example: API response schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;
