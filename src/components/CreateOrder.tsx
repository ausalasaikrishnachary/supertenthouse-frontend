import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/Config/Api';
import { 
  Plus, Minus, ShoppingCart, X, ChevronLeft, ChevronRight, ArrowLeft, 
  Printer, Download, FileText, User, Phone, Mail, Calendar, 
  Tag, Package, IndianRupee, CreditCard, Building, MapPin, Trash2, CheckCircle, ChevronUp, Home, Navigation
} from 'lucide-react';
import Navbar from './Navbar';

interface User {
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
  avatar?: string | null;
  is_verified?: number;
}

interface Product {
  id: number;
  product_name: string;
  product_code: string;
  price: string;
  available_stock: number;
  images: string[];
  discount: string;
  category_name: string;
  color: string;
  material: string;
}

interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  available_stock: number;
  image: string;
  product_code?: string;
  discount?: number;
}

interface OrderResponse {
  message: string;
  order_id: number;
  order_number: string;
  order: {
    id: number;
    customer_id: number;
    total_amount: number;
    items: CartItem[];
  };
}

const CreateOrder: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<OrderResponse | null>(null);
  const [orderDate, setOrderDate] = useState(new Date());
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});
  const [orderNumber, setOrderNumber] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  // Generate Order Number
  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/customers/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.data);
        
        if (userId) {
          const user = response.data.data.find((u: User) => u.id === parseInt(userId));
          if (user) {
            setSelectedUser(user);
            // Fetch full details for the selected user
            fetchUserDetails(user.id);
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        showToast('Failed to fetch users', 'error');
      }
    };
    fetchUsers();
  }, [userId]);

  // Fetch full user details including address
  const fetchUserDetails = async (id: number) => {
    setLoadingUserDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customers/details/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUserDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Fallback: use the basic user data
      setSelectedUserDetails(selectedUser);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Handle user selection
  const handleUserSelect = async (userId: string) => {
    const user = users.find(u => u.id === parseInt(userId));
    if (user) {
      setSelectedUser(user);
      await fetchUserDetails(user.id);
    } else {
      setSelectedUser(null);
      setSelectedUserDetails(null);
    }
  };

  // Fetch products
  useEffect(() => {
    if (showProducts) {
      const fetchProducts = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${BASE_URL}/api/products`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProducts(response.data);
          const initialQuantities: { [key: number]: number } = {};
          response.data.forEach((product: Product) => {
            initialQuantities[product.id] = 1;
          });
          setProductQuantities(initialQuantities);
        } catch (error) {
          console.error('Error fetching products:', error);
          showToast('Failed to fetch products', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [showProducts]);

  const updateProductQuantity = (productId: number, change: number) => {
    setProductQuantities(prev => {
      const currentQty = prev[productId] || 1;
      const newQty = currentQty + change;
      if (newQty < 1) return prev;
      const product = products.find(p => p.id === productId);
      if (product && newQty > product.available_stock) {
        showToast('Not enough stock available', 'error');
        return prev;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const addToCart = (product: Product) => {
    const quantity = productQuantities[product.id] || 1;
    const existingItem = cart.find(item => item.product_id === product.id);
    const price = parseFloat(product.price) * (1 - parseFloat(product.discount || '0') / 100);
    const discount = parseFloat(product.discount || '0');
    
    if (existingItem) {
      if (existingItem.quantity + quantity <= product.available_stock) {
        setCart(cart.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
        showToast(`Added ${quantity} more ${product.product_name} to cart`, 'success');
      } else {
        showToast('Not enough stock available', 'error');
      }
    } else {
      setCart([...cart, {
        product_id: product.id,
        product_name: product.product_name,
        price: price,
        quantity: quantity,
        available_stock: product.available_stock,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        product_code: product.product_code,
        discount: discount
      }]);
      showToast(`Added ${product.product_name} to cart`, 'success');
    }
    setProductQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const removeFromCart = (productId: number) => {
    const item = cart.find(i => i.product_id === productId);
    setCart(cart.filter(item => item.product_id !== productId));
    if (item) {
      showToast(`Removed ${item.product_name} from cart`, 'info');
    }
  };

  const updateCartQuantity = (productId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return item;
        if (newQuantity > item.available_stock) {
          showToast('Not enough stock available', 'error');
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const placeOrder = async () => {
    if (!selectedUser) {
      showToast('Please select a customer', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Please add at least one product', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        customer_id: selectedUser.id,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: calculateSubtotal()
      };

      const response = await axios.post(`${BASE_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const cartItemsForInvoice = [...cart];
      const orderNumberGen = response.data.order_number || generateOrderNumber();
      
      setPlacedOrder({
        ...response.data,
        order_number: orderNumberGen
      });
      setOrderNumber(orderNumberGen);
      setOrderDate(new Date());
      setShowInvoice(true);
      
      showToast('Order placed successfully! 🎉', 'success');
    } catch (error: any) {
      console.error('Error placing order:', error);
      showToast(error.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToOrders = () => {
    setShowInvoice(false);
    setPlacedOrder(null);
    setCart([]);
    setShowProducts(false);
    navigate('/admin/orders');
  };

  const nextImage = (productId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (productId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleHideProducts = () => {
    setShowProducts(false);
  };

  // Get address display text
  const getFullAddress = (user: User | null) => {
    if (!user) return 'No address available';
    const parts = [];
    if (user.address_line1) parts.push(user.address_line1);
    if (user.address_line2) parts.push(user.address_line2);
    if (user.city) parts.push(user.city);
    if (user.state) parts.push(user.state);
    if (user.pincode) parts.push(user.pincode);
    if (user.country) parts.push(user.country);
    return parts.length > 0 ? parts.join(', ') : 'No address available';
  };

  if (showInvoice && placedOrder) {
    const invoiceItems = cart.length > 0 ? cart : placedOrder.order?.items || [];
    
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #invoice-print-area, #invoice-print-area * {
                visibility: visible;
              }
              #invoice-print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                padding: 20px;
                background: white;
              }
              .no-print {
                display: none !important;
              }
              .print-break {
                page-break-after: avoid;
              }
            }
          `}
        </style>
        <div className="max-w-4xl mx-auto px-4">
          {toastMessage && (
            <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              toastType === 'success' ? 'bg-green-500' : 
              toastType === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } text-white flex items-center gap-2 no-print`}>
              {toastType === 'success' && <CheckCircle size={20} />}
              {toastMessage}
            </div>
          )}

          <div id="invoice-print-area" ref={invoiceRef} className="bg-white rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
            {/* Invoice Header - Screen View */}
            <div className="bg-gradient-to-r from-[#0c2d67] to-[#1a3f7a] text-white p-6 print:hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">🏪 TentHouse</h1>
                  <p className="text-blue-200 mt-1">123 Business Street, City</p>
                  <p className="text-blue-200">Email: info@tenthouse.com</p>
                  <p className="text-blue-200">Phone: +91 98765 43210</p>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-bold">INVOICE</h2>
                  <p className="text-lg mt-2">#{placedOrder.order_number || orderNumber}</p>
                  <p className="text-blue-200">Date: {orderDate.toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Invoice Header - Print View */}
            <div className="hidden print:block p-6 border-b-2 border-gray-300">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">TentHouse</h1>
                  <p className="text-gray-700 mt-1">123 Business Street, City</p>
                  <p className="text-gray-700">Email: info@tenthouse.com</p>
                  <p className="text-gray-700">Phone: +91 98765 43210</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800">#{placedOrder.order_number || orderNumber}</p>
                  <p className="text-gray-700">Date: {orderDate.toLocaleDateString('en-IN')}</p>
                  <p className="text-sm text-gray-500 mt-1">{orderDate.toLocaleTimeString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-b print:border-b-2 print:border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <User size={18} /> Customer Details
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-800"><strong>Name:</strong> {selectedUser?.name}</p>
                    <p className="text-gray-800"><strong>Email:</strong> {selectedUser?.email}</p>
                    <p className="text-gray-800"><strong>Phone:</strong> {selectedUser?.phone}</p>
                    {/* Display Address in Invoice */}
                    {(selectedUserDetails?.address_line1 || selectedUser?.address_line1) && (
                      <p className="text-gray-800 flex items-start gap-2 mt-2">
                        <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Address:</strong> {getFullAddress(selectedUserDetails || selectedUser)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold text-gray-700">Order Details</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-800"><strong>Order ID:</strong> #{placedOrder.order_id}</p>
                    <p className="text-gray-800"><strong>Status:</strong> <span className="text-green-600">Confirmed</span></p>
                    <p className="text-gray-800"><strong>Payment:</strong> <span className="text-yellow-600">Pending</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 print:p-4">
              <h3 className="font-semibold text-gray-700 mb-4">Order Items</h3>
              {invoiceItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items in this order</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50 print:bg-gray-100">
                      <tr className="border-b-2 border-gray-300 print:border-b-2 print:border-gray-400">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase print:text-gray-700">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase print:text-gray-700">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase print:text-gray-700">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase print:text-gray-700">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase print:text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 print:divide-y print:divide-gray-300">
                      {invoiceItems.map((item: CartItem, index: number) => (
                        <tr key={item.product_id} className="print:border-b print:border-gray-300">
                          <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img 
                                  src={`${BASE_URL}/${item.image}`} 
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded print:w-10 print:h-10"
                                  onError={(e) => (e.target as HTMLImageElement).src = '/placeholder-image.jpg'}
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-800">{item.product_name}</p>
                                <p className="text-xs text-gray-500">{item.product_code}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">₹{item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 border-t pt-6 print:border-t-2 print:border-gray-400">
                <div className="flex justify-end">
                  <div className="w-full md:w-72 space-y-2">
                    <div className="flex justify-between text-gray-600 print:text-gray-700">
                      <span>Subtotal:</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 print:text-gray-700">
                      <span>Tax (18%):</span>
                      <span>₹{calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-[#0c2d67] pt-2 border-t-2 border-dashed print:border-t-2 print:border-gray-400 print:text-gray-900">
                      <span>Grand Total:</span>
                      <span>₹{calculateGrandTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 text-center border-t print:bg-white print:border-t-2 print:border-gray-400">
              <p className="text-gray-600">Thank you for your business!</p>
              <p className="text-gray-400 text-sm mt-1">This is a system generated invoice.</p>
              <p className="text-gray-400 text-xs mt-2">{orderDate.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-center no-print">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-[#0c2d67] text-white rounded-lg hover:bg-[#1a3f7a] transition-colors flex items-center gap-2"
            >
              <Printer size={20} /> Print Invoice
            </button>
            <button
              onClick={handleBackToOrders}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FileText size={20} /> View All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          toastType === 'success' ? 'bg-green-500' : 
          toastType === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white flex items-center gap-2`}>
          {toastType === 'success' && <CheckCircle size={20} />}
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/orders')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Back to Users"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FileText size={18} />
            View Orders
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={20} /> Select Customer
          </h2>
          <select
            className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2d67]"
            value={selectedUser?.id || ''}
            onChange={(e) => handleUserSelect(e.target.value)}
          >
            <option value="">Select a customer...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.email}
              </option>
            ))}
          </select>
          
          {selectedUser && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  <span className="font-semibold">Name:</span> {selectedUser.name}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  <span className="font-semibold">Email:</span> {selectedUser.email}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Phone size={16} className="text-blue-600" />
                  <span className="font-semibold">Phone:</span> {selectedUser.phone}
                </p>
              </div>
              
              {/* ─── ADDRESS SECTION - NOW DISPLAYED ────────────────────────── */}
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-blue-600" />
                  Address Details
                </p>
                {loadingUserDetails ? (
                  <p className="text-sm text-gray-500">Loading address...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[70px]">Address 1:</span>
                      <span className="text-gray-800">
                        {selectedUserDetails?.address_line1 || selectedUser?.address_line1 || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[70px]">Address 2:</span>
                      <span className="text-gray-800">
                        {selectedUserDetails?.address_line2 || selectedUser?.address_line2 || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[70px]">City:</span>
                      <span className="text-gray-800">
                        {selectedUserDetails?.city || selectedUser?.city || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[70px]">State:</span>
                      <span className="text-gray-800">
                        {selectedUserDetails?.state || selectedUser?.state || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[70px]">Pincode:</span>
                      <span className="text-gray-800">
                        {selectedUserDetails?.pincode || selectedUser?.pincode || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[70px]">Country:</span>
                      <span className="text-gray-800">
                        {selectedUserDetails?.country || selectedUser?.country || 'India'}
                      </span>
                    </div>
                  </div>
                )}
                {/* Full address display */}
                <div className="mt-2 p-2 bg-white rounded border border-blue-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Full Address:</span>{' '}
                    {getFullAddress(selectedUserDetails || selectedUser)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Package size={20} /> Products
            </h2>
            {!showProducts ? (
              <button
                onClick={() => setShowProducts(true)}
                className="px-4 py-2 bg-[#0c2d67] text-white rounded-lg hover:bg-[#1a3f7a] transition-colors"
              >
                Show All Products
              </button>
            ) : (
              <button
                onClick={() => setShowProducts(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Hide Products
              </button>
            )}
          </div>

          {showProducts && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                {loading ? (
                  <div className="col-span-full text-center py-8 text-gray-500">Loading products...</div>
                ) : products.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">No products available</div>
                ) : (
                  products.map(product => {
                    const isInCart = cart.some(item => item.product_id === product.id);
                    return (
                      <div key={product.id} className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative ${isInCart ? 'border-green-500 border-2' : ''}`}>
                        {isInCart && (
                          <div className="absolute z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-br-lg">
                            In Cart ✓
                          </div>
                        )}
                        <div className="relative h-48 bg-gray-100">
                          {product.images && product.images.length > 0 ? (
                            <>
                              <img
                                src={`${BASE_URL}/${product.images[currentImageIndex[product.id] || 0]}`}
                                alt={product.product_name}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                }}
                              />
                              {product.images.length > 1 && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      prevImage(product.id, product.images.length);
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                  >
                                    <ChevronLeft size={20} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      nextImage(product.id, product.images.length);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                  >
                                    <ChevronRight size={20} />
                                  </button>
                                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {product.images.map((_, idx) => (
                                      <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full ${
                                          idx === (currentImageIndex[product.id] || 0)
                                            ? 'bg-white'
                                            : 'bg-white/50'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-48 flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {product.product_name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {product.category_name}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-[#0c2d67]">
                                ₹{parseFloat(product.price).toFixed(2)}
                              </span>
                              {parseFloat(product.discount) > 0 && (
                                <span className="ml-2 text-sm text-red-500 line-through">
                                  ₹{(parseFloat(product.price) / (1 - parseFloat(product.discount) / 100)).toFixed(2)}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              Stock: {product.available_stock}
                            </span>
                          </div>
                          
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center border rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateProductQuantity(product.id, -1)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                disabled={(productQuantities[product.id] || 1) <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-4 py-1 text-sm font-medium min-w-[30px] text-center">
                                {productQuantities[product.id] || 1}
                              </span>
                              <button
                                onClick={() => updateProductQuantity(product.id, 1)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                disabled={(productQuantities[product.id] || 1) >= product.available_stock}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.available_stock === 0}
                              className={`flex-1 px-3 py-1 text-sm rounded-lg transition-colors ${
                                product.available_stock > 0
                                  ? isInCart 
                                    ? 'bg-green-600 text-white hover:bg-green-700' 
                                    : 'bg-[#0c2d67] text-white hover:bg-[#1a3f7a]'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {isInCart ? '✓ Added' : product.available_stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {showProducts && products.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleHideProducts}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <ChevronUp size={18} />
                    Hide Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#0c2d67] to-[#1a3f7a] text-white p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} />
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm">
                  {cart.length} items
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cart.map((item, index) => (
                      <tr key={item.product_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={`${BASE_URL}/${item.image}`}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                }}
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
                              {item.product_code && (
                                <p className="text-xs text-gray-500">{item.product_code}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">₹{item.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.product_id, -1)}
                              className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product_id, 1)}
                              className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 border-t pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-gray-600">Tax (18%):</span>
                      <span className="font-medium">₹{calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex gap-4 text-lg font-bold text-[#0c2d67]">
                      <span>Grand Total:</span>
                      <span>₹{calculateGrandTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={isSubmitting || !selectedUser}
                    className={`px-8 py-3 bg-green-600 text-white rounded-lg transition-colors text-lg font-semibold ${
                      isSubmitting || !selectedUser
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-green-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span> Processing...
                      </span>
                    ) : (
                      'Complete Order'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {cart.length === 0 && showProducts && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <p className="text-gray-400 text-sm">Add products from the list above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOrder;