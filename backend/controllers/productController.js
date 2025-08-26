// Product controller: CRUD, search, filter
import { prisma } from '../lib/prisma.js';

// Get all products (with search, filter, pagination)
export const getProducts = async (req, res) => {
  try {
    const { keyword = '', category, page = 1, limit = 8 } = req.query;
    
    const where = {
      AND: [
        keyword ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } }
          ]
        } : {},
        category ? { category } : {}
      ]
    };

    const total = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ products, total });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, countInStock } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        category,
        images: images || [],
        countInStock: Number(countInStock),
        rating: 0,
        numReviews: 0
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error during product creation' });
  }
};

// Admin: update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        price: updateData.price ? Number(updateData.price) : undefined,
        countInStock: updateData.countInStock ? Number(updateData.countInStock) : undefined
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error during product update' });
  }
};

// Admin: delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error during product deletion' });
  }
};
