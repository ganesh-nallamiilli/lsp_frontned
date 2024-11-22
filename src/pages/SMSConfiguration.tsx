import React from 'react';
import { useNavigate } from 'react-router-dom';

const SMSConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const msg91Logo = '/path-to-msg91-logo.png';
  const twilioLogo = '/path-to-twilio-logo.png';

  const handleServiceClick = (provider: string) => {
    navigate(`/settings/notifications/sms/${provider.toLowerCase()}`);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-100 p-3 rounded-lg">
          <img src="/sms-icon.svg" alt="SMS" className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">SMS Service provider</h1>
          <p className="text-gray-600 mt-1">
            Integrate our developer-friendly SMS API to send and receive text messages. 
            Our distributed carrier network and intelligent routing ensure the highest delivery and lowest latency.
          </p>
        </div>
      </div>

      {/* Active Provider */}
      <div className="mb-8">
        <h2 className="text-green-600 font-medium mb-4">Active Now</h2>
        <div 
          className="border border-green-500 rounded-lg p-6 inline-block cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleServiceClick('MSG91')}
        >
          <img 
            src={msg91Logo}
            alt="MSG91 Logo"
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>

      {/* All Providers */}
      <div>
        <h2 className="font-medium mb-4">All SMS Service providers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: 'MSG91', logo: msg91Logo },
            { name: 'Twilio', logo: twilioLogo }
          ].map((provider) => (
            <div 
              key={provider.name}
              className="border rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
              onClick={() => handleServiceClick(provider.name)}
            >
              <img 
                src={provider.logo}
                alt={`${provider.name} Logo`}
                className="h-8 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SMSConfiguration; 