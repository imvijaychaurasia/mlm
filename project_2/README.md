# Mera Local Market (MLM)

![Mera Local Market](public/assets/mlm-logo.png)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/mera-local-market)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/your-username/mera-local-market)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)](https://www.typescriptlang.org/)

## About the Platform

**Mera Local Market** is a comprehensive local marketplace platform designed to connect buyers and sellers within their neighborhoods. Built with modern web technologies and a focus on user experience, it provides a secure, intuitive environment for local commerce.

### What It Does

Mera Local Market serves as a digital bridge between community members, enabling them to:
- **Buy and sell** items locally with verified users
- **Post requirements** for items they need and receive responses from sellers
- **Discover services** and products in their immediate vicinity
- **Build trust** through user verification and rating systems
- **Conduct secure transactions** with integrated payment processing

### Key Features

- 🏪 **Local Marketplace**: Geo-located buying and selling with radius-based search
- 📝 **Requirements System**: Post what you need and get matched with sellers
- 🔐 **Secure Authentication**: Multi-provider auth (Email/Password, Google OAuth)
- 💳 **Payment Integration**: Razorpay integration with contact pass system
- 📍 **Location Services**: GPS-based location detection and geohash indexing
- 👤 **User Management**: Comprehensive profiles with verification system
- ⚙️ **Admin Dashboard**: Complete platform management and moderation tools
- 🔧 **Flexible Architecture**: Configurable integrations (Mock/Production modes)
- 📱 **Mobile-First Design**: Responsive UI optimized for all devices
- 🌐 **PWA Ready**: Progressive Web App capabilities for mobile installation

### Target Audience

- **Individual Sellers**: People looking to sell personal items locally
- **Small Businesses**: Local entrepreneurs wanting to reach nearby customers
- **Buyers**: Community members seeking specific products or services
- **Service Providers**: Local service businesses (repairs, tutoring, etc.)

### Technology Stack

**Frontend Framework**
- React 18.3.1 with TypeScript 5.5.3
- Material-UI 7.3.1 for component library
- Vite 5.4.2 for build tooling and development server

**State Management & Data**
- Zustand 4.4.7 for lightweight state management
- TanStack Query 5.84.2 for server state and caching
- React Hook Form 7.62.0 with Yup validation

**Routing & Navigation**
- React Router DOM 7.8.0 for client-side routing
- Hash routing for GitHub Pages compatibility

**Integrations & Services**
- Firebase 12.1.0 (Authentication, Firestore, Storage)
- Razorpay (Payment processing)
- Geofire Common 6.0.0 (Geolocation services)

**Development Tools**
- ESLint 9.9.1 with TypeScript support
- Tailwind CSS 3.4.1 for utility-first styling
- PostCSS 8.4.35 with Autoprefixer

## Setup, Build, and Deploy Instructions

### System Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: Latest version for version control
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Linux Setup

#### Prerequisites Installation

**Ubuntu/Debian:**
```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm via NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git -y

# Verify installations
node --version  # Should be 18.x.x or higher
npm --version   # Should be 8.x.x or higher
git --version
```

**CentOS/RHEL/Fedora:**
```bash
# Install Node.js and npm
sudo dnf install nodejs npm git -y

# Or using NodeSource repository for latest version
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs -y

# Verify installations
node --version
npm --version
git --version
```

#### Project Setup

```bash
# Clone the repository
git clone https://github.com/your-username/mera-local-market.git
cd mera-local-market

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run dev
```

#### Common Linux Issues

**Permission Issues:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Port Already in Use:**
```bash
# Kill process on port 5173
sudo lsof -ti:5173 | xargs kill -9
```

### Windows Setup

#### Prerequisites Installation

**Using Node.js Installer:**
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer (.msi file)
3. Follow installation wizard (includes npm)
4. Install Git from [git-scm.com](https://git-scm.com/)

**Using Chocolatey (Recommended):**
```powershell
# Install Chocolatey (run as Administrator)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js and Git
choco install nodejs git -y

# Verify installations
node --version
npm --version
git --version
```

#### Project Setup (Command Prompt)

```cmd
# Clone the repository
git clone https://github.com/your-username/mera-local-market.git
cd mera-local-market

# Install dependencies
npm install

# Copy environment configuration
copy .env.example .env

# Start development server
npm run dev
```

#### Project Setup (PowerShell)

```powershell
# Clone the repository
git clone https://github.com/your-username/mera-local-market.git
Set-Location mera-local-market

# Install dependencies
npm install

# Copy environment configuration
Copy-Item .env.example .env

# Start development server
npm run dev
```

#### Common Windows Issues

**Execution Policy Error:**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Long Path Issues:**
```cmd
# Enable long paths in Windows
git config --system core.longpaths true
```

**Antivirus Interference:**
- Add project folder to antivirus exclusions
- Temporarily disable real-time protection during installation

### macOS Setup

#### Prerequisites Installation

**Using Homebrew (Recommended):**
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and Git
brew install node git

# Verify installations
node --version  # Should be 18.x.x or higher
npm --version   # Should be 8.x.x or higher
git --version
```

**Using Node.js Installer:**
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the .pkg installer
3. Install Git using Xcode Command Line Tools: `xcode-select --install`

#### Project Setup

```bash
# Clone the repository
git clone https://github.com/your-username/mera-local-market.git
cd mera-local-market

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run dev
```

#### macOS-Specific Considerations

**Xcode Command Line Tools:**
```bash
# Install if not already installed
xcode-select --install
```

**Permission Issues:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### Build Process

#### Development Build
```bash
# Start development server with hot reload
npm run dev

# Access application at http://localhost:5173
# Hot reload enabled - changes reflect immediately
```

#### Production Build
```bash
# Create optimized production build
npm run build

# Output will be in 'dist' directory
# Preview production build locally
npm run preview
```

#### Build Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Build with specific base path for deployment
npm run build -- --base=/your-repo-name/
```

### Troubleshooting Common Issues

#### Node.js Version Issues
```bash
# Check current version
node --version

# Using nvm (Node Version Manager)
# Install nvm first, then:
nvm install 18
nvm use 18
```

#### Dependency Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Port Conflicts
```bash
# Use different port
npm run dev -- --port 3000

# Or set in vite.config.ts
# server: { port: 3000 }
```

## Integration Configuration

The platform supports multiple service integrations that can be configured based on your deployment needs. Each integration can operate in either **Mock Mode** (for development/testing) or **Production Mode** (with real services).

### Available Integrations

| Integration | Mock Provider | Production Provider | Purpose |
|-------------|---------------|-------------------|---------|
| Authentication | Mock Auth | Firebase Auth | User login/registration |
| Database | Mock Storage | Firestore | Data persistence |
| Payments | Mock Gateway | Razorpay | Payment processing |
| File Storage | Mock Storage | Firebase Storage | Image/file uploads |
| Geolocation | Mock GPS | Geofire | Location services |
| Notifications | Mock Service | Firebase Messaging | Push notifications |

### Environment Configuration

#### 1. Basic Configuration

Create and configure your `.env` file:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application Settings
VITE_APP_NAME=Mera Local Market
VITE_USE_MOCKS=false  # Set to true for development

# Firebase Configuration
VITE_FB_API_KEY=your_firebase_api_key_here
VITE_FB_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FB_PROJECT_ID=your-firebase-project-id
VITE_FB_STORAGE_BUCKET=your-project.appspot.com
VITE_FB_MESSAGING_SENDER_ID=123456789012
VITE_FB_APP_ID=1:123456789012:web:abcdef123456

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# Optional: Maps Provider
VITE_MAPS_PROVIDER=geofire
```

#### 2. Firebase Integration Setup

**Step 1: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard
4. Enable Authentication, Firestore, and Storage

**Step 2: Get Configuration**
1. In Firebase Console, go to Project Settings
2. Scroll to "Your apps" section
3. Click "Web app" icon to create web app
4. Copy the configuration values

**Step 3: Configure Authentication**
```javascript
// In Firebase Console > Authentication > Sign-in method
// Enable the following providers:
- Email/Password
- Google (optional)
- Phone (optional)
```

**Step 4: Setup Firestore Database**
```javascript
// In Firebase Console > Firestore Database
// Create database in production mode
// Set up security rules (example):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Listings are publicly readable, writable by authenticated users
    match /listings/{listingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Step 5: Configure Storage**
```javascript
// In Firebase Console > Storage
// Set up security rules:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### 3. Razorpay Integration Setup

**Step 1: Create Razorpay Account**
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Complete KYC verification
3. Generate API keys

**Step 2: Get API Keys**
1. Go to Settings > API Keys
2. Generate Key ID and Key Secret
3. **Important**: Only use Key ID in frontend, keep Key Secret on backend

**Step 3: Configure Webhooks (Optional)**
```javascript
// Webhook URL format:
https://your-domain.com/api/webhooks/razorpay

// Events to subscribe:
- payment.captured
- payment.failed
- order.paid
```

**Step 4: Test Integration**
```javascript
// Use test credentials for development:
Key ID: rzp_test_xxxxxxxxxx
Key Secret: xxxxxxxxxx (backend only)

// Live credentials for production:
Key ID: rzp_live_xxxxxxxxxx
Key Secret: xxxxxxxxxx (backend only)
```

#### 4. Geolocation Services Setup

**Using Geofire (Recommended)**
```env
VITE_MAPS_PROVIDER=geofire
# Requires Firebase Firestore to be configured
```

**Using Mock Provider (Development)**
```env
VITE_MAPS_PROVIDER=mock
# No additional configuration needed
```

### Integration Testing

#### 1. Test Firebase Connection
```bash
# Start the application
npm run dev

# Navigate to Admin > Integrations
# Check Firebase status indicators
# Test authentication by signing up/logging in
```

#### 2. Test Razorpay Integration
```javascript
// In the application:
1. Create a listing
2. Try to publish it (triggers payment)
3. Use test card: 4111 1111 1111 1111
4. Any CVV and future expiry date
```

#### 3. Test Geolocation
```javascript
// In the application:
1. Go to Admin > Integrations
2. Click "Detect Location" button
3. Allow location permission
4. Verify coordinates are displayed
```

### Switching Between Mock and Production

#### Via Environment Variables
```env
# Development mode (uses mocks)
VITE_USE_MOCKS=true

# Production mode (uses real services)
VITE_USE_MOCKS=false
```

#### Via Admin Interface
1. Navigate to `/admin/integrations`
2. Use provider dropdowns to switch services
3. Configure credentials in the interface
4. Test connections before switching

### Configuration Validation

The application includes built-in validation for integration configurations:

```javascript
// Check configuration status
// Navigate to Admin > Integrations
// View the "Environment Status" section
// Green checkmarks indicate properly configured services
// Red X marks indicate missing configuration
```

### Security Best Practices

1. **Never commit sensitive keys** to version control
2. **Use environment variables** for all credentials
3. **Rotate API keys** regularly
4. **Use test credentials** in development
5. **Implement proper CORS** settings
6. **Enable security rules** in Firebase
7. **Use HTTPS** in production

## Production Deployment with GitHub Pages

GitHub Pages provides free hosting for static websites, making it perfect for deploying the Mera Local Market platform. This section covers the complete deployment process.

### Prerequisites for GitHub Pages Deployment

#### Repository Requirements
- GitHub repository (public or private with GitHub Pro)
- Repository name should match your desired URL structure
- Admin access to the repository

#### Build Requirements
- Node.js 18+ installed locally
- All dependencies properly configured
- Successful local build (`npm run build`)

#### Domain Requirements (Optional)
- Custom domain name (if not using github.io subdomain)
- DNS management access for custom domain setup

### Repository Setup and Configuration

#### 1. Prepare Repository

```bash
# Ensure your repository is up to date
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

#### 2. Configure Build for GitHub Pages

Update `vite.config.ts` for proper base path:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/your-repository-name/', // Replace with your actual repo name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable for production
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

#### 3. Update Router Configuration

Ensure hash routing is enabled for GitHub Pages compatibility:

```typescript
// In src/core/router/AppRouter.tsx
import { HashRouter } from 'react-router-dom';

// Use HashRouter instead of BrowserRouter
<HashRouter>
  {/* Your routes */}
</HashRouter>
```

### Build Optimization for Production

#### 1. Environment Configuration

Create production environment file `.env.production`:

```env
# Production Environment Variables
VITE_APP_NAME=Mera Local Market
VITE_USE_MOCKS=false

# Firebase Production Configuration
VITE_FB_API_KEY=your_production_firebase_api_key
VITE_FB_AUTH_DOMAIN=your-prod-project.firebaseapp.com
VITE_FB_PROJECT_ID=your-production-project-id
VITE_FB_STORAGE_BUCKET=your-prod-project.appspot.com
VITE_FB_MESSAGING_SENDER_ID=your_production_sender_id
VITE_FB_APP_ID=your_production_app_id

# Razorpay Production Configuration
VITE_RAZORPAY_KEY_ID=rzp_live_your_production_key_id

# Maps Configuration
VITE_MAPS_PROVIDER=geofire
```

#### 2. Build Optimization

```bash
# Clean previous builds
rm -rf dist

# Build for production
npm run build

# Verify build output
ls -la dist/
```

#### 3. Add GitHub Pages Configuration

Create `dist/_redirects` file for SPA routing:

```bash
# Create redirects file
echo "/*    /index.html   200" > dist/_redirects
```

### Automated Deployment with GitHub Actions

#### 1. Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      env:
        VITE_APP_NAME: ${{ secrets.VITE_APP_NAME }}
        VITE_USE_MOCKS: ${{ secrets.VITE_USE_MOCKS }}
        VITE_FB_API_KEY: ${{ secrets.VITE_FB_API_KEY }}
        VITE_FB_AUTH_DOMAIN: ${{ secrets.VITE_FB_AUTH_DOMAIN }}
        VITE_FB_PROJECT_ID: ${{ secrets.VITE_FB_PROJECT_ID }}
        VITE_FB_STORAGE_BUCKET: ${{ secrets.VITE_FB_STORAGE_BUCKET }}
        VITE_FB_MESSAGING_SENDER_ID: ${{ secrets.VITE_FB_MESSAGING_SENDER_ID }}
        VITE_FB_APP_ID: ${{ secrets.VITE_FB_APP_ID }}
        VITE_RAZORPAY_KEY_ID: ${{ secrets.VITE_RAZORPAY_KEY_ID }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        cname: your-custom-domain.com # Optional: for custom domain
```

#### 2. Configure Repository Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:

```
VITE_APP_NAME=Mera Local Market
VITE_USE_MOCKS=false
VITE_FB_API_KEY=your_firebase_api_key
VITE_FB_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FB_PROJECT_ID=your-project-id
VITE_FB_STORAGE_BUCKET=your-project.appspot.com
VITE_FB_MESSAGING_SENDER_ID=123456789012
VITE_FB_APP_ID=1:123456789012:web:abcdef123456
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
```

#### 3. Enable GitHub Pages

1. Go to repository Settings > Pages
2. Select "Deploy from a branch"
3. Choose "gh-pages" branch
4. Select "/ (root)" folder
5. Click Save

### Custom Domain Setup (Optional)

#### 1. Configure DNS Records

For a custom domain (e.g., `meralocalmarket.com`):

**A Records:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME Record (for www subdomain):**
```
www.meralocalmarket.com -> your-username.github.io
```

#### 2. Configure GitHub Pages Custom Domain

1. Go to repository Settings > Pages
2. Enter your custom domain in "Custom domain" field
3. Check "Enforce HTTPS"
4. GitHub will verify domain ownership

#### 3. Update Build Configuration

Update `vite.config.ts` for custom domain:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // Use root path for custom domain
  // ... other configuration
});
```

### Manual Deployment Process

If you prefer manual deployment over automated workflows:

#### 1. Build Locally

```bash
# Build for production
npm run build

# Verify build
npm run preview
```

#### 2. Deploy Using gh-pages Package

```bash
# Install gh-pages utility
npm install --save-dev gh-pages

# Add deploy script to package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

#### 3. Alternative: Manual Upload

```bash
# Create gh-pages branch
git checkout --orphan gh-pages

# Remove all files
git rm -rf .

# Copy build files
cp -r dist/* .

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Switch back to main branch
git checkout main
```

### Post-Deployment Verification

#### 1. Check Deployment Status

1. Go to repository Actions tab
2. Verify latest workflow run completed successfully
3. Check for any error messages or warnings

#### 2. Test Application Functionality

Visit your deployed site and verify:

- ✅ Application loads without errors
- ✅ Navigation works correctly
- ✅ Authentication functions properly
- ✅ API integrations are working
- ✅ Images and assets load correctly
- ✅ Mobile responsiveness
- ✅ HTTPS is enforced (for custom domains)

#### 3. Performance Verification

Use tools to verify performance:

```bash
# Lighthouse audit
npx lighthouse https://your-site.github.io --view

# Check Core Web Vitals
# Use Google PageSpeed Insights
# Test on multiple devices and browsers
```

#### 4. Monitor and Maintain

Set up monitoring for:
- **Uptime monitoring**: Use services like UptimeRobot
- **Error tracking**: Implement error logging
- **Analytics**: Add Google Analytics or similar
- **Performance monitoring**: Regular Lighthouse audits

### Troubleshooting Deployment Issues

#### Common Issues and Solutions

**Build Fails:**
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

**404 Errors on Refresh:**
```bash
# Ensure hash routing is enabled
# Check that _redirects file is created
# Verify base path in vite.config.ts
```

**Assets Not Loading:**
```bash
# Check base path configuration
# Verify asset paths are relative
# Check browser console for 404 errors
```

**Environment Variables Not Working:**
```bash
# Verify secrets are set in GitHub repository
# Check variable names match exactly
# Ensure VITE_ prefix is used
```

**Custom Domain Issues:**
```bash
# Verify DNS records are correct
# Check domain propagation: dig your-domain.com
# Ensure HTTPS is enforced
# Wait up to 24 hours for DNS propagation
```

### Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Firebase security rules implemented
- [ ] Razorpay webhooks configured (if using)
- [ ] Custom domain DNS configured (if applicable)
- [ ] HTTPS enforced
- [ ] Error tracking implemented
- [ ] Analytics configured
- [ ] Performance optimized
- [ ] Mobile testing completed
- [ ] Cross-browser testing completed
- [ ] Backup and rollback plan prepared

### Maintenance and Updates

#### Regular Maintenance Tasks

**Weekly:**
- Monitor application performance
- Check error logs
- Verify all integrations are working

**Monthly:**
- Update dependencies: `npm update`
- Review and rotate API keys
- Backup configuration and data

**Quarterly:**
- Security audit
- Performance optimization review
- User feedback analysis and improvements

#### Updating the Deployment

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push origin main

# GitHub Actions will automatically deploy
# Or for manual deployment:
npm run build
npm run deploy
```

This comprehensive deployment guide ensures your Mera Local Market platform is properly configured, optimized, and deployed to GitHub Pages with all necessary integrations working correctly in production.