import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';

// Import verification provider logo
const indiconnectLogo = 'https://indiconnect.co.in/assets/logo.png'; // Replace with actual logo path

const PennyDropSettings: React.FC = () => {
  const navigate = useNavigate();

  const handleVerificationServiceClick = (provider: string) => {
    navigate(`/verification-service/${provider.toLowerCase()}`, {
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
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaCheckCircle 
                className="w-8 h-8 text-blue-500"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Penny Drop Verification Services</h1>
              <p className="text-gray-600 mt-1">
                Verify bank accounts instantly with penny drop verification. 
                Ensure secure and reliable transactions with real-time account validation.
              </p>
            </div>
          </div>

          {/* Active Now Section */}
          <div className="mb-8">
            <h2 className="text-green-600 font-medium mb-4">Active Now</h2>
            <div 
              className="border border-green-500 rounded-lg p-6 inline-block cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleVerificationServiceClick('Indiconnect')}
            >
              <img 
                src={indiconnectLogo}
                alt="Indiconnect Logo"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  console.log('Image failed to load');
                }}
              />
            </div>
          </div>

          {/* All Providers Section */}
          <div>
            <h2 className="font-medium mb-4">All Verification Service providers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                className="border rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
                onClick={() => handleVerificationServiceClick('Indiconnect')}
              >
                <img 
                  src={indiconnectLogo}
                  alt="Indiconnect Logo"
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    console.log('Image failed to load');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PennyDropSettings; 