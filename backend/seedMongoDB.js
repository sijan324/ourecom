// MongoDB native seeding script
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
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
    numReviews: 342,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
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
    numReviews: 278,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
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
    numReviews: 156,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
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
    numReviews: 89,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
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
    numReviews: 124,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
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
    numReviews: 203,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
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
    numReviews: 145,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
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
    numReviews: 167,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Gaming Chair Pro",
    description: "Ergonomic gaming chair with lumbar support, adjustable height, and premium materials.",
    price: 299.99,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
      "https://images.unsplash.com/photo-1562113530-57ba4cea77b0?w=500"
    ],
    countInStock: 12,
    rating: 4.2,
    numReviews: 78,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Instant Pot Duo 7-in-1",
    description: "Multi-functional pressure cooker that replaces 7 kitchen appliances.",
    price: 79.99,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1585515656692-93c2e1c6f084?w=500",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
    ],
    countInStock: 28,
    rating: 4.5,
    numReviews: 234,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Ray-Ban Aviator Sunglasses",
    description: "Iconic aviator sunglasses with premium polarized lenses and classic gold frame.",
    price: 189.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
    ],
    countInStock: 32,
    rating: 4.6,
    numReviews: 112,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Nintendo Switch OLED",
    description: "Portable gaming console with vibrant OLED display and enhanced audio for gaming on the go.",
    price: 349.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500"
    ],
    countInStock: 19,
    rating: 4.8,
    numReviews: 167,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedProducts() {
  const connectionString = process.env.DATABASE_URL.replace('?retryWrites=true&w=majority&connectTimeoutMS=60000&socketTimeoutMS=60000', '');
  const client = new MongoClient(connectionString, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db('ourecom');
    const collection = db.collection('products');
    
    // Clear existing products
    console.log('🧹 Clearing existing products...');
    const deleteResult = await collection.deleteMany({});
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing products`);
    
    // Insert new products
    console.log('📦 Adding sample products...');
    const insertResult = await collection.insertMany(sampleProducts);
    console.log(`✅ Successfully inserted ${insertResult.insertedCount} products!`);
    
    // Show summary
    const totalProducts = await collection.countDocuments();
    console.log(`📊 Total products in database: ${totalProducts}`);
    
    // Show categories
    const categories = await collection.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    console.log('\n📊 Products by Category:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} products`);
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    
    // Try with different connection approach
    if (error.message.includes('timeout') || error.message.includes('closed')) {
      console.log('\n🔄 Retrying with alternative connection...');
      const altConnectionString = 'mongodb+srv://sijangautam17:sijan@cluster0.m0e69.mongodb.net/ourecom?retryWrites=true&w=majority';
      const altClient = new MongoClient(altConnectionString);
      
      try {
        await altClient.connect();
        console.log('✅ Alternative connection successful!');
        // Repeat seeding with alternative client
        const db = altClient.db('ourecom');
        const collection = db.collection('products');
        await collection.deleteMany({});
        const result = await collection.insertMany(sampleProducts);
        console.log(`✅ Successfully inserted ${result.insertedCount} products with alternative connection!`);
        await altClient.close();
      } catch (altError) {
        console.error('❌ Alternative connection also failed:', altError.message);
      }
    }
  } finally {
    await client.close();
  }
}

seedProducts();
