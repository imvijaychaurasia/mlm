# GitHub Pages Deployment Guide for MLM Project

This guide provides step-by-step instructions to deploy the Mera Local Market (MLM) project to GitHub Pages using the repository: https://github.com/imvijaychaurasia/mlm

## Prerequisites

- GitHub account with access to the repository
- Repository admin permissions
- Basic understanding of Git and GitHub

## Deployment Methods

### Method 1: Automated Deployment with GitHub Actions (Recommended)

#### Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/imvijaychaurasia/mlm
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**

#### Step 2: Configure Repository Secrets (Optional)

If you want to use production integrations instead of mock mode:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret** and add the following secrets:

```
VITE_APP_NAME=Mera Local Market
VITE_USE_MOCKS=false
VITE_FB_API_KEY=your_firebase_api_key_here
VITE_FB_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FB_PROJECT_ID=your-firebase-project-id
VITE_FB_STORAGE_BUCKET=your-project.appspot.com
VITE_FB_MESSAGING_SENDER_ID=123456789012
VITE_FB_APP_ID=1:123456789012:web:abcdef123456
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id_here
```

**Note**: If you don't add these secrets, the app will run in mock mode by default.

#### Step 3: Trigger Deployment

The GitHub Actions workflow will automatically trigger when you:
- Push to the `main` branch
- Create a pull request to `main`

To manually trigger deployment:
1. Make any small change to the repository (e.g., update README.md)
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

#### Step 4: Monitor Deployment

1. Go to **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Once completed successfully, your site will be available at:
   **https://imvijaychaurasia.github.io/mlm/**

### Method 2: Manual Deployment with gh-pages

#### Step 1: Install gh-pages Package

```bash
npm install --save-dev gh-pages
```

#### Step 2: Build and Deploy

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

#### Step 3: Configure GitHub Pages

1. Go to repository **Settings** > **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose **gh-pages** branch
4. Select **/ (root)** folder
5. Click **Save**

## Verification Steps

### 1. Check Deployment Status

- Go to **Actions** tab to see workflow status
- Green checkmark = successful deployment
- Red X = deployment failed (check logs)

### 2. Test the Live Site

Visit: **https://imvijaychaurasia.github.io/mlm/**

Verify the following:
- ✅ Site loads without errors
- ✅ Navigation works correctly
- ✅ Logo displays properly
- ✅ Listings page shows sample data
- ✅ Authentication works (mock mode)
- ✅ Mobile responsiveness
- ✅ All pages are accessible

### 3. Check Browser Console

- Open Developer Tools (F12)
- Look for any JavaScript errors
- Verify all assets load correctly

## Troubleshooting

### Common Issues and Solutions

#### 1. 404 Error on Page Refresh
**Problem**: Direct URLs return 404 error
**Solution**: The app uses hash routing (#) which is already configured for GitHub Pages

#### 2. Assets Not Loading
**Problem**: CSS/JS files return 404
**Solution**: Verify `base: '/mlm/'` is set in `vite.config.ts`

#### 3. Deployment Workflow Fails
**Problem**: GitHub Actions workflow fails
**Solutions**:
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check for TypeScript errors: `npm run build`

#### 4. Environment Variables Not Working
**Problem**: Integrations not working in production
**Solutions**:
- Verify secrets are set in GitHub repository settings
- Check secret names match exactly (case-sensitive)
- Ensure VITE_ prefix is used for all frontend variables

### Debug Commands

```bash
# Test build locally
npm run build
npm run preview

# Check for TypeScript errors
npm run lint

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Custom Domain Setup (Optional)

### Step 1: Configure DNS

If you have a custom domain (e.g., `meralocalmarket.com`):

**A Records:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME Record:**
```
www.meralocalmarket.com -> imvijaychaurasia.github.io
```

### Step 2: Configure GitHub Pages

1. Go to **Settings** > **Pages**
2. Enter your custom domain in **Custom domain** field
3. Check **Enforce HTTPS**
4. Wait for DNS verification (can take up to 24 hours)

### Step 3: Update Build Configuration

Update `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // Use root path for custom domain
  // ... other config
});
```

## Production Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Firebase security rules implemented (if using Firebase)
- [ ] Razorpay webhooks configured (if using payments)
- [ ] Custom domain DNS configured (if applicable)
- [ ] HTTPS enforced
- [ ] Error tracking implemented
- [ ] Analytics configured
- [ ] Performance optimized
- [ ] Mobile testing completed
- [ ] Cross-browser testing completed

## Maintenance

### Regular Updates

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm update

# Test locally
npm run dev

# Deploy
git push origin main  # Triggers auto-deployment
```

### Monitoring

- Check GitHub Actions for deployment status
- Monitor site performance with Lighthouse
- Review error logs if available
- Test functionality regularly

## Support

If you encounter issues:

1. Check the **Actions** tab for deployment logs
2. Review this troubleshooting guide
3. Test the build locally first
4. Check GitHub Pages status: https://www.githubstatus.com/

---

**Live Site**: https://imvijaychaurasia.github.io/mlm/
**Repository**: https://github.com/imvijaychaurasia/mlm