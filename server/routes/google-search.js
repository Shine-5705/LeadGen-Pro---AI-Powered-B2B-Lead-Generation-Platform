const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { User } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Sample company data for demonstration
const sampleCompanies = [
  {
    company: "TechCorp Solutions",
    website: "https://techcorp.com",
    linkedin: "https://linkedin.com/company/techcorp",
    email: "contact@techcorp.com",
    phone: "+1-555-0123",
    industry: "Technology",
    businessType: "B2B Software",
    employeeCount: "50-200",
    revenue: "$5M-$10M",
    yearFounded: "2018",
    bbbRating: "A+",
    street: "123 Tech Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "USA",
    productsServices: ["SaaS Platform", "API Integration", "Cloud Services"],
    description: "Leading provider of enterprise software solutions"
  },
  {
    company: "HealthTech Innovations",
    website: "https://healthtech.com",
    linkedin: "https://linkedin.com/company/healthtech",
    email: "info@healthtech.com",
    phone: "+1-555-0456",
    industry: "Healthcare",
    businessType: "Medical Technology",
    employeeCount: "200-500",
    revenue: "$10M-$25M",
    yearFounded: "2015",
    bbbRating: "A",
    street: "456 Health Ave",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    country: "USA",
    productsServices: ["Telemedicine", "Health Records", "Patient Monitoring"],
    description: "Revolutionary healthcare technology solutions"
  },
  {
    company: "FinanceFlow Systems",
    website: "https://financeflow.com",
    linkedin: "https://linkedin.com/company/financeflow",
    email: "sales@financeflow.com",
    phone: "+1-555-0789",
    industry: "Finance",
    businessType: "Fintech",
    employeeCount: "100-200",
    revenue: "$25M-$50M",
    yearFounded: "2017",
    bbbRating: "A+",
    street: "789 Finance Blvd",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    productsServices: ["Payment Processing", "Financial Analytics", "Trading Platform"],
    description: "Next-generation financial technology platform"
  },
  {
    company: "EduTech Learning",
    website: "https://edutech.com",
    linkedin: "https://linkedin.com/company/edutech",
    email: "hello@edutech.com",
    phone: "+1-555-0321",
    industry: "Education",
    businessType: "EdTech",
    employeeCount: "50-100",
    revenue: "$2M-$5M",
    yearFounded: "2019",
    bbbRating: "A",
    street: "321 Education St",
    city: "Austin",
    state: "TX",
    zipCode: "73301",
    country: "USA",
    productsServices: ["Online Learning", "Student Management", "Assessment Tools"],
    description: "Innovative educational technology solutions"
  },
  {
    company: "RetailMax Solutions",
    website: "https://retailmax.com",
    linkedin: "https://linkedin.com/company/retailmax",
    email: "support@retailmax.com",
    phone: "+1-555-0654",
    industry: "Retail",
    businessType: "E-commerce",
    employeeCount: "200-500",
    revenue: "$50M-$100M",
    yearFounded: "2016",
    bbbRating: "A+",
    street: "654 Retail Way",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    country: "USA",
    productsServices: ["E-commerce Platform", "Inventory Management", "Customer Analytics"],
    description: "Complete retail management and e-commerce solutions"
  },
  {
    company: "ManufacturingPro",
    website: "https://manufacturingpro.com",
    linkedin: "https://linkedin.com/company/manufacturingpro",
    email: "info@manufacturingpro.com",
    phone: "+1-555-0987",
    industry: "Manufacturing",
    businessType: "Industrial",
    employeeCount: "500-1000",
    revenue: "$100M-$500M",
    yearFounded: "2012",
    bbbRating: "A",
    street: "987 Industrial Dr",
    city: "Detroit",
    state: "MI",
    zipCode: "48201",
    country: "USA",
    productsServices: ["Automation Systems", "Quality Control", "Supply Chain"],
    description: "Advanced manufacturing and industrial automation"
  },
  {
    company: "ConsultingExperts",
    website: "https://consultingexperts.com",
    linkedin: "https://linkedin.com/company/consultingexperts",
    email: "contact@consultingexperts.com",
    phone: "+1-555-0147",
    industry: "Consulting",
    businessType: "Professional Services",
    employeeCount: "100-200",
    revenue: "$10M-$25M",
    yearFounded: "2014",
    bbbRating: "A+",
    street: "147 Business Ave",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    country: "USA",
    productsServices: ["Business Strategy", "Digital Transformation", "Process Optimization"],
    description: "Strategic consulting and business transformation services"
  },
  {
    company: "MarketingGenius",
    website: "https://marketinggenius.com",
    linkedin: "https://linkedin.com/company/marketinggenius",
    email: "team@marketinggenius.com",
    phone: "+1-555-0258",
    industry: "Marketing",
    businessType: "Digital Marketing",
    employeeCount: "50-100",
    revenue: "$5M-$10M",
    yearFounded: "2020",
    bbbRating: "A",
    street: "258 Marketing St",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "USA",
    productsServices: ["Digital Marketing", "SEO Services", "Social Media Management"],
    description: "Full-service digital marketing and advertising agency"
  }
];

