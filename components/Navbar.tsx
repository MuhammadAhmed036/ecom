'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Heart, 
  ShoppingCart,
  Globe,
  Star,
  LogOut
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole('');
    setUser(null);
    window.location.href = '/';
  };

  const categories = [
    { name: "Men's Clothing", href: "/mens-clothing" },
    { name: "Women's Clothing", href: "/womens-clothing" },
    { name: "Men's Accessories", href: "/mens-accessories" },
    { name: "Women's Accessories", href: "/womens-accessories" },
  ];

  return (
    <>
      {/* Top Bar - Similar to reference */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center space-x-6">
              <Link href="/" className="hover:text-yellow-400 transition-colors">Best Sellers</Link>
              <Link href="/latest-products" className="hover:text-yellow-400 transition-colors">New Releases</Link>
              <Link href="/" className="hover:text-yellow-400 transition-colors">Today's Deals</Link>
              <Link href="/" className="hover:text-yellow-400 transition-colors">Customer Service</Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe size={16} className="text-purple-400" />
                <select className="bg-transparent border-none text-white text-sm focus:outline-none">
                  <option>English</option>
                  <option>العربية</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-yellow-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-black/10 transition-colors"
              >
                <Menu size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} />
              </button>
              
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-black/10 transition-colors">
                  <span className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                    All Categories
                  </span>
                  <ChevronDown size={16} className={isScrolled ? 'text-gray-800' : 'text-white'} />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-2">
                    {categories.map((category, index) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center px-4 py-3 text-gray-800 hover:bg-yellow-50 transition-colors"
                      >
                        <span className="text-sm font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Brand Logo */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex-1 flex justify-center"
            >
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  Ahmed Brands
                </span>
              </Link>
            </motion.div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-white rounded-full shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search Ahmed Brands..."
                  className="px-4 py-2 w-64 focus:outline-none text-gray-800"
                />
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 transition-colors">
                  <Search size={20} className="text-white" />
                </button>
              </div>

              {/* Cart & User */}
              <div className="flex items-center space-x-2">
                <Link href="/cart" className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-black/10 transition-colors">
                  <ShoppingCart size={20} className={isScrolled ? 'text-gray-800' : 'text-white'} />
                  <span className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>CART</span>
                </Link>
                
                <Link href="/wishlist" className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-black/10 transition-colors">
                  <Heart size={20} className={isScrolled ? 'text-gray-800' : 'text-white'} />
                  <span className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>WISHLIST</span>
                </Link>
                
                {isLoggedIn ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-black/10 transition-colors">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                          {user?.profileImage ? (
                            <img 
                              src={user.profileImage} 
                              alt={user.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} className={isScrolled ? 'text-gray-800' : 'text-white'} />
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                      </div>
                      <span className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                        {user?.name?.split(' ')[0] || 'ACCOUNT'}
                      </span>
                    </button>
                    
                    {/* Account Dropdown for logged in users */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 text-gray-800 hover:bg-yellow-50 transition-colors"
                        >
                          <span className="text-sm font-medium">My Profile</span>
                        </Link>
                        {(userRole === 'admin' || userRole === 'superadmin') && (
                          <Link
                            href={userRole === 'superadmin' ? '/superadmin' : '/admin'}
                            className="flex items-center px-4 py-3 text-gray-800 hover:bg-yellow-50 transition-colors"
                          >
                            <span className="text-sm font-medium">Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut size={16} className="mr-2" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-black/10 transition-colors">
                      <User size={20} className={isScrolled ? 'text-gray-800' : 'text-white'} />
                      <span className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>ACCOUNT</span>
                    </button>
                    
                    {/* Account Dropdown for non-logged in users */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="py-2">
                        <Link
                          href="/login"
                          className="flex items-center px-4 py-3 text-gray-800 hover:bg-yellow-50 transition-colors"
                        >
                          <span className="text-sm font-medium">Sign In</span>
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center px-4 py-3 text-gray-800 hover:bg-yellow-50 transition-colors"
                        >
                          <span className="text-sm font-medium">Create Account</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search Ahmed Brands..."
                  className="flex-1 px-4 py-2 bg-transparent focus:outline-none"
                />
                <button className="px-4 py-2 bg-orange-500">
                  <Search size={20} className="text-white" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Categories</h3>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block py-2 text-gray-600 hover:text-yellow-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      className="block py-2 text-gray-600 hover:text-yellow-500 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    {(userRole === 'admin' || userRole === 'superadmin') && (
                      <Link
                        href={userRole === 'superadmin' ? '/superadmin' : '/admin'}
                        className="block py-2 text-gray-600 hover:text-yellow-500 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block py-2 text-gray-600 hover:text-yellow-500 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block py-2 text-gray-600 hover:text-yellow-500 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
