import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone,
  Globe,
  MapPin,
  Users,
  ExternalLink,
  MessageSquare,
  Zap,
  Star,
  Send,
  Copy,
  Linkedin,
  Sparkles,
  X,
  CheckCircle
} from 'lucide-react';

// Sample Lead Data
const SAMPLE_LEADS = [
  {
    id: 1,
    company: 'TechCorp Solutions',
    website: 'https://techcorp.com',
    linkedin: 'https://linkedin.com/company/techcorp',
    email: 'john.doe@techcorp.com',
    phone: '+1-555-0101',
    industry: 'Technology',
    businessType: 'B2B',
    productsServices: ['Cloud Computing', 'AI Solutions', 'Data Analytics'],
    employeeCount: '51-200',
    revenue: '$10M-$50M',
    yearFounded: '2015',
    bbbRating: 'A+',
    street: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    status: 'new',
    description: 'Leading provider of enterprise cloud solutions'
  },
  {
    id: 2,
    company: 'HealthFirst Medical',
    website: 'https://healthfirst.com',
    linkedin: 'https://linkedin.com/company/healthfirst',
    email: 'jane.smith@healthfirst.com',
    phone: '+1-555-0202',
    industry: 'Healthcare',
    businessType: 'B2C',
    productsServices: ['Telemedicine', 'Health Records', 'Patient Care'],
    employeeCount: '201-500',
    revenue: '$50M-$100M',
    yearFounded: '2010',
    bbbRating: 'A',
    street: '456 Medical Ave',
    city: 'Boston',
    state: 'MA',
    zipCode: '02108',
    status: 'contacted',
    description: 'Innovative telemedicine and healthcare platform'
  },
  {
    id: 3,
    company: 'FinanceHub Inc',
    website: 'https://financehub.com',
    linkedin: 'https://linkedin.com/company/financehub',
    email: 'michael.brown@financehub.com',
    phone: '+1-555-0303',
    industry: 'Finance',
    businessType: 'B2B',
    productsServices: ['Financial Software', 'Investment Tools', 'Analytics'],
    employeeCount: '11-50',
    revenue: '$5M-$10M',
    yearFounded: '2018',
    bbbRating: 'A+',
    street: '789 Finance Blvd',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    status: 'qualified',
    description: 'Next-generation financial technology platform'
  },
  {
    id: 4,
    company: 'RetailPro Systems',
    website: 'https://retailpro.com',
    linkedin: 'https://linkedin.com/company/retailpro',
    email: 'sarah.wilson@retailpro.com',
    phone: '+1-555-0404',
    industry: 'Retail',
    businessType: 'B2C',
    productsServices: ['E-commerce Platform', 'Inventory Management', 'POS Systems'],
    employeeCount: '51-200',
    revenue: '$10M-$50M',
    yearFounded: '2012',
    bbbRating: 'B+',
    street: '321 Retail Lane',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    status: 'new',
    description: 'Comprehensive retail management solutions'
  },
  {
    id: 5,
    company: 'EduTech Learning',
    website: 'https://edutech.com',
    linkedin: 'https://linkedin.com/company/edutech',
    email: 'david.lee@edutech.com',
    phone: '+1-555-0505',
    industry: 'Education',
    businessType: 'B2C',
    productsServices: ['Online Courses', 'LMS Platform', 'Student Analytics'],
    employeeCount: '11-50',
    revenue: '$1M-$5M',
    yearFounded: '2019',
    bbbRating: 'A',
    street: '555 Education Dr',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    status: 'new',
    description: 'Modern e-learning and education technology'
  },
  {
    id: 6,
    company: 'CloudScale AI',
    website: 'https://cloudscale.ai',
    linkedin: 'https://linkedin.com/company/cloudscale-ai',
    email: 'emily.chen@cloudscale.ai',
    phone: '+1-555-0606',
    industry: 'Technology',
    businessType: 'SaaS',
    productsServices: ['Machine Learning', 'AI Platform', 'Cloud Infrastructure'],
    employeeCount: '201-500',
    revenue: '$50M-$100M',
    yearFounded: '2016',
    bbbRating: 'A+',
    street: '888 Innovation Way',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    status: 'contacted',
    description: 'Enterprise AI and machine learning solutions'
  },
  {
    id: 7,
    company: 'GreenEnergy Solutions',
    website: 'https://greenenergy.com',
    linkedin: 'https://linkedin.com/company/greenenergy',
    email: 'robert.garcia@greenenergy.com',
    phone: '+1-555-0707',
    industry: 'Energy',
    businessType: 'B2B',
    productsServices: ['Solar Panels', 'Energy Storage', 'Smart Grid'],
    employeeCount: '501-1000',
    revenue: '$100M+',
    yearFounded: '2008',
    bbbRating: 'A',
    street: '999 Green Blvd',
    city: 'Denver',
    state: 'CO',
    zipCode: '80202',
    status: 'qualified',
    description: 'Sustainable energy and renewable solutions'
  },
  {
    id: 8,
    company: 'StartupLab Ventures',
    website: 'https://startuplab.com',
    linkedin: 'https://linkedin.com/company/startuplab',
    email: 'lisa.martinez@startuplab.com',
    phone: '+1-555-0808',
    industry: 'Technology',
    businessType: 'Startup',
    productsServices: ['SaaS Tools', 'Developer Platform', 'API Services'],
    employeeCount: '1-10',
    revenue: '<$1M',
    yearFounded: '2023',
    bbbRating: 'B',
    street: '111 Startup Ave',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    status: 'new',
    description: 'Early-stage technology startup'
  }
];

