import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/Config/Api';
import {
  Trash2, Printer, User, Package, ShoppingBag,
  Eye, X, CreditCard, Calendar, RefreshCw, UserCheck, ChevronDown,
  MapPin, Home, MessageSquare, Tag
} from 'lucide-react';
import SalesmanNavbar from '@/components/SalesmanNavbar';

// ============================================================
// TYPES
// ============================================================

type OrderSource = 'customer' | 'admin' | 'salesman';
type FilterType = OrderSource | 'all';

interface OrderItem {
  id?: string | number;
  productId?: string | number;
  product_id?: number;
  name?: string;
  product_name?: string;
  price: string | number;
  quantity: number;
  image?: string;
  image_url?: string;
  product_code?: string;
  subtotal?: string | number;
}

// Customer interface with address
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  avatar?: string;
}

// Unified order shape with address fields
interface UnifiedOrder {
  id: number;
  customer_id: number;
  order_number: string;
  items: OrderItem[];
  status: string;
  order_status?: string;
  payment_status: string;
  payment_method: string;
  notes?: string | null;
  created_at: string;
  order_date?: string;
  event_date?: string | null;
  event_type?: string;
  event_time?: string;
  venue?: string;
  guest_count?: number;
  special_instructions?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  grand_total: string | number;
  total_amount?: string | number;
  subtotal?: string | number;
  tax_amount?: string | number;
  tax?: string | number;
  gst?: string | number;
  delivery_charge?: string | number;
  coupon_code?: string | null;
  coupon_discount?: string | number;
  salesman_id?: number;
  salesman_name?: string;
  order_by?: string;
  address_id?: number;
  address_label?: string;
  address_full_name?: string;
  address_phone?: string;
  // These will be populated from customer data
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_pincode?: string;
  address_country?: string;
  _source: OrderSource;
  [key: string]: any;
}

// ============================================================
// HELPERS (module-level)
// ============================================================

