/**
 * CONFIDENTIAL — NEW RELEASE HUB TRADE SECRET
 * Protected under the Defend Trade Secrets Act (18 U.S.C. § 1836)
 * Unauthorized use, reproduction, or reverse engineering is prohibited.
 * © 2025 New Release Hub LLC. All rights reserved.
 *
 * This file intentionally contains no formula constants.
 * All rate values are loaded from Vercel environment variables at runtime.
 * Do NOT hardcode any percentages, multipliers, or thresholds here.
 */

export function getEnvOrThrow(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
}

export function getEnvFloat(key: string, fallback = 0): number {
  const val = process.env[key];
  if (!val) return fallback;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
}

export function getEnvInt(key: string, fallback = 0): number {
  const val = process.env[key];
  if (!val) return fallback;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? fallback : parsed;
}


