import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import EmailConfiguration from './EmailConfiguration';
import SMSConfiguration from './SMSConfiguration';
import NotificationTemplates from './NotificationTemplates';

const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path.includes('email')) return 'email';
    if (path.includes('sms')) return 'sms';
    if (path.includes('templates')) return 'templates';
    return 'email';
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'email', label: 'Email Configuration' },
    { id: 'sms', label: 'SMS Configuration' },
    { id: 'templates', label: 'Email/SMS Templates' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
          >
            <IoArrowBack />
            BACK
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'email' && <EmailConfiguration />}
            {activeTab === 'sms' && <SMSConfiguration />}
            {activeTab === 'templates' && <NotificationTemplates />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 