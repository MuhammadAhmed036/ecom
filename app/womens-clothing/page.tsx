'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, Eye, Filter, Search, Grid, List, Package, Shirt } from 'lucide-react';
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
  is_featured: boolean;
  created_at: string;
}

const WomensClothingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedSubcategory, sortBy, priceRange]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?category=womens-clothing');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      toast.error('An error occurred while fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesSubcategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  };

  const subcategories = [
    { id: 'all', name: 'All Items', count: products.length },
    { id: 'dresses', name: 'Dresses', count: products.filter(p => p.subcategory === 'dresses').length },
    { id: 'tops', name: 'Tops', count: products.filter(p => p.subcategory === 'tops').length },
    { id: 'skirts', name: 'Skirts', count: products.filter(p => p.subcategory === 'skirts').length },
    { id: 'jeans', name: 'Jeans', count: products.filter(p => p.subcategory === 'jeans').length },
    { id: 'jackets', name: 'Jackets', count: products.filter(p => p.subcategory === 'jackets').length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-pink-600 to-rose-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Shirt className="h-12 w-12 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Women's Clothing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Discover your unique style with our elegant collection of women's clothing. From casual chic to sophisticated elegance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center space-x-4"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white">
              <span className="font-semibold">{filteredProducts.length} Items</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white">
              <span className="font-semibold">Elegant Collection</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search women's clothing..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Subcategory Filter */}
            <div className="lg:w-64">
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {subcategories.map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name} ({subcategory.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shirt className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Product Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'h-64'}`}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
                      <Shirt className="h-12 w-12 text-pink-400" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                    <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Heart size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-pink-600 hover:text-white transition-colors"
                      >
                        <Eye size={16} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {product.is_featured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    <span className="bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {product.subcategory || 'Clothing'}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-pink-600">${product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-pink-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag size={16} />
                      <span>Add to Cart</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Heart size={16} className="text-gray-600" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-lg"
            >
              Load More Items
            </motion.button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WomensClothingPage;
