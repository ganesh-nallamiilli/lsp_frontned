import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaMap } from 'react-icons/fa';

const googleMapsLogo = new URL('../assets/google-maps-logo.png', import.meta.url).href;

const MapsSettings: React.FC = () => {
  const navigate = useNavigate();

  // Add handler for map service selection
  const handleMapServiceClick = (provider: string) => {
    navigate(`/maps-service/${provider.toLowerCase()}`, {
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
              <FaMap 
                className="w-8 h-8 text-blue-500"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Maps Service providers</h1>
              <p className="text-gray-600 mt-1">
                Integrate our developer-friendly MAPS API to send and receive text messages. 
                Our distributed carrier network and intelligent routing ensure the highest delivery and lowest latency.
              </p>
            </div>
          </div>

          {/* Active Now Section - Made clickable */}
          <div className="mb-8">
            <h2 className="text-green-600 font-medium mb-4">Active Now</h2>
            <div 
              className="border border-green-500 rounded-lg p-4 inline-block cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleMapServiceClick('Google-Maps')}
            >
              <img 
                src={googleMapsLogo}
                alt="Google Maps Logo"
                className="w-32"
                onError={(e) => {
                  console.log('Image failed to load');
                }}
              />
            </div>
          </div>

          {/* All Providers Section - Made clickable */}
          <div>
            <h2 className="font-medium mb-4">All Maps Service providers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
                onClick={() => handleMapServiceClick('Google-Maps')}
              >
                <img 
                  src={googleMapsLogo}
                  alt="Google Maps Logo"
                  className="w-32"
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

export default MapsSettings; 