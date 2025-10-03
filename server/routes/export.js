const express = require('express');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const { Lead, User } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Export leads to CSV
router.post('/csv', authenticateToken, async (req, res) => {
  try {
    const { leadIds, filters = {} } = req.body;
    
    let query = { userId: req.userId };
    
    if (leadIds && leadIds.length > 0) {
      query._id = { $in: leadIds };
    } else {
      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.industry) query.industry = filters.industry;
      if (filters.city) query.city = filters.city;
      if (filters.state) query.state = filters.state;
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    if (leads.length === 0) {
      return res.status(404).json({ message: 'No leads found to export' });
    }

    // Prepare data for CSV
    const csvData = leads.map(lead => ({
      Company: lead.company,
      Website: lead.website,
      LinkedIn: lead.linkedin,
      Email: lead.email,
      Phone: lead.phone,
      Industry: lead.industry,
      Business_Type: lead.businessType,
      Employee_Count: lead.employeeCount,
      Revenue: lead.revenue,
      Year_Founded: lead.yearFounded,
      BBB_Rating: lead.bbbRating,
      Street: lead.street,
      City: lead.city,
      State: lead.state,
      Zip_Code: lead.zipCode,
      Country: lead.country,
      Products_Services: lead.productsServices?.join('; ') || '',
      Description: lead.description,
      Status: lead.status,
      Notes: lead.notes,
      Created_At: lead.createdAt,
      Updated_At: lead.updatedAt
    }));

    // Generate CSV
    const parser = new Parser();
    const csv = parser.parse(csvData);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`);
    
    res.send(csv);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ message: 'CSV export failed' });
  }
});

// Export leads to Excel
router.post('/excel', authenticateToken, async (req, res) => {
  try {
    const { leadIds, filters = {} } = req.body;
    
    let query = { userId: req.userId };
    
    if (leadIds && leadIds.length > 0) {
      query._id = { $in: leadIds };
    } else {
      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.industry) query.industry = filters.industry;
      if (filters.city) query.city = filters.city;
      if (filters.state) query.state = filters.state;
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    if (leads.length === 0) {
      return res.status(404).json({ message: 'No leads found to export' });
    }

    // Prepare data for Excel
    const excelData = leads.map(lead => ({
      Company: lead.company,
      Website: lead.website,
      LinkedIn: lead.linkedin,
      Email: lead.email,
      Phone: lead.phone,
      Industry: lead.industry,
      'Business Type': lead.businessType,
      'Employee Count': lead.employeeCount,
      Revenue: lead.revenue,
      'Year Founded': lead.yearFounded,
      'BBB Rating': lead.bbbRating,
      Street: lead.street,
      City: lead.city,
      State: lead.state,
      'Zip Code': lead.zipCode,
      Country: lead.country,
      'Products/Services': lead.productsServices?.join('; ') || '',
      Description: lead.description,
      Status: lead.status,
      Notes: lead.notes,
      'Created At': lead.createdAt,
      'Updated At': lead.updatedAt
    }));

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leads');

    // Define columns
    worksheet.columns = [
      { header: 'Company', key: 'Company', width: 25 },
      { header: 'Website', key: 'Website', width: 30 },
      { header: 'LinkedIn', key: 'LinkedIn', width: 30 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'Phone', key: 'Phone', width: 15 },
      { header: 'Industry', key: 'Industry', width: 20 },
      { header: 'Business Type', key: 'Business Type', width: 15 },
      { header: 'Employee Count', key: 'Employee Count', width: 15 },
      { header: 'Revenue', key: 'Revenue', width: 15 },
      { header: 'Year Founded', key: 'Year Founded', width: 12 },
      { header: 'BBB Rating', key: 'BBB Rating', width: 12 },
      { header: 'Street', key: 'Street', width: 30 },
      { header: 'City', key: 'City', width: 20 },
      { header: 'State', key: 'State', width: 10 },
      { header: 'Zip Code', key: 'Zip Code', width: 10 },
      { header: 'Country', key: 'Country', width: 15 },
      { header: 'Products/Services', key: 'Products/Services', width: 40 },
      { header: 'Description', key: 'Description', width: 50 },
      { header: 'Status', key: 'Status', width: 12 },
      { header: 'Notes', key: 'Notes', width: 30 },
      { header: 'Created At', key: 'Created At', width: 20 },
      { header: 'Updated At', key: 'Updated At', width: 20 }
    ];

    // Add data rows
    worksheet.addRows(excelData);

    // Generate Excel buffer
    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.xlsx"`);
    
    res.send(excelBuffer);
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Excel export failed' });
  }
});

