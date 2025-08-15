'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Eye,
  UserCheck,
  UserX,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Settings,
  BarChart3,
  Activity,
  DollarSign,
  ShoppingCart,
  Star,
  Calendar,
  Mail,
  Phone,
  AlertTriangle,
  MapPin,
  ShoppingBag,
  CreditCard,
  User,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  role: string;
  is_approved: boolean;
  last_activity: string;
  created_at: string;
  profile_image: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  image_url: string;
  stock_quantity: number;
  is_featured: boolean;
  created_at: string;
}

interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  user_name: string;
  user_email: string;
}

const SuperAdminPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showUserDetails, setShowUserDetails] = useState<number | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      toast.error('Access denied. Please login.');
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      if (user.role !== 'superadmin') {
        toast.error('Access denied. Superadmin privileges required.');
        router.push('/login');
      }
    } catch (error) {
      toast.error('Invalid user data. Please login again.');
      router.push('/login');
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        router.push('/login');
        return;
      }

      // Fetch users
      const usersResponse = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

      // Fetch products
      const productsResponse = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.products);
      }

      // Fetch orders
      const ordersResponse = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('User approved successfully');
        fetchData();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to approve user');
      }
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('An error occurred');
    }
  };

  const handleDeleteEmployee = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Employee deleted successfully');
        fetchData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred');
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        router.push('/login');
        return;
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success('Product added successfully');
        setShowAddProductModal(false);
        fetchData();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Add product error:', error);
      toast.error('An error occurred');
    }
  };

  const handleEditProduct = async (productId: number, productData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success('Product updated successfully');
        setEditingProduct(null);
        fetchData();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Edit product error:', error);
      toast.error('An error occurred');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Product deleted successfully');
        fetchData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      toast.error('An error occurred');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const pendingAdmins = users.filter(user => user.role === 'admin' && !user.is_approved);
  const approvedAdmins = users.filter(user => user.role === 'admin' && user.is_approved);
  const customers = users.filter(user => user.role === 'customer');
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600">Manage your e-commerce platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddProductModal(true)}
                className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Users</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="h-12 w-12 text-green-200" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Orders</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <ShoppingCart className="h-12 w-12 text-purple-200" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Total Revenue</p>
                  <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-12 w-12 text-yellow-200" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'users', name: 'Users', icon: Users },
                { id: 'products', name: 'Products', icon: Package },
                { id: 'orders', name: 'Orders', icon: ShoppingCart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Pending Admins</h3>
                      <p className="text-3xl font-bold text-blue-600">{pendingAdmins.length}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Approved Admins</h3>
                      <p className="text-3xl font-bold text-green-600">{approvedAdmins.length}</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">Customers</h3>
                      <p className="text-3xl font-bold text-purple-600">{customers.length}</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {users.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 capitalize">{user.role}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Filters */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      <option value="customer">Customers</option>
                      <option value="admin">Admins</option>
                      <option value="superadmin">Super Admins</option>
                    </select>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                    {user.profile_image ? (
                                      <img src={user.profile_image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                      <User className="h-5 w-5 text-yellow-600" />
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                    <div className="text-sm text-gray-500">{user.phone}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                                  user.role === 'admin' ? 'bg-green-100 text-green-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {user.role === 'admin' ? (
                                  user.is_approved ? (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approved
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Pending
                                    </span>
                                  )
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setShowUserDetails(showUserDetails === user.id ? null : user.id)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  {user.role === 'admin' && !user.is_approved && (
                                    <button
                                      onClick={() => handleApproveUser(user.id)}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      <UserCheck size={16} />
                                    </button>
                                  )}
                                  {user.role === 'admin' && (
                                    <button
                                      onClick={() => handleDeleteEmployee(user.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* User Details Modal */}
                  {showUserDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                          <button
                            onClick={() => setShowUserDetails(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X size={24} />
                          </button>
                        </div>
                        
                        {(() => {
                          const user = users.find(u => u.id === showUserDetails);
                          if (!user) return null;
                          
                          return (
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                                  {user.profile_image ? (
                                    <img src={user.profile_image} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                                  ) : (
                                    <User className="h-10 w-10 text-yellow-600" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-xl font-semibold text-gray-900">{user.name}</h4>
                                  <p className="text-gray-600">{user.email}</p>
                                  <p className="text-gray-600">{user.phone}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Age</label>
                                  <p className="text-gray-900">{user.age}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                                  <p className="text-gray-900 capitalize">{user.gender}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Role</label>
                                  <p className="text-gray-900 capitalize">{user.role}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Status</label>
                                  <p className="text-gray-900">
                                    {user.role === 'admin' ? (user.is_approved ? 'Approved' : 'Pending') : 'Active'}
                                  </p>
                                </div>
                              </div>
                              
                              {(user.address_line1 || user.city || user.state) && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    {user.address_line1 && <p className="text-gray-900">{user.address_line1}</p>}
                                    {user.address_line2 && <p className="text-gray-900">{user.address_line2}</p>}
                                    <p className="text-gray-900">
                                      {[user.city, user.state, user.zip_code, user.country].filter(Boolean).join(', ')}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Joined</label>
                                  <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Last Activity</label>
                                  <p className="text-gray-900">{new Date(user.last_activity).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'products' && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Products Management</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddProductModal(true)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add Product</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-yellow-600">${product.price}</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              product.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.is_featured ? 'Featured' : 'Regular'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <span>Stock: {product.stock_quantity}</span>
                            <span className="capitalize">{product.category}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Customer Orders</h3>
                  
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{order.user_name}</div>
                                  <div className="text-sm text-gray-500">{order.user_email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">${order.total_amount.toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SuperAdminPage;
