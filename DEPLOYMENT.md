# Vercel Deployment Guide

## Quick Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings on vercel.com
   - Add these environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Your JWT secret key
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `NODE_ENV`: production

5. **Production Deploy**
   ```bash
   vercel --prod
   ```

## Alternative: One-Click Deploy Button
Add this to your README.md:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shine-5705/LeadGen-Pro---AI-Powered-B2B-Lead-Generation-Platform)