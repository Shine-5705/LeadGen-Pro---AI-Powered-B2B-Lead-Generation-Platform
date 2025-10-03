import React, { useState } from 'react';
import { useLeads } from '../contexts/LeadContext';
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
  ExternalLink,
  MessageSquare,
  Zap,
  Star,
  Send,
  Eye,
  Copy
} from 'lucide-react';

const Leads = () => {
  const { leads, loading, updateFilters, exportLeads, deleteLead } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [aiMessage, setAiMessage] = useState('');
  const [messageType, setMessageType] = useState('email'); // 'email' or 'linkedin'

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

  const handleAIGenerate = async (lead, type) => {
    setSelectedLead(lead);
    setMessageType(type);
    setShowAIModal(true);
    
    // Simulate AI generation
    const template = type === 'email' 
      ? `Hi there,\n\nI hope this email finds you well. I noticed ${lead.company} is in the ${lead.industry} industry and wanted to reach out about potential opportunities for collaboration.\n\nBest regards,\n[Your Name]`
      : `Hi! I came across ${lead.company} and was impressed by your work in ${lead.industry}. Would love to connect and explore potential synergies.`;
    
    setAiMessage(template);
  };

  const handleSendMessage = async () => {
    // In a real implementation, this would send the message
    alert(`${messageType === 'email' ? 'Email' : 'LinkedIn message'} sent to ${selectedLead.company}!`);
    setShowAIModal(false);
    setAiMessage('');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(aiMessage);
    alert('Message copied to clipboard!');
  };

  const openGoogleMaps = (lead) => {
    const address = `${lead.street || ''} ${lead.city || ''} ${lead.state || ''} ${lead.zipCode || ''}`.trim();
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const statusOptions = ['new', 'contacted', 'qualified', 'converted', 'closed'];
  const industryOptions = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
        <p className="text-gray-600 mt-2">
          Manage and organize your lead database
        </p>
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

      {/* Leads Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === leads.length && leads.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Links
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products/Services
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year Founded
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BBB Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Street
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead._id)}
                        onChange={() => handleSelectLead(lead._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    
                    {/* Company */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                          <div className="text-xs text-gray-500">
                            Status: <span className={`px-1 py-0.5 rounded text-xs ${
                              lead.status === 'new' ? 'bg-green-100 text-green-800' :
                              lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                              lead.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
                              lead.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {lead.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => handleAIGenerate(lead, 'email')}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded tooltip"
                          title="Generate AI Email"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAIGenerate(lead, 'linkedin')}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded tooltip"
                          title="Generate LinkedIn Message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-50 rounded tooltip" title="Edit Lead">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteLead(lead._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded tooltip"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.industry || 'N/A'}</div>
                    </td>

                    {/* Links */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {lead.website && (
                          <a 
                            href={lead.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded tooltip"
                            title="Visit Website"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                        {lead.linkedin && (
                          <a 
                            href={lead.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded tooltip"
                            title="LinkedIn Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {lead.email && (
                          <a 
                            href={`mailto:${lead.email}`}
                            className="p-1 text-green-600 hover:bg-green-50 rounded tooltip"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        {(lead.street || lead.city) && (
                          <button 
                            onClick={() => openGoogleMaps(lead)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded tooltip"
                            title="View on Map"
                          >
                            <MapPin className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Products/Services */}
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {lead.productsServices?.join(', ') || lead.description || 'N/A'}
                      </div>
                    </td>

                    {/* Business Type */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.businessType || 'N/A'}</div>
                    </td>

                    {/* Employee Count */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Users className="w-3 h-3 mr-1 text-gray-400" />
                        {lead.employeeCount || 'N/A'}
                      </div>
                    </td>

                    {/* Revenue */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <DollarSign className="w-3 h-3 mr-1 text-gray-400" />
                        {lead.revenue || 'N/A'}
                      </div>
                    </td>

                    {/* Year Founded */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        {lead.yearFounded || 'N/A'}
                      </div>
                    </td>

                    {/* BBB Rating */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        {lead.bbbRating || 'N/A'}
                      </div>
                    </td>

                    {/* Street */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.street || 'N/A'}</div>
                    </td>

                    {/* City */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.city || 'N/A'}</div>
                    </td>

                    {/* State */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.state || 'N/A'}</div>
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
                : 'Start by scraping some companies or adding leads manually.'
              }
            </p>
            <button className="btn-primary">Add Your First Lead</button>
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

      {/* AI Message Generation Modal */}
      {showAIModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                AI {messageType === 'email' ? 'Email' : 'LinkedIn Message'} Generator
              </h3>
              <button 
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Building className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{selectedLead.company}</h4>
                  <p className="text-sm text-gray-600">
                    {selectedLead.industry} • {selectedLead.city}, {selectedLead.state}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personalized {messageType === 'email' ? 'Email' : 'Message'}
              </label>
              <textarea
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="AI-generated message will appear here..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyMessage}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => handleAIGenerate(selectedLead, messageType)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Regenerate</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send {messageType === 'email' ? 'Email' : 'Message'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;


