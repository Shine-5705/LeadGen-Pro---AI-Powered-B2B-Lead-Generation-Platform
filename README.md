# LeadGen Pro - AI-Powered B2B Lead Generation Platform

A comprehensive lead generation platform that replicates and enhances the functionality of SaaSquatch Leads, featuring AI-powered email generation, web scraping, and advanced analytics.

## 🚀 Live Demo

**🌐 Frontend (Vercel):** [https://leadgenpro-black.vercel.app/](https://leadgenpro-black.vercel.app/)

**⚡ Backend API (Render):** [https://leadgenpro-backend.onrender.com/](https://leadgenpro-backend.onrender.com/)

*Try the live application with sample data and AI-powered features!*

---

## 🏗️ Architecture

- **Frontend:** React.js (with Context API, Hooks, and Material UI)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (local or Atlas)
- **AI Integration:** OpenAI GPT for personalized email/message generation
- **Data Processing:** Custom preprocessing pipeline for company data

---

## 📦 Features

### **🎯 What You Can Do on the Live Demo:**
- 📊 **Explore Dashboard** - View lead statistics and industry breakdown
- 🏢 **Browse Sample Companies** - 8 pre-loaded realistic B2B companies
- 🤖 **Generate AI Emails** - Create personalized outreach emails using OpenAI
- 🎯 **Smart Matching** - See intelligent lead scoring based on preferences
- 🔗 **Direct Engagement** - One-click LinkedIn, email, and maps integration
- ⚙️ **Configure Preferences** - Set industry targets and business criteria

### 1. **User Management**
- Registration, login, JWT authentication
- User profile with editable preferences (industries, business types, keywords, etc.)

### 2. **Lead Scraping & Ingestion**
- Scrapes company data from public sources (websites, LinkedIn, BBB, etc.)
- Data fields: Company, Industry, Links, Products/Services, Business Type, Employee Count, Revenue, Year Founded, BBB Rating, Address, City, State

### 3. **Data Preprocessing**
- Cleans and normalizes scraped data (removes duplicates, standardizes fields)
- Enriches with external APIs (e.g., LinkedIn, BBB, Google Maps)
- Extracts and validates contact emails, LinkedIn URLs, and phone numbers

### 4. **AI-Powered Matching**
- Users set interests/preferences (industries, business types, revenue, etc.)
- Each lead is scored using a custom matching algorithm:
    - Industry match (30%)
    - Business type (20%)
    - Revenue range (20%)
    - Employee count (15%)
    - Keyword relevance (15%)
- Match score is displayed visually (badges, color codes)

### 5. **Tabular Dashboard**
- Interactive table with all company fields as columns
- Action buttons for:
    - AI-personalized email/message (OpenAI GPT)
    - LinkedIn messaging
    - Email (mailto)
    - Google Maps (address)
- Filtering and search by any field
- Export to CSV/Excel

### 6. **Direct Engagement Tools**
- One-click AI message generation for each lead
- Send emails or LinkedIn messages directly from the dashboard
- Map integration for viewing company locations

### 7. **Analytics & Insights**
- Dashboard with stats: total leads, contacted, qualified, new
- Industry breakdown charts
- Top matches and recent leads

---

## 🧠 Model & AI Details

### **Model Used**
- [OpenAI GPT-3.5/4](https://platform.openai.com/docs/models/gpt-4) via API
- Used for: Personalized email/message generation based on lead data and user preferences

### **Prompt Engineering**
- Dynamic prompts constructed using company info, user interests, and context
- Example prompt:
    ```
    Write a concise, personalized outreach email to the HR manager of {Company} in the {Industry} sector, highlighting our {UserInterest} and referencing their {Product/Service}.
    ```

### **Preprocessing Pipeline**
- **Deduplication:** Remove duplicate companies by domain or name
- **Standardization:** Normalize industry, revenue, and address fields
- **Enrichment:** Fetch missing data from LinkedIn, BBB, Google Maps APIs
- **Validation:** Ensure emails and URLs are valid and reachable

---

## 📊 Dataset

### **Sources**
- Public company directories (e.g., LinkedIn, BBB, Crunchbase)
- Company websites (scraped with consent)
- Open datasets (e.g., US business registries)

### **Fields Collected**
- Company Name, Industry, Website, LinkedIn, Email, Products/Services, Business Type, Employee Count, Revenue, Year Founded, BBB Rating, Address, City, State

### **Sample Data**
- 8+ realistic sample companies included for demo/testing

---

## 💡 Business Model

### **Target Users**
- B2B sales teams, recruiters, business development professionals, agencies

### **Value Proposition**
- **Faster lead discovery:** Automated scraping and enrichment
- **Smarter engagement:** AI-personalized outreach at scale
- **Higher conversion:** Intelligent matching to user interests
- **All-in-one workflow:** From discovery to engagement in one dashboard

### **Monetization Strategies**
- **Subscription tiers:** Free trial, Pro (unlimited leads, advanced AI), Enterprise (custom integrations)
- **Pay-per-lead:** Charge for exporting or unlocking premium leads
- **White-labeling:** Offer as a SaaS platform for agencies

---

## 🛠️ Setup & Usage

### **🌐 Live Demo**
Visit the live application: [https://leadgenpro-black.vercel.app/](https://leadgenpro-black.vercel.app/)

### **🔧 Local Development**

### **1. Clone the Repository**
```bash
git clone https://github.com/Shine-5705/LeadGen-Pro---AI-Powered-B2B-Lead-Generation-Platform.git
cd LeadGen-Pro---AI-Powered-B2B-Lead-Generation-Platform
```

### **2. Install Dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### **3. Configure Environment**
Create a `.env` file in `/server`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leadgen
JWT_SECRET=your-strong-secret
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
```

Create a `.env` file in `/client`:
```
REACT_APP_API_URL=http://localhost:5000
```

### **4. Start the Application**
```bash
# Start backend server (from /server directory)
npm start

# Start frontend client (from /client directory)
npm start
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### **🚀 Deployment**

**Frontend (Vercel):**
- Deployed at: [https://leadgenpro-black.vercel.app/](https://leadgenpro-black.vercel.app/)
- Environment variables: `REACT_APP_API_URL=https://leadgenpro-backend.onrender.com`

**Backend (Render):**
- Deployed at: [https://leadgenpro-backend.onrender.com/](https://leadgenpro-backend.onrender.com/)
- Environment variables: MongoDB Atlas URI, OpenAI API Key, JWT Secret

### **5. Demo Features**
- ✅ Sample data with 8 realistic companies
- ✅ AI-powered email generation
- ✅ Intelligent lead matching
- ✅ Direct engagement tools (LinkedIn, email, maps)
- ✅ User preferences system

---

## 📈 Roadmap

- [ ] Real-time scraping from user-provided URLs
- [ ] Bulk import/export
- [ ] CRM integrations (HubSpot, Salesforce)
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features

---

## 🤝 Contributing

Pull requests welcome! Please open an issue first to discuss major changes.

---

## 📄 License

MIT License


