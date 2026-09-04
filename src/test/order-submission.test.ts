import { expect, it } from 'vitest';
import { orderSubmissionError } from '../lib/orderSubmission';
it('shows backend validation errors instead of hiding their cause', () => {
  expect(orderSubmissionError({ response: { data: { error: 'Customer ID is required' } } })).toBe('Customer ID is required');
  expect(orderSubmissionError({ response: { data: { message: 'Insufficient stock' } } })).toBe('Insufficient stock');
});
it('warns against blind retries when the response is lost', () => {
  expect(orderSubmissionError(new Error('Network error'))).toContain('Orders list before retrying');
});
