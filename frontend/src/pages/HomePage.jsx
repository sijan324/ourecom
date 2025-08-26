import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(state => state.products);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => { 
    dispatch(fetchProducts({ limit: 8 })); 
  }, [dispatch]);

  // Hero carousel data
  const heroSlides = [
    {
      title: "Amazing Deals",
      subtitle: "Up to 70% Off on Electronics",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200",
      link: "/products?category=Electronics"
    },
    {
      title: "Fashion Sale",
      subtitle: "Latest Trends at Best Prices",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
      link: "/products?category=Fashion"
    },
    {
      title: "Home Essentials",
      subtitle: "Make Your Home Beautiful",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
      link: "/products?category=Home"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const categories = [
    { name: "Electronics", icon: "📱", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300", count: "500+ Items" },
    { name: "Fashion", icon: "👕", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300", count: "1200+ Items" },
    { name: "Home", icon: "🏠", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300", count: "800+ Items" },
    { name: "Sports", icon: "⚽", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300", count: "300+ Items" },
    { name: "Books", icon: "📚", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300", count: "2000+ Items" },
    { name: "Beauty", icon: "💄", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300", count: "600+ Items" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="text-white max-w-lg">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl mb-8">{slide.subtitle}</p>
                <Link
                  to={slide.link}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Special Offers Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold">🎉 Free Delivery on Orders Over Rs. 2000 | 📞 24/7 Customer Support</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center">
                  <div 
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">⚡ Flash Sale</h2>
            <p className="text-xl mb-4">Limited Time Offers - Up to 60% Off!</p>
            <div className="flex justify-center items-center space-x-4 text-lg">
              <div className="bg-white/20 px-3 py-2 rounded">
                <span className="font-bold">02</span>
                <div className="text-xs">Days</div>
              </div>
              <span>:</span>
              <div className="bg-white/20 px-3 py-2 rounded">
                <span className="font-bold">14</span>
                <div className="text-xs">Hours</div>
              </div>
              <span>:</span>
              <div className="bg-white/20 px-3 py-2 rounded">
                <span className="font-bold">35</span>
                <div className="text-xs">Mins</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
            <Link 
              to="/products" 
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
            >
              View All <span className="ml-1">→</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                  <div className="bg-gray-200 h-40 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {list.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">📧 Stay Updated</h2>
          <p className="text-xl mb-6">Get the latest deals and offers straight to your inbox!</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
            />
            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-r-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
