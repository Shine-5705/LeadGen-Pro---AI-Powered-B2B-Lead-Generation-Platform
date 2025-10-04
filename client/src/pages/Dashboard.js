import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building, 
  TrendingUp, 
  Target,
  Zap,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Import sample data
const SAMPLE_LEADS = [
  {
    id: 1,
    company: 'TechCorp Solutions',
    industry: 'Technology',
    businessType: 'B2B',
    productsServices: ['Cloud Computing', 'AI Solutions', 'Data Analytics'],
    employeeCount: '51-200',
    revenue: '$10M-$50M',
    city: 'San Francisco',
    state: 'CA',
    status: 'new',
  },
  {
    id: 2,
    company: 'HealthFirst Medical',
    industry: 'Healthcare',
    businessType: 'B2C',
    productsServices: ['Telemedicine', 'Health Records', 'Patient Care'],
    employeeCount: '201-500',
    revenue: '$50M-$100M',
    city: 'Boston',
    state: 'MA',
    status: 'contacted',
  },
  {
    id: 3,
    company: 'FinanceHub Inc',
    industry: 'Finance',
    businessType: 'B2B',
    productsServices: ['Financial Software', 'Investment Tools', 'Analytics'],
    employeeCount: '11-50',
    revenue: '$5M-$10M',
    city: 'New York',
    state: 'NY',
    status: 'qualified',
  },
  {
    id: 4,
    company: 'RetailPro Systems',
    industry: 'Retail',
    businessType: 'B2C',
    productsServices: ['E-commerce Platform', 'Inventory Management', 'POS Systems'],
    employeeCount: '51-200',
    revenue: '$10M-$50M',
    city: 'Chicago',
    state: 'IL',
    status: 'new',
  },
  {
    id: 5,
    company: 'EduTech Learning',
    industry: 'Education',
    businessType: 'B2C',
    productsServices: ['Online Courses', 'LMS Platform', 'Student Analytics'],
    employeeCount: '11-50',
    revenue: '$1M-$5M',
    city: 'Austin',
    state: 'TX',
    status: 'new',
  },
  {
    id: 6,
    company: 'CloudScale AI',
    industry: 'Technology',
    businessType: 'SaaS',
    productsServices: ['Machine Learning', 'AI Platform', 'Cloud Infrastructure'],
    employeeCount: '201-500',
    revenue: '$50M-$100M',
    city: 'Seattle',
    state: 'WA',
    status: 'contacted',
  },
  {
    id: 7,
    company: 'GreenEnergy Solutions',
    industry: 'Energy',
    businessType: 'B2B',
    productsServices: ['Solar Panels', 'Energy Storage', 'Smart Grid'],
    employeeCount: '501-1000',
    revenue: '$100M+',
    city: 'Denver',
    state: 'CO',
    status: 'qualified',
  },
  {
    id: 8,
    company: 'StartupLab Ventures',
    industry: 'Technology',
    businessType: 'Startup',
    productsServices: ['SaaS Tools', 'Developer Platform', 'API Services'],
    employeeCount: '1-10',
    revenue: '<$1M',
    city: 'San Francisco',
    state: 'CA',
    status: 'new',
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setUserPreferences(prefs.interests);
    }
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = SAMPLE_LEADS.length;
    const byStatus = {
      new: SAMPLE_LEADS.filter(l => l.status === 'new').length,
      contacted: SAMPLE_LEADS.filter(l => l.status === 'contacted').length,
      qualified: SAMPLE_LEADS.filter(l => l.status === 'qualified').length,
      converted: SAMPLE_LEADS.filter(l => l.status === 'converted').length,
    };

    const industryBreakdown = SAMPLE_LEADS.reduce((acc, lead) => {
      acc[lead.industry] = (acc[lead.industry] || 0) + 1;
      return acc;
    }, {});

    const topIndustries = Object.entries(industryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { total, byStatus, topIndustries };
  }, []);

  const calculateMatchScore = useCallback((lead) => {
    if (!userPreferences) return 0;
    let score = 0;
    let maxScore = 0;

    if (userPreferences.industries && userPreferences.industries.length > 0) {
      maxScore += 30;
      if (userPreferences.industries.includes(lead.industry)) score += 30;
    }
    if (userPreferences.businessTypes && userPreferences.businessTypes.length > 0) {
      maxScore += 20;
      if (userPreferences.businessTypes.includes(lead.businessType)) score += 20;
    }
    if (userPreferences.revenueRange) {
      maxScore += 20;
      if (lead.revenue === userPreferences.revenueRange) score += 20;
    }
    if (userPreferences.employeeRange) {
      maxScore += 15;
      if (lead.employeeCount === userPreferences.employeeRange) score += 15;
    }
    if (userPreferences.keywords) {
      maxScore += 15;
      const keywords = userPreferences.keywords.toLowerCase().split(',').map(k => k.trim());
      const leadText = `${lead.company} ${lead.productsServices.join(' ')}`.toLowerCase();
      const matchedKeywords = keywords.filter(keyword => leadText.includes(keyword));
      score += (matchedKeywords.length / keywords.length) * 15;
    }
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  }, [userPreferences]);

  const topMatches = useMemo(() => {
    if (!userPreferences) return [];
    return SAMPLE_LEADS
      .map(lead => ({ ...lead, matchScore: calculateMatchScore(lead) }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }, [userPreferences, calculateMatchScore]);

  const recentLeads = SAMPLE_LEADS.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's your lead generation overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Leads</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Contacted</p>
              <p className="text-3xl font-bold mt-2">{stats.byStatus.contacted}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <Zap className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Qualified</p>
              <p className="text-3xl font-bold mt-2">{stats.byStatus.qualified}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <Star className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">New Leads</p>
              <p className="text-3xl font-bold mt-2">{stats.byStatus.new}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <Target className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Set Preferences Banner */}
      {!userPreferences && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Sparkles className="w-6 h-6 text-blue-600 mt-1 mr-4" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">🎯 Get Personalized Lead Matches</h3>
              <p className="text-gray-700 mt-2">
                Set your preferences to see which companies match your interests. Our intelligent matching system will score and prioritize leads based on your criteria.
              </p>
              <button
                onClick={() => navigate('/settings')}
                className="mt-4 btn-primary inline-flex items-center"
              >
                <span>Set Your Preferences</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Matches or Recent Leads */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              {userPreferences ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                  Your Top Matches
                </>
              ) : (
                <>
                  <Building className="w-5 h-5 mr-2 text-gray-500" />
                  Recent Leads
                </>
              )}
            </h2>
            <button
              onClick={() => navigate('/leads')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {(userPreferences ? topMatches : recentLeads).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate('/leads')}
              >
                <div className="flex items-center flex-1">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {lead.company.charAt(0)}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{lead.company}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                        {lead.industry}
                      </span>
                      <span className="text-xs text-gray-500">{lead.city}, {lead.state}</span>
                    </div>
                  </div>
                </div>
                {userPreferences && lead.matchScore > 0 && (
                  <div className="ml-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      lead.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                      lead.matchScore >= 60 ? 'bg-blue-100 text-blue-800' :
                      lead.matchScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {lead.matchScore}% Match
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Industry Breakdown */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-gray-500" />
              Top Industries
            </h2>
          </div>
          
          <div className="space-y-4">
            {stats.topIndustries.map(([industry, count], index) => (
              <div key={industry} className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{industry}</span>
                    <span className="text-sm text-gray-600">{count} leads</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/leads')}
          className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">View All Leads</h3>
              <p className="text-sm text-gray-600 mt-1">Access full lead database</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/scraping')}
          className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Find New Leads</h3>
              <p className="text-sm text-gray-600 mt-1">Scrape companies from web</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/analytics')}
          className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">Track your performance</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;



