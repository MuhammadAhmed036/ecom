'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Truck,
  User,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  shipping_address: any;
}

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track your order history and status</p>
          </div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-12 text-center"
            >
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/latest-products')}
                className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors"
              >
                Start Shopping
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Order #{order.order_number}</h3>
                          <p className="text-yellow-100 text-sm">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">${order.total_amount.toFixed(2)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Order Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Package className="h-4 w-4 text-yellow-500 mr-2" />
                          Order Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order Number:</span>
                            <span className="font-medium">{order.order_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order Date:</span>
                            <span className="font-medium">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-medium text-green-600">
                              ${order.total_amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className={`font-medium ${
                              order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.shipping_address && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <MapPin className="h-4 w-4 text-yellow-500 mr-2" />
                            Shipping Address
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            {order.shipping_address.address_line1 && (
                              <p>{order.shipping_address.address_line1}</p>
                            )}
                            {order.shipping_address.address_line2 && (
                              <p>{order.shipping_address.address_line2}</p>
                            )}
                            <p>
                              {[
                                order.shipping_address.city,
                                order.shipping_address.state,
                                order.shipping_address.zip_code,
                                order.shipping_address.country
                              ].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Order Status */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Truck className="h-4 w-4 text-yellow-500 mr-2" />
                          Order Status
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <p className="font-medium text-gray-900 capitalize">{order.status}</p>
                              <p className="text-sm text-gray-500">
                                {order.status === 'completed' ? 'Order delivered successfully' :
                                 order.status === 'shipped' ? 'Order is on its way' :
                                 order.status === 'processing' ? 'Order is being processed' :
                                 'Order is pending'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </motion.button>
                        {order.status === 'completed' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                          >
                            Leave Review
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;
