// app/salesman/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/Config/Api';
import { 
  ShoppingBag, 
  Package, 
  TrendingUp,
  DollarSign,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  ArrowUp,
  Bell,
  CheckCheck
} from 'lucide-react';
import SalesmanNavbar from '@/components/SalesmanNavbar';

interface DashboardOrder {
  id: number;
  order_number: string;
  customer_name?: string;
  customer_email?: string;
  grand_total: string | number;
  status: string;
}

interface SalesmanUser {
  id: number;
  name: string;
  email?: string;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: DashboardOrder[];
}

interface SalesmanNotification {
  id: number;
  order_id: number;
  order_number: string;
  previous_status: string;
  new_status: string;
  title: string;
  message: string;
  is_read: number | boolean;
  created_at: string;
}

const getApiErrorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error) ? error.response?.data?.message || fallback : fallback;

const SalesmanDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    recentOrders: []
  });
  const [user, setUser] = useState<SalesmanUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<SalesmanNotification[]>([]);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in as salesman
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userData = localStorage.getItem('user');
    
    if (!token || role !== 'salesman') {
      navigate('/admin-login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchDashboardData();
    fetchNotifications();

    const intervalId = window.setInterval(fetchNotifications, 30000);
    const refreshOnFocus = () => fetchNotifications();
    window.addEventListener('focus', refreshOnFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshOnFocus);
    };
    // This setup intentionally runs once; polling reads the current token on every request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/salesman/notifications`, {
        headers: authHeaders()
      });
      setNotifications(response.data?.data || []);
      setNotificationError(null);
    } catch (err: unknown) {
      console.error('Error fetching salesman notifications:', err);
      setNotificationError(getApiErrorMessage(err, 'Failed to load notifications'));
    }
  };

  const markNotificationRead = async (notificationId: number) => {
    try {
      await axios.put(
        `${BASE_URL}/api/salesman/notifications/${notificationId}/read`,
        {},
        { headers: authHeaders() }
      );
      setNotifications(current => current.map(notification =>
        notification.id === notificationId ? { ...notification, is_read: 1 } : notification
      ));
    } catch (err: unknown) {
      setNotificationError(getApiErrorMessage(err, 'Failed to mark notification as read'));
    }
  };

  const openNotification = async (notification: SalesmanNotification) => {
    if (!notification.is_read) await markNotificationRead(notification.id);
    if (notification.order_source === 'admin') {
      window.alert(`${notification.title}\n\n${notification.message}`);
      return;
    }
    navigate(`/salesman/order-details/${notification.order_id}`);
  };

  const markAllNotificationsRead = async () => {
    try {
      await axios.put(`${BASE_URL}/api/salesman/notifications/read-all`, {}, {
        headers: authHeaders()
      });
      setNotifications(current => current.map(notification => ({ ...notification, is_read: 1 })));
    } catch (err: unknown) {
      setNotificationError(getApiErrorMessage(err, 'Failed to mark notifications as read'));
    }
  };

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

      // Fetch orders
      const ordersResponse = await axios.get(`${BASE_URL}/api/salesman-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const orders: DashboardOrder[] = ordersResponse.data.data || [];

      // Calculate stats
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(String(order.grand_total)) || 0), 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'completed' || order.status === 'approved').length;

      // Get recent orders (last 5)
      const recentOrders = orders.slice(0, 5);

      setStats({
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        recentOrders
      });

    } catch (err: unknown) {
      console.error('Error fetching dashboard data:', err);
      setError(getApiErrorMessage(err, 'Failed to fetch dashboard data'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/admin-login');
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

  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SalesmanNavbar userName={user?.name} />
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
        <SalesmanNavbar userName={user?.name} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
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
      <SalesmanNavbar userName={user?.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={32} className="text-[#0c2d67]" />
            Welcome, {user?.name || 'Salesman'}!
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of your orders</p>
        </div>

        {/* Order status notifications */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell size={22} className="text-[#0c2d67]" />
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Order Updates</h2>
                <p className="text-xs text-gray-500">Status changes for orders assigned to you</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-sm text-[#0c2d67] hover:underline flex items-center gap-1"
              >
                <CheckCheck size={16} /> Mark all read
              </button>
            )}
          </div>

          {notificationError ? (
            <div className="px-6 py-4 text-sm text-red-600 flex items-center justify-between gap-4">
              <span>{notificationError}</span>
              <button onClick={fetchNotifications} className="font-medium hover:underline">Retry</button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <Bell size={32} className="mx-auto text-gray-300 mb-2" />
              <p>No order updates yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {notifications.slice(0, 10).map(notification => (
                <button
                  key={notification.id}
                  onClick={() => openNotification(notification)}
                  className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                    notification.is_read ? 'bg-white' : 'bg-blue-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm ${notification.is_read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notification.is_read && <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#0c2d67] hover:shadow-xl transition-shadow">
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

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-xl transition-shadow">
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

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</p>
              </div>
              <div className="p-3 bg-yellow-600/10 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-yellow-600 flex items-center gap-1">
                <Clock size={14} />
                {stats.pendingOrders > 0 ? 'Awaiting action' : 'No pending orders'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completedOrders}</p>
              </div>
              <div className="p-3 bg-purple-600/10 rounded-lg">
                <CheckCircle size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-purple-600 flex items-center gap-1">
                <CheckCircle size={14} />
                {stats.completedOrders > 0 ? 'Completed successfully' : 'No completed orders'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              <button
                onClick={() => navigate('/salesman/orders')}
                className="text-sm text-[#0c2d67] hover:underline flex items-center gap-1"
              >
                View All <Eye size={14} />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium">No recent orders</p>
                <p className="text-sm">Orders will appear here once customers place orders.</p>
              </div>
            ) : (
              stats.recentOrders.map(order => (
                <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors" >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">#{order.order_number}</p>
                      <p className="text-sm text-gray-500">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#0c2d67]">
                        {formatCurrency(parseFloat(String(order.grand_total)) || 0)}
                      </p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/salesman/orders')}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow text-center hover:bg-gray-50"
            >
              <ShoppingBag size={24} className="mx-auto text-[#0c2d67] mb-2" />
              <p className="text-sm font-medium text-gray-700">View Orders</p>
            </button>
            <button
              onClick={fetchDashboardData}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow text-center hover:bg-gray-50"
            >
              <RefreshCw size={24} className="mx-auto text-[#0c2d67] mb-2" />
              <p className="text-sm font-medium text-gray-700">Refresh Data</p>
            </button>
            {/* <button
              onClick={() => navigate('/salesman/profile')}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow text-center hover:bg-gray-50"
            >
              <User size={24} className="mx-auto text-[#0c2d67] mb-2" />
              <p className="text-sm font-medium text-gray-700">My Profile</p>
            </button> */}
            <button
              onClick={handleLogout}
              className="bg-red-50 rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow text-center border border-red-100"
            >
              <LogOut size={24} className="mx-auto text-red-600 mb-2" />
              <p className="text-sm font-medium text-red-600">Logout</p>
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
              <span>Pending: <strong>{stats.pendingOrders}</strong></span>
              <span>Completed: <strong>{stats.completedOrders}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesmanDashboard;
