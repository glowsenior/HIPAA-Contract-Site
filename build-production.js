const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Medical Contract Builder for Production...\n');

try {
  // Step 1: Build React frontend
  console.log('📦 Building React frontend...');
  process.chdir('client');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Frontend build completed!\n');

  // Step 2: Create server public directory if it doesn't exist
  console.log('📁 Setting up server public directory...');
  const publicDir = path.join(__dirname, 'server', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('✅ Created server/public directory');
  }

  // Step 3: Copy build files to server public directory
  console.log('📋 Copying build files to server...');
  const buildDir = path.join(__dirname, 'client', 'build');
  const serverPublicDir = path.join(__dirname, 'server', 'public');

  // Copy all files from build to server/public
  if (fs.existsSync(buildDir)) {
    // Remove existing files in server/public
    if (fs.existsSync(serverPublicDir)) {
      fs.rmSync(serverPublicDir, { recursive: true, force: true });
    }
    
    // Copy build files
    fs.cpSync(buildDir, serverPublicDir, { recursive: true });
    console.log('✅ Build files copied to server/public');
  } else {
    throw new Error('Build directory not found. Please run npm run build first.');
  }

  // Step 4: Create production environment file
  console.log('⚙️ Creating production environment...');
  const envContent = `# Production Environment
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-contracts
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:5000
`;
  
  fs.writeFileSync(path.join(__dirname, 'server', '.env.production'), envContent);
  console.log('✅ Production environment file created');

  console.log('\n🎉 Production build completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the server: cd server && npm start');
  console.log('2. Visit: http://localhost:5000');
  console.log('3. The server will serve both API and static files');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
