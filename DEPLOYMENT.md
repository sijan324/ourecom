# 🚀 Deployment Guide for OurEcom

## GitHub Repository Setup

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `ourecom`
3. Description: `Complete e-commerce platform with eSewa payment integration`
4. Set to Public (or Private if preferred)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 2. Push to GitHub
```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ourecom.git

# Push to main branch
git branch -M main
git push -u origin main
```

## 🌐 Deployment Options

### Frontend Deployment (Vercel - Recommended)

#### Option 1: Vercel GitHub Integration
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your `ourecom` repository
5. Set these configurations:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Environment Variables for Frontend
Add these in Vercel dashboard:
```bash
VITE_API_URL=https://your-backend-domain.com/api
VITE_ESEWA_MERCHANT_CODE=EPAYTEST
VITE_ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
VITE_ESEWA_ENVIRONMENT=testing
```

#### Option 2: Netlify
1. Go to https://netlify.com
2. Connect GitHub repository
3. Build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### Backend Deployment (Railway - Recommended)

#### Railway Setup
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `ourecom` repository
5. Choose "backend" folder as root directory

#### Environment Variables for Backend
Add these in Railway dashboard:
```bash
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://your-frontend-domain.vercel.app
JWT_SECRET=your_super_secret_production_key_here
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_ENVIRONMENT=testing
```

#### Alternative: Render.com
1. Go to https://render.com
2. Connect GitHub repository
3. Create new "Web Service"
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## 🔧 Production Configurations

### 1. Update Frontend API URL
After backend is deployed, update frontend environment:
```bash
VITE_API_URL=https://your-backend-domain.up.railway.app/api
```

### 2. Update Backend CORS
Update backend environment:
```bash
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 3. Real eSewa Integration (For Production)
1. Contact eSewa for merchant account
2. Get production credentials
3. Update environment variables:
```bash
ESEWA_MERCHANT_CODE=your_real_merchant_code
ESEWA_SECRET_KEY=your_real_secret_key
ESEWA_ENVIRONMENT=production
```

## 🧪 Testing Deployment

### Test Checklist
- [ ] Frontend loads correctly
- [ ] API calls work from frontend to backend
- [ ] User authentication works
- [ ] Cart functionality works
- [ ] eSewa payment flow works
- [ ] Order creation works
- [ ] Order history displays

### Common Issues & Solutions

#### CORS Errors
```bash
# Backend .env
FRONTEND_URL=https://your-exact-frontend-domain.vercel.app
```

#### API Connection Issues
```bash
# Frontend .env
VITE_API_URL=https://your-exact-backend-domain.up.railway.app/api
```

#### Build Errors
1. Check Node.js version compatibility
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall

## 📱 Mobile Testing
Test on various devices:
- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad/Android)
- Desktop (Chrome, Firefox, Safari)

## 🔒 Security Checklist for Production
- [ ] Use strong JWT secret
- [ ] Enable HTTPS only
- [ ] Validate all user inputs
- [ ] Use real eSewa credentials
- [ ] Enable rate limiting
- [ ] Add security headers

## 📊 Monitoring & Analytics

### Add to Frontend
```bash
# Google Analytics
VITE_GA_TRACKING_ID=GA_MEASUREMENT_ID

# Sentry Error Tracking
VITE_SENTRY_DSN=your_sentry_dsn
```

### Backend Monitoring
Consider adding:
- PM2 for process management
- Winston for logging
- Sentry for error tracking

## 🎉 Post-Deployment

### 1. Test Complete Flow
1. Browse products ✅
2. Add to cart ✅
3. User registration ✅
4. Login ✅
5. Checkout process ✅
6. eSewa payment ✅
7. Order confirmation ✅
8. Order history ✅

### 2. Performance Optimization
- Enable gzip compression
- Add CDN for static assets
- Optimize images
- Add caching headers

### 3. SEO Optimization
- Add meta tags
- Create sitemap
- Add robots.txt
- Optimize page titles

---

**🚀 Your e-commerce platform is now ready for the world!**
