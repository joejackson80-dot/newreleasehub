/**
 * ============================================================
 * CONFIDENTIAL — NEW RELEASE HUB TRADE SECRET
 * ============================================================
 * This file contains proprietary algorithms and business logic
 * that are trade secrets of New Release Hub LLC.
 * Protected under the Defend Trade Secrets Act (18 U.S.C. § 1836).
 * UNAUTHORIZED DISCLOSURE, REPRODUCTION, OR USE IS PROHIBITED.
 * Access is restricted to authorized personnel with signed NDAs.
 * © 2025 New Release Hub LLC. All rights reserved.
 * ============================================================
 */

/**
 * CONFIDENTIAL — NRH TRADE SECRET
 * Loaded from environment variables. Never hardcode values.
 */

export const POOL_A_ARTIST_SHARE  = Number(process.env.POOL_A_ARTIST_SHARE  ?? '0.70')
export const POOL_C_ARTIST_SHARE  = Number(process.env.POOL_C_ARTIST_SHARE  ?? '0.60')
export const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT ?? '0.12')
export const SERVICES_FEE_PERCENT = Number(process.env.SERVICES_FEE_PERCENT ?? '0.15')
export const MIN_STREAM_SECONDS   = Number(process.env.MIN_STREAM_SECONDS   ?? '30')

export const PATRON_MULTIPLIER_TIERS = [
  { minPatrons: Number(process.env.MULT_TIER_4_MIN ?? '2000'), multiplier: Number(process.env.MULT_TIER_4_VAL ?? '1.5') },
  { minPatrons: Number(process.env.MULT_TIER_3_MIN ?? '500'),  multiplier: Number(process.env.MULT_TIER_3_VAL ?? '1.2') },
  { minPatrons: Number(process.env.MULT_TIER_2_MIN ?? '100'),  multiplier: Number(process.env.MULT_TIER_2_VAL ?? '1.1') },
  { minPatrons: 0, multiplier: 1.0 },
] as const

export const DISCOVERY_WEIGHTS = {
  patronGrowth7Day:  Number(process.env.DISC_W_PATRON_GROWTH ?? '0.35'),
  totalStreams:      Number(process.env.DISC_W_TOTAL_STREAMS ?? '0.25'),
  recentActivity:    Number(process.env.DISC_W_ACTIVITY      ?? '0.20'),
  patronCount:       Number(process.env.DISC_W_PATRON_COUNT  ?? '0.15'),
  profileComplete:   Number(process.env.DISC_W_PROFILE       ?? '0.05'),
} as const
