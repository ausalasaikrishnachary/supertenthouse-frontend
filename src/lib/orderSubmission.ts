export function orderSubmissionError(error: unknown): string {
  const failure = error as { response?: { status?: number; data?: { message?: string; error?: string } } };
  const body = failure?.response?.data;
  if (typeof body?.message === 'string' && body.message.trim()) return body.message;
  if (typeof body?.error === 'string' && body.error.trim()) return body.error;
  if (!failure?.response) return 'Could not confirm the order. Check your connection and Orders list before retrying to avoid duplicates.';
  return `Failed to place order (HTTP ${failure.response.status || 'unknown'}). Please try again.`;
}