const LeadsEnhanced = () => {
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [aiMessage, setAiMessage] = useState('');
  const [messageType, setMessageType] = useState('email');
  const [userPreferences, setUserPreferences] = useState(null);
  const [showMatchesOnly, setShowMatchesOnly] = useState(false);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setUserPreferences(prefs.interests);
    }
  }, []);

  // Calculate match score for each lead based on user preferences
  const calculateMatchScore = (lead) => {
    if (!userPreferences) return 0;

    let score = 0;
    let maxScore = 0;

    // Check industry match
    if (userPreferences.industries && userPreferences.industries.length > 0) {
      maxScore += 30;
      if (userPreferences.industries.includes(lead.industry)) {
        score += 30;
      }
    }

    // Check business type match
    if (userPreferences.businessTypes && userPreferences.businessTypes.length > 0) {
      maxScore += 20;
      if (userPreferences.businessTypes.includes(lead.businessType)) {
        score += 20;
      }
    }

    // Check revenue range match
    if (userPreferences.revenueRange) {
      maxScore += 20;
      if (lead.revenue === userPreferences.revenueRange) {
        score += 20;
      }
    }

    // Check employee range match
    if (userPreferences.employeeRange) {
      maxScore += 15;
      if (lead.employeeCount === userPreferences.employeeRange) {
        score += 15;
      }
    }

    // Check keywords match
    if (userPreferences.keywords) {
      maxScore += 15;
      const keywords = userPreferences.keywords.toLowerCase().split(',').map(k => k.trim());
      const leadText = `${lead.company} ${lead.description} ${lead.productsServices.join(' ')}`.toLowerCase();
      const matchedKeywords = keywords.filter(keyword => leadText.includes(keyword));
      score += (matchedKeywords.length / keywords.length) * 15;
    }

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  };

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let result = leads;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(lead =>
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(lead => lead.status === statusFilter);
    }

    // Apply industry filter
    if (industryFilter) {
      result = result.filter(lead => lead.industry === industryFilter);
    }

    // Add match scores
    result = result.map(lead => ({
      ...lead,
      matchScore: calculateMatchScore(lead)
    }));

    // Filter by matches only if enabled
    if (showMatchesOnly && userPreferences) {
      result = result.filter(lead => lead.matchScore >= 50);
    }

    // Sort by match score
    result.sort((a, b) => b.matchScore - a.matchScore);

    return result;
  }, [leads, searchTerm, statusFilter, industryFilter, userPreferences, showMatchesOnly]);

  const handleAIGenerate = (lead, type) => {
    setSelectedLead(lead);
    setMessageType(type);
    setShowAIModal(true);
    
    const template = type === 'email' 
      ? `Subject: Partnership Opportunity with ${lead.company}\n\nHi there,\n\nI hope this email finds you well. I noticed ${lead.company} is a leading company in the ${lead.industry} industry, specializing in ${lead.productsServices[0]}.\n\nI believe there's a great opportunity for us to collaborate and create mutual value. Would you be open to a brief conversation to explore potential synergies?\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name]`
      : `Hi! I came across ${lead.company} and was impressed by your work in ${lead.industry}, particularly your focus on ${lead.productsServices[0]}. Would love to connect and explore potential collaboration opportunities!`;
    
    setAiMessage(template);
  };

  const handleSendMessage = () => {
    alert(`${messageType === 'email' ? 'Email' : 'LinkedIn message'} sent to ${selectedLead.company}!`);
    setShowAIModal(false);
    setAiMessage('');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(aiMessage);
    alert('Message copied to clipboard!');
  };

  const getMatchBadge = (score) => {
    if (score >= 80) return { color: 'bg-green-100 text-green-800 border-green-200', label: 'Excellent Match', icon: '🎯' };
    if (score >= 60) return { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Good Match', icon: '✨' };
    if (score >= 40) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Fair Match', icon: '⭐' };
    return { color: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Low Match', icon: '•' };
  };

  const statuses = ['new', 'contacted', 'qualified', 'converted', 'closed'];
  const industries = [...new Set(SAMPLE_LEADS.map(lead => lead.industry))];

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lead Generation Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Direct Engagement Tools • Reach Faster • Engage Smarter
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies, industries, locations..."
                className="pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {userPreferences && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMatchesOnly}
                  onChange={(e) => setShowMatchesOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                  Show My Matches Only
                </span>
              </label>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                className="input-field"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Preference Alert */}
      {!userPreferences && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">Set Your Lead Preferences</h3>
              <p className="text-sm text-blue-700 mt-1">
                Configure your interests in Settings to see personalized match scores and get the most relevant leads highlighted.
              </p>
              <a href="/settings" className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2 inline-block">
                Go to Settings →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Leads Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredLeads.length}</span> leads
          {showMatchesOnly && ' (filtered by your preferences)'}
        </p>
      </div>

      {/* Leads Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {userPreferences && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products/Services</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year Founded</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BBB Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => {
                const matchBadge = getMatchBadge(lead.matchScore);
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    {/* Match Score */}
                    {userPreferences && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${matchBadge.color}`}>
                          <span className="mr-1">{matchBadge.icon}</span>
                          {lead.matchScore}%
                        </div>
                      </td>
                    )}

                    {/* Company */}
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {lead.company.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                          <div className="text-xs text-gray-500">{lead.description}</div>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAIGenerate(lead, 'email')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Generate AI Email"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAIGenerate(lead, 'linkedin')}
                          className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="LinkedIn Message"
                        >
                          <Linkedin className="w-4 h-4" />
                        </button>
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Call"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        {lead.industry}
                      </span>
                    </td>

                    {/* Links */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Website"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                        <a
                          href={lead.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://maps.google.com/?q=${lead.street}, ${lead.city}, ${lead.state}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View on Map"
                        >
                          <MapPin className="w-4 h-4" />
                        </a>
                      </div>
                    </td>

                    {/* Products/Services */}
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {lead.productsServices.join(', ')}
                      </div>
                    </td>

                    {/* Business Type */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {lead.businessType}
                      </span>
                    </td>

                    {/* Employee Count */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {lead.employeeCount}
                      </div>
                    </td>

                    {/* Revenue */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.revenue}
                    </td>

                    {/* Year Founded */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.yearFounded}
                    </td>

                    {/* BBB Rating */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded">
                        {lead.bbbRating}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{lead.city}, {lead.state}</div>
                      <div className="text-xs text-gray-500">{lead.street}</div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          const updatedLeads = leads.map(l =>
                            l.id === lead.id ? { ...l, status: e.target.value } : l
                          );
                          setLeads(updatedLeads);
                        }}
                        className="text-sm border-gray-300 rounded-md"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                  AI-Powered {messageType === 'email' ? 'Email' : 'LinkedIn Message'}
                </h3>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {selectedLead.company.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{selectedLead.company}</div>
                    <div className="text-xs text-gray-600">{selectedLead.email}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Message
                </label>
                <textarea
                  className="input-field font-mono text-sm"
                  rows="12"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={handleCopyMessage}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsEnhanced;
