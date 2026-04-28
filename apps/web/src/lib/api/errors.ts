export function safeError(error: unknown, statusCode: number = 500) {
  console.error('[NRH Internal Error]', error)
  
  const publicMessages: Record<number, string> = {
    400: 'Invalid request.',
    401: 'Authentication required.',
    403: 'Access denied.',
    404: 'Not found.',
    409: 'Conflict with existing data.',
    429: 'Too many requests.',
    500: 'Something went wrong. Please try again.',
  }
  
  return { error: publicMessages[statusCode] ?? 'An error occurred.', code: statusCode }
}
