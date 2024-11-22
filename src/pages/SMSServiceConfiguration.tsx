import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaExternalLinkAlt } from 'react-icons/fa';

const PROVIDER_CONFIGS = {
  msg91: {
    title: 'MSG91',
    description: 'Leading SMS service provider with global reach',
    createAccountUrl: 'https://msg91.com/signup',
    docsUrl: 'https://docs.msg91.com/',
    fields: [
      { name: 'authKey', label: 'Authentication Key', placeholder: 'Enter your MSG91 auth key' },
      { name: 'senderId', label: 'Sender ID', placeholder: 'Enter sender ID' },
      { name: 'route', label: 'Route', placeholder: 'Enter route (e.g., 4 for transactional)' }
    ]
  },
  twilio: {
    title: 'Twilio',
    description: 'Cloud communications platform for SMS, voice, and more',
    createAccountUrl: 'https://www.twilio.com/try-twilio',
    docsUrl: 'https://www.twilio.com/docs/sms',
    fields: [
      { name: 'accountSid', label: 'Account SID', placeholder: 'Enter your Twilio Account SID' },
      { name: 'authToken', label: 'Auth Token', placeholder: 'Enter your Twilio Auth Token' },
      { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Enter your Twilio phone number' }
    ]
  }
};

const SMSServiceConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const { provider } = useParams();
  const providerConfig = PROVIDER_CONFIGS[provider?.toLowerCase() as keyof typeof PROVIDER_CONFIGS];

  const handleCreateAccount = () => {
    window.open(providerConfig.createAccountUrl, '_blank');
  };

  const handleReadDocs = () => {
    window.open(providerConfig.docsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center">
            <IoArrowBack className="text-xl" />
          </button>
          <span>SMS Service providers</span>
          <span>/</span>
          <span>{providerConfig.title}</span>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-semibold">{providerConfig.title}</h1>
              <p className="text-gray-600 mt-2">{providerConfig.description}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateAccount}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Create Account
                <FaExternalLinkAlt className="text-sm" />
              </button>
              <button
                onClick={handleReadDocs}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Documentation
                <FaExternalLinkAlt className="text-sm" />
              </button>
            </div>
          </div>
          
          <form className="space-y-6">
            {providerConfig.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SMSServiceConfiguration; 