const express = require('express');
const { Lead, User } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get all leads for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, status, industry, search } = req.query;
    const query = { userId: req.userId };

    // Add filters
    if (status) query.status = status;
    if (industry) query.industry = industry;
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lead.countDocuments(query);

    res.json({
      leads,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single lead
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, userId: req.userId });
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new lead
router.post('/', authenticateToken, async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      userId: req.userId
    };

    const lead = new Lead(leadData);
    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lead
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete lead
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk create leads
router.post('/bulk', authenticateToken, async (req, res) => {
  try {
    const { leads } = req.body;
    
    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ message: 'Leads array is required' });
    }

    // Check user credits
    const user = await User.findById(req.userId);
    if (user.credits < leads.length) {
      return res.status(400).json({ 
        message: 'Insufficient credits',
        required: leads.length,
        available: user.credits
      });
    }

    // Add userId to each lead
    const leadsWithUserId = leads.map(lead => ({
      ...lead,
      userId: req.userId
    }));

    const createdLeads = await Lead.insertMany(leadsWithUserId);

    // Deduct credits
    user.credits -= leads.length;
    await user.save();

    res.status(201).json({
      message: 'Leads created successfully',
      leads: createdLeads,
      creditsUsed: leads.length,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Bulk create leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get lead statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
          qualified: { $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] } },
          converted: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
        }
      }
    ]);

    const industryStats = await Lead.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      statusBreakdown: stats[0] || { total: 0, new: 0, contacted: 0, qualified: 0, converted: 0, closed: 0 },
      topIndustries: industryStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



