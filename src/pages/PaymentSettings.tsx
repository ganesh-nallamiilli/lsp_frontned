import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaMoneyBillWave } from 'react-icons/fa';

// Import payment provider logos
const stripeLogo = 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg';
const phonePayLogo = 'https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png';
const razorPayLogo = 'https://razorpay.com/assets/razorpay-glyph.svg';

const PaymentSettings: React.FC = () => {
  const navigate = useNavigate();

  const handlePaymentServiceClick = (provider: string) => {
    navigate(`/payment-service/${provider.toLowerCase()}`, {
      state: { 
        isActive: true,
        provider: provider
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-amber-800"
          >
            <IoArrowBack className="text-xl" />
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {/* Title Section */}
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaMoneyBillWave 
                className="w-8 h-8 text-green-500"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Payment Service providers</h1>
              <p className="text-gray-600 mt-1">
                Integrate our secure payment gateways to accept payments globally. 
                Support for multiple payment methods and currencies with robust security features.
              </p>
            </div>
          </div>

          {/* Active Now Section */}
          <div className="mb-8">
            <h2 className="text-green-600 font-medium mb-4">Active Now</h2>
            <div 
              className="border border-green-500 rounded-lg p-6 inline-block cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handlePaymentServiceClick('Stripe')}
            >
              <img 
                src={stripeLogo}
                alt="Stripe Logo"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  console.log('Image failed to load');
                }}
              />
            </div>
          </div>

          {/* All Providers Section */}
          <div>
            <h2 className="font-medium mb-4">All Payment Service providers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Stripe', logo: stripeLogo },
                { name: 'PhonePay', logo: phonePayLogo },
                { name: 'RazorPay', logo: razorPayLogo }
              ].map((provider) => (
                <div 
                  key={provider.name}
                  className="border rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
                  onClick={() => handlePaymentServiceClick(provider.name)}
                >
                  <img 
                    src={provider.logo}
                    alt={`${provider.name} Logo`}
                    className="h-8 w-auto object-contain"
                    onError={(e) => {
                      console.log('Image failed to load');
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings; 