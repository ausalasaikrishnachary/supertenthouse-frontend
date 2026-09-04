import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarDays, ChevronRight, Package, Plus, RefreshCw, Search } from 'lucide-react';
import BASE_URL from '@/Config/Api';
import SalesmanNavbar from '@/components/SalesmanNavbar';

interface OrderItem {
  id: number;
  product_name?: string;
  name?: string;
  quantity: number;
}

interface SalesmanOrder {
  id: number;
  order_number: string;
  invoice_number?: string;
  customer_name?: string;
  event_date?: string;
  created_at?: string;
  order_date?: string;
  status: string;
  grand_total: string | number;
  items: OrderItem[];
}

type Tab = 'upcoming' | 'completed' | 'cancelled';

const tabMatches = (tab: Tab, status: string) => {
  if (tab === 'completed') return status === 'completed';
  if (tab === 'cancelled') return status === 'cancelled' || status === 'rejected';
  return status === 'pending' || status === 'approved' || status === 'processing';
};

const statusClass = (status: string) => ({
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800',
}[status] || 'bg-gray-100 text-gray-700');

export default function SalesmanOrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SalesmanOrder[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/api/salesman-orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setOrders(data.map((order: SalesmanOrder) => ({
        ...order,
        status: order.status || 'pending',
        items: Array.isArray(order.items) ? order.items : []
      })));
    } catch (requestError: unknown) {
      setError(axios.isAxiosError(requestError)
        ? requestError.response?.data?.message || 'Failed to load orders'
        : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const counts = useMemo(() => ({
    upcoming: orders.filter(order => tabMatches('upcoming', order.status)).length,
    completed: orders.filter(order => tabMatches('completed', order.status)).length,
    cancelled: orders.filter(order => tabMatches('cancelled', order.status)).length
  }), [orders]);

  const visibleOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter(order => tabMatches(activeTab, order.status)).filter(order =>
      !term || order.order_number?.toLowerCase().includes(term) || order.customer_name?.toLowerCase().includes(term)
    );
  }, [activeTab, orders, search]);

  const formatDate = (value?: string) => {
    if (!value) return 'Date not available';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Date not available' : date.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SalesmanNavbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">View and track orders assigned to you</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchOrders} className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2 hover:bg-gray-50">
              <RefreshCw size={17} /> Refresh
            </button>
            <button onClick={() => navigate('/salesman/create-order')} className="px-4 py-2 bg-[#0c2d67] text-white rounded-lg flex items-center gap-2 hover:bg-[#173f78]">
              <Plus size={17} /> Create Order
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-2 flex gap-2 mb-5 overflow-x-auto">
          {(['upcoming', 'completed', 'cancelled'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-32 px-4 py-2.5 rounded-lg capitalize font-medium ${activeTab === tab ? 'bg-[#0c2d67] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab} <span className="ml-1 text-xs opacity-80">({counts[tab]})</span>
            </button>
          ))}
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by order number or customer" className="w-full bg-white border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0c2d67]" />
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border p-12 text-center text-gray-500">Loading your orders…</div>
        ) : error ? (
          <div className="bg-white rounded-xl border p-10 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchOrders} className="px-4 py-2 bg-[#0c2d67] text-white rounded-lg">Try again</button>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
            <Package size={42} className="mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-700">No {activeTab} orders</p>
            <p className="text-sm mt-1">Assigned orders will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {visibleOrders.map(order => (
              <button key={order.id} onClick={() => navigate(`/salesman/order-details/${order.id}`)} className="bg-white rounded-xl border shadow-sm p-5 text-left hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-[#0c2d67]">#{order.order_number}</p>
                    <p className="text-xs text-blue-700">Invoice Number: {order.invoice_number || 'Pending generation'}</p>
                    <p className="text-sm text-gray-700 mt-1">{order.customer_name || 'Customer'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(order.status)}`}>{order.status}</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 mt-4 pt-4 border-t text-sm">
                  <div className="flex items-center gap-2 text-gray-600"><CalendarDays size={16} /> {formatDate(order.event_date || order.created_at || order.order_date)}</div>
                  <div className="text-gray-600">{order.items.length} item{order.items.length === 1 ? '' : 's'}</div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <strong className="text-gray-900">₹{Number(order.grand_total || 0).toLocaleString('en-IN')}</strong>
                    <ChevronRight size={19} className="text-gray-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
