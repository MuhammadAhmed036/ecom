'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  ArrowLeft, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  Check,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  image_url: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

const ProductDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else {
        toast.error('Product not found');
        router.push('/');
      }
    } catch (error) {
      toast.error('Failed to fetch product');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
             toast.error('Please create an account to add items to your cart');
       const shouldRegister = confirm('Would you like to create an account now?');
       if (shouldRegister) {
         router.push('/register');
       }
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${quantity} item(s) added to cart`);
  };

  const handleWishlist = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
             toast.error('Please create an account to add items to your wishlist');
       const shouldRegister = confirm('Would you like to create an account now?');
       if (shouldRegister) {
         router.push('/register');
       }
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase' && quantity < (product?.stock_quantity || 1)) {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderStars = (rating: number = 4.5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={`${
          i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors"
            >
              Back to Home
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-1 hover:text-yellow-600 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <span>/</span>
          <span className="capitalize">{product.category.replace('-', ' ')}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Package className="h-24 w-24 text-gray-400" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {product.subcategory || product.category.replace('-', ' ')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlist}
                  className={`p-3 rounded-full shadow-lg transition-colors ${
                    isWishlisted 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white rounded-full shadow-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Share2 size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars()}
                  <span className="text-sm text-gray-600 ml-2">(4.5)</span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{Math.floor(Math.random() * 100) + 50} reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-yellow-600">${product.price}</span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-6 py-3 text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    disabled={quantity >= product.stock_quantity}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock_quantity} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/checkout')}
                disabled={product.stock_quantity === 0}
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </motion.button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">1 year warranty</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-600">30-day return policy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Authentic product guarantee</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium capitalize">{product.category.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subcategory:</span>
                  <span className="font-medium capitalize">{product.subcategory || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="font-medium">AB-{product.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Added:</span>
                  <span className="font-medium">{new Date(product.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
