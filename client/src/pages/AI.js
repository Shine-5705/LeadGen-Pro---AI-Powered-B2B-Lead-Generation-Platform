import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bot, 
  Mail, 
  Copy, 
  Send,
  RefreshCw,
  Loader,
  CheckCircle,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

// Sample lead data for demo
const SAMPLE_LEADS = [
  {
    _id: '1',
    company: 'TechCorp Solutions',
    email: 'john.doe@techcorp.com',
    industry: 'Technology',
    city: 'San Francisco',
    state: 'CA',
    website: 'https://techcorp.com',
    productsServices: ['Cloud Computing', 'AI Solutions', 'Data Analytics'],
    employeeCount: '51-200',
    revenue: '$10M-$50M'
  },
  {
    _id: '2',
    company: 'HealthFirst Medical',
    email: 'jane.smith@healthfirst.com',
    industry: 'Healthcare',
    city: 'Boston',
    state: 'MA',
    website: 'https://healthfirst.com',
    productsServices: ['Telemedicine', 'Health Records', 'Patient Care'],
    employeeCount: '201-500',
    revenue: '$50M-$100M'
  },
  {
    _id: '3',
    company: 'FinanceHub Inc',
    email: 'michael.brown@financehub.com',
    industry: 'Finance',
    city: 'New York',
    state: 'NY',
    website: 'https://financehub.com',
    productsServices: ['Financial Software', 'Investment Tools', 'Analytics'],
    employeeCount: '11-50',
    revenue: '$5M-$10M'
  }
];