// Export campaign data
router.post('/campaign', authenticateToken, async (req, res) => {
  try {
    const { campaignId, format = 'excel' } = req.body;

    // Get campaign leads
    const leads = await Lead.find({ 
      userId: req.userId,
      // Add campaign filtering logic here if needed
    }).sort({ createdAt: -1 });

    if (leads.length === 0) {
      return res.status(404).json({ message: 'No campaign data found to export' });
    }

    // Prepare campaign data
    const campaignData = leads.map(lead => ({
      Company: lead.company,
      Website: lead.website,
      Email: lead.email,
      Phone: lead.phone,
      Industry: lead.industry,
      Status: lead.status,
      'Last Contacted': lead.lastContacted || 'Never',
      Notes: lead.notes || '',
      'Response Rate': calculateResponseRate(lead),
      'Engagement Score': calculateEngagementScore(lead)
    }));

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(campaignData);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="campaign-${campaignId}-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else {
      // Excel format
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Campaign Data');
      
      // Define columns
      worksheet.columns = [
        { header: 'Company', key: 'Company', width: 25 },
        { header: 'Website', key: 'Website', width: 30 },
        { header: 'Email', key: 'Email', width: 30 },
        { header: 'Phone', key: 'Phone', width: 15 },
        { header: 'Industry', key: 'Industry', width: 20 },
        { header: 'Status', key: 'Status', width: 12 },
        { header: 'Last Contacted', key: 'Last Contacted', width: 20 },
        { header: 'Notes', key: 'Notes', width: 30 },
        { header: 'Response Rate', key: 'Response Rate', width: 15 },
        { header: 'Engagement Score', key: 'Engagement Score', width: 18 }
      ];

      // Add data rows
      worksheet.addRows(campaignData);
      
      // Add summary sheet
      const summaryData = [
        { Metric: 'Total Leads', Value: leads.length },
        { Metric: 'New Leads', Value: leads.filter(l => l.status === 'new').length },
        { Metric: 'Contacted', Value: leads.filter(l => l.status === 'contacted').length },
        { Metric: 'Qualified', Value: leads.filter(l => l.status === 'qualified').length },
        { Metric: 'Converted', Value: leads.filter(l => l.status === 'converted').length },
        { Metric: 'Average Response Rate', Value: calculateAverageResponseRate(leads) },
        { Metric: 'Export Date', Value: new Date().toISOString().split('T')[0] }
      ];
      
      const summarySheet = workbook.addWorksheet('Summary');
      summarySheet.columns = [
        { header: 'Metric', key: 'Metric', width: 25 },
        { header: 'Value', key: 'Value', width: 20 }
      ];
      summarySheet.addRows(summaryData);

      const excelBuffer = await workbook.xlsx.writeBuffer();

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="campaign-${campaignId}-${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(excelBuffer);
    }
  } catch (error) {
    console.error('Campaign export error:', error);
    res.status(500).json({ message: 'Campaign export failed' });
  }
});

