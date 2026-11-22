# Production Deployment Guide

## 1. Vercel Deployment

1. Push your repository to GitHub or GitLab.
2. Import the project into Vercel.
3. Configure the environment variables:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
4. Deploy.

## 2. Convex Setup

1. Initialize Convex:
   ```bash
   npx convex dev
   ```
2. Deploy to production:
   ```bash
   npx convex deploy
   ```
3. Copy the production URL to `NEXT_PUBLIC_CONVEX_URL` in your Vercel project settings.
