const express = require('express');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');
const { User } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key'
});

// Generate personalized email
router.post('/email', async (req, res) => {
  try {
    const { leadData, emailType = 'cold-outreach', customPrompt } = req.body;

    if (!leadData) {
      return res.status(400).json({ message: 'Lead data is required' });
    }

    // For demo purposes, allow without authentication
    // In production, always require authentication
    let user = null;
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.userId);
      } catch (error) {
        console.log('Token verification failed, using demo mode');
      }
    }

    // Check user credits only if authenticated
    if (user && user.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const emailContent = await generatePersonalizedEmail(leadData, emailType, customPrompt);

    // Deduct credit only if user is authenticated
    if (user) {
      user.credits -= 1;
      await user.save();
    }

    res.json({
      ...emailContent,
      creditsUsed: user ? 1 : 0,
      remainingCredits: user ? user.credits : 'demo'
    });
  } catch (error) {
    console.error('Email generation error:', error);
    res.status(500).json({ message: 'Email generation failed', error: error.message });
  }
});

// Generate multiple email variations
router.post('/email/variations', authenticateToken, async (req, res) => {
  try {
    const { leadData, count = 3, emailType = 'cold-outreach' } = req.body;

    if (!leadData) {
      return res.status(400).json({ message: 'Lead data is required' });
    }

    // Check user credits
    const user = await User.findById(req.userId);
    if (user.credits < count) {
      return res.status(400).json({ 
        message: 'Insufficient credits',
        required: count,
        available: user.credits
      });
    }

    const variations = [];
    for (let i = 0; i < count; i++) {
      const emailContent = await generatePersonalizedEmail(leadData, emailType);
      variations.push({
        ...emailContent,
        variation: i + 1
      });
    }

    // Deduct credits
    user.credits -= count;
    await user.save();

    res.json({
      variations,
      creditsUsed: count,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Email variations error:', error);
    res.status(500).json({ message: 'Email variations generation failed' });
  }
});

// Generate follow-up email
router.post('/email/followup', authenticateToken, async (req, res) => {
  try {
    const { leadData, previousEmail, followUpType = 'gentle-reminder' } = req.body;

    if (!leadData || !previousEmail) {
      return res.status(400).json({ message: 'Lead data and previous email are required' });
    }

    // Check user credits
    const user = await User.findById(req.userId);
    if (user.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const followUpContent = await generateFollowUpEmail(leadData, previousEmail, followUpType);

    // Deduct credit
    user.credits -= 1;
    await user.save();

    res.json({
      ...followUpContent,
      creditsUsed: 1,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Follow-up email error:', error);
    res.status(500).json({ message: 'Follow-up email generation failed' });
  }
});

// Generate LinkedIn message
router.post('/linkedin', authenticateToken, async (req, res) => {
  try {
    const { leadData, messageType = 'connection-request' } = req.body;

    if (!leadData) {
      return res.status(400).json({ message: 'Lead data is required' });
    }

    // Check user credits
    const user = await User.findById(req.userId);
    if (user.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const messageContent = await generateLinkedInMessage(leadData, messageType);

    // Deduct credit
    user.credits -= 1;
    await user.save();

    res.json({
      ...messageContent,
      creditsUsed: 1,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('LinkedIn message error:', error);
    res.status(500).json({ message: 'LinkedIn message generation failed' });
  }
});

// Generate revenue estimate
router.post('/revenue-estimate', authenticateToken, async (req, res) => {
  try {
    const { companyData } = req.body;

    if (!companyData) {
      return res.status(400).json({ message: 'Company data is required' });
    }

    const revenueEstimate = await generateRevenueEstimate(companyData);

    res.json(revenueEstimate);
  } catch (error) {
    console.error('Revenue estimate error:', error);
    res.status(500).json({ message: 'Revenue estimation failed' });
  }
});

// Helper function to generate personalized email
async function generatePersonalizedEmail(leadData, emailType, customPrompt) {
  const prompt = buildEmailPrompt(leadData, emailType, customPrompt);
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert sales copywriter specializing in B2B outreach emails. Create compelling, personalized emails that drive engagement and conversions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const content = completion.choices[0].message.content;
    const lines = content.split('\n');
    
    const subject = lines.find(line => line.toLowerCase().includes('subject:'))?.replace(/subject:\s*/i, '') || 
                   generateDefaultSubject(leadData);
    
    const body = content.replace(/subject:.*\n/i, '').trim();

    return {
      subject,
      body,
      wordCount: body.split(' ').length,
      personalizationScore: calculatePersonalizationScore(body, leadData)
    };
  } catch (error) {
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

// Helper function to generate follow-up email
async function generateFollowUpEmail(leadData, previousEmail, followUpType) {
  const prompt = `Generate a follow-up email based on this previous email and lead information:

Previous Email:
Subject: ${previousEmail.subject}
Body: ${previousEmail.body}

Lead Information:
Company: ${leadData.company}
Industry: ${leadData.industry}
Website: ${leadData.website}
Location: ${leadData.city}, ${leadData.state}

Follow-up Type: ${followUpType}

Create a professional follow-up email that:
1. References the previous email subtly
2. Provides additional value
3. Maintains a professional tone
4. Includes a clear call-to-action
5. Is personalized to their business

Format the response as:
Subject: [subject line]
Body: [email body]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert sales copywriter specializing in follow-up emails. Create compelling follow-up emails that maintain engagement and drive conversions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.7
    });

    const content = completion.choices[0].message.content;
    const lines = content.split('\n');
    
    const subject = lines.find(line => line.toLowerCase().includes('subject:'))?.replace(/subject:\s*/i, '') || 
                   `Following up - ${leadData.company}`;
    
    const body = content.replace(/subject:.*\n/i, '').trim();

    return {
      subject,
      body,
      wordCount: body.split(' ').length,
      followUpType
    };
  } catch (error) {
    throw new Error(`Follow-up email generation error: ${error.message}`);
  }
}

// Helper function to generate LinkedIn message
async function generateLinkedInMessage(leadData, messageType) {
  const prompt = `Generate a LinkedIn ${messageType} message for this lead:

Lead Information:
Name: ${leadData.name || 'Professional'}
Company: ${leadData.company}
Title: ${leadData.title || 'Professional'}
Industry: ${leadData.industry}
Location: ${leadData.city}, ${leadData.state}

Message Type: ${messageType}

Create a professional LinkedIn message that:
1. Is personalized and relevant
2. Provides value
3. Is concise (under 300 characters)
4. Includes a clear call-to-action
5. Maintains a professional tone

Generate the message content:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert LinkedIn networking specialist. Create compelling LinkedIn messages that build professional relationships."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const message = completion.choices[0].message.content.trim();

    return {
      message,
      characterCount: message.length,
      messageType
    };
  } catch (error) {
    throw new Error(`LinkedIn message generation error: ${error.message}`);
  }
}

// Helper function to generate revenue estimate
async function generateRevenueEstimate(companyData) {
  const prompt = `Estimate the annual revenue for this company based on available data:

Company Information:
Company: ${companyData.company}
Industry: ${companyData.industry}
Employee Count: ${companyData.employeeCount}
Website: ${companyData.website}
Location: ${companyData.city}, ${companyData.state}
Year Founded: ${companyData.yearFounded}

Provide a revenue estimate with:
1. Estimated annual revenue range
2. Confidence level (High/Medium/Low)
3. Reasoning for the estimate
4. Key factors considered

Format as JSON with fields: minRevenue, maxRevenue, confidence, reasoning, factors`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a business analyst expert at estimating company revenues based on available data points."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    });

    const response = completion.choices[0].message.content.trim();
    
    try {
      return JSON.parse(response);
    } catch {
      // Fallback if JSON parsing fails
      return {
        minRevenue: 1000000,
        maxRevenue: 5000000,
        confidence: 'Medium',
        reasoning: 'Based on industry standards and company size',
        factors: ['Industry', 'Employee count', 'Location']
      };
    }
  } catch (error) {
    throw new Error(`Revenue estimation error: ${error.message}`);
  }
}

// Helper function to build email prompt
function buildEmailPrompt(leadData, emailType, customPrompt) {
  if (customPrompt) {
    return customPrompt.replace(/\{(\w+)\}/g, (match, key) => leadData[key] || match);
  }

  const basePrompt = `Generate a personalized ${emailType} email for this B2B lead:

Lead Information:
Company: ${leadData.company}
Industry: ${leadData.industry}
Website: ${leadData.website}
Location: ${leadData.city}, ${leadData.state}
Employee Count: ${leadData.employeeCount}
Revenue: ${leadData.revenue}
Year Founded: ${leadData.yearFounded}
Products/Services: ${leadData.productsServices?.join(', ') || 'Not specified'}

Email Requirements:
1. Professional and personalized tone
2. Reference specific company details
3. Provide clear value proposition
4. Include a compelling call-to-action
5. Keep it concise (under 200 words)
6. Avoid generic phrases

Format the response as:
Subject: [compelling subject line]
Body: [email body]`;

  return basePrompt;
}

// Helper function to generate default subject
function generateDefaultSubject(leadData) {
  const subjects = [
    `Quick question about ${leadData.company}`,
    `Partnership opportunity with ${leadData.company}`,
    `How ${leadData.company} can benefit from our solution`,
    `Growing ${leadData.industry} companies like ${leadData.company}`,
    `Quick 5-minute call about ${leadData.company}?`
  ];
  
  return subjects[Math.floor(Math.random() * subjects.length)];
}

// Helper function to calculate personalization score
function calculatePersonalizationScore(body, leadData) {
  let score = 0;
  const companyName = leadData.company?.toLowerCase() || '';
  const industry = leadData.industry?.toLowerCase() || '';
  const city = leadData.city?.toLowerCase() || '';
  
  if (body.toLowerCase().includes(companyName)) score += 30;
  if (body.toLowerCase().includes(industry)) score += 25;
  if (body.toLowerCase().includes(city)) score += 20;
  if (body.includes(leadData.website)) score += 15;
  if (body.includes(leadData.employeeCount)) score += 10;
  
  return Math.min(score, 100);
}

module.exports = router;



