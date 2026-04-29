/**
 * New Release Hub Pricing Constants
 * Prices in cents (USD)
 */

export const ARTIST_PLANS = {
  INDIE: {
    price: 0,
    royaltySplit: 75,
  },
  PRO: {
    price: 599,
    royaltySplit: 85,
  },
  STUDIO: {
    price: 999,
    royaltySplit: 95,
  }
}

export const ENTERPRISE_PLANS = {
  COLLECTIVE: {
    price: 3999,
    artists: 10,
    seats: 3,
  },
  IMPRINT: {
    price: 5999,
    artists: 20,
    seats: 10,
  },
  POWERHOUSE: {
    price: 7999,
    artists: 40,
    seats: 20,
  }
}


