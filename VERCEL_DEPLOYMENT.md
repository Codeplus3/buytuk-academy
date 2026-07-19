# Vercel Deployment Guide

## Prerequisites

- Node.js 18.x or higher
- pnpm 9.x or higher
- GitHub account connected to Vercel

## One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Codeplus3/buytuk-academy&project-name=buytuk-academy&repository-name=buytuk-academy&env=VITE_API_URL,VITE_DEFAULT_LANGUAGE,VITE_ENABLE_PWA&envDescription=BuyTuk%20Academy%20environment%20variables&envLink=https://github.com/Codeplus3/buytuk-academy/blob/main/.env.example)

## Manual Deployment Steps

### 1. Connect GitHub Repository

1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository: `Codeplus3/buytuk-academy`
4. Click "Import"

### 2. Configure Project

**Project Name**: `buytuk-academy`

**Framework Preset**: Automatically detected as Vite ✓

**Build Command**: 
```bash
pnpm build
```

**Output Directory**: 
```
dist
```

**Install Command**:
```bash
pnpm install
```

### 3. Environment Variables

Add the following environment variables in Vercel Dashboard:

```
VITE_API_URL=https://your-api.com/api
VITE_DEFAULT_LANGUAGE=ar
VITE_SUPPORTED_LANGUAGES=ar,en
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_OFFLINE_MODE=true
```

### 4. Deploy

Click "Deploy" button. Vercel will:

1. Clone the repository
2. Install dependencies with pnpm
3. Run type checking
4. Build the project
5. Deploy to CDN

### 5. Access Your Deployment

Your app will be available at:
```
https://buytuk-academy.vercel.app
```

And automatically get a preview URL for each pull request.

---

## Important Notes

### ⚠️ pnpm Support

Vercel automatically detects and uses pnpm if `pnpm-lock.yaml` exists. Make sure it's committed to the repository.

### ⚠️ Build Time

The build includes type checking, so it may take 2-3 minutes on first deploy.

### ✅ Optimizations

- ✓ Automatic image optimization
- ✓ Edge caching for static assets
- ✓ Automatic HTTPS
- ✓ Atomic deployments
- ✓ Automatic rollbacks on failure

### 📱 PWA Support

The app includes PWA support:
- Service Worker (`sw.js`)
- Web Manifest (`manifest.json`)
- Offline support with offline media

These work automatically on Vercel.

---

## Troubleshooting

### Build Fails: "pnpm not found"

→ Make sure `pnpm-lock.yaml` is committed to the repository

### Build Fails: "Cannot find module 'react'"

→ Ensure Node.js version is 18.x or higher in Vercel settings

### Build Fails: TypeScript errors

→ Run locally first:
```bash
pnpm typecheck
pnpm build
```

### API Connection Issues

→ Verify `VITE_API_URL` is set correctly for production environment

---

## Post-Deployment

### 1. Custom Domain

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed

### 2. Analytics

Vercel provides built-in analytics:
- Dashboard → Analytics
- View page performance
- Monitor Core Web Vitals

### 3. Monitoring

- Set up Slack notifications for deployments
- Monitor function logs
- Set up error tracking

### 4. CI/CD

Automatic deployments on:
- Push to `main` branch → Production
- Push to any branch → Preview deployment
- Pull requests → Preview deployment

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Custom domain set up
- [ ] HTTPS enabled (automatic)
- [ ] PWA manifest configured
- [ ] Analytics enabled
- [ ] Error tracking set up
- [ ] Performance monitoring active
- [ ] Backups configured
- [ ] Security headers set
- [ ] Rate limiting configured

---

## Support

For deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- GitHub Issues in this repository

---

**Status**: ✅ Ready for Vercel deployment
**Last Updated**: 2026-07-19