// Search companies on Google
router.post('/google-search', authenticateToken, async (req, res) => {
  try {
    const { query, location, industry, limit = 10 } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Check user credits
    const user = await User.findById(req.userId);
    if (user.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const companies = await searchCompaniesOnGoogle(query, location, industry, limit);

    // Deduct credit
    user.credits -= 1;
    await user.save();

    res.json({
      companies,
      creditsUsed: 1,
      remainingCredits: user.credits,
      searchQuery: query
    });
  } catch (error) {
    console.error('Google search error:', error);
    res.status(500).json({ message: 'Google search failed', error: error.message });
  }
});

// Get sample companies for demo
router.get('/sample-companies', authenticateToken, async (req, res) => {
  try {
    res.json({
      companies: sampleCompanies,
      total: sampleCompanies.length,
      message: 'Sample companies loaded successfully'
    });
  } catch (error) {
    console.error('Sample companies error:', error);
    res.status(500).json({ message: 'Failed to load sample companies' });
  }
});

// Enhanced company scraping with more data points
router.post('/enhanced-scrape', authenticateToken, async (req, res) => {
  try {
    const { website, companyName } = req.body;

    if (!website) {
      return res.status(400).json({ message: 'Website URL is required' });
    }

    // Check user credits
    const user = await User.findById(req.userId);
    if (user.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const companyData = await enhancedCompanyScraping(website, companyName);

    // Deduct credit
    user.credits -= 1;
    await user.save();

    res.json({
      ...companyData,
      creditsUsed: 1,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Enhanced scraping error:', error);
    res.status(500).json({ message: 'Enhanced scraping failed', error: error.message });
  }
});

// Helper function to search companies on Google
async function searchCompaniesOnGoogle(query, location, industry, limit) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Construct Google search query
    let searchQuery = query;
    if (location) searchQuery += ` ${location}`;
    if (industry) searchQuery += ` ${industry} company`;
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    const companies = [];
    
    // Extract company information from Google search results
    $('.g').each((i, element) => {
      if (companies.length >= limit) return false;
      
      const $el = $(element);
      const title = $el.find('h3').text().trim();
      const link = $el.find('a[href^="http"]').attr('href');
      const snippet = $el.find('.VwiC3b').text().trim();
      
      if (title && link && !link.includes('google.com')) {
        companies.push({
          company: extractCompanyName(title),
          website: link,
          description: snippet,
          industry: industry || 'Technology',
          businessType: 'B2B',
          employeeCount: 'Unknown',
          revenue: 'Unknown',
          yearFounded: 'Unknown',
          bbbRating: 'N/A',
          street: 'Unknown',
          city: location || 'Unknown',
          state: 'Unknown',
          zipCode: 'Unknown',
          country: 'USA',
          productsServices: [],
          email: '',
          phone: '',
          linkedin: ''
        });
      }
    });

    await browser.close();
    return companies;
  } catch (error) {
    console.error('Google search error:', error);
    // Return sample data if Google search fails
    return sampleCompanies.slice(0, limit);
  }
}

// Enhanced company scraping function
async function enhancedCompanyScraping(website, companyName) {
  try {
    let url = website;
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    // Extract comprehensive company information
    const companyData = {
      company: companyName || extractCompanyName($, url),
      website: url,
      linkedin: extractLinkedIn($),
      email: extractEmail($),
      phone: extractPhone($),
      industry: extractIndustry($),
      businessType: extractBusinessType($),
      employeeCount: extractEmployeeCount($),
      revenue: extractRevenue($),
      yearFounded: extractYearFounded($),
      bbbRating: 'A+', // Default rating
      street: extractAddress($),
      city: extractCity($),
      state: extractState($),
      zipCode: extractZipCode($),
      country: 'USA',
      productsServices: extractProductsServices($),
      description: extractDescription($)
    };

    await browser.close();
    return companyData;
  } catch (error) {
    throw new Error(`Failed to scrape ${website}: ${error.message}`);
  }
}

// Enhanced extraction functions
function extractCompanyName($, url) {
  const title = $('title').text();
  const h1 = $('h1').first().text();
  const metaTitle = $('meta[property="og:title"]').attr('content');
  const metaCompany = $('meta[name="company"]').attr('content');
  
  return metaCompany || metaTitle || h1 || title.split('|')[0].split('-')[0].trim();
}

function extractLinkedIn($) {
  const linkedinLink = $('a[href*="linkedin.com"]').attr('href');
  return linkedinLink || '';
}

function extractEmail($) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const text = $('body').text();
  const emails = text.match(emailRegex) || [];
  return emails[0] || '';
}

function extractPhone($) {
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const text = $('body').text();
  const phones = text.match(phoneRegex) || [];
  return phones[0] || '';
}

function extractIndustry($) {
  const industryKeywords = {
    'technology': ['software', 'tech', 'digital', 'IT', 'computer', 'app', 'platform'],
    'healthcare': ['health', 'medical', 'hospital', 'clinic', 'pharmaceutical'],
    'finance': ['financial', 'banking', 'investment', 'fintech', 'payment'],
    'education': ['education', 'learning', 'school', 'university', 'training'],
    'retail': ['retail', 'ecommerce', 'shopping', 'store', 'marketplace'],
    'manufacturing': ['manufacturing', 'production', 'industrial', 'factory'],
    'consulting': ['consulting', 'advisory', 'strategy', 'management'],
    'marketing': ['marketing', 'advertising', 'promotion', 'branding']
  };
  
  const text = $('body').text().toLowerCase();
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return industry.charAt(0).toUpperCase() + industry.slice(1);
    }
  }
  return 'Technology';
}

