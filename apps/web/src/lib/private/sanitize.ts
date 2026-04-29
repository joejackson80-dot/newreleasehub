/**
 * CONFIDENTIAL — NEW RELEASE HUB TRADE SECRET
 * Protected under the Defend Trade Secrets Act (18 U.S.C. § 1836)
 * Unauthorized use, reproduction, or reverse engineering is prohibited.
 * © 2025 New Release Hub LLC. All rights reserved.
 */

/**
 * API Response Sanitizer
 * Strips all internal algorithm fields from API responses before they
 * reach the client. Wrap every NextResponse.json() call with this.
 *
 * Usage: return NextResponse.json(sanitizeResponse(data));
 */

const BANNED_FIELDS = new Set([
  // Core Secrets
  'stripeAccountId', 'passwordHash', 'password', 'balanceCents',
  // Internal logic
  'poolATotal', 'poolCTotal', 'poolAShare', 'poolCShare',
  'poolAGross', 'poolCGross', 'multiplierRate', 'multiplierThreshold',
  // Commission / fees
  'nrhCommissionPercent', 'nrhCommissionCents', 'platformFeePercent',
  'platformFeeAmount', 'artistSharePercent', 'servicesFeePercent',
  // Discovery / ranking scores
  'discoveryScore', 'rankingScore', 'trendingScore', 'risingScore',
  'discoveryWeight', 'activityScore', 'totalPlatformStreams',
  // Tiers / Matching
  'tierScore', 'tierThreshold', 'tierCriteria',
  'matchScore', 'matchWeight', 'matchCriteria',
  // Per-stream rates
  'perStreamRateCents', 'poolARateCents', 'poolCRateCents', 'perStreamRate',
  // Thresholds / Flags
  'minStreamSeconds', 'adTriggerThreshold', 'countedAsStream',
  'rawStreamCount', 'totalPaidStreams', 'totalFreeStreams',
  // Chart System (Trade Secret)
  'nrhEquityScore', 'equityScoreDelta', 'equityScoreHistory',
  'components', 'streamMomentum', 'SUPPORTERDepth', 'fanVelocity',
  'engagementQuality', 'releaseConsist',
]);

/** Field aliases: internal name → public-safe name */
const FIELD_ALIASES: Record<string, string> = {
  netPayout: 'monthlyEarnings',
  totalEarnings: 'grossEarnings',
  SUPPORTERMultiplier: 'earningsLevel',
  poolAEarnings: 'subscriberEarnings',
  poolCEarnings: 'radioEarnings',
  paidStreams: 'premiumPlays',
  freeStreams: 'radioPlays',
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function sanitizeValue(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    return sanitizeObject(value as Record<string, JsonValue>);
  }
  return value;
}

function sanitizeObject(obj: Record<string, JsonValue>): Record<string, JsonValue> {
  const result: Record<string, JsonValue> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (BANNED_FIELDS.has(key)) continue;
    const publicKey = FIELD_ALIASES[key] ?? key;
    result[publicKey] = sanitizeValue(val);
  }
  return result;
}

export function sanitizeResponse<T>(data: T): T {
  return sanitizeValue(data as JsonValue) as T;
}

/** Legacy alias support */
export function aliasFields<T>(data: T): T {
  return sanitizeResponse(data);
}

/**
 * Safe error handler for API routes.
 * Logs the real error server-side, returns a generic message to client.
 */
export function safeError(error: unknown, context?: string): { error: string } {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[NRH API Error]${context ? ` [${context}]` : ''}: ${message}`);
  return { error: 'An unexpected error occurred. Please try again.' };
}



