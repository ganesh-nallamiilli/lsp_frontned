import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaExternalLinkAlt } from 'react-icons/fa';

const PROVIDER_CONFIGS = {
  stripe: {
    title: 'Stripe',
    description: 'Build and scale your payment infrastructure',
    createAccountUrl: 'https://dashboard.stripe.com/register',
    docsUrl: 'https://stripe.com/docs',
    fields: [
      { name: 'publishableKey', label: 'Publishable Key', placeholder: 'Enter your Stripe publishable key' },
      { name: 'secretKey', label: 'Secret Key', placeholder: 'Enter your Stripe secret key' },
      { name: 'webhookSecret', label: 'Webhook Secret', placeholder: 'Enter your webhook secret' }
    ]
  },
  phonepay: {
    title: 'PhonePe',
    description: "India's most trusted digital payments platform",
    createAccountUrl: 'https://business.phonepe.com/signup',
    docsUrl: 'https://developer.phonepe.com/docs',
    fields: [
      { name: 'merchantId', label: 'Merchant ID', placeholder: 'Enter your PhonePe merchant ID' },
      { name: 'saltKey', label: 'Salt Key', placeholder: 'Enter your salt key' },
      { name: 'saltIndex', label: 'Salt Index', placeholder: 'Enter your salt index' }
    ]
  },
  razorpay: {
    title: 'Razorpay',
    description: 'Best payment gateway for Indian businesses',
    createAccountUrl: 'https://dashboard.razorpay.com/signup',
    docsUrl: 'https://razorpay.com/docs',
    fields: [
      { name: 'keyId', label: 'Key ID', placeholder: 'Enter your Razorpay key ID' },
      { name: 'keySecret', label: 'Key Secret', placeholder: 'Enter your key secret' },
      { name: 'webhookSecret', label: 'Webhook Secret', placeholder: 'Enter your webhook secret' }
    ]
  }
};

const PaymentServiceConfiguration: React.FC = () => {
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
          <span>Payment Service providers</span>
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
                Create Account Now
                <FaExternalLinkAlt className="text-sm" />
              </button>
              <button
                onClick={handleReadDocs}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Read Documentation
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Save & Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentServiceConfiguration; 