# 🚀 LeadGen Pro - AI-Powered B2B Lead Generation Platform

A comprehensive B2B lead generation platform with AI-powered email generation, intelligent matching, and advanced analytics.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shine-5705/LeadGen-Pro---AI-Powered-B2B-Lead-Generation-Platform)

## 🌟 Features

- **AI-Powered Email Generation** - Create personalized outreach emails using GPT
- **Intelligent Lead Matching** - Smart scoring based on user preferences
- **Advanced Analytics** - Track performance and ROI
- **Real-time Data** - Live lead scoring and updates
- **User Preferences** - Customizable industry and business type filters
- **Export Capabilities** - Download leads in multiple formats
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **AI**: OpenAI GPT API
- **Authentication**: JWT
- **Deployment**: Vercel, Render, Railway

## 🚀 Quick Deploy

### Option 1: Vercel (Recommended)

1. **One-Click Deploy**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shine-5705/LeadGen-Pro---AI-Powered-B2B-Lead-Generation-Platform)

2. **Manual Deploy**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

3. **Environment Variables** (Add in Vercel Dashboard)
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=production
   ```

### Option 2: Railway

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

### Option 3: Render

1. Go to [Render](https://render.com)
2. Connect your GitHub repository
3. Create Web Service
4. Add environment variables
5. Deploy

## 🔧 Local Development

1. **Clone & Install**
   ```bash
   git clone https://github.com/Shine-5705/LeadGen-Pro---AI-Powered-B2B-Lead-Generation-Platform.git
   cd LeadGen-Pro---AI-Powered-B2B-Lead-Generation-Platform
   npm run install-all
   ```

2. **Environment Setup**
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your values
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Access**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🎯 Key Features

### AI Email Generation
- Powered by OpenAI GPT API
- Personalized based on company data
- Multiple email types (cold outreach, follow-up, etc.)
- Fallback templates for reliability

### Intelligent Matching
- User preference-based scoring
- Industry and business type filtering
- Real-time score calculations
- Customizable matching criteria

### Advanced Dashboard
- Lead overview and statistics
- Interactive charts and graphs
- Quick action buttons
- Responsive design

## 🔐 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=sk-your-openai-api-key
NODE_ENV=development
```

## 📄 License

MIT License

---

**Ready to deploy? Use the deployment scripts or one-click deploy buttons above! 🚀**