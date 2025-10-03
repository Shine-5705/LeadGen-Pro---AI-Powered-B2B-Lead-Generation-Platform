import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Building, 
  CreditCard, 
  Bell, 
  Shield,
  Key,
  Download,
  Upload,
  Save
} from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    description: user?.description || '',
    interests: user?.interests || {
      industries: [],
      businessTypes: [],
      locations: [],
      revenueRange: '',
      employeeRange: '',
      keywords: ''
    }
  });
  const [loading, setLoading] = useState(false);

  const industryOptions = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Real Estate', 'Hospitality', 'Transportation', 'Energy'];
  const businessTypeOptions = ['B2B', 'B2C', 'SaaS', 'E-commerce', 'Consulting', 'Agency', 'Startup', 'Enterprise'];
  const revenueRanges = ['<$1M', '$1M-$5M', '$5M-$10M', '$10M-$50M', '$50M-$100M', '$100M+'];
  const employeeRanges = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Save to localStorage for persistence
    localStorage.setItem('userPreferences', JSON.stringify(profileData));
    
    // Simulate API call
    setTimeout(() => {
      updateUser(profileData);
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const toggleInterest = (category, value) => {
    setProfileData(prev => {
      const currentArray = prev.interests[category];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        interests: {
          ...prev.interests,
          [category]: newArray
        }
      };
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'data', label: 'Data Export', icon: Download }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="input-field"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="input-field"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              className="input-field"
              value={profileData.company}
              onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description / About Me
            </label>
            <textarea
              className="input-field"
              rows="4"
              value={profileData.description}
              onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
              placeholder="Tell us about yourself and your business goals..."
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* Lead Preferences Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Preferences & Interests</h3>
        <p className="text-sm text-gray-600 mb-6">
          Set your preferences to see companies that match your interests. We'll automatically filter and highlight matching leads.
        </p>

        <div className="space-y-6">
          {/* Industries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Industries
            </label>
            <div className="flex flex-wrap gap-2">
              {industryOptions.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggleInterest('industries', industry)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    profileData.interests.industries.includes(industry)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* Business Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Business Types
            </label>
            <div className="flex flex-wrap gap-2">
              {businessTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleInterest('businessTypes', type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    profileData.interests.businessTypes.includes(type)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Revenue Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Revenue Range
            </label>
            <select
              className="input-field"
              value={profileData.interests.revenueRange}
              onChange={(e) => setProfileData({
                ...profileData,
                interests: { ...profileData.interests, revenueRange: e.target.value }
              })}
            >
              <option value="">Select revenue range</option>
              {revenueRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Employee Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Employee Count
            </label>
            <select
              className="input-field"
              value={profileData.interests.employeeRange}
              onChange={(e) => setProfileData({
                ...profileData,
                interests: { ...profileData.interests, employeeRange: e.target.value }
              })}
            >
              <option value="">Select employee range</option>
              {employeeRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Keywords & Products (comma-separated)
            </label>
            <input
              type="text"
              className="input-field"
              value={profileData.interests.keywords}
              onChange={(e) => setProfileData({
                ...profileData,
                interests: { ...profileData.interests, keywords: e.target.value }
              })}
              placeholder="e.g., AI, Machine Learning, Cloud Computing, SaaS"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter keywords related to products, services, or technologies you're interested in
            </p>
          </div>

          <button
            onClick={handleProfileUpdate}
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Preferences...' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 capitalize">{user?.plan || 'Free'} Plan</h4>
              <p className="text-gray-600">Credits: {user?.credits || 0}</p>
            </div>
            <button className="btn-primary">Upgrade Plan</button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
        <div className="card">
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-8 h-8 mx-auto mb-2" />
            <p>No billing history available</p>
            <p className="text-sm">Upgrade to a paid plan to see billing information</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Lead Generation Updates</h4>
              <p className="text-sm text-gray-600">Get notified when new leads are generated</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Weekly Reports</h4>
              <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Credit Alerts</h4>
              <p className="text-sm text-gray-600">Get notified when credits are running low</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter current password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Confirm new password"
            />
          </div>
          
          <button className="btn-primary">Update Password</button>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">2FA Status</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="btn-secondary">Enable 2FA</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
        <div className="card">
          <div className="text-center py-8 text-gray-500">
            <Key className="w-8 h-8 mx-auto mb-2" />
            <p>No API keys generated</p>
            <p className="text-sm">Generate API keys to integrate with external tools</p>
            <button className="btn-primary mt-4">Generate API Key</button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Documentation</h3>
        <div className="card">
          <p className="text-gray-600 mb-4">
            Access our comprehensive API documentation to integrate LeadGen Pro with your existing tools.
          </p>
          <button className="btn-secondary">View Documentation</button>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Your Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h4 className="font-medium text-gray-900 mb-2">Lead Data</h4>
            <p className="text-sm text-gray-600 mb-4">Export all your leads in CSV or Excel format</p>
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm">CSV</button>
              <button className="btn-secondary text-sm">Excel</button>
            </div>
          </div>
          
          <div className="card">
            <h4 className="font-medium text-gray-900 mb-2">Analytics Data</h4>
            <p className="text-sm text-gray-600 mb-4">Export analytics and performance data</p>
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm">CSV</button>
              <button className="btn-secondary text-sm">Excel</button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Deletion</h3>
        <div className="card bg-red-50 border-red-200">
          <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
          <p className="text-sm text-red-800 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'billing':
        return renderBillingTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'api':
        return renderApiTab();
      case 'data':
        return renderDataTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;