const normalizeItems = (rawItems: unknown): OrderItem[] => {
  if (Array.isArray(rawItems)) return rawItems;
  if (typeof rawItems === 'string') {
    try {
      const parsed = JSON.parse(rawItems);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeList = (rawList: unknown, source: OrderSource): UnifiedOrder[] => {
  const list = Array.isArray(rawList) ? rawList : [];
  return list.map((o: any) => ({
    ...o,
    items: normalizeItems(o?.items),
    _source: source,
  }));
};

const SOURCE_META: Record<OrderSource, { label: string; endpoint: string; badge: string }> = {
  customer: { label: 'Customer', endpoint: 'customer-orders', badge: 'bg-blue-100 text-blue-800' },
  admin: { label: 'Admin', endpoint: 'orders', badge: 'bg-purple-100 text-purple-800' },
  salesman: { label: 'Salesman', endpoint: 'salesman-orders', badge: 'bg-emerald-100 text-emerald-800' },
};

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled'];

// ============================================================
// COMPONENT
// ============================================================

const SalesmanOrders: React.FC = () => {
  const [filterType, setFilterType] = useState<FilterType>('salesman');
  const [customerOrders, setCustomerOrders] = useState<UnifiedOrder[]>([]);
  const [adminOrders, setAdminOrders] = useState<UnifiedOrder[]>([]);
  const [salesmanOrders, setSalesmanOrders] = useState<UnifiedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [salesmanId, setSalesmanId] = useState<number | null>(null);

  // Cache for customer data to avoid repeated API calls
  const [customerCache, setCustomerCache] = useState<Map<number, Customer>>(new Map());

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
      setSalesmanId(user.id);
    }
  }, []);

  // Fetch all orders on initial load when salesmanId is available
  useEffect(() => {
    if (salesmanId) {
      fetchAllOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesmanId]);

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch customer details by ID
  const fetchCustomerDetails = async (customerId: number): Promise<Customer | null> => {
    // Check cache first
    if (customerCache.has(customerId)) {
      return customerCache.get(customerId) || null;
    }

    try {
      const headers = authHeaders();
      const response = await axios.get(`${BASE_URL}/api/customers/details/${customerId}`, { headers });

      if (response.data?.success && response.data?.data) {
        const customerData = response.data.data;
        // Update cache
        setCustomerCache(prev => new Map(prev).set(customerId, customerData));
        return customerData;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      return null;
    }
  };

  // Enrich orders with customer address data
  const enrichOrdersWithAddress = async (orders: UnifiedOrder[]): Promise<UnifiedOrder[]> => {
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        // Skip if order already has address data
        if (order.address_line1) return order;

        // Get customer details
        const customer = await fetchCustomerDetails(order.customer_id);
        if (customer) {
          return {
            ...order,
            address_line1: customer.address_line1 || '',
            address_line2: customer.address_line2 || '',
            address_city: customer.city || '',
            address_state: customer.state || '',
            address_pincode: customer.pincode || '',
            address_country: customer.country || '',
          };
        }
        return order;
      })
    );
    return enrichedOrders;
  };

  // New function to fetch all orders regardless of filter
  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const salesmanQuery = salesmanId ? `?salesman_id=${salesmanId}` : '';

      // Fetch all three types of orders in parallel
      const [customerRes, adminRes, salesmanRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/customer-orders/`, { headers }),
        axios.get(`${BASE_URL}/api/orders/`, { headers }),
        axios.get(`${BASE_URL}/api/salesman-orders/${salesmanQuery}`, { headers })
      ]);

      // Process customer orders
      let customerOrdersData = normalizeList(customerRes.data?.data, 'customer');
      customerOrdersData = await enrichOrdersWithAddress(customerOrdersData);
      setCustomerOrders(customerOrdersData);

      // Process admin orders
      let adminOrdersData = normalizeList(adminRes.data?.data, 'admin');
      adminOrdersData = await enrichOrdersWithAddress(adminOrdersData);
      setAdminOrders(adminOrdersData);

      // Process salesman orders
      let salesmanOrdersData = normalizeList(salesmanRes.data?.data, 'salesman');
      salesmanOrdersData = await enrichOrdersWithAddress(salesmanOrdersData);
      setSalesmanOrders(salesmanOrdersData);

    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Original fetchOrders function kept for compatibility
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const salesmanQuery = salesmanId ? `?salesman_id=${salesmanId}` : '';

      let customerOrdersData: UnifiedOrder[] = [];
      let adminOrdersData: UnifiedOrder[] = [];
      let salesmanOrdersData: UnifiedOrder[] = [];

      if (filterType === 'all' || filterType === 'customer') {
        const res = await axios.get(`${BASE_URL}/api/customer-orders/`, { headers });
        customerOrdersData = normalizeList(res.data?.data, 'customer');
        customerOrdersData = await enrichOrdersWithAddress(customerOrdersData);
        setCustomerOrders(customerOrdersData);
      }

      if (filterType === 'all' || filterType === 'admin') {
        const res = await axios.get(`${BASE_URL}/api/orders/`, { headers });
        adminOrdersData = normalizeList(res.data?.data, 'admin');
        adminOrdersData = await enrichOrdersWithAddress(adminOrdersData);
        setAdminOrders(adminOrdersData);
      }

      if (filterType === 'all' || filterType === 'salesman') {
        const res = await axios.get(`${BASE_URL}/api/salesman-orders/${salesmanQuery}`, { headers });
        salesmanOrdersData = normalizeList(res.data?.data, 'salesman');
        salesmanOrdersData = await enrichOrdersWithAddress(salesmanOrdersData);
        setSalesmanOrders(salesmanOrdersData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const currentOrders = useMemo<UnifiedOrder[]>(() => {
    if (filterType === 'all') {
      return [...customerOrders, ...adminOrders, ...salesmanOrders].sort((a, b) => {
        const da = new Date(a.created_at || a.order_date || 0).getTime();
        const db = new Date(b.created_at || b.order_date || 0).getTime();
        return db - da;
      });
    }
    if (filterType === 'customer') return customerOrders;
    if (filterType === 'admin') return adminOrders;
    return salesmanOrders;
  }, [filterType, customerOrders, adminOrders, salesmanOrders]);

  // ============================================================
  // UPDATE STATUS
  // ============================================================
  const updateOrderStatus = async (order: UnifiedOrder, status: string) => {
    const orderId = order.id;
    const source = order._source;
    let paymentStatus = 'pending';
    if (status === 'completed' || status === 'approved') {
      paymentStatus = 'paid';
    } else if (status === 'cancelled' || status === 'rejected') {
      paymentStatus = 'failed';
    }

    const setForSource = (updater: (list: UnifiedOrder[]) => UnifiedOrder[]) => {
      if (source === 'customer') setCustomerOrders(updater);
      else if (source === 'admin') setAdminOrders(updater);
      else setSalesmanOrders(updater);
    };

    const previous =
      source === 'customer' ? customerOrders : source === 'admin' ? adminOrders : salesmanOrders;

    setForSource(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status, payment_status: paymentStatus } : o))
    );

    setUpdatingOrderId(orderId);
    try {
      const headers = authHeaders();
      const endpoint = `${BASE_URL}/api/${SOURCE_META[source].endpoint}/${orderId}/status-payment`;
      const payload = { status, payment_status: paymentStatus };

      const response = await axios.put(endpoint, payload, { headers });

      if (response.data?.data) {
        const updated = { ...response.data.data, items: normalizeItems(response.data.data.items), _source: source };
        setForSource(prev => prev.map(o => (o.id === orderId ? { ...o, ...updated } : o)));
      } else if (response.data?.success) {
        await fetchAllOrders();
      } else {
        throw new Error('Invalid response from server');
      }

      alert(`Order status updated to ${status.charAt(0).toUpperCase() + status.slice(1)}!`);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      setForSource(() => previous);
      alert(`Failed to update order status: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ============================================================
  // DELETE ORDER
  // ============================================================
  const deleteOrder = async (order: UnifiedOrder) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const headers = authHeaders();
      const endpoint = `${BASE_URL}/api/${SOURCE_META[order._source].endpoint}/${order.id}`;
      await axios.delete(endpoint, { headers });
      await fetchAllOrders();
      alert('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================
  const viewInvoice = (order: UnifiedOrder) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const viewOrderDetails = (order: UnifiedOrder) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false);
    setSelectedOrder(null);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handlePrintInvoice = () => window.print();

  const formatPrice = (value: string | number | undefined): number => {
    const num = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
    return isNaN(num as number) ? 0 : (num as number);
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/placeholder-image.jpg';
    if (imagePath.startsWith('uploads/')) return `${BASE_URL}/${imagePath}`;
    if (imagePath.includes('trycloudflare.com')) {
      const match = imagePath.match(/\/uploads\/.+$/);
      if (match) return `${BASE_URL}${match[0]}`;
    }
    if (imagePath.includes('localhost:5000')) return imagePath;
    if (imagePath.startsWith('/uploads/')) return `${BASE_URL}${imagePath}`;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}/uploads/products/${imagePath}`;
  };

  const ProductThumbnail: React.FC<{
    image?: string;
    name?: string;
  }> = ({ image, name }) => {
    const [imageError, setImageError] = useState(false);

    const normalizedImage = image?.trim();

    const hasImage =
      !!normalizedImage &&
      normalizedImage.toLowerCase() !== 'null' &&
      normalizedImage.toLowerCase() !== 'undefined';

    if (!hasImage || imageError) {
      return (
        <div className="w-8 h-8 rounded border bg-gray-100 flex items-center justify-center">
          <span className="text-[8px] text-gray-400">
            {name?.charAt(0)?.toUpperCase() || 'N/A'}
          </span>
        </div>
      );
    }

    return (
      <div className="w-8 h-8 rounded border overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(normalizedImage)}
          alt={name || 'Product'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled':
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed':
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = currentOrders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const orderNumber = order.order_number?.toLowerCase() || '';
    const customerName = order.customer_name?.toLowerCase() || '';
    const customerEmail = order.customer_email?.toLowerCase() || '';
    const salesmanName = order.salesman_name?.toLowerCase() || '';

    const matchSearch =
      orderNumber.includes(searchLower) ||
      customerName.includes(searchLower) ||
      customerEmail.includes(searchLower) ||
      salesmanName.includes(searchLower) ||
      order.id.toString().includes(searchTerm);

    const orderStatus = order.order_status || order.status || 'pending';
    const matchStatus = statusFilter === 'all' || orderStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  const getStatusCount = (status: string) => {
    if (status === 'all') return currentOrders.length;
    return currentOrders.filter((order) => (order.order_status || order.status || 'pending') === status).length;
  };

  // Get event type icon
  const getEventIcon = (eventType?: string) => {
    if (!eventType) return '🎉';
    const type = eventType.toLowerCase();
    if (type.includes('birthday')) return '🎂';
    if (type.includes('wedding')) return '💒';
    if (type.includes('reception')) return '🥂';
    if (type.includes('corporate')) return '🏢';
    if (type.includes('anniversary')) return '💝';
    if (type.includes('party')) return '🎊';
    return '🎉';
  };

  // ============================================================
  // RENDER HELPERS
  // ============================================================
  const renderSourceBadge = (order: UnifiedOrder) => (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${SOURCE_META[order._source].badge}`}>
      {SOURCE_META[order._source].label}
    </span>
  );

  const renderStatusBadge = (order: UnifiedOrder) => {
    const status = order.status || 'pending';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderPaymentStatusBadge = (order: UnifiedOrder) => {
    const status = order.payment_status || 'pending';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderStatusActions = (order: UnifiedOrder) => {
    const currentStatus = order.status || 'pending';
    const isUpdating = updatingOrderId === order.id;

    return (
      <div className="flex flex-col gap-1">
        <select
          value={currentStatus}
          onChange={(e) => updateOrderStatus(order, e.target.value)}
          disabled={isUpdating}
          className={`text-xs border rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#0c2d67] disabled:opacity-50 min-w-[100px]
            ${currentStatus === 'pending' ? 'border-yellow-400 bg-yellow-50' :
              currentStatus === 'approved' ? 'border-green-400 bg-green-50' :
                currentStatus === 'completed' ? 'border-purple-400 bg-purple-50' :
                  currentStatus === 'processing' ? 'border-blue-400 bg-blue-50' :
                    currentStatus === 'rejected' ? 'border-red-400 bg-red-50' :
                      currentStatus === 'cancelled' ? 'border-red-400 bg-red-50' :
                        'border-gray-300 bg-gray-50'
            }`}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {isUpdating && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <RefreshCw size={12} className="animate-spin" /> Updating...
          </span>
        )}
      </div>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <SalesmanNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserCheck size={28} className="text-[#0c2d67]" />
              Orders
            </h1>
            <p className="text-gray-600">View customer, admin, and your own salesman orders</p>
          </div>

          <button
            onClick={() => navigate('/salesman/create-order')}
            className="px-4 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#1a3f7a] transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            New Order
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-lg">
          <button
            onClick={() => setFilterType('customer')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${filterType === 'customer' ? 'bg-[#0c2d67] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <User size={18} />
            Customer Orders
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${filterType === 'customer' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {customerOrders.length}
            </span>
          </button>
          <button
            onClick={() => setFilterType('admin')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${filterType === 'admin' ? 'bg-[#0c2d67] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Package size={18} />
            Admin Orders
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${filterType === 'admin' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {adminOrders.length}
            </span>
          </button>
          <button
            onClick={() => setFilterType('salesman')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${filterType === 'salesman' ? 'bg-[#0c2d67] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <UserCheck size={18} />
            Salesman Orders
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${filterType === 'salesman' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {salesmanOrders.length}
            </span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-[#0c2d67]">{currentOrders.length}</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{getStatusCount('approved')}</p>
            <p className="text-sm text-gray-500">Approved</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{getStatusCount('completed')}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{getStatusCount('rejected') + getStatusCount('cancelled')}</p>
            <p className="text-sm text-gray-500">Rejected/Cancelled</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by order #, customer name or email..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2d67]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full lg:w-56">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="w-full appearance-none px-4 py-2 pr-9 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0c2d67] text-sm font-medium text-gray-700"
              >
                <option value="all">All Orders</option>
                <option value="customer">Customer Orders</option>
                <option value="admin">Admin Orders</option>
                <option value="salesman">Salesman Orders</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === status ? 'bg-[#0c2d67] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesman</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span> Loading orders...
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No orders found matching your search' : 'No orders found'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={`${order._source}-${order.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#0c2d67]">{order.order_number}</p>
                          <p className="text-xs text-gray-500">#{order.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{renderSourceBadge(order)}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">{order.customer_email}</p>
                          <p className="text-xs text-gray-400">{order.customer_phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {order.address_line1 ? (
                          <div className="text-sm text-gray-700">
                            <p className="font-medium">{order.address_line1}</p>
                            {order.address_line2 && <p>{order.address_line2}</p>}
                            <p className="text-xs text-gray-500">
                              {order.address_city}, {order.address_state} - {order.address_pincode}
                            </p>
                            <p className="text-xs text-gray-500">{order.address_country}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No address</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {order.salesman_name ? (
                          <div>
                            <p className="text-sm font-medium text-blue-600">{order.salesman_name}</p>
                            <p className="text-xs text-gray-400">ID: {order.salesman_id}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{order.items?.length || 0}</span>
                          <span className="text-xs text-gray-500">items</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {order.items?.slice(0, 3).map((item: OrderItem, idx: number) => {
                            const imageUrl = item.image || item.image_url;

                            return (
                              <div key={idx} className="w-8 h-8 rounded border overflow-hidden bg-gray-100">
                                {imageUrl ? (
                                  <img
                                    src={getImageUrl(imageUrl)}
                                    alt={item.name || item.product_name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 bg-gray-100">
                                    {item.name?.charAt(0) || item.product_name?.charAt(0) || '?'}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {(order.items?.length || 0) > 3 && (
                            <span className="text-xs text-gray-500 ml-1">+{(order.items?.length || 0) - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-[#0c2d67]">
                          ₹{formatPrice(order.grand_total || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Items: ₹{formatPrice(order.subtotal || order.total_amount || 0).toFixed(2)}
                        </div>
                        {order.coupon_code && (
                          <div className="text-xs text-green-600">🎫 {order.coupon_code}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {renderStatusBadge(order)}
                          {renderStatusActions(order)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {renderPaymentStatusBadge(order)}
                        <div className="text-xs text-gray-400 mt-1 capitalize">{order.payment_method}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.created_at || order.order_date || '').toLocaleDateString()}
                        <br />
                        <span className="text-xs">{new Date(order.created_at || order.order_date || '').toLocaleTimeString()}</span>
                        {order.event_date && (
                          <>
                            <br />
                            <span className="text-xs text-blue-600">📅 {new Date(order.event_date).toLocaleDateString()}</span>
                            {order.event_time && (
                              <span className="text-xs text-blue-600 ml-1">🕐 {order.event_time}</span>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Order Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => deleteOrder(order)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#0c2d67] to-[#1a3f7a] text-white p-6 sticky top-0 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-blue-200">{selectedOrder.order_number}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-white/20">
                  {SOURCE_META[selectedOrder._source].label} Order
                </span>
              </div>
              <button onClick={closeDetailsModal} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Customer & Order Details Row */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <User size={16} /> Customer
                  </h3>
                  <p className="text-sm text-gray-800"><strong>Name:</strong> {selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-800"><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p className="text-sm text-gray-800"><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                  {selectedOrder.salesman_name && (
                    <p className="text-sm text-gray-800 mt-2"><strong>Salesman:</strong> {selectedOrder.salesman_name}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <Calendar size={16} /> Order Details
                  </h3>
                  <p className="text-sm text-gray-800"><strong>Status:</strong> {selectedOrder.order_status || selectedOrder.status}</p>
                  <p className="text-sm text-gray-800"><strong>Payment:</strong> {selectedOrder.payment_status}</p>
                  <p className="text-sm text-gray-800"><strong>Method:</strong> {selectedOrder.payment_method}</p>
                  <p className="text-sm text-gray-800"><strong>Created:</strong> {new Date(selectedOrder.created_at || '').toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Event Details & Delivery Address - Side by Side */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Details - Left Column */}
                {(selectedOrder.event_type || selectedOrder.venue || selectedOrder.guest_count) && (
                  <div>
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                      <span className="text-xl">{getEventIcon(selectedOrder.event_type)}</span> Event Details
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                      {selectedOrder.event_type && (
                        <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                          <span className="text-sm text-gray-600">Event Type</span>
                          <span className="font-medium text-gray-800">{selectedOrder.event_type}</span>
                        </div>
                      )}
                      {selectedOrder.event_date && (
                        <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                          <span className="text-sm text-gray-600">Event Date</span>
                          <span className="font-medium text-gray-800">{new Date(selectedOrder.event_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedOrder.event_time && (
                        <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                          <span className="text-sm text-gray-600">Event Time</span>
                          <span className="font-medium text-gray-800">{selectedOrder.event_time}</span>
                        </div>
                      )}
                      {selectedOrder.venue && (
                        <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                          <span className="text-sm text-gray-600">Venue</span>
                          <span className="font-medium text-gray-800">{selectedOrder.venue}</span>
                        </div>
                      )}
                      {selectedOrder.guest_count && (
                        <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                          <span className="text-sm text-gray-600">Guest Count</span>
                          <span className="font-medium text-gray-800">{selectedOrder.guest_count}</span>
                        </div>
                      )}
                      {selectedOrder.special_instructions && (
                        <div className="pt-2">
                          <span className="text-sm text-gray-600 block mb-1">Special Instructions</span>
                          <p className="text-sm text-gray-800 bg-yellow-50 p-2 rounded border border-yellow-200">
                            {selectedOrder.special_instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Delivery Address - Right Column */}
                {(selectedOrder.address_line1 || selectedOrder.address_city) && (
                  <div>
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                      <MapPin size={16} /> Delivery Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {selectedOrder.address_label && (
                        <p className="text-sm font-semibold text-gray-800 mb-2">{selectedOrder.address_label}</p>
                      )}
                      <div className="space-y-1 text-sm text-gray-700">
                        {selectedOrder.address_full_name && (
                          <p className="font-medium">{selectedOrder.address_full_name}</p>
                        )}
                        <p>
                          {selectedOrder.address_line1}
                          {selectedOrder.address_line2 && <>, {selectedOrder.address_line2}</>}
                        </p>
                        <p>
                          {selectedOrder.address_city}, {selectedOrder.address_state} - {selectedOrder.address_pincode}
                        </p>
                        <p>{selectedOrder.address_country}</p>
                        {selectedOrder.address_phone && (
                          <p className="text-blue-600 font-medium mt-2">📞 {selectedOrder.address_phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Package size={18} /> Order Items
              </h3>
              {!selectedOrder.items || selectedOrder.items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items in this order</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item: OrderItem, index: number) => {
                        const imageUrl = item.image || item.image_url;
                        const lineTotal = item.subtotal !== undefined
                          ? formatPrice(item.subtotal)
                          : formatPrice(item.price) * item.quantity;
                        return (
                          <tr key={item.id || index}>
                            <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-800">{item.name || item.product_name}</p>
                              {item.product_code && <p className="text-xs text-gray-400">Code: {item.product_code}</p>}
                            </td>
                            <td className="px-4 py-3">
                              {imageUrl ? (
                                <img
                                  src={getImageUrl(imageUrl)}
                                  alt={item.name || item.product_name}
                                  className="w-12 h-12 object-cover rounded border"
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.jpg'; }}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No img</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-right">₹{formatPrice(item.price).toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">₹{lineTotal.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Totals Section */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  {selectedOrder.coupon_code && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <Tag size={14} /> Coupon: {selectedOrder.coupon_code} ({selectedOrder.coupon_discount ? `₹${formatPrice(selectedOrder.coupon_discount).toFixed(2)} off` : ''})
                    </p>
                  )}
                  {selectedOrder.notes && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MessageSquare size={14} /> Note: {selectedOrder.notes}
                    </p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <div className="flex justify-between gap-8 text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>₹{formatPrice(selectedOrder.subtotal || selectedOrder.total_amount || 0).toFixed(2)}</span>
                  </div>
                  {selectedOrder.delivery_charge && formatPrice(selectedOrder.delivery_charge) > 0 && (
                    <div className="flex justify-between gap-8 text-sm text-gray-600">
                      <span>Delivery Charge:</span>
                      <span>₹{formatPrice(selectedOrder.delivery_charge).toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.gst && formatPrice(selectedOrder.gst) > 0 && (
                    <div className="flex justify-between gap-8 text-sm text-gray-600">
                      <span>GST:</span>
                      <span>₹{formatPrice(selectedOrder.gst).toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.tax_amount && formatPrice(selectedOrder.tax_amount) > 0 && (
                    <div className="flex justify-between gap-8 text-sm text-gray-600">
                      <span>Tax:</span>
                      <span>₹{formatPrice(selectedOrder.tax_amount).toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.coupon_discount && formatPrice(selectedOrder.coupon_discount) > 0 && (
                    <div className="flex justify-between gap-8 text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-₹{formatPrice(selectedOrder.coupon_discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-8 text-xl font-bold text-[#0c2d67] pt-2 border-t">
                    <span>Grand Total:</span>
                    <span>₹{formatPrice(selectedOrder.grand_total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex flex-wrap gap-4 justify-end bg-gray-50">
              <button
                onClick={() => { closeDetailsModal(); viewInvoice(selectedOrder); }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Printer size={18} /> View Invoice
              </button>
              <button onClick={closeDetailsModal} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#0c2d67] to-[#1a3f7a] text-white p-6 sticky top-0">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">🏪 TentHouse</h1>
                  <p className="text-blue-200 mt-1">123 Business Street, City</p>
                  <p className="text-blue-200">Email: info@tenthouse.com</p>
                  <p className="text-blue-200">Phone: +91 98765 43210</p>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-bold">INVOICE</h2>
                  <p className="text-lg mt-2">{selectedOrder.order_number}</p>
                  <p className="text-blue-200">
                    Date: {new Date(selectedOrder.created_at || selectedOrder.order_date || '').toLocaleDateString()}
                  </p>
                  {selectedOrder.salesman_name && (
                    <p className="text-sm text-blue-300">Salesman: {selectedOrder.salesman_name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <User size={18} /> Customer Details
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-800"><strong>Name:</strong> {selectedOrder.customer_name}</p>
                    <p className="text-gray-800"><strong>Email:</strong> {selectedOrder.customer_email}</p>
                    <p className="text-gray-800"><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar size={18} /> Order Details
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-800"><strong>Order #:</strong> {selectedOrder.order_number}</p>
                    <p className="text-gray-800"><strong>Status:</strong> {selectedOrder.order_status || selectedOrder.status}</p>
                    <p className="text-gray-800"><strong>Payment:</strong> {selectedOrder.payment_status}</p>
                    <p className="text-gray-800"><strong>Method:</strong> {selectedOrder.payment_method}</p>
                    {selectedOrder.event_type && (
                      <p className="text-gray-800"><strong>Event:</strong> {selectedOrder.event_type}</p>
                    )}
                    {selectedOrder.event_date && (
                      <p className="text-gray-800"><strong>Event Date:</strong> {new Date(selectedOrder.event_date).toLocaleDateString()}</p>
                    )}
                    {selectedOrder.venue && (
                      <p className="text-gray-800"><strong>Venue:</strong> {selectedOrder.venue}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address on Invoice */}
              {(selectedOrder.address_line1 || selectedOrder.address_city) && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Home size={16} /> Delivery Address
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    {selectedOrder.address_full_name && <p>{selectedOrder.address_full_name}</p>}
                    <p>{selectedOrder.address_line1}{selectedOrder.address_line2 && `, ${selectedOrder.address_line2}`}</p>
                    <p>{selectedOrder.address_city}, {selectedOrder.address_state} - {selectedOrder.address_pincode}</p>
                    <p>{selectedOrder.address_country}</p>
                    {selectedOrder.address_phone && <p>📞 {selectedOrder.address_phone}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Order Items</h3>
              {!selectedOrder.items || selectedOrder.items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items in this order</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item: OrderItem, index: number) => {
                        const imageUrl = item.image || item.image_url;
                        const lineTotal = item.subtotal !== undefined
                          ? formatPrice(item.subtotal)
                          : formatPrice(item.price) * item.quantity;
                        return (
                          <tr key={item.id || index}>
                            <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-800">{item.name || item.product_name}</p>
                              {item.product_code && <p className="text-xs text-gray-400">Code: {item.product_code}</p>}
                            </td>
                            <td className="px-4 py-3">
                              {imageUrl ? (
                                <img
                                  src={getImageUrl(imageUrl)}
                                  alt={item.name || item.product_name}
                                  className="w-12 h-12 object-cover rounded border"
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.jpg'; }}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No img</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-right">₹{formatPrice(item.price).toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">₹{lineTotal.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 border-t pt-6">
                <div className="flex justify-end">
                  <div className="w-full md:w-72 space-y-2">
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Subtotal:</span>
                      <span>₹{formatPrice(selectedOrder.subtotal || selectedOrder.total_amount || 0).toFixed(2)}</span>
                    </div>
                    {selectedOrder.delivery_charge && formatPrice(selectedOrder.delivery_charge) > 0 && (
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Delivery Charge:</span>
                        <span>₹{formatPrice(selectedOrder.delivery_charge).toFixed(2)}</span>
                      </div>
                    )}
                    {selectedOrder.gst && formatPrice(selectedOrder.gst) > 0 && (
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>GST:</span>
                        <span>₹{formatPrice(selectedOrder.gst).toFixed(2)}</span>
                      </div>
                    )}
                    {selectedOrder.tax_amount && formatPrice(selectedOrder.tax_amount) > 0 && (
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Tax:</span>
                        <span>₹{formatPrice(selectedOrder.tax_amount).toFixed(2)}</span>
                      </div>
                    )}
                    {selectedOrder.coupon_discount && formatPrice(selectedOrder.coupon_discount) > 0 && (
                      <div className="flex justify-between text-green-600 text-sm">
                        <span>Coupon Discount ({selectedOrder.coupon_code}):</span>
                        <span>-₹{formatPrice(selectedOrder.coupon_discount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-[#0c2d67] pt-2 border-t-2 border-dashed">
                      <span>Grand Total:</span>
                      <span>₹{formatPrice(selectedOrder.grand_total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 text-center border-t">
              <p className="text-gray-600">Thank you for your business!</p>
              <p className="text-gray-400 text-sm mt-1">This is a system generated invoice.</p>
            </div>

            <div className="p-6 border-t flex flex-wrap gap-4 justify-end bg-gray-50">
              <button
                onClick={handlePrintInvoice}
                className="px-6 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#1a3f7a] transition-colors flex items-center gap-2"
              >
                <Printer size={18} /> Print
              </button>
              <button onClick={closeInvoiceModal} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesmanOrders;