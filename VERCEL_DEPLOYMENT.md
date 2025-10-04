# Vercel Deployment Guide for LeadGen Pro

## Prerequisites
- Vercel account (free at vercel.com)
- MongoDB Atlas account with cluster
- OpenAI API key

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Login to Vercel
```bash
vercel login
```

## Step 3: Environment Variables Setup

You need to set up these environment variables in Vercel dashboard:

1. Go to your Vercel dashboard
2. Import your project or go to project settings
3. Go to Environment Variables section
4. Add these variables:

### Required Environment Variables:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Your JWT secret key (use a strong random string)
- `OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV` - Set to "production"

### Example Values:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leadgen?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=production
```

## Step 4: Deploy to Vercel

### Option A: Deploy via CLI
```bash
# From project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your username
# - Link to existing project? No
# - Project name? leadgen-pro (or your choice)
# - Directory? ./
# - Override settings? No
```

### Option B: Deploy via GitHub (Recommended)
1. Push your code to GitHub repository
2. Go to vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect it's a monorepo
6. Set the environment variables in the dashboard
7. Deploy

## Step 5: Configure Build Settings (if needed)

In Vercel dashboard, go to Project Settings → General:

- **Framework Preset**: Other
- **Root Directory**: `./` (keep empty)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/build`
- **Install Command**: `npm install`

## Step 6: Set Up Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

1. **MONGODB_URI**: Your MongoDB connection string
2. **JWT_SECRET**: A secure random string
3. **OPENAI_API_KEY**: Your OpenAI API key
4. **NODE_ENV**: production

## Step 7: Redeploy

After setting environment variables, trigger a new deployment:
```bash
vercel --prod
```

## How It Works

The deployment structure:
- **Frontend**: React app served as static files from `client/build`
- **Backend**: Node.js API running as serverless functions
- **Routing**: `/api/*` routes go to backend, everything else to frontend
- **Database**: MongoDB Atlas (cloud)
- **AI**: OpenAI API calls from serverless functions

## Project Structure After Deployment
```
vercel-deployment/
├── client/build/          # Static React app
└── server/               # Serverless API functions
    ├── index.js         # Main API handler
    └── routes/          # API routes
```

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are in package.json
2. **API 404 Errors**: Verify vercel.json routing configuration
3. **Environment Variables**: Make sure all required vars are set in Vercel dashboard
4. **Database Connection**: Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Logs:
View deployment logs in Vercel dashboard → Functions tab

## Alternative: Split Deployment

If you prefer to deploy frontend and backend separately:

### Frontend Only (Vercel):
1. Deploy only the `client` folder to Vercel
2. Set `REACT_APP_API_URL` to your backend URL

### Backend (Railway/Heroku/DigitalOcean):
1. Deploy `server` folder to a Node.js hosting platform
2. Update frontend to point to backend URL

## Cost Considerations

- **Vercel Free Tier**: 100GB bandwidth, 6,000 serverless function execution hours
- **MongoDB Atlas**: Free tier with 512MB storage
- **OpenAI**: Pay-per-use (approximately $0.001-0.03 per API call)

For production apps with high traffic, consider upgrading to paid plans.