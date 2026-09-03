// app/admin/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/Config/Api';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Eye,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Gift,
  Tag,
  LayoutGrid,
  Plus
} from 'lucide-react';
import Navbar from '@/components/Navbar';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  completedOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  recentOrders: any[];
  recentUsers: any[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    approvedOrders: 0,
    rejectedOrders: 0,
    recentOrders: [],
    recentUsers: []
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in as admin
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      navigate('/admin-login');
      return;
    }
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      // ─── Fetch orders ──────────────────────────────────────────────────────
      let orders = [];
      try {
        const ordersResponse = await axios.get(`${BASE_URL}/api/customer-orders/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        orders = ordersResponse.data.data || [];
      } catch (orderErr) {
        console.warn('Could not fetch orders:', orderErr);
        orders = [];
      }

      // ─── Fetch products ────────────────────────────────────────────────────
      let products = [];
      try {
        const productsResponse = await axios.get(`${BASE_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        products = productsResponse.data || [];
      } catch (productErr) {
        console.warn('Could not fetch products:', productErr);
        products = [];
      }

      // ─── Fetch users / customers ──────────────────────────────────────────
      let users = [];
      try {
        // Try both possible endpoints
        let usersResponse;
        try {
          usersResponse = await axios.get(`${BASE_URL}/api/customers/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (e) {
          // Fallback to /all endpoint
          usersResponse = await axios.get(`${BASE_URL}/api/customers/all`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        users = usersResponse.data.data || [];
      } catch (userErr) {
        console.warn('Could not fetch users:', userErr);
        users = [];
      }

      // ─── Calculate stats ──────────────────────────────────────────────────
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (parseFloat(order.grand_total) || 0), 0);
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
      const completedOrders = orders.filter((o: any) => o.status === 'completed').length;
      const approvedOrders = orders.filter((o: any) => o.status === 'approved').length;
      const rejectedOrders = orders.filter((o: any) => o.status === 'rejected' || o.status === 'cancelled').length;

      // Get recent orders (last 5)
      const recentOrders = orders.slice(0, 5);

      // Get recent users (last 5)
      const recentUsers = users.slice(0, 5);

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingOrders,
        completedOrders,
        approvedOrders,
        rejectedOrders,
        recentOrders,
        recentUsers
      });

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'rejected': 
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock size={14} className="text-yellow-600" />;
      case 'approved': return <CheckCircle size={14} className="text-green-600" />;
      case 'completed': return <CheckCircle size={14} className="text-purple-600" />;
      case 'processing': return <RefreshCw size={14} className="text-blue-600" />;
      case 'rejected': 
      case 'cancelled': return <XCircle size={14} className="text-red-600" />;
      default: return <AlertCircle size={14} className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c2d67] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-800">Error loading dashboard</p>
            <p className="text-gray-500 mt-2">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#1a3f7a] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={32} className="text-[#0c2d67]" />
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Overview of your business performance</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#1a3f7a] transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
            <button
              onClick={() => navigate('/admin/create-order')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              New Order
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#0c2d67] hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/admin/orders')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-[#0c2d67]/10 rounded-lg">
                <ShoppingBag size={24} className="text-[#0c2d67]" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUp size={14} />
                {stats.totalOrders > 0 ? 'Active orders' : 'No orders yet'}
              </span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/admin/orders')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-green-600/10 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUp size={14} />
                {stats.totalOrders > 0 ? `From ${stats.totalOrders} orders` : 'No revenue'}
              </span>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/admin-products')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-purple-600/10 rounded-lg">
                <Package size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-purple-600 flex items-center gap-1">
                <ArrowUp size={14} />
                {stats.totalProducts > 0 ? 'Available in catalog' : 'No products'}
              </span>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/users')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-600/10 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-blue-600 flex items-center gap-1">
                <ArrowUp size={14} />
                {stats.totalUsers > 0 ? 'Registered users' : 'No users'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/orders?status=pending')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pendingOrders}</p>
              </div>
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/orders?status=approved')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Approved</p>
                <p className="text-2xl font-bold text-green-900">{stats.approvedOrders}</p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/orders?status=completed')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Completed</p>
                <p className="text-2xl font-bold text-purple-900">{stats.completedOrders}</p>
              </div>
              <CheckCircle size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/orders?status=rejected')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Rejected/Cancelled</p>
                <p className="text-2xl font-bold text-red-900">{stats.rejectedOrders}</p>
              </div>
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Recent Orders & Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="text-sm text-[#0c2d67] hover:underline flex items-center gap-1"
                >
                  View All <Eye size={14} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.recentOrders.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No recent orders
                </div>
              ) : (
                stats.recentOrders.map((order: any) => (
                  <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors " >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">#{order.order_number}</p>
                        <p className="text-sm text-gray-500">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#0c2d67]">
                          {formatCurrency(parseFloat(order.grand_total) || 0)}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Recent Customers</h3>
                <button
                  onClick={() => navigate('/users')}
                  className="text-sm text-[#0c2d67] hover:underline flex items-center gap-1"
                >
                  View All <Eye size={14} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.recentUsers.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No recent users
                </div>
              ) : (
                stats.recentUsers.map((user: any) => (
                  <div key={user.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{user.phone}</p>
                        <p className="text-xs text-gray-400">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <button
              onClick={() => navigate('/admin-products')}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow text-center hover:bg-gray-50"
            >
              <Package size={24} className="mx-auto text-[#0c2d67] mb-2" />
              <p className="text-sm font-medium text-gray-700">Products</p>
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow text-center hover:bg-gray-50"
            >
              <ShoppingBag size={24} className="mx-auto text-[#0c2d67] mb-2" />
              <p className="text-sm font-medium text-gray-700">Orders</p>
            </button>
            <button
              onClick={() => navigate('/users')}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow text-center hover:bg-gray-50"
            >
              <Users size={24} className="mx-auto text-[#0c2d67] mb-2" />
              <p className="text-sm font-medium text-gray-700">Customers</p>
            </button>
            <button
              onClick={() => navigate('/admin-categories')}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow text-center hover:bg-gray-50"
            >
              <LayoutGrid size={24} className="mx-auto text-[#0c2d67] mb-2" />
              <p className="text-sm font-medium text-gray-700">Categories</p>
            </button>
            <button
              onClick={() => navigate('/admin/packages')}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow text-center hover:bg-gray-50"
            >
              <Gift size={24} className="mx-auto text-[#0c2d67] mb-2" />
              <p className="text-sm font-medium text-gray-700">Packages</p>
            </button>
            <button
              onClick={() => navigate('/admin/coupons')}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow text-center hover:bg-gray-50"
            >
              <Tag size={24} className="mx-auto text-[#0c2d67] mb-2" />
              <p className="text-sm font-medium text-gray-700">Coupons</p>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-white rounded-xl shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <div>
              <span className="font-medium text-gray-700">Last Updated:</span> {new Date().toLocaleString()}
            </div>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <span>Total Orders: <strong>{stats.totalOrders}</strong></span>
              <span>Total Revenue: <strong>{formatCurrency(stats.totalRevenue)}</strong></span>
              <span>Total Customers: <strong>{stats.totalUsers}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;