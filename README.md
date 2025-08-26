# 🛒 OurEcom - Complete E-commerce Platform

A modern, full-stack e-commerce platform built with React, Node.js, and eSewa payment integration.

## ✨ Features

### 🛍️ Customer Features
- **Product Browsing**: Filter by category, search, and pagination
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Login, signup, profile management
- **Checkout Process**: 3-step checkout with form validation
- **Payment Integration**: Real eSewa payment gateway
- **Order Management**: Order history and tracking
- **Responsive Design**: Mobile-first approach

### 🔐 Admin Features
- **Dashboard**: Sales overview and analytics
- **Product Management**: Add, edit, delete products
- **Order Management**: View and update order status
- **User Management**: Monitor user activities

### 💳 Payment Features
- **eSewa Integration**: Real payment processing
- **Test Mode**: Complete testing environment
- **Payment Verification**: HMAC SHA256 signatures
- **Success/Failure Handling**: Comprehensive callback handling

## 🚀 Tech Stack

### Frontend
- **React 18.2.0** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Crypto-JS** - Payment signature generation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Mock Data System** - Development-ready data layer
- **JWT Authentication** - Secure user sessions
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ourecom.git
cd ourecom
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:5000

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
JWT_SECRET=your_super_secret_key
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_ENVIRONMENT=testing
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_ESEWA_MERCHANT_CODE=EPAYTEST
VITE_ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
VITE_ESEWA_ENVIRONMENT=testing
```

## 🧪 Testing eSewa Payment

### Test Credentials
- **eSewa ID**: 9806800001 or 9806800002
- **Password**: Nepal@123
- **Token**: 123456 (always use this for testing)

### Test Flow
1. Add products to cart
2. Proceed to checkout
3. Fill shipping information
4. Select eSewa payment
5. Use test credentials
6. Verify payment success/failure

## 🏗️ Project Structure

```
ourecom/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── lib/
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Update environment variables for production
# Deploy to your preferred platform
```

### Environment Updates for Production
1. Update `FRONTEND_URL` in backend
2. Update `VITE_API_URL` in frontend
3. Use real eSewa credentials
4. Set `NODE_ENV=production`

## 📱 Features Demo

### 🛒 Shopping Experience
- Browse products with advanced filtering
- Add items to cart with quantity selection
- Real-time cart updates and calculations
- Smooth checkout process

### 💰 Payment Processing
- Secure eSewa integration
- Real-time payment verification
- Automatic order creation
- Payment success/failure handling

### 👤 User Management
- Secure authentication system
- User profile management
- Order history tracking
- Admin dashboard access

## 🔑 Demo Accounts

### Customer Accounts
- **Email**: user@demo.com
- **Password**: user123

### Admin Account
- **Email**: admin@demo.com
- **Password**: admin123

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` in backend .env
   - Ensure ports match (frontend: 5174, backend: 5000)

2. **Payment Issues**
   - Verify eSewa test credentials
   - Check ESEWA environment variables
   - Ensure crypto-js is properly installed

3. **Cart Not Loading**
   - Clear browser localStorage
   - Restart both servers
   - Check API endpoint connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **eSewa** - Payment gateway integration
- **React Team** - Amazing frontend framework
- **Tailwind CSS** - Beautiful styling system
- **Heroicons** - Beautiful icon library

---

**Built with ❤️ for the Nepal e-commerce ecosystem**
npm run dev
```

---

## Environment Variables
- See `.env.example` in each folder for required variables.

## Sample Data
- Backend includes `sample_products.json` for quick testing.

## eSewa Integration
- Sandbox credentials pre-configured. Switch to live in `.env` when ready.

---

## License
MIT