const AI = () => {
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [selectedLead, setSelectedLead] = useState(null);
  const [emailType, setEmailType] = useState('cold-outreach');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load leads on component mount
  useEffect(() => {
    // Try to load leads from LeadContext or use sample data
    setLeads(SAMPLE_LEADS);
  }, []);

  const emailTypes = [
    { value: 'cold-outreach', label: 'Cold Outreach', description: 'Initial contact with prospects' },
    { value: 'follow-up', label: 'Follow-up', description: 'Gentle reminder emails' },
    { value: 'introduction', label: 'Introduction', description: 'Introduce your company/services' },
    { value: 'partnership', label: 'Partnership', description: 'Propose business partnerships' },
    { value: 'demo-request', label: 'Demo Request', description: 'Request product demonstrations' }
  ];

  const handleGenerateEmail = async () => {
    if (!selectedLead) return;

    setLoading(true);
    setGeneratedEmail(null);

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      // Use environment-based API URL
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/ai/email' 
        : 'http://localhost:5000/api/ai/email';
      
      // Create the email generation request with proper format
      const response = await axios.post(apiUrl, {
        leadData: {
          company: selectedLead.company,
          industry: selectedLead.industry,
          productsServices: selectedLead.productsServices,
          website: selectedLead.website,
          city: selectedLead.city,
          state: selectedLead.state,
          employeeCount: selectedLead.employeeCount,
          revenue: selectedLead.revenue,
          yearFounded: selectedLead.yearFounded
        },
        emailType: emailType,
        customPrompt: customPrompt
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        const emailData = response.data;

        setGeneratedEmail({
          subject: emailData.subject,
          body: emailData.body,
          wordCount: emailData.wordCount || emailData.body.split(/\s+/).length,
          personalizationScore: emailData.personalizationScore || Math.min(
            100, 
            Math.round(
              (emailData.body.toLowerCase().includes(selectedLead.company.toLowerCase()) ? 20 : 0) +
              (emailData.body.toLowerCase().includes(selectedLead.industry.toLowerCase()) ? 20 : 0) +
              (selectedLead.productsServices && selectedLead.productsServices.some(service => 
                emailData.body.toLowerCase().includes(service.toLowerCase())
              ) ? 30 : 0) +
              (customPrompt ? 20 : 0) +
              10 // Base score
            )
          )
        });
      } else {
        console.error('Email generation failed:', response.data.message);
        // Fallback: Generate a basic email if API fails
        generateFallbackEmail();
      }
    } catch (error) {
      console.error('Error generating email:', error);
      // Fallback: Generate a basic email if API fails
      generateFallbackEmail();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackEmail = () => {
    // Fallback email generation when API is not available
    const emailTemplates = {
      'cold-outreach': {
        subject: `Partnership Opportunity with ${selectedLead.company}`,
        body: `Hi there,

I hope this email finds you well. I came across ${selectedLead.company} and was impressed by your work in the ${selectedLead.industry} industry.

I believe there could be a great opportunity for our companies to collaborate. Would you be interested in a brief conversation to explore potential synergies?

Looking forward to hearing from you.

Best regards,
[Your Name]`
      },
      'follow-up': {
        subject: `Following up on our conversation - ${selectedLead.company}`,
        body: `Hi there,

I wanted to follow up on my previous message regarding potential collaboration between our companies.

${selectedLead.company} seems like a perfect fit for what we're looking for in the ${selectedLead.industry} space.

Would you have 15 minutes this week for a quick call?

Best regards,
[Your Name]`
      },
      'introduction': {
        subject: `Introduction: Connecting with ${selectedLead.company}`,
        body: `Hello,

I'm reaching out to introduce our company and explore potential opportunities with ${selectedLead.company}.

We specialize in working with companies in the ${selectedLead.industry} industry and have helped similar organizations achieve significant growth.

Would you be open to a brief conversation to discuss how we might be able to help ${selectedLead.company}?

Best regards,
[Your Name]`
      }
    };

    const template = emailTemplates[emailType] || emailTemplates['cold-outreach'];
    const wordCount = template.body.split(/\s+/).length;
    const personalizationScore = 75; // Default score for fallback

    setGeneratedEmail({
      subject: template.subject,
      body: template.body,
      wordCount: wordCount,
      personalizationScore: personalizationScore
    });
  };

  const handleCopyEmail = () => {
    if (generatedEmail) {
      const emailText = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
      navigator.clipboard.writeText(emailText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendEmail = () => {
    if (generatedEmail && selectedLead?.email) {
      const subject = encodeURIComponent(generatedEmail.subject);
      const body = encodeURIComponent(generatedEmail.body);
      const mailtoLink = `mailto:${selectedLead.email}?subject=${subject}&body=${body}`;
      window.open(mailtoLink);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI-Powered Outreach</h1>
        <p className="text-gray-600 mt-2">
          Generate personalized emails and messages using advanced AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Lead</h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <div
                  key={lead._id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedLead?._id === lead._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">{lead.company}</div>
                  <div className="text-sm text-gray-600">{lead.industry}</div>
                  <div className="text-sm text-gray-500">{lead.city}, {lead.state}</div>
                  {lead.email && (
                    <div className="text-sm text-blue-600">{lead.email}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <p>No leads available</p>
                <p className="text-sm">Add some leads first</p>
              </div>
            )}
          </div>
        </div>

        {/* Email Configuration */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Configuration</h2>
          
          <div className="space-y-6">
            {/* Email Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Type
              </label>
              <select
                className="input-field"
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
              >
                {emailTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {emailTypes.find(t => t.value === emailType)?.description}
              </p>
            </div>

            {/* Custom Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Instructions (Optional)
              </label>
              <textarea
                className="input-field h-24 resize-none"
                placeholder="Add specific instructions for the AI to follow..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateEmail}
              disabled={loading || !selectedLead}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
              <span>{loading ? 'Generating...' : 'Generate Email'}</span>
            </button>
          </div>
        </div>

        {/* Generated Email */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Generated Email</h2>
          
          {generatedEmail ? (
            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-900">{generatedEmail.subject}</p>
                </div>
              </div>

              {/* Email Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Body
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border min-h-48">
                  <p className="text-gray-900 whitespace-pre-wrap">{generatedEmail.body}</p>
                </div>
              </div>

              {/* Email Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">Words: {generatedEmail.wordCount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Personalization: {generatedEmail.personalizationScore}%</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyEmail}
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                
                {selectedLead?.email && (
                  <button
                    onClick={handleSendEmail}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                )}
              </div>

              {/* Regenerate */}
              <button
                onClick={handleGenerateEmail}
                disabled={loading}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No email generated</h3>
              <p>Select a lead and click "Generate Email" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Features Overview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Personalization</h3>
          <p className="text-gray-600 text-sm">
            Our AI analyzes company data to create highly personalized emails that resonate with your prospects.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Higher Conversion Rates</h3>
          <p className="text-gray-600 text-sm">
            Personalized emails generated by our AI have shown 3x higher response rates than generic templates.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Multiple Variations</h3>
          <p className="text-gray-600 text-sm">
            Generate multiple email variations to test different approaches and find what works best for your audience.
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 AI Email Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Use custom instructions to guide the AI for your specific use case</li>
          <li>• Include specific pain points or benefits relevant to the prospect's industry</li>
          <li>• Test different email types to see which resonates best with your audience</li>
          <li>• Each email generation uses 1 credit</li>
        </ul>
      </div>
    </div>
  );
};

export default AI;



