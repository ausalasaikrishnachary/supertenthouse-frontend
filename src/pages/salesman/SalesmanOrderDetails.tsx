import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CalendarDays, CreditCard, MapPin, Package, Phone, UserRound, Users } from 'lucide-react';
import BASE_URL from '@/Config/Api';
import SalesmanNavbar from '@/components/SalesmanNavbar';

interface OrderItem {
  id: number;
  product_name?: string;
  name?: string;
  product_code?: string;
  image_url?: string;
  quantity: number;
  price: string | number;
  subtotal?: string | number;
}

interface SalesmanOrderDetailsData {
  id: number;
  order_number: string;
  invoice_number?: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_pincode?: string;
  address_country?: string;
  event_date?: string;
  event_time?: string;
  event_type?: string;
  venue?: string;
  guest_count?: number;
  notes?: string;
  subtotal?: string | number;
  total_amount?: string | number;
  tax_amount?: string | number;
  delivery_charge?: string | number;
  grand_total: string | number;
  created_at?: string;
  updated_at?: string;
  items: OrderItem[];
}

const statusClass = (status: string) => ({
  pending: 'bg-amber-100 text-amber-800', approved: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800', completed: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800', cancelled: 'bg-red-100 text-red-800'
}[status] || 'bg-gray-100 text-gray-700');

const money = (value?: string | number) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const dateTime = (value?: string) => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toLocaleString('en-IN') : 'Not available';

export default function SalesmanOrderDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const source = params.get('source') || 'salesman';
  const navigate = useNavigate();
  const [order, setOrder] = useState<SalesmanOrderDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || !['admin', 'salesman'].includes(source)) {
        setError('Invalid order');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(source === 'admin' ? `${BASE_URL}/api/salesman/notifications/admin-orders/${id}` : `${BASE_URL}/api/salesman-orders/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrder({ ...response.data.data, items: Array.isArray(response.data.data?.items) ? response.data.data.items : [] });
      } catch (requestError: unknown) {
        if (axios.isAxiosError(requestError) && requestError.response?.status === 404) setError('Order not found or not assigned to you');
        else setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || 'Failed to load order' : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, source]);

  if (loading) return <div className="min-h-screen bg-gray-50"><SalesmanNavbar /><div className="max-w-5xl mx-auto p-8"><div className="bg-white rounded-xl border p-12 text-center text-gray-500">Loading order details…</div></div></div>;
  if (error || !order) return <div className="min-h-screen bg-gray-50"><SalesmanNavbar /><div className="max-w-5xl mx-auto p-8 text-center"><div className="bg-white rounded-xl border p-12"><Package className="mx-auto text-gray-300 mb-3" size={42} /><p className="text-gray-800 font-semibold">{error || 'Order not found'}</p><button onClick={() => navigate('/salesman/orders')} className="mt-5 px-4 py-2 bg-[#0c2d67] text-white rounded-lg">Back to orders</button></div></div></div>;

  const address = [order.address_line1, order.address_line2, order.address_city, order.address_state, order.address_pincode, order.address_country].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-gray-50">
      <SalesmanNavbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate('/salesman/orders')} className="flex items-center gap-2 text-[#0c2d67] font-medium mb-5 hover:underline"><ArrowLeft size={18} /> Back to orders</button>
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><p className="text-sm text-gray-500">Order details</p><h1 className="text-2xl font-bold text-gray-900">#{order.order_number}</h1><p className="text-sm text-blue-700">Invoice Number: {order.invoice_number || 'Pending generation'}</p><p className="text-xs text-gray-400 mt-1">Created {dateTime(order.created_at)}</p></div>
          <span className={`self-start px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusClass(order.status)}`}>{order.status || 'pending'}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <section className="bg-white rounded-xl border p-6"><h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><UserRound size={19} /> Customer</h2><div className="space-y-2 text-sm text-gray-600"><p className="font-medium text-gray-900">{order.customer_name || 'Not available'}</p><p>{order.customer_email || 'Email not available'}</p><p className="flex items-center gap-2"><Phone size={15} /> {order.customer_phone || 'Phone not available'}</p></div></section>
          <section className="bg-white rounded-xl border p-6"><h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><CalendarDays size={19} /> Event</h2><div className="space-y-2 text-sm text-gray-600"><p><strong>Type:</strong> {order.event_type || 'Not specified'}</p><p><strong>Date:</strong> {dateTime(order.event_date)}</p><p><strong>Time:</strong> {order.event_time || 'Not specified'}</p><p><strong>Venue:</strong> {order.venue || 'Not specified'}</p>{order.guest_count != null && <p className="flex items-center gap-2"><Users size={15} /> {order.guest_count} guests</p>}</div></section>
        </div>

        <section className="bg-white rounded-xl border p-6 mb-5"><h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3"><MapPin size={19} /> Address</h2><p className="text-sm text-gray-600">{address || order.venue || 'Address not available'}</p></section>

        <section className="bg-white rounded-xl border overflow-hidden mb-5"><div className="px-6 py-4 border-b"><h2 className="font-semibold text-gray-900 flex items-center gap-2"><Package size={19} /> Order items</h2></div>{order.items.length === 0 ? <p className="p-6 text-sm text-gray-500">No items available.</p> : <div className="divide-y">{order.items.map(item => <div key={item.id} className="p-5 flex items-center justify-between gap-4"><div><p className="font-medium text-gray-900">{item.product_name || item.name || 'Item'}</p><p className="text-xs text-gray-500 mt-1">{item.product_code || ''} · Quantity {item.quantity}</p></div><div className="text-right"><p className="font-semibold">{money(item.subtotal ?? Number(item.price) * item.quantity)}</p><p className="text-xs text-gray-500">{money(item.price)} each</p></div></div>)}</div>}</section>

        <div className="grid md:grid-cols-2 gap-5">
          <section className="bg-white rounded-xl border p-6"><h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><CreditCard size={19} /> Payment</h2><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Method</span><span className="capitalize">{order.payment_method || 'Not specified'}</span></div><div className="flex justify-between"><span className="text-gray-500">Status</span><span className="capitalize font-medium">{order.payment_status || 'pending'}</span></div></div></section>
          <section className="bg-white rounded-xl border p-6"><h2 className="font-semibold text-gray-900 mb-4">Price summary</h2><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{money(order.subtotal ?? order.total_amount)}</span></div><div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{money(order.tax_amount)}</span></div>{Number(order.delivery_charge || 0) > 0 && <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{money(order.delivery_charge)}</span></div>}<div className="flex justify-between border-t pt-3 mt-3 text-base font-bold"><span>Total</span><span>{money(order.grand_total)}</span></div></div></section>
        </div>

        {order.notes && <section className="bg-white rounded-xl border p-6 mt-5"><h2 className="font-semibold text-gray-900 mb-2">Notes</h2><p className="text-sm text-gray-600 whitespace-pre-wrap">{order.notes}</p></section>}
        <p className="text-xs text-gray-400 text-right mt-4">Last updated: {dateTime(order.updated_at)}</p>
      </main>
    </div>
  );
}
