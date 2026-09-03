// app/admin/orders.tsx
import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Truck,
  PackageCheck,
  AlertCircle,
  RefreshCw,
  Check,
  X,
  Edit
} from 'lucide-react';
import axios from 'axios';
import BASE_URL from '@/Config/Api';

interface Order {
  id: number;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_id: number;
  address_label: string;
  address_full_name: string;
  address_phone: string;
  address_line1: string;
  address_line2: string;
  address_city: string;
  address_state: string;
  address_pincode: string;
  address_country: string;
  event_date: string;
  event_time: string;
  event_type: string;
  venue: string;
  guest_count: number;
  special_instructions: string;
  items: any;
  subtotal: number;
  delivery_charge: number;
  gst: number;
  coupon_discount: number;
  coupon_code: string;
  grand_total: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  productId?: string;
  id?: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [processing, setProcessing] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const API_BASE_URL = `${BASE_URL}/api`;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const endpoint = `${API_BASE_URL}/customer-orders`;
      console.log('📦 Fetching orders from:', endpoint);
      
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        const ordersWithStatus = response.data.data.map((order: any) => ({
          ...order,
          status: order.status || 'pending',
          items: Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : [])
        }));
        setOrders(ordersWithStatus);
        setError(null);
        console.log('✅ Orders loaded:', ordersWithStatus.length);
      } else {
        setError('Failed to fetch orders: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('❌ Error fetching orders:', err);
      let errorMessage = 'Error fetching orders';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check if the server is running.';
      } else {
        errorMessage = err.message || 'Unknown error occurred';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const approveOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to approve this order?')) return;
    
    try {
      setProcessing(orderId);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${API_BASE_URL}/customer-orders/${orderId}/status`,
        { status: 'approved' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchOrders();
        alert('✅ Order approved successfully!');
      } else {
        alert('Failed to approve order: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('❌ Error approving order:', err);
      alert('Failed to approve order: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(null);
    }
  };

  const rejectOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to reject this order?')) return;
    
    try {
      setProcessing(orderId);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${API_BASE_URL}/customer-orders/${orderId}/status`,
        { status: 'rejected' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchOrders();
        alert('❌ Order rejected successfully!');
      } else {
        alert('Failed to reject order: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('❌ Error rejecting order:', err);
      alert('Failed to reject order: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(null);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    if (!confirm(`Are you sure you want to change this order status to ${newStatus}?`)) return;
    
    try {
      setUpdatingStatus(orderId);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${API_BASE_URL}/customer-orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus as Order['status'] } : null);
        }
        alert(`✅ Order status updated to ${newStatus}!`);
      } else {
        alert('Failed to update order status: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('❌ Error updating order status:', err);
      alert('Failed to update order status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const toggleRow = (orderId: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
      processing: { color: 'bg-blue-100 text-blue-800', icon: PackageCheck, label: 'Processing' },
      completed: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const PaymentBadge: React.FC<{ status: string }> = ({ status }) => {
    const config: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      blocked: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[status] || config.pending}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const parseItems = (items: any): OrderItem[] => {
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') {
      try {
        return JSON.parse(items || '[]');
      } catch {
        return [];
      }
    }
    return [];
  };

  // ─── Status options for dropdown ──────────────────────────────────────────
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="font-semibold">Error loading orders</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600">Manage all customer orders</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              Total: <strong>{filteredOrders.length}</strong> orders
            </span>
            <button 
              onClick={fetchOrders}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order #, customer, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Payment</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <PackageCheck className="w-12 h-12 text-gray-300 mb-2" />
                        <p>No orders found</p>
                        <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers place orders.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleRow(order.id)}
                              className="mr-2 text-gray-400 hover:text-gray-600"
                            >
                              {expandedRows[order.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <div>
                              <div className="text-sm font-medium text-gray-900">#{order.order_number}</div>
                              <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{order.customer_email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.event_type || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{order.event_date && new Date(order.event_date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{Number(order.grand_total).toFixed(2)}</div>
                          <div className="text-xs text-gray-500">{parseItems(order.items).length} items</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* ─── Status Dropdown ───────────────────────────────────── */}
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={updatingStatus === order.id}
                              className={`px-3 py-1.5 pr-8 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                order.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' :
                                order.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                order.status === 'completed' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                                'bg-gray-100 text-gray-800 border-gray-300'
                              } ${updatingStatus === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value} className="bg-white text-gray-900">
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                            {updatingStatus === order.id && (
                              <div className="absolute right-0 -top-6">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PaymentBadge status={order.payment_status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {/* Approve/Reject buttons - only for pending orders */}
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => approveOrder(order.id)}
                                  disabled={processing === order.id}
                                  className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                                  title="Approve Order"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => rejectOrder(order.id)}
                                  disabled={processing === order.id}
                                  className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                  title="Reject Order"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => viewOrderDetails(order)}
                              className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows[order.id] && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2">Delivery Address</h4>
                                <p className="text-sm text-gray-600">
                                  {order.address_full_name}<br />
                                  {order.address_line1}<br />
                                  {order.address_line2 && `${order.address_line2}<br />`}
                                  {order.address_city}, {order.address_state}<br />
                                  {order.address_pincode}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2">Event Details</h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> {order.event_type || 'N/A'}<br />
                                  <strong>Date:</strong> {order.event_date && new Date(order.event_date).toLocaleDateString()}<br />
                                  <strong>Time:</strong> {order.event_time || 'N/A'}<br />
                                  <strong>Guests:</strong> {order.guest_count || 'N/A'}<br />
                                  <strong>Venue:</strong> {order.venue || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2">Order Summary</h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Subtotal:</strong> ₹{Number(order.subtotal).toFixed(2)}<br />
                                  <strong>Delivery:</strong> ₹{Number(order.delivery_charge).toFixed(2)}<br />
                                  <strong>GST:</strong> ₹{Number(order.gst).toFixed(2)}<br />
                                  {order.coupon_discount > 0 && <><strong>Discount:</strong> -₹{Number(order.coupon_discount).toFixed(2)}<br /></>}
                                  <strong className="text-blue-600">Total:</strong> ₹{Number(order.grand_total).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.order_number}</h2>
                <p className="text-sm text-gray-600">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Customer Information</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {selectedOrder.customer_name || 'N/A'}<br />
                    <strong>Email:</strong> {selectedOrder.customer_email || 'N/A'}<br />
                    <strong>Phone:</strong> {selectedOrder.customer_phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Delivery Address</h3>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.address_full_name}<br />
                    {selectedOrder.address_line1}<br />
                    {selectedOrder.address_line2 && `${selectedOrder.address_line2}<br />`}
                    {selectedOrder.address_city}, {selectedOrder.address_state}<br />
                    {selectedOrder.address_pincode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Event Details</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {selectedOrder.event_type || 'N/A'}<br />
                    <strong>Date:</strong> {selectedOrder.event_date && new Date(selectedOrder.event_date).toLocaleDateString()}<br />
                    <strong>Time:</strong> {selectedOrder.event_time || 'N/A'}<br />
                    <strong>Guests:</strong> {selectedOrder.guest_count || 'N/A'}<br />
                    <strong>Venue:</strong> {selectedOrder.venue || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Status</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Order Status</label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={updatingStatus === selectedOrder.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Payment Status</label>
                      <PaymentBadge status={selectedOrder.payment_status} />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Payment Details</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Method:</strong> {selectedOrder.payment_method || 'N/A'}<br />
                    <strong>Subtotal:</strong> ₹{Number(selectedOrder.subtotal).toFixed(2)}<br />
                    <strong>Delivery:</strong> ₹{Number(selectedOrder.delivery_charge).toFixed(2)}<br />
                    <strong>GST:</strong> ₹{Number(selectedOrder.gst).toFixed(2)}<br />
                    {selectedOrder.coupon_discount > 0 && <><strong>Discount:</strong> -₹{Number(selectedOrder.coupon_discount).toFixed(2)}<br /></>}
                    <strong className="text-blue-600">Grand Total:</strong> ₹{Number(selectedOrder.grand_total).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {parseItems(selectedOrder.items).map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">₹{Number(item.price).toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">₹{Number(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedOrder.special_instructions && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Special Instructions</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedOrder.special_instructions}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;