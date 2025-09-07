import { mockProducts } from '../lib/mockData.js';

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    
    let filteredProducts = [...mockProducts];

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      products: paginatedProducts,
      total: filteredProducts.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProducts.length / parseInt(limit)),
        totalProducts: filteredProducts.length,
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === id || p._id === id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, countInStock } = req.body;

    const newProduct = {
      id: generateId(),
      _id: generateId(),
      name,
      description,
      price: parseFloat(price),
      category,
      images: images || [],
      countInStock: parseInt(countInStock) || 0,
      rating: 0,
      numReviews: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockProducts.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const productIndex = mockProducts.findIndex(p => p.id === id || p._id === id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...updateData,
      price: updateData.price ? parseFloat(updateData.price) : mockProducts[productIndex].price,
      countInStock: updateData.countInStock ? parseInt(updateData.countInStock) : mockProducts[productIndex].countInStock,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: mockProducts[productIndex]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productIndex = mockProducts.findIndex(p => p.id === id || p._id === id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const deletedProduct = mockProducts.splice(productIndex, 1)[0];

    res.json({
      success: true,
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = mockProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );

    res.json({ success: true, products });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    // Get products with high ratings or featured ones
    const featuredProducts = mockProducts
      .filter(product => product.rating >= 4.5)
      .slice(0, 8);

    res.json({ success: true, products: featuredProducts });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
