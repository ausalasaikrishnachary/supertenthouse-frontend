import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/Config/Api';

type InvoiceOrder = { invoice_number?: string | null; [key: string]: any };
export const hasInvoice = (order: InvoiceOrder) => Boolean(order.invoice_number?.trim());
const number = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;

export function invoicePayload(order: InvoiceOrder) {
  return {
    orderId: order.id, orderSource: order._source || 'customer',
    orderNumber: order.order_number, invoiceNumber: order.invoice_number,
    customerName: order.customer_name, customerEmail: order.customer_email, customerPhone: order.customer_phone,
    orderDate: order.order_date || order.created_at, eventDate: order.event_date,
    eventTime: order.event_time, eventType: order.event_type, venue: order.venue,
    guestCount: number(order.guest_count), specialInstructions: order.special_instructions,
    subtotal: number(order.subtotal ?? order.total_amount ?? order.total),
    gst: number(order.gst ?? order.tax_amount ?? order.tax), grandTotal: number(order.grand_total),
    deliveryCharge: number(order.delivery_charge), couponDiscount: number(order.coupon_discount ?? order.discount_amount),
    couponCode: order.coupon_code, paymentMethod: order.payment_method, paymentStatus: order.payment_status,
    address: { fullName: order.address_full_name || order.customer_name,
      line1: order.address_line1, line2: order.address_line2, city: order.address_city || order.city,
      state: order.address_state || order.state, pincode: order.address_pincode || order.pincode, country: order.address_country || order.country },
    items: (Array.isArray(order.items) ? order.items : []).map(item => ({
      name: item.name || item.product_name, quantity: number(item.quantity), price: number(item.price),
      total: number(item.total ?? item.subtotal ?? number(item.price) * number(item.quantity)),
    })),
  };
}

export default function DownloadInvoice({ order }: { order: InvoiceOrder }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!hasInvoice(order)) return null;
  const download = async () => {
    setBusy(true); setError('');
    let url: string | undefined;
    try {
      const response = await axios.post(`${BASE_URL}/api/invoice/generate-pdf`, { orderData: invoicePayload(order) }, {
        responseType: 'blob', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!(response.data instanceof Blob) || !response.data.type.includes('application/pdf')) throw new Error('Invalid PDF response');
      url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${order.invoice_number!.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      document.body.appendChild(link); link.click(); link.remove();
    } catch {
      setError('Invoice download failed. Please try again.');
    } finally {
      if (url) { const downloadedUrl = url; window.setTimeout(() => URL.revokeObjectURL(downloadedUrl), 1000); }
      setBusy(false);
    }
  };
  return <span><button type="button" disabled={busy} onClick={download} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-50">{busy ? 'Downloading…' : 'Download Invoice'}</button>{error && <span role="alert" className="block text-xs text-red-600 mt-1">{error}</span>}</span>;
}
