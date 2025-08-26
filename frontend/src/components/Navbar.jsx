import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserProfile from './UserProfile';

function Navbar() {
  const { user } = useSelector(state => state.user);
  const { items } = useSelector(state => state.cart);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setSearchTerm('');
    }
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex justify-between items-center py-2 text-white text-sm border-b border-blue-500">
          <div className="flex items-center space-x-4">
            <span>📞 +977-9800000000</span>
            <span>📧 support@ourecom.com</span>
          </div>
        </div>

        {/* Main navbar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white text-blue-600 p-2 rounded-lg font-bold text-xl">
              🛍️ Ourecom
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 px-4 py-2 text-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-r-lg transition-colors"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Right menu */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart" className="relative text-white hover:text-orange-300 transition-colors">
              <span className="text-2xl">🛒</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="hidden md:inline ml-1">Cart</span>
            </Link>

            {/* User Profile - Enhanced */}
            <UserProfile />

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Categories bar */}
        <div className="hidden md:flex items-center space-x-8 pb-4 text-white">
          <Link to="/products" className="hover:text-orange-300 transition-colors">All Products</Link>
          <Link to="/products?category=Electronics" className="hover:text-orange-300 transition-colors">Electronics</Link>
          <Link to="/products?category=Fashion" className="hover:text-orange-300 transition-colors">Fashion</Link>
          <Link to="/products?category=Home" className="hover:text-orange-300 transition-colors">Home & Garden</Link>
          <Link to="/products?category=Sports" className="hover:text-orange-300 transition-colors">Sports</Link>
          <Link to="/products?category=Books" className="hover:text-orange-300 transition-colors">Books</Link>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800 text-white py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-3 py-2 text-gray-800 rounded-l"
                />
                <button type="submit" className="bg-orange-500 px-4 py-2 rounded-r">🔍</button>
              </div>
            </form>
            <div className="space-y-2">
              <Link to="/products" className="block py-2 hover:text-orange-300">All Products</Link>
              <Link to="/products?category=Electronics" className="block py-2 hover:text-orange-300">Electronics</Link>
              <Link to="/products?category=Fashion" className="block py-2 hover:text-orange-300">Fashion</Link>
              <Link to="/orders" className="block py-2 hover:text-orange-300">My Orders</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
