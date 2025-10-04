import React, { useState, useEffect } from 'react';
import { useLeads } from '../contexts/LeadContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  Globe,
  MapPin,
  Users,
  Building,
  Calendar,
  DollarSign,
  Star,
  ExternalLink,
  RefreshCw,
  Loader,
  Eye,
  EyeOff
} from 'lucide-react';

const EnhancedDashboard = () => {
  const { leads, loading, updateFilters, exportLeads, deleteLead, bulkCreateLeads } = useLeads();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [googleSearchQuery, setGoogleSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const [sampleCompanies, setSampleCompanies] = useState([]);

  // Load sample companies on component mount
  useEffect(() => {
    loadSampleCompanies();
  }, []);

  const loadSampleCompanies = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/google/sample-companies`);
      setSampleCompanies(response.data.companies);
    } catch (error) {
      console.error('Failed to load sample companies:', error);
    }
  };

  const handleGoogleSearch = async () => {
    if (!googleSearchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/google/google-search`, {
        query: googleSearchQuery,
        limit: 20
      });

      if (response.data.companies.length > 0) {
        const result = await bulkCreateLeads(response.data.companies);
        if (result.success) {
          toast.success(`${response.data.companies.length} companies found and added!`);
          setGoogleSearchQuery('');
        }
      } else {
        toast.error('No companies found for this search');
      }
    } catch (error) {
      console.error('Google search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadSampleData = async () => {
    try {
      const result = await bulkCreateLeads(sampleCompanies);
      if (result.success) {
        toast.success(`${sampleCompanies.length} sample companies loaded!`);
        setShowSampleData(false);
      }
    } catch (error) {
      console.error('Failed to load sample data:', error);
      toast.error('Failed to load sample data');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    updateFilters({ search: e.target.value, page: 1 });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    updateFilters({ status, page: 1 });
  };

  const handleIndustryFilter = (industry) => {
    setIndustryFilter(industry);
    updateFilters({ industry, page: 1 });
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead._id));
    }
  };

  const handleExport = async (format) => {
    const leadIds = selectedLeads.length > 0 ? selectedLeads : null;
    await exportLeads(format, leadIds);
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(leadId);
    }
  };

  const statusOptions = ['new', 'contacted', 'qualified', 'converted', 'closed'];
  const industryOptions = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Marketing'];

  const currentLeads = showSampleData ? sampleCompanies : leads;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lead Generation Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Discover, manage, and engage with your prospects
        </p>
      </div>

      {/* Google Search Section */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Discover Companies</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for companies (e.g., 'software companies in San Francisco')"
                className="input-field pl-10"
                value={googleSearchQuery}
                onChange={(e) => setGoogleSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGoogleSearch()}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleGoogleSearch}
              disabled={isSearching || !googleSearchQuery.trim()}
              className="btn-primary flex items-center space-x-2"
            >
              {isSearching ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{isSearching ? 'Searching...' : 'Search Google'}</span>
            </button>
            <button
              onClick={() => setShowSampleData(!showSampleData)}
              className="btn-secondary flex items-center space-x-2"
            >
              {showSampleData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showSampleData ? 'Hide Sample' : 'Show Sample'}</span>
            </button>
            {showSampleData && (
              <button
                onClick={handleLoadSampleData}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Load Sample Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search leads..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Export Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExport('csv')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>
            </div>

            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="input-field"
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  className="input-field"
                  value={industryFilter}
                  onChange={(e) => handleIndustryFilter(e.target.value)}
                >
                  <option value="">All Industries</option>
                  {industryOptions.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setIndustryFilter('');
                    updateFilters({ status: '', industry: '', page: 1 });
                  }}
                  className="btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Leads Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : currentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === currentLeads.length && currentLeads.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry & Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLeads.map((lead, index) => (
                  <tr key={lead._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead._id)}
                        onChange={() => handleSelectLead(lead._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                          {lead.website && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Globe className="w-3 h-3 mr-1" />
                              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center">
                                Website
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {lead.email && (
                          <div className="text-sm text-gray-900 flex items-center">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            <a href={`mailto:${lead.email}`} className="hover:text-blue-600">
                              {lead.email}
                            </a>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="text-sm text-gray-900 flex items-center">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                              {lead.phone}
                            </a>
                          </div>
                        )}
                        {lead.linkedin && (
                          <div className="text-sm text-gray-900 flex items-center">
                            <ExternalLink className="w-3 h-3 mr-2 text-gray-400" />
                            <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              LinkedIn
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.industry || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{lead.businessType || 'N/A'}</div>
                      {lead.employeeCount && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {lead.employeeCount} employees
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {lead.revenue && (
                          <div className="text-sm text-gray-900 flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {lead.revenue}
                          </div>
                        )}
                        {lead.yearFounded && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Founded {lead.yearFounded}
                          </div>
                        )}
                        {lead.bbbRating && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            BBB: {lead.bbbRating}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {lead.city}, {lead.state}
                      </div>
                      {lead.country && (
                        <div className="text-sm text-gray-500">{lead.country}</div>
                      )}
                      {lead.street && (
                        <div className="text-sm text-gray-500">{lead.street}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.status === 'new' ? 'bg-green-100 text-green-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteLead(lead._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter || industryFilter 
                ? 'Try adjusting your filters or search terms.'
                : 'Start by searching for companies or loading sample data.'
              }
            </p>
            <div className="flex space-x-2 justify-center">
              <button 
                onClick={() => setShowSampleData(true)}
                className="btn-primary"
              >
                Load Sample Data
              </button>
              <button className="btn-secondary">
                Search Companies
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Actions */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedLeads.length} selected
            </span>
            <button
              onClick={() => handleExport('csv')}
              className="btn-secondary text-sm"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="btn-secondary text-sm"
            >
              Export Excel
            </button>
            <button
              onClick={() => setSelectedLeads([])}
              className="text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Sample Data Preview */}
      {showSampleData && (
        <div className="mt-6 card bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">📊 Sample Company Data Preview</h3>
          <p className="text-blue-800 text-sm mb-4">
            This shows the type of comprehensive company data you'll get when scraping real companies. 
            Click "Load Sample Data" to add these companies to your dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleCompanies.slice(0, 6).map((company, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border">
                <h4 className="font-medium text-gray-900">{company.company}</h4>
                <p className="text-sm text-gray-600">{company.industry} • {company.city}, {company.state}</p>
                <p className="text-sm text-gray-500">{company.employeeCount} employees • {company.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboard;
