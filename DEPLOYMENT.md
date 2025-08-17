# Deploying Seattle Climate Puzzle to GitHub Pages

## Prerequisites

1. **GitHub Repository**: Ensure your project is pushed to a GitHub repository
2. **Node.js**: Version 18 or higher installed
3. **Git**: Latest version installed

## Deployment Steps

### Option 1: Automated Deployment (Recommended)

The project is configured with GitHub Actions for automatic deployment. Simply push your code to the main branch:

```bash
git add .
git commit -m "Update for deployment"
git push origin main
```

The GitHub Action will automatically:
- Build the project
- Deploy to GitHub Pages
- Update the custom domain

### Option 2: Manual Deployment

If you prefer manual deployment:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

## Configuration

### GitHub Pages Settings

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Set **Source** to "GitHub Actions"
4. Ensure your custom domain is configured: `www.seattleclimatepuzzle.org`

### Custom Domain

The project is configured with a custom domain. The CNAME file in the public folder contains:
```
www.seattleclimatepuzzle.org
```

**Important**: The homepage in package.json is set to `https://www.seattleclimatepuzzle.org` for production deployment.

### Environment Variables

For production deployment, ensure these environment variables are set:
- `REACT_APP_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `REACT_APP_CLOUDINARY_UPLOAD_PRESET`: Your Cloudinary upload preset

## Troubleshooting

### Common Issues

1. **Build Failures**: Check the GitHub Actions logs for build errors
2. **Domain Issues**: Verify DNS settings for your custom domain
3. **Image Loading**: Ensure all image paths are correct for production

### Manual Build Test

Test the build locally before deploying:
```bash
npm run build
npm run test
```

## URLs

- **Production Site**: https://www.seattleclimatepuzzle.org
- **GitHub Pages**: https://adityaaggarwal.github.io/seattle-climate-puzzle (fallback)

## Support

For deployment issues, check:
1. GitHub Actions logs
2. GitHub Pages settings
3. DNS configuration for custom domain 