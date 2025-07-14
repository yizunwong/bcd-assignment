export function logEvent(event: string, data?: any) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics] ${event}`, data ?? '');
  }
}