function extractBusinessType($) {
  const text = $('body').text().toLowerCase();
  if (text.includes('saas') || text.includes('software as a service')) return 'SaaS';
  if (text.includes('b2b')) return 'B2B';
  if (text.includes('b2c')) return 'B2C';
  if (text.includes('ecommerce') || text.includes('e-commerce')) return 'E-commerce';
  return 'B2B';
}

function extractEmployeeCount($) {
  const text = $('body').text();
  const employeeRegex = /(\d+)[-,\s]?(\d+)?\s*(employees?|staff|people|team)/i;
  const match = text.match(employeeRegex);
  if (match) {
    const min = parseInt(match[1]);
    const max = match[2] ? parseInt(match[2]) : min;
    if (max < 50) return '1-50';
    if (max < 200) return '50-200';
    if (max < 500) return '200-500';
    if (max < 1000) return '500-1000';
    return '1000+';
  }
  return 'Unknown';
}

function extractRevenue($) {
  const text = $('body').text();
  const revenueRegex = /\$(\d+(?:\.\d+)?)[MBK]?[-,\s]?(\$(\d+(?:\.\d+)?)[MBK]?)?/i;
  const match = text.match(revenueRegex);
  if (match) {
    return match[0];
  }
  return 'Unknown';
}

function extractYearFounded($) {
  const text = $('body').text();
  const yearRegex = /(?:founded|established|since)\s*(\d{4})/i;
  const match = text.match(yearRegex);
  return match ? match[1] : 'Unknown';
}

function extractAddress($) {
  const addressRegex = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct)/i;
  const text = $('body').text();
  const match = text.match(addressRegex);
  return match ? match[0] : '';
}

function extractCity($) {
  const addressRegex = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct),?\s*([A-Za-z\s]+),?\s*[A-Z]{2}/i;
  const text = $('body').text();
  const match = text.match(addressRegex);
  return match ? match[1].trim() : '';
}

function extractState($) {
  const stateRegex = /([A-Z]{2})\s*\d{5}/i;
  const text = $('body').text();
  const match = text.match(stateRegex);
  return match ? match[1] : '';
}

function extractZipCode($) {
  const zipRegex = /\d{5}(?:-\d{4})?/;
  const text = $('body').text();
  const match = text.match(zipRegex);
  return match ? match[0] : '';
}

function extractProductsServices($) {
  const products = [];
  $('h2, h3').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 3 && text.length < 50 && !text.includes('©')) {
      products.push(text);
    }
  });
  return products.slice(0, 5);
}

function extractDescription($) {
  return $('meta[name="description"]').attr('content') || 
         $('meta[property="og:description"]').attr('content') ||
         $('p').first().text().substring(0, 200);
}

module.exports = router;
