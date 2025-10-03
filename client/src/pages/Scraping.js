import React, { useState } from 'react';
import { useLeads } from '../contexts/LeadContext';
import { 
  Search, 
  Globe, 
  Building, 
  Users, 
  MapPin, 
  Mail, 
  Phone,
  Linkedin,
  Plus,
  Download,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Scraping = () => {
  const { scrapeCompany, bulkCreateLeads } = useLeads();
  const [scrapingData, setScrapingData] = useState({
    website: '',
    companyName: ''
  });
  const [bulkWebsites, setBulkWebsites] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState(null);
  const [bulkResults, setBulkResults] = useState([]);

  const handleSingleScrape = async (e) => {
    e.preventDefault();
    if (!scrapingData.website) return;

    setLoading(true);
    const result = await scrapeCompany(scrapingData.website, scrapingData.companyName);
    
    if (result.success) {
      setScrapedData(result.data);
    }
    setLoading(false);
  };

  const handleBulkScrape = async () => {
    const websites = bulkWebsites
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split(',');
        return {
          url: parts[0].trim(),
          companyName: parts[1]?.trim() || ''
        };
      });

    if (websites.length === 0) return;

    setLoading(true);
    const result = await bulkCreateLeads(websites);
    
    if (result.success) {
      setBulkResults(result.leads);
    }
    setLoading(false);
  };

  const handleSaveLead = async () => {
    if (!scrapedData) return;
    
    const leadData = {
      company: scrapedData.company,
      website: scrapedData.website,
      linkedin: scrapedData.socialLinks?.linkedin,
      email: scrapedData.contactInfo?.emails?.[0],
      phone: scrapedData.contactInfo?.phones?.[0],
      industry: scrapedData.industry,
      description: scrapedData.description,
      productsServices: scrapedData.productsServices,
      street: scrapedData.address,
      city: extractCityFromAddress(scrapedData.address),
      state: extractStateFromAddress(scrapedData.address)
    };

    const result = await bulkCreateLeads([leadData]);
    if (result.success) {
      setScrapedData(null);
      setScrapingData({ website: '', companyName: '' });
    }
  };

  const extractCityFromAddress = (address) => {
    if (!address) return '';
    const parts = address.split(',');
    return parts[0]?.trim() || '';
  };

  const extractStateFromAddress = (address) => {
    if (!address) return '';
    const parts = address.split(',');
    return parts[1]?.trim() || '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lead Scraping</h1>
        <p className="text-gray-600 mt-2">
          Automatically discover and extract company data from websites
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Single Website Scraping */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Scrape Single Website</h2>
          
          <form onSubmit={handleSingleScrape} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  className="input-field pl-10"
                  placeholder="https://example.com"
                  value={scrapingData.website}
                  onChange={(e) => setScrapingData({ ...scrapingData, website: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name (Optional)
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Company Name"
                  value={scrapingData.companyName}
                  onChange={(e) => setScrapingData({ ...scrapingData, companyName: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !scrapingData.website}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{loading ? 'Scraping...' : 'Scrape Website'}</span>
            </button>
          </form>

          {/* Scraped Data Display */}
          {scrapedData && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-green-900">Scraped Data</h3>
                <button
                  onClick={handleSaveLead}
                  className="btn-primary text-sm flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Save as Lead</span>
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{scrapedData.company}</span>
                </div>
                
                {scrapedData.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <a href={scrapedData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {scrapedData.website}
                    </a>
                  </div>
                )}
                
                {scrapedData.industry && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>{scrapedData.industry}</span>
                  </div>
                )}
                
                {scrapedData.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>{scrapedData.address}</span>
                  </div>
                )}
                
                {scrapedData.contactInfo?.emails?.[0] && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    <span>{scrapedData.contactInfo.emails[0]}</span>
                  </div>
                )}
                
                {scrapedData.contactInfo?.phones?.[0] && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>{scrapedData.contactInfo.phones[0]}</span>
                  </div>
                )}
                
                {scrapedData.socialLinks?.linkedin && (
                  <div className="flex items-center space-x-2">
                    <Linkedin className="w-4 h-4 text-green-600" />
                    <a href={scrapedData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                
                {scrapedData.description && (
                  <div className="mt-3">
                    <p className="text-gray-700">{scrapedData.description}</p>
                  </div>
                )}
                
                {scrapedData.productsServices && scrapedData.productsServices.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-gray-700 mb-1">Products/Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {scrapedData.productsServices.map((product, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bulk Website Scraping */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Bulk Website Scraping</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URLs (one per line)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Format: URL, Company Name (optional)
              </p>
              <textarea
                className="input-field h-32 resize-none"
                placeholder="https://example1.com, Company 1&#10;https://example2.com&#10;https://example3.com, Company 3"
                value={bulkWebsites}
                onChange={(e) => setBulkWebsites(e.target.value)}
              />
            </div>

            <button
              onClick={handleBulkScrape}
              disabled={loading || !bulkWebsites.trim()}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{loading ? 'Scraping...' : 'Bulk Scrape'}</span>
            </button>
          </div>

          {/* Bulk Results */}
          {bulkResults.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-4">Scraping Results</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bulkResults.map((result, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="font-medium">{result.company || result.url}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                    {result.error && (
                      <p className="text-sm text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Scraping Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Include company names for better data extraction accuracy</li>
          <li>• Use HTTPS URLs when possible for better scraping success</li>
          <li>• Bulk scraping is limited by your credit balance</li>
          <li>• Each successful scrape uses 1 credit</li>
        </ul>
      </div>
    </div>
  );
};

export default Scraping;



