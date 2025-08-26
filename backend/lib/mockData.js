// Mock data for testing when database is unavailable
export const mockProducts = [
  {
    _id: "6507f1f77bcf86cd799439011",
    id: "6507f1f77bcf86cd799439011",
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for photography and professional use.",
    price: 999.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
    ],
    countInStock: 25,
    rating: 4.8,
    numReviews: 342
  },
  {
    _id: "6507f1f77bcf86cd799439012",
    id: "6507f1f77bcf86cd799439012",
    name: "Samsung Galaxy S24",
    description: "Flagship Android phone with AI features and excellent camera performance.",
    price: 899.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500"
    ],
    countInStock: 30,
    rating: 4.6,
    numReviews: 278
  },
  {
    _id: "6507f1f77bcf86cd799439013",
    id: "6507f1f77bcf86cd799439013",
    name: "MacBook Air M3",
    description: "Ultra-thin laptop with M3 chip, all-day battery life, and stunning Retina display.",
    price: 1199.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
    ],
    countInStock: 15,
    rating: 4.9,
    numReviews: 156
  },
  {
    _id: "6507f1f77bcf86cd799439014",
    id: "6507f1f77bcf86cd799439014",
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Max Air cushioning and modern design.",
    price: 129.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
    ],
    countInStock: 50,
    rating: 4.4,
    numReviews: 89
  },
  {
    _id: "6507f1f77bcf86cd799439015",
    id: "6507f1f77bcf86cd799439015",
    name: "Adidas Ultraboost 22",
    description: "Premium running shoes with responsive BOOST midsole and Primeknit upper.",
    price: 179.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500"
    ],
    countInStock: 35,
    rating: 4.5,
    numReviews: 124
  },
  {
    _id: "6507f1f77bcf86cd799439016",
    id: "6507f1f77bcf86cd799439016",
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling wireless headphones with superior sound quality.",
    price: 349.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    ],
    countInStock: 20,
    rating: 4.7,
    numReviews: 203
  },
  {
    _id: "6507f1f77bcf86cd799439017",
    id: "6507f1f77bcf86cd799439017",
    name: "Apple Watch Series 9",
    description: "Advanced health and fitness tracker with ECG, blood oxygen monitoring, and GPS.",
    price: 399.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=500"
    ],
    countInStock: 40,
    rating: 4.6,
    numReviews: 167
  },
  {
    _id: "6507f1f77bcf86cd799439018",
    id: "6507f1f77bcf86cd799439018",
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-leg jeans with authentic fit and timeless style.",
    price: 89.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"
    ],
    countInStock: 75,
    rating: 4.3,
    numReviews: 145
  }
];

export const mockUsers = new Map();

export const mockOrders = [];

export const mockCartItems = new Map(); // userId -> array of cart items

export const mockWishlistItems = new Map(); // userId -> array of product ids
