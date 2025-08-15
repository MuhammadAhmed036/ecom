'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Camera, 
  Upload,
  ShoppingBag,
  Heart,
  Package,
  LogOut,
  Settings,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  role: string;
  profile_image: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  created_at: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          age: data.user.age?.toString() || '',
          gender: data.user.gender || '',
          address_line1: data.user.address_line1 || '',
          address_line2: data.user.address_line2 || '',
          city: data.user.city || '',
          state: data.user.state || '',
          zip_code: data.user.zip_code || '',
          country: data.user.country || ''
        });
        if (data.user.profile_image) {
          setImagePreview(data.user.profile_image);
        }
      } else {
        toast.error('Failed to fetch profile');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('phone', formData.phone);
      submitData.append('age', formData.age);
      submitData.append('gender', formData.gender);
      submitData.append('address_line1', formData.address_line1);
      submitData.append('address_line2', formData.address_line2);
      submitData.append('city', formData.city);
      submitData.append('state', formData.state);
      submitData.append('zip_code', formData.zip_code);
      submitData.append('country', formData.country);
      
      if (profileImage) {
        submitData.append('profile_image', profileImage);
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        fetchUserProfile(); // Refresh the data
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors"
            >
              Go to Login
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white text-yellow-500 p-1 rounded-full cursor-pointer hover:bg-gray-50 transition-colors shadow-lg">
                      <Camera size={12} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-yellow-100">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Shield className="h-4 w-4 text-yellow-100" />
                    <span className="text-yellow-100 capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-yellow-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </motion.button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save size={16} />
                      <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsEditing(false);
                        fetchUserProfile(); // Reset to original data
                      }}
                      className="bg-white text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </motion.button>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 text-yellow-500 mr-2" />
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.phone}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          min="18"
                          max="100"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{user.age}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 capitalize">{user.gender}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 text-yellow-500 mr-2" />
                  Address Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.address_line1 || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.address_line2 || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{user.city || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{user.state || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="zip_code"
                          value={formData.zip_code}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{user.zip_code || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{user.country || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/cart')}
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900">My Cart</p>
                    <p className="text-sm text-blue-700">View shopping cart</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/wishlist')}
                  className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Heart className="h-6 w-6 text-red-600" />
                  <div className="text-left">
                    <p className="font-medium text-red-900">Wishlist</p>
                    <p className="text-sm text-red-700">View saved items</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/orders')}
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <Package className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-green-900">My Orders</p>
                    <p className="text-sm text-green-700">Track orders</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