// Export analytics data
router.post('/analytics', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, format = 'excel' } = req.body;

    // Get leads within date range
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const leads = await Lead.find({
      userId: req.userId,
      ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
    });

    // Generate analytics data
    const analyticsData = generateAnalyticsData(leads);

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(analyticsData);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else {
      // Excel format with multiple sheets
      const workbook = new ExcelJS.Workbook();
      
      // Overview sheet
      const overviewData = [
        { Metric: 'Total Leads', Value: leads.length },
        { Metric: 'New Leads', Value: leads.filter(l => l.status === 'new').length },
        { Metric: 'Contacted Leads', Value: leads.filter(l => l.status === 'contacted').length },
        { Metric: 'Qualified Leads', Value: leads.filter(l => l.status === 'qualified').length },
        { Metric: 'Converted Leads', Value: leads.filter(l => l.status === 'converted').length },
        { Metric: 'Conversion Rate', Value: `${((leads.filter(l => l.status === 'converted').length / leads.length) * 100).toFixed(2)}%` }
      ];
      
      const overviewSheet = workbook.addWorksheet('Overview');
      overviewSheet.columns = [
        { header: 'Metric', key: 'Metric', width: 25 },
        { header: 'Value', key: 'Value', width: 20 }
      ];
      overviewSheet.addRows(overviewData);

      // Industry breakdown
      const industryData = generateIndustryBreakdown(leads);
      const industrySheet = workbook.addWorksheet('Industry Breakdown');
      industrySheet.columns = [
        { header: 'Industry', key: 'Industry', width: 25 },
        { header: 'Count', key: 'Count', width: 15 },
        { header: 'Percentage', key: 'Percentage', width: 15 }
      ];
      industrySheet.addRows(industryData);

      // Geographic breakdown
      const geoData = generateGeographicBreakdown(leads);
      const geoSheet = workbook.addWorksheet('Geographic Breakdown');
      geoSheet.columns = [
        { header: 'Location', key: 'Location', width: 30 },
        { header: 'Count', key: 'Count', width: 15 },
        { header: 'Percentage', key: 'Percentage', width: 15 }
      ];
      geoSheet.addRows(geoData);

      const excelBuffer = await workbook.xlsx.writeBuffer();

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(excelBuffer);
    }
  } catch (error) {
    console.error('Analytics export error:', error);
    res.status(500).json({ message: 'Analytics export failed' });
  }
});

// Helper functions
function calculateResponseRate(lead) {
  // This would be calculated based on email opens, clicks, responses
  // For now, return a mock value
  return Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low';
}

function calculateEngagementScore(lead) {
  // This would be calculated based on various engagement metrics
  // For now, return a mock value
  return Math.floor(Math.random() * 100);
}

function calculateAverageResponseRate(leads) {
  const responseRates = leads.map(lead => {
    const rate = calculateResponseRate(lead);
    return rate === 'High' ? 0.8 : rate === 'Medium' ? 0.5 : 0.2;
  });
  
  return (responseRates.reduce((sum, rate) => sum + rate, 0) / responseRates.length * 100).toFixed(2) + '%';
}

function generateAnalyticsData(leads) {
  return leads.map(lead => ({
    Company: lead.company,
    Industry: lead.industry,
    City: lead.city,
    State: lead.state,
    Status: lead.status,
    'Created Date': lead.createdAt,
    'Last Updated': lead.updatedAt,
    'Response Rate': calculateResponseRate(lead),
    'Engagement Score': calculateEngagementScore(lead)
  }));
}

function generateIndustryBreakdown(leads) {
  const industryCounts = {};
  leads.forEach(lead => {
    const industry = lead.industry || 'Unknown';
    industryCounts[industry] = (industryCounts[industry] || 0) + 1;
  });

  return Object.entries(industryCounts).map(([industry, count]) => ({
    Industry: industry,
    Count: count,
    Percentage: `${((count / leads.length) * 100).toFixed(2)}%`
  }));
}

function generateGeographicBreakdown(leads) {
  const geoCounts = {};
  leads.forEach(lead => {
    const location = `${lead.city || 'Unknown'}, ${lead.state || 'Unknown'}`;
    geoCounts[location] = (geoCounts[location] || 0) + 1;
  });

  return Object.entries(geoCounts).map(([location, count]) => ({
    Location: location,
    Count: count,
    Percentage: `${((count / leads.length) * 100).toFixed(2)}%`
  }));
}

module.exports = router;



