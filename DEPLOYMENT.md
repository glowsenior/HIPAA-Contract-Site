# 🚀 Production Deployment Guide

## Medical Contract Builder - Production Setup

### 📋 Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- PM2 (for process management)

### 🔧 Production Build Process

#### 1. **Build Frontend for Production**
```bash
# Build React frontend
npm run build:production
```

This script will:
- ✅ Build the React frontend with optimizations
- ✅ Create `server/public` directory
- ✅ Copy build files to server
- ✅ Create production environment file

#### 2. **Start Production Server**
```bash
# Start the production server
npm run start:production
```

### 📁 **File Structure After Build**
```
medical-contract-builder/
├── server/
│   ├── public/           # React build files (served by Express)
│   │   ├── index.html
│   │   ├── static/
│   │   └── ...
│   ├── uploads/          # User uploaded files
│   ├── index.js          # Main server file
│   └── .env.production   # Production environment
├── client/
│   └── build/            # React build (source)
└── build-production.js   # Build script
```

### 🌐 **Production URLs**
- **Frontend**: `http://localhost:5000`
- **API**: `http://localhost:5000/api/*`
- **Health Check**: `http://localhost:5000/api/health`

### ⚙️ **Environment Configuration**

#### **Production Environment (`.env.production`)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-contracts
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:5000
```

### 🔒 **Security Features**
- ✅ Helmet.js security headers
- ✅ Rate limiting (1000 requests per 15 minutes)
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Password hashing with bcrypt
- ✅ JWT authentication

### 📊 **Performance Optimizations**
- ✅ React production build with minification
- ✅ Static file serving with Express
- ✅ Client-side routing support
- ✅ Optimized bundle sizes
- ✅ Gzip compression (if configured)

### 🚀 **Deployment Options**

#### **Option 1: Local Production**
```bash
# Build and start
npm run build:production
npm run start:production
```

#### **Option 2: PM2 Process Manager**
```bash
# Install PM2 globally
npm install -g pm2

# Build production
npm run build:production

# Start with PM2
cd server
pm2 start index.js --name "medical-contract-builder"
pm2 save
pm2 startup
```

#### **Option 3: Docker Deployment**
```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build production
RUN npm run build:production

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "run", "start:production"]
```

### 🔍 **Monitoring & Logs**

#### **PM2 Monitoring**
```bash
# View processes
pm2 list

# View logs
pm2 logs medical-contract-builder

# Restart application
pm2 restart medical-contract-builder

# Stop application
pm2 stop medical-contract-builder
```

#### **Health Checks**
- **API Health**: `GET /api/health`
- **Database**: MongoDB connection status
- **File Uploads**: `/uploads` directory access

### 🛠️ **Troubleshooting**

#### **Common Issues**

1. **Build Fails**
   ```bash
   # Clear cache and rebuild
   cd client
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Static Files Not Loading**
   ```bash
   # Check if public directory exists
   ls -la server/public/
   
   # Rebuild if missing
   npm run build:production
   ```

3. **Database Connection Issues**
   ```bash
   # Check MongoDB status
   systemctl status mongod
   
   # Check connection string
   echo $MONGODB_URI
   ```

### 📈 **Production Checklist**

- ✅ Frontend built and optimized
- ✅ Static files served correctly
- ✅ API endpoints working
- ✅ Database connected
- ✅ File uploads working
- ✅ Authentication working
- ✅ Security headers enabled
- ✅ Rate limiting configured
- ✅ Error handling in place
- ✅ Logging configured
- ✅ Environment variables set
- ✅ SSL/HTTPS configured (if needed)

### 🔄 **Update Process**

1. **Update Code**
   ```bash
   git pull origin main
   ```

2. **Rebuild Production**
   ```bash
   npm run build:production
   ```

3. **Restart Server**
   ```bash
   pm2 restart medical-contract-builder
   ```

### 📞 **Support**

For issues or questions:
- Check server logs: `pm2 logs medical-contract-builder`
- Verify API health: `curl http://localhost:5000/api/health`
- Check database connection in logs
- Verify file permissions for uploads directory

---

**🎉 Your Medical Contract Builder is now ready for production!**
