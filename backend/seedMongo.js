// Simple MongoDB product seeding script
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for photography and professional use.",
    price: 999,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
    ],
    countInStock: 25,
    rating: 4.8,
    numReviews: 156
  },
  {
    name: "MacBook Air M3",
    description: "Powerful and lightweight laptop with M3 chip, 13-inch Liquid Retina display, and all-day battery life.",
    price: 1299,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
    ],
    countInStock: 15,
    rating: 4.9,
    numReviews: 243
  },
  {
    name: "Nike Air Jordan 1",
    description: "Classic basketball sneakers with premium leather construction and iconic design. Perfect for street style.",
    price: 179,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500"
    ],
    countInStock: 50,
    rating: 4.7,
    numReviews: 89
  },
  {
    name: "Samsung 55\" 4K Smart TV",
    description: "Crystal clear 4K resolution with smart features, HDR support, and sleek design for your living room.",
    price: 599,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500"
    ],
    countInStock: 12,
    rating: 4.6,
    numReviews: 67
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Premium running shoes with Boost midsole technology for maximum energy return and comfort.",
    price: 189,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500"
    ],
    countInStock: 35,
    rating: 4.8,
    numReviews: 134
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling headphones with premium sound quality and 30-hour battery life.",
    price: 399,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
    ],
    countInStock: 28,
    rating: 4.9,
    numReviews: 201
  },
  {
    name: "The North Face Jacket",
    description: "Waterproof and breathable outdoor jacket perfect for hiking and outdoor adventures.",
    price: 249,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500",
      "https://images.unsplash.com/photo-1544966503-7d42ebd32d5d?w=500"
    ],
    countInStock: 18,
    rating: 4.5,
    numReviews: 76
  },
  {
    name: "iPad Air 5th Gen",
    description: "Powerful tablet with M1 chip, 10.9-inch Liquid Retina display, and Apple Pencil support.",
    price: 599,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500"
    ],
    countInStock: 22,
    rating: 4.7,
    numReviews: 145
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "Classic straight fit jeans with authentic 5-pocket styling and premium denim construction.",
    price: 89,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
      "https://images.unsplash.com/photo-1506629905844-f4ab1f6a35a8?w=500"
    ],
    countInStock: 45,
    rating: 4.4,
    numReviews: 98
  },
  {
    name: "Canon EOS R6 Camera",
    description: "Professional mirrorless camera with 20MP full-frame sensor and advanced autofocus system.",
    price: 2499,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500"
    ],
    countInStock: 8,
    rating: 4.9,
    numReviews: 78
  },
  {
    name: "Ray-Ban Aviator Sunglasses",
    description: "Iconic aviator sunglasses with premium polarized lenses and classic gold frame.",
    price: 189,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
    ],
    countInStock: 32,
    rating: 4.6,
    numReviews: 112
  },
  {
    name: "Nintendo Switch OLED",
    description: "Portable gaming console with vibrant OLED display and enhanced audio for gaming on the go.",
    price: 349,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500"
    ],
    countInStock: 19,
    rating: 4.8,
    numReviews: 167
  },
  {
    name: "Converse Chuck Taylor All Star",
    description: "Classic canvas sneakers with rubber sole and timeless design. Perfect for casual wear.",
    price: 65,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "https://images.unsplash.com/photo-1552346989-e069318f803f?w=500"
    ],
    countInStock: 58,
    rating: 4.3,
    numReviews: 203
  },
  {
    name: "Apple Watch Series 9",
    description: "Advanced smartwatch with health monitoring, fitness tracking, and seamless iOS integration.",
    price: 429,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3f436f25d4d4?w=500",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500"
    ],
    countInStock: 31,
    rating: 4.7,
    numReviews: 189
  },
  {
    name: "Champion Hoodie",
    description: "Comfortable cotton blend hoodie with classic Champion logo and relaxed fit.",
    price: 79,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500"
    ],
    countInStock: 41,
    rating: 4.5,
    numReviews: 156
  },
  {
    name: "Dell XPS 13 Laptop",
    description: "Premium ultrabook with Intel Core i7, 13-inch InfinityEdge display, and all-day battery life.",
    price: 1199,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"
    ],
    countInStock: 14,
    rating: 4.6,
    numReviews: 92
  }
];

async function seedProducts() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('Product');
    
    // Clear existing products
    await collection.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const result = await collection.insertMany(sampleProducts);
    console.log(`Successfully inserted ${result.insertedCount} products!`);
    
    // List all products to verify
    const products = await collection.find({}).toArray();
    console.log(`Total products in database: ${products.length}`);
    
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await client.close();
  }
}

seedProducts();
