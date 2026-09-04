import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const app = readFileSync(resolve(__dirname, '../App.tsx'), 'utf8');
const list = readFileSync(resolve(__dirname, '../pages/salesman/SalesmanOrderList.tsx'), 'utf8');
const details = readFileSync(resolve(__dirname, '../pages/salesman/SalesmanOrderDetails.tsx'), 'utf8');
const dashboard = readFileSync(resolve(__dirname, '../pages/salesman/dashboard.tsx'), 'utf8');

describe('salesman order management', () => {
  it('registers protected list and details routes', () => {
    expect(app).toContain('path="/salesman/orders"');
    expect(app).toContain('path="/salesman/order-details/:id"');
    expect(app).toContain('<SalesmanProtectedRoute><SalesmanOrderDetails /></SalesmanProtectedRoute>');
  });

  it('loads assigned orders without accepting a salesman id from the browser', () => {
    expect(list).toContain('/api/salesman-orders`');
    expect(list).not.toContain('salesman_id=');
    expect(list).toContain('Authorization: `Bearer ${localStorage.getItem(\'token\')}`');
  });

  it('provides customer-style tabs, search and details navigation', () => {
    expect(list).toContain("'upcoming', 'completed', 'cancelled'");
    expect(list).toContain('Search by order number or customer');
    expect(list).toContain('navigate(`/salesman/order-details/${order.id}`)');
  });

  it('keeps status read-only across list and details pages', () => {
    expect(list).not.toContain('axios.put');
    expect(details).not.toContain('axios.put');
    expect(details).toContain('Order details');
    expect(details).toContain('Price summary');
  });

  it('completely omits existing-order deletion from active salesman pages', () => {
    for (const source of [list, details]) {
      expect(source).not.toContain('axios.delete');
      expect(source).not.toContain('deleteOrder');
      expect(source).not.toContain('Delete Order');
      expect(source).not.toContain('window.confirm');
      expect(source).not.toContain('<Trash2');
    }
  });

  it('opens notification order links in the details page', () => {
    expect(dashboard).toContain('navigate(`/salesman/order-details/${notification.order_id}`)');
  });
});
