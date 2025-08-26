import { mockProducts, mockUsers, mockOrders, mockCartItems, mockWishlistItems } from '../lib/mockData.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to generate IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Initialize demo users if none exist
const initializeDemoUsers = async () => {
  if (mockUsers.size === 0) {
    try {
      // Create demo admin user
      const adminPassword = await bcrypt.hash('admin123', 12);
      mockUsers.set('admin1', {
        id: 'admin1',
        name: 'Admin User',
        email: 'admin@demo.com',
        password: adminPassword,
        role: 'admin',
        phone: '+977-9800000000',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create demo regular user
      const userPassword = await bcrypt.hash('user123', 12);
      mockUsers.set('user1', {
        id: 'user1',
        name: 'Demo User',
        email: 'user@demo.com',
        password: userPassword,
        role: 'customer',
        phone: '+977-9841234567',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Demo users initialized');
    } catch (error) {
      console.error('Error initializing demo users:', error);
    }
  }
};

// Initialize demo users when module loads
initializeDemoUsers();

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    for (const [id, user] of mockUsers.entries()) {
      if (user.email === email) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userId = generateId();
    const user = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'customer',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUsers.set(userId, user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    let foundUser = null;
    for (const [id, user] of mockUsers.entries()) {
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!foundUser.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: foundUser.id, email: foundUser.email, role: foundUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = foundUser;

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = mockUsers.get(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userResponse } = user;
    res.json({ success: true, user: userResponse });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email } = req.body;

    const user = mockUsers.get(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      for (const [id, existingUser] of mockUsers.entries()) {
        if (id !== userId && existingUser.email === email) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }
    }

    // Update user
    if (name) user.name = name;
    if (email) user.email = email;
    user.updatedAt = new Date();

    mockUsers.set(userId, user);

    const { password: _, ...userResponse } = user;
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
