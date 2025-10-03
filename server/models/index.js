const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  company: String,
  plan: { type: String, enum: ['free', 'bronze', 'silver', 'gold', 'platinum'], default: 'free' },
  credits: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

// Lead Schema
const leadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  website: String,
  linkedin: String,
  email: String,
  phone: String,
  industry: String,
  businessType: String,
  employeeCount: String,
  revenue: String,
  yearFounded: String,
  bbbRating: String,
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: { type: String, default: 'USA' },
  productsServices: [String],
  description: String,
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'closed'], default: 'new' },
  notes: String,
  lastContacted: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Campaign Schema
const campaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  leads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }],
  emailTemplate: String,
  status: { type: String, enum: ['draft', 'active', 'paused', 'completed'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Email Template Schema
const emailTemplateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  subject: String,
  content: { type: String, required: true },
  variables: [String],
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  leadsGenerated: { type: Number, default: 0 },
  emailsSent: { type: Number, default: 0 },
  emailsOpened: { type: Number, default: 0 },
  emailsClicked: { type: Number, default: 0 },
  responses: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 }
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leadgen');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  User: mongoose.model('User', userSchema),
  Lead: mongoose.model('Lead', leadSchema),
  Campaign: mongoose.model('Campaign', campaignSchema),
  EmailTemplate: mongoose.model('EmailTemplate', emailTemplateSchema),
  Analytics: mongoose.model('Analytics', analyticsSchema)
};



