import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading } = useSelector(state => state.products);
  const { user } = useSelector(state => state.user);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => { 
    dispatch(fetchProduct(id)); 
  }, [dispatch, id]);

  const isInWishlist = wishlistItems.some(item => 
    (item._id || item.id) === (product?._id || product?.id)
  );

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ 
      productId: product._id || product.id, 
      quantity 
    }));
  };

  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist({ productId: product._id || product.id }));
    } else {
      dispatch(addToWishlist({ productId: product._id || product.id }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button 
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-800 transition-all duration-300"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || ['/placeholder.jpg'];
  const rating = product.rating || 4.5;
  const numReviews = product.numReviews || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                {product.category}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(rating) ? (
                    <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <StarIcon key={i} className="h-5 w-5 text-gray-300" />
                  )
                ))}
              </div>
              <span className="text-gray-600">
                {rating} ({numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-orange-600">
                  ${product.price}
                </span>
                <span className="text-gray-500 line-through text-xl">
                  ${(product.price * 1.2).toFixed(2)}
                </span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  17% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-semibold ${
                product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.countInStock > 0 
                  ? `In Stock (${product.countInStock} available)` 
                  : 'Out of Stock'
                }
              </span>
            </div>

            {/* Quantity Selector */}
            {product.countInStock > 0 && (
              <div className="flex items-center gap-4">
                <label className="font-semibold text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-xl">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button 
                onClick={handleWishlistToggle}
                className="p-4 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all duration-300 group"
              >
                {isInWishlist ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-400 group-hover:text-red-500" />
                )}
              </button>
            </div>

            {/* Features */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <TruckIcon className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-600">1 year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
