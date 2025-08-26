import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    numReviews: 342
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
    numReviews: 278
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
    numReviews: 156
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
    numReviews: 89
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
    numReviews: 124
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
    numReviews: 203
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
    numReviews: 145
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
    numReviews: 167
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
    numReviews: 78
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
    numReviews: 234
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
    numReviews: 112
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
    numReviews: 167
  },
  {
    name: "The North Face Jacket",
    description: "Waterproof and breathable outdoor jacket perfect for hiking and outdoor adventures.",
    price: 249.99,
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
    price: 599.99,
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
    name: "Canon EOS R6 Camera",
    description: "Professional mirrorless camera with 20MP full-frame sensor and advanced autofocus system.",
    price: 2499.99,
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
    name: "Converse Chuck Taylor All Star",
    description: "Classic canvas sneakers with rubber sole and timeless design. Perfect for casual wear.",
    price: 65.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "https://images.unsplash.com/photo-1552346989-e069318f803f?w=500"
    ],
    countInStock: 58,
    rating: 4.3,
    numReviews: 203
  }
];

async function main() {
  console.log('🌱 Starting to seed the database...');
  
  try {
    // Clear existing products
    console.log('🧹 Clearing existing products...');
    await prisma.product.deleteMany({});
    
    // Add sample products
    console.log('📦 Adding sample products...');
    for (const product of sampleProducts) {
      const result = await prisma.product.create({
        data: product,
      });
      console.log(`✅ Created product: ${result.name} - $${result.price}`);
    }
    
    console.log(`🎉 Successfully seeded ${sampleProducts.length} products!`);
    
    // Show summary
    const totalProducts = await prisma.product.count();
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    });
    
    console.log('\n📊 Database Summary:');
    console.log(`Total Products: ${totalProducts}`);
    console.log('Products by Category:');
    categories.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.category} products`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Database seeding completed successfully!');
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
