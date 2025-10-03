const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { User } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Scrape company data from website
router.post('/company', authenticateToken, async (req, res) => {
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

    const companyData = await scrapeCompanyData(website, companyName);

    // Deduct credit
    user.credits -= 1;
    await user.save();

    res.json({
      ...companyData,
      creditsUsed: 1,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ message: 'Scraping failed', error: error.message });
  }
});

// Bulk scrape companies
router.post('/bulk', authenticateToken, async (req, res) => {
  try {
    const { websites } = req.body;

    if (!Array.isArray(websites) || websites.length === 0) {
      return res.status(400).json({ message: 'Websites array is required' });
    }

    // Check user credits
    const user = await User.findById(req.userId);
    if (user.credits < websites.length) {
      return res.status(400).json({ 
        message: 'Insufficient credits',
        required: websites.length,
        available: user.credits
      });
    }

    const results = [];
    for (const website of websites) {
      try {
        const data = await scrapeCompanyData(website.url, website.companyName);
        results.push({ ...data, url: website.url, success: true });
      } catch (error) {
        results.push({ 
          url: website.url, 
          companyName: website.companyName,
          success: false, 
          error: error.message 
        });
      }
    }

    // Deduct credits for successful scrapes
    const successfulScrapes = results.filter(r => r.success).length;
    user.credits -= successfulScrapes;
    await user.save();

    res.json({
      results,
      creditsUsed: successfulScrapes,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Bulk scraping error:', error);
    res.status(500).json({ message: 'Bulk scraping failed' });
  }
});

// Scrape LinkedIn profiles
router.post('/linkedin', authenticateToken, async (req, res) => {
  try {
    const { linkedinUrl } = req.body;

    if (!linkedinUrl) {
      return res.status(400).json({ message: 'LinkedIn URL is required' });
    }

    // Check user credits
    const user = await User.findById(req.userId);
    if (user.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const profileData = await scrapeLinkedInProfile(linkedinUrl);

    // Deduct credit
    user.credits -= 1;
    await user.save();

    res.json({
      ...profileData,
      creditsUsed: 1,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('LinkedIn scraping error:', error);
    res.status(500).json({ message: 'LinkedIn scraping failed' });
  }
});

// Helper function to scrape company data
async function scrapeCompanyData(website, companyName) {
  try {
    // Normalize URL
    let url = website;
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    // Use Puppeteer for dynamic content
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    // Extract company information
    const companyData = {
      company: companyName || extractCompanyName($, url),
      website: url,
      description: extractDescription($),
      industry: extractIndustry($),
      productsServices: extractProductsServices($),
      contactInfo: extractContactInfo($),
      socialLinks: extractSocialLinks($),
      address: extractAddress($)
    };

    await browser.close();
    return companyData;
  } catch (error) {
    throw new Error(`Failed to scrape ${website}: ${error.message}`);
  }
}

// Helper function to scrape LinkedIn profile
async function scrapeLinkedInProfile(linkedinUrl) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto(linkedinUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    const profileData = {
      linkedin: linkedinUrl,
      name: extractLinkedInName($),
      title: extractLinkedInTitle($),
      company: extractLinkedInCompany($),
      location: extractLinkedInLocation($),
      connections: extractLinkedInConnections($),
      summary: extractLinkedInSummary($)
    };

    await browser.close();
    return profileData;
  } catch (error) {
    throw new Error(`Failed to scrape LinkedIn profile: ${error.message}`);
  }
}

// Extraction helper functions
function extractCompanyName($, url) {
  const title = $('title').text();
  const h1 = $('h1').first().text();
  const metaTitle = $('meta[property="og:title"]').attr('content');
  
  return metaTitle || h1 || title.split('|')[0].split('-')[0].trim();
}

function extractDescription($) {
  return $('meta[name="description"]').attr('content') || 
         $('meta[property="og:description"]').attr('content') ||
         $('p').first().text().substring(0, 200);
}

function extractIndustry($) {
  const industryKeywords = [
    'technology', 'software', 'healthcare', 'finance', 'education', 
    'retail', 'manufacturing', 'consulting', 'marketing', 'real estate'
  ];
  
  const text = $('body').text().toLowerCase();
  for (const keyword of industryKeywords) {
    if (text.includes(keyword)) {
      return keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }
  }
  return 'Technology'; // Default
}

function extractProductsServices($) {
  const products = [];
  $('h2, h3').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 3 && text.length < 50) {
      products.push(text);
    }
  });
  return products.slice(0, 5);
}

function extractContactInfo($) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  
  const text = $('body').text();
  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  
  return {
    emails: [...new Set(emails)].slice(0, 3),
    phones: [...new Set(phones)].slice(0, 2)
  };
}

function extractSocialLinks($) {
  const links = {};
  $('a[href*="linkedin.com"]').each((i, el) => {
    links.linkedin = $(el).attr('href');
  });
  $('a[href*="twitter.com"], a[href*="x.com"]').each((i, el) => {
    links.twitter = $(el).attr('href');
  });
  $('a[href*="facebook.com"]').each((i, el) => {
    links.facebook = $(el).attr('href');
  });
  return links;
}

function extractAddress($) {
  const addressRegex = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct)/i;
  const text = $('body').text();
  const match = text.match(addressRegex);
  return match ? match[0] : '';
}

// LinkedIn extraction functions
function extractLinkedInName($) {
  return $('h1.text-heading-xlarge').text().trim() ||
         $('.text-heading-xlarge').text().trim();
}

function extractLinkedInTitle($) {
  return $('.text-body-medium.break-words').text().trim();
}

function extractLinkedInCompany($) {
  return $('.text-body-small.inline.t-black--light.break-words').text().trim();
}

function extractLinkedInLocation($) {
  return $('.text-body-small.inline.t-black--light.break-words').eq(1).text().trim();
}

function extractLinkedInConnections($) {
  return $('.t-bold').text().trim();
}

function extractLinkedInSummary($) {
  return $('.pv-about-section .pv-about__summary-text').text().trim();
}

module.exports = router;



