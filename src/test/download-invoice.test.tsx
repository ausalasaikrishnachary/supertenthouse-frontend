import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import axios from 'axios';
import DownloadInvoice, { canDownloadInvoice, invoicePayload } from '../components/DownloadInvoice';
vi.mock('axios', () => ({ default: { post: vi.fn() } }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const order = { id: 25, _source: 'admin', status: 'completed', invoice_number: 'INV-2026-000123', customer_name: 'Test Customer', total_amount: '100', tax_amount: '18', grand_total: '118', payment_method: 'cash', items: [{ product_name: 'Tent', price: '100', quantity: 1, subtotal: '100' }] };
it('maps Admin customer details, totals, items and source for the PDF template', () => {
  expect(invoicePayload(order)).toMatchObject({ orderId: 25, orderSource: 'admin', customerName: 'Test Customer', subtotal: 100, gst: 18, grandTotal: 118, paymentMethod: 'cash', items: [{ name: 'Tent', price: 100, quantity: 1, total: 100 }] });
});
it('hides download for blank or missing invoice numbers', () => {
  const view = render(<DownloadInvoice order={{ ...order, invoice_number: '  ' }} />);
  expect(view.container).toBeEmptyDOMElement();
});
it('hides download for every non-completed order status', () => {
  for (const status of ['pending', 'approved', 'processing', 'rejected', 'cancelled']) {
    const view = render(<DownloadInvoice order={{ ...order, status }} />);
    expect(view.container).toBeEmptyDOMElement();
    cleanup();
  }
  expect(axios.post).not.toHaveBeenCalled();
});
it('requires both completed status and a generated invoice', () => {
  expect(canDownloadInvoice(order)).toBe(true);
  expect(canDownloadInvoice({ ...order, status: 'COMPLETED' })).toBe(true);
  expect(canDownloadInvoice({ ...order, status: 'approved' })).toBe(false);
  expect(canDownloadInvoice({ ...order, invoice_number: '' })).toBe(false);
});
it('downloads a PDF for a completed order with an invoice number', async () => {
  vi.mocked(axios.post).mockResolvedValue({ data: new Blob(['%PDF-1.4'], { type: 'application/pdf' }) });
  URL.createObjectURL = vi.fn(() => 'blob:invoice'); URL.revokeObjectURL = vi.fn();
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<DownloadInvoice order={{ ...order, status: ' Completed ' }} />);
  fireEvent.click(screen.getByRole('button', { name: 'Download Invoice' }));
  await waitFor(() => expect(click).toHaveBeenCalledOnce());
  expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/invoice/generate-pdf'), { orderData: invoicePayload({ ...order, status: ' Completed ' }) }, expect.objectContaining({ responseType: 'blob' }));
});
it('shows a retryable error instead of downloading a non-PDF response', async () => {
  vi.mocked(axios.post).mockResolvedValue({ data: new Blob(['error'], { type: 'application/json' }) });
  render(<DownloadInvoice order={order} />);
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByRole('alert')).toHaveTextContent('download failed');
  expect(screen.getByRole('button')).not.toBeDisabled();
});
