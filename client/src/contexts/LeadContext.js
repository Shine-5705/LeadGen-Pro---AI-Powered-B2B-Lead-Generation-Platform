import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const LeadContext = createContext();

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    closed: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    industry: '',
    search: '',
    page: 1,
    limit: 50
  });
  const { isAuthenticated } = useAuth();

  // Fetch leads
  const fetchLeads = useCallback(async (newFilters = filters) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/api/leads?${params}`);
      setLeads(response.data.leads);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  // Fetch lead statistics
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.get('/api/leads/stats/overview');
      setStats(response.data.statusBreakdown);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, [isAuthenticated]);

  // Create lead
  const createLead = async (leadData) => {
    try {
      const response = await axios.post('/api/leads', leadData);
      setLeads(prev => [response.data, ...prev]);
      toast.success('Lead created successfully');
      return { success: true, lead: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create lead';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update lead
  const updateLead = async (leadId, leadData) => {
    try {
      const response = await axios.put(`/api/leads/${leadId}`, leadData);
      setLeads(prev => prev.map(lead => 
        lead._id === leadId ? response.data : lead
      ));
      toast.success('Lead updated successfully');
      return { success: true, lead: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update lead';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete lead
  const deleteLead = async (leadId) => {
    try {
      await axios.delete(`/api/leads/${leadId}`);
      setLeads(prev => prev.filter(lead => lead._id !== leadId));
      toast.success('Lead deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete lead';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Bulk create leads
  const bulkCreateLeads = async (leadsData) => {
    try {
      const response = await axios.post('/api/leads/bulk', { leads: leadsData });
      setLeads(prev => [...response.data.leads, ...prev]);
      toast.success(`${response.data.leads.length} leads created successfully`);
      return { success: true, leads: response.data.leads };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create leads';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Scrape company data
  const scrapeCompany = async (website, companyName) => {
    try {
      const response = await axios.post('/api/scraping/company', { website, companyName });
      toast.success('Company data scraped successfully');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to scrape company data';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Generate AI email
  const generateEmail = async (leadData, emailType = 'cold-outreach') => {
    try {
      const response = await axios.post('/api/ai/email', { leadData, emailType });
      toast.success('Email generated successfully');
      return { success: true, email: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Google search for companies
  const searchCompanies = async (query, location, industry, limit) => {
    try {
      const response = await axios.post('/api/google/google-search', {
        query,
        location,
        industry,
        limit
      });
      toast.success(`${response.data.companies.length} companies found!`);
      return { success: true, companies: response.data.companies };
    } catch (error) {
      const message = error.response?.data?.message || 'Company search failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Load sample companies
  const loadSampleCompanies = async () => {
    try {
      const response = await axios.get('/api/google/sample-companies');
      return { success: true, companies: response.data.companies };
    } catch (error) {
      console.error('Failed to load sample companies:', error);
      return { success: false, error: 'Failed to load sample companies' };
    }
  };

  // Export leads
  const exportLeads = async (format = 'csv', leadIds = null, exportFilters = {}) => {
    try {
      const response = await axios.post(`/api/export/${format}`,
        {
          leadIds,
          filters: exportFilters
        },
        {
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Leads exported successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to export leads';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchLeads(updatedFilters);
  };

  // Load data on authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
      fetchStats();
    }
  }, [isAuthenticated, fetchLeads, fetchStats]);

  const value = {
    leads,
    loading,
    stats,
    filters,
    fetchLeads,
    fetchStats,
    createLead,
    updateLead,
    deleteLead,
    bulkCreateLeads,
    scrapeCompany,
    generateEmail,
    exportLeads,
    updateFilters,
    searchCompanies,
    loadSampleCompanies
  };

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
};



