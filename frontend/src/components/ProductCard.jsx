import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, EyeIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, CheckIcon } from '@heroicons/react/24/solid';
import { addToCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: cartItems, loading: cartLoading } = useSelector(state => state.cart);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  
  const isInWishlist = wishlistItems.some(item => 
    (item.product?.id || item.product?._id) === (product.id || product._id)
  );
  
  const isInCart = cartItems.some(item => 
    (item.product?.id || item.product?._id) === (product.id || product._id)
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart || justAdded) return;
    
    setIsAddingToCart(true);
    
    try {
      await dispatch(addToCart({ 
        productId: product.id || product._id, 
        quantity: 1 
      })).unwrap();
      
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product.id || product._id)).unwrap();
      } else {
        await dispatch(addToWishlist({ productId: product.id || product._id })).unwrap();
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/products/${product.id || product._id}`}>
          <img
            src={product.images?.[0] || '/api/placeholder/300/300'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/api/placeholder/300/300';
            }}
          />
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 group/wishlist"
        >
          {isInWishlist ? (
            <HeartSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600 group-hover/wishlist:text-red-500 transition-colors" />
          )}
        </button>

        {/* Quick View Button */}
        <Link
          to={`/products/${product.id || product._id}`}
          className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
        >
          <EyeIcon className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors" />
        </Link>

        {/* Stock Status */}
        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand/Category */}
        <div className="text-sm text-gray-500 mb-1 capitalize">
          {product.category}
        </div>

        {/* Product Name */}
        <Link to={`/products/${product.id || product._id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.countInStock === 0 || isAddingToCart || justAdded}
          className={`w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            justAdded
              ? 'bg-green-500 text-white'
              : isInCart
              ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
              : product.countInStock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
          }`}
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Adding...
            </>
          ) : justAdded ? (
            <>
              <CheckIcon className="h-5 w-5" />
              Added!
            </>
          ) : isInCart ? (
            <>
              <ShoppingCartIcon className="h-5 w-5" />
              In Cart
            </>
          ) : product.countInStock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCartIcon className="h-5 w-5" />
              Add to Cart
            </>
          )}
        </button>

        {/* Stock Info */}
        {product.countInStock > 0 && product.countInStock <= 10 && (
          <div className="text-xs text-orange-600 mt-2 text-center">
            Only {product.countInStock} left in stock!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
