// app/admin/coupons.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter,
  Tag,
  Calendar,
  DollarSign,
  Users,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  Clock
} from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import BASE_URL from '@/Config/Api';

interface Coupon {
  id: number;
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minimum_order: number;
  max_discount: number | null;
  usage_limit: number | null;
  per_user_limit: number | null;
  used_count: number;
  start_date: string;
  expires_at: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: '',
    type: 'percentage' as 'percentage' | 'fixed',
    minimum_order: '',
    max_discount: '',
    usage_limit: '',
    per_user_limit: '',
    expires_at: '',
    start_date: '',
    is_active: 1
  });

  const API_BASE_URL = BASE_URL;

  // ─── Fetch Coupons ──────────────────────────────────────────────────────────
  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      console.log('📦 Fetching coupons from:', `${API_BASE_URL}/api/admin/coupons`);
      const response = await axios.get(`${API_BASE_URL}/api/admin/coupons`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📦 Coupons response:', response.data);
      
      if (response.data.success) {
        setCoupons(response.data.data || []);
      } else {
        setError('Failed to fetch coupons: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('❌ Error fetching coupons:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check if the server is running.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch coupons');
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // ─── Create Coupon ──────────────────────────────────────────────────────────
  const createCoupon = async () => {
    // Validate required fields
    if (!formData.code.trim()) {
      alert('Please enter a coupon code');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (!formData.discount || parseFloat(formData.discount) <= 0) {
      alert('Please enter a valid discount value');
      return;
    }
    if (!formData.expires_at) {
      alert('Please select an expiry date');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discount: parseFloat(formData.discount),
        type: formData.type,
        minOrder: parseFloat(formData.minimum_order) || 0,
        maxDiscount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        usageLimit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        perUserLimit: formData.per_user_limit ? parseInt(formData.per_user_limit) : null,
        startDate: formData.start_date || new Date().toISOString().slice(0, 19).replace('T', ' '),
        endDate: formData.expires_at,
        active: formData.is_active === 1
      };

      console.log('📦 Creating coupon:', payload);

      const response = await axios.post(`${API_BASE_URL}/api/admin/coupons`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        await fetchCoupons();
        resetForm();
        setShowModal(false);
        alert('✅ Coupon created successfully!');
      } else {
        alert('Failed to create coupon: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('❌ Error creating coupon:', err);
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  // ─── Update Coupon ──────────────────────────────────────────────────────────
  const updateCoupon = async () => {
    if (!editingCoupon) return;
    
    // Validate required fields
    if (!formData.code.trim()) {
      alert('Please enter a coupon code');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (!formData.discount || parseFloat(formData.discount) <= 0) {
      alert('Please enter a valid discount value');
      return;
    }
    if (!formData.expires_at) {
      alert('Please select an expiry date');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discount: parseFloat(formData.discount),
        type: formData.type,
        minOrder: parseFloat(formData.minimum_order) || 0,
        maxDiscount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        usageLimit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        perUserLimit: formData.per_user_limit ? parseInt(formData.per_user_limit) : null,
        startDate: formData.start_date,
        endDate: formData.expires_at,
        active: formData.is_active === 1
      };

      console.log('📦 Updating coupon:', payload);

      const response = await axios.put(`${API_BASE_URL}/api/admin/coupons/${editingCoupon.id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        await fetchCoupons();
        resetForm();
        setShowModal(false);
        alert('✅ Coupon updated successfully!');
      } else {
        alert('Failed to update coupon: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('❌ Error updating coupon:', err);
      alert(err.response?.data?.message || 'Failed to update coupon');
    }
  };

  // ─── Delete Coupon ──────────────────────────────────────────────────────────
  const deleteCoupon = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${API_BASE_URL}/api/admin/coupons/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        await fetchCoupons();
        alert('✅ Coupon deleted successfully!');
      } else {
        alert('Failed to delete coupon');
      }
    } catch (err: any) {
      console.error('❌ Error deleting coupon:', err);
      alert(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  // ─── Reset Form ────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount: '',
      type: 'percentage',
      minimum_order: '',
      max_discount: '',
      usage_limit: '',
      per_user_limit: '',
      expires_at: '',
      start_date: '',
      is_active: 1
    });
    setEditingCoupon(null);
  };

  // ─── Edit Coupon ────────────────────────────────────────────────────────────
  const editCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discount: coupon.discount.toString(),
      type: coupon.type,
      minimum_order: coupon.minimum_order?.toString() || '',
      max_discount: coupon.max_discount?.toString() || '',
      usage_limit: coupon.usage_limit?.toString() || '',
      per_user_limit: coupon.per_user_limit?.toString() || '',
      expires_at: coupon.expires_at,
      start_date: coupon.start_date || '',
      is_active: coupon.is_active
    });
    setShowModal(true);
  };

  // ─── Filter Coupons ──────────────────────────────────────────────────────────
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && coupon.is_active === 1) ||
      (statusFilter === 'inactive' && coupon.is_active === 0) ||
      (statusFilter === 'expired' && new Date(coupon.expires_at) < new Date());
    
    return matchesSearch && matchesStatus;
  });

  // ─── Status Badge ──────────────────────────────────────────────────────────
  const StatusBadge = ({ coupon }: { coupon: Coupon }) => {
    const isExpired = new Date(coupon.expires_at) < new Date();
    const isActive = coupon.is_active === 1 && !isExpired;

    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
          Active
        </span>
      );
    } else if (isExpired) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <Clock className="w-3 h-3 mr-1" />
          Expired
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" />
          Inactive
        </span>
      );
    }
  };

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading coupons...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-800">Error loading coupons</p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={fetchCoupons}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(false);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Tag className="text-blue-600" />
                Coupons
              </h1>
              <p className="text-gray-600">Manage your promotional coupons</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Total: <strong>{filteredCoupons.length}</strong> coupons
              </span>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Coupon
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
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <button
                onClick={fetchCoupons}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Coupons Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredCoupons.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No coupons found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first coupon'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Min Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCoupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{coupon.description}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(coupon.expires_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          ₹{coupon.minimum_order?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {coupon.used_count || 0}
                              {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge coupon={coupon} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => editCoupon(coupon)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Coupon"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCoupon(coupon.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Coupon"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SAVE20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder={formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimum_order}
                    onChange={(e) => setFormData({ ...formData, minimum_order: e.target.value })}
                    placeholder="e.g., 500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Per User Limit
                  </label>
                  <input
                    type="number"
                    value={formData.per_user_limit}
                    onChange={(e) => setFormData({ ...formData, per_user_limit: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the coupon offer"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingCoupon ? updateCoupon : createCoupon}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCoupons;