'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Mail, 
  Home,
  ShoppingBag,
  Star
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const OrderSuccessPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get the latest order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length > 0) {
      setOrderDetails(orders[orders.length - 1]);
    }
  }, []);

  if (!orderDetails) {
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Order Confirmed!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Thank you for your purchase. Your order has been successfully placed.
          </motion.p>

          {/* Order Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold text-gray-900">{orderDetails.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(orderDetails.orderDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-yellow-600 text-xl">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">
                  {orderDetails.shipping.firstName} {orderDetails.shipping.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{orderDetails.shipping.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900">{orderDetails.shipping.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-semibold text-gray-900">{orderDetails.shipping.country}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold text-gray-900">
                  {orderDetails.shipping.address}, {orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.zipCode}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Confirmation Email</h4>
                <p className="text-sm text-gray-600">You'll receive an email confirmation shortly</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Order Processing</h4>
                <p className="text-sm text-gray-600">We'll start processing your order right away</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Shipping Updates</h4>
                <p className="text-sm text-gray-600">Track your order with the order number</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
              >
                <Home size={20} />
                <span>Continue Shopping</span>
              </motion.button>
            </Link>
            <Link href="/latest-products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200"
              >
                <ShoppingBag size={20} />
                <span>Browse Products</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Review Request */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900">Love your purchase?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Share your experience with others by leaving a review. Your feedback helps us improve and helps other customers make informed decisions.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-200"
            >
              Leave a Review
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
