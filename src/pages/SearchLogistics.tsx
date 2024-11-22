import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';

interface LocationDetails {
  city: string;
  area: string;
  pincode: string;
  phone: string;
}

interface PackageDimensions {
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

interface LogisticsProvider {
  name: string;
  domain: string;
  company: string;
  distance: string;
  deliveryType: string;
  expectedPickup: string;
  estimatedDelivery: string;
  deliveryMode: string;
  shippingCharges: number;
  rtoCharges: number;
}

const SearchLogistics: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<string>('same_day');
  const [showResults, setShowResults] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);

  const deliveryOptions = [
    { id: 'next_day', label: 'Next Day Delivery', icon: '📅' },
    { id: 'standard', label: 'Standard Delivery', icon: '🚚' },
    { id: 'express', label: 'Express Delivery', icon: '⚡' },
    { id: 'immediate', label: 'Immediate Delivery', icon: '🏃' },
    { id: 'same_day', label: 'Same Day Delivery', icon: '📦' },
  ];

  const logisticsProviders: LogisticsProvider[] = [
    {
      name: "ONDC Test Courier Services",
      domain: "ondc-mock-server-dev.thewitslab.com",
      company: "ONDC Test Courier Services Inc",
      distance: "25 kilometer",
      deliveryType: "Same Day delivery",
      expectedPickup: "P1D",
      estimatedDelivery: "P1D",
      deliveryMode: "Hyperlocal -P2P",
      shippingCharges: 1.00,
      rtoCharges: 1.00
    },
    // Add other providers as needed
  ];

  // Get the parameters from the URL
  const fromCity = searchParams.get('from') || 'Bengaluru';
  const toCity = searchParams.get('to') || 'Bengaluru';
  const length = searchParams.get('length') || '20';
  const breadth = searchParams.get('breadth') || '20';
  const height = searchParams.get('height') || '10';
  const weight = searchParams.get('weight') || '0.3';

  // Replace the animation imports with async loading
  const [animations, setAnimations] = useState<{
    package: any;
    truck: any;
    delivered: any;
  }>({
    package: null,
    truck: null,
    delivered: null,
  });

  // Load animations when component mounts
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const [packageAnim, truckAnim, deliveredAnim] = await Promise.all([
          fetch("https://lottie.host/2c1ce8ca-3937-4265-9255-03a6e6f3b97d/4ZS6yqgv3o.json").then(r => r.json()),
          fetch("https://lottie.host/cc7c0e99-c5e3-4e39-a9c3-0579c0dc32b7/zufRKHdZYS.json").then(r => r.json()),
          fetch("https://lottie.host/7b11c3d4-47d8-421d-a9c0-c2e6def00d05/WPnWBYpTHq.json").then(r => r.json()),
        ]);

        setAnimations({
          package: packageAnim,
          truck: truckAnim,
          delivered: deliveredAnim,
        });
      } catch (error) {
        console.error('Failed to load animations:', error);
      }
    };

    loadAnimations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button 
              className="flex items-center text-blue-600 font-medium"
              onClick={() => navigate(-1)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              BACK
            </button>
            <div className="flex gap-4">
              <select className="border border-gray-300 rounded-md px-3 py-1.5 text-blue-600">
                <option>Delivery</option>
                <option>Return</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-1.5 text-blue-600">
                <option>Version 1.1</option>
                <option selected>Version 1.2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-b">
            {/* From Location */}
            <div>
              <div className="text-sm text-gray-500 mb-1">From</div>
              <div className="text-xl font-semibold mb-1">{fromCity}</div>
              <div className="text-sm text-gray-600">
                prestige tech park, kadubeesanahalli - 560103
              </div>
              <div className="text-sm text-gray-500 mt-1">7569316575</div>
            </div>

            {/* To Location */}
            <div>
              <div className="text-sm text-gray-500 mb-1">To</div>
              <div className="text-xl font-semibold mb-1">{toCity}</div>
              <div className="text-sm text-gray-600">
                Prestige Tech Park Road, Kadubeesanahalli - 560103
              </div>
              <div className="text-sm text-gray-500 mt-1">9638527410</div>
            </div>

            {/* Pickup Date */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Pickup Date</div>
              <div className="text-xl font-semibold mb-1">20 Nov '24</div>
              <div className="text-sm text-gray-600">
                Wednesday, 12:00 AM - 11:00 PM
              </div>
            </div>

            {/* Package Dimensions */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Package Dimensions</div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">L: {length}cm</div>
                <div className="text-sm text-gray-600">B: {breadth}cm</div>
                <div className="text-sm text-gray-600">H: {height}cm</div>
                <div className="text-sm text-gray-600">Weight: {weight} kg</div>
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="p-6">
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              {deliveryOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedDeliveryType(option.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    selectedDeliveryType === option.id
                      ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>

            {/* Search Button */}
            <div className="text-center">
              <button 
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
                onClick={() => setShowResults(true)}
              >
                SEARCH LOGISTICS
              </button>
            </div>

             {/* Delivery Progress Indicator */}
             <div className="mt-8 flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                {animations.package ? (
                  <Lottie
                    animationData={animations.package}
                    loop={true}
                    style={{ width: 50, height: 50 }}
                  />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <div className="flex-1 border-t-2 border-dashed border-blue-200 max-w-[200px]"></div>
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                {animations.truck ? (
                  <Lottie
                    animationData={animations.truck}
                    loop={true}
                    style={{ width: 50, height: 50 }}
                  />
                ) : (
                  <span className="text-2xl transform scale-x-[-1]">🚚</span>
                )}
              </div>
              <div className="flex-1 border-t-2 border-dashed border-blue-200 max-w-[200px]"></div>
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                {animations.delivered ? (
                  <Lottie
                    animationData={animations.delivered}
                    loop={true}
                    style={{ width: 50, height: 50 }}
                  />
                ) : (
                  <span className="text-2xl">🏠</span>
                )}
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mt-8 flex justify-center gap-2">
              {/* Delivery Type Filters */}
              <button
                onClick={() => setDeliveryFilter(deliveryFilter === 'hyperlocal' ? null : 'hyperlocal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                  deliveryFilter === 'hyperlocal' 
                    ? 'bg-blue-50 border-blue-600 text-blue-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Hyperlocal
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-100 text-blue-600 rounded-full">
                  8
                </span>
              </button>
              
              <button
                onClick={() => setDeliveryFilter(deliveryFilter === 'intercity' ? null : 'intercity')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                  deliveryFilter === 'intercity' 
                    ? 'bg-blue-50 border-blue-600 text-blue-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Intercity
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-100 text-blue-600 rounded-full">
                  1
                </span>
              </button>
              
              {/* Price Filters */}
              <button
                onClick={() => setPriceFilter(priceFilter === 'low-to-high' ? null : 'low-to-high')}
                className={`px-4 py-2 rounded-full border ${
                  priceFilter === 'low-to-high' 
                    ? 'bg-blue-50 border-blue-600 text-blue-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Low to High
              </button>
              
              <button
                onClick={() => setPriceFilter(priceFilter === 'high-to-low' ? null : 'high-to-low')}
                className={`px-4 py-2 rounded-full border ${
                  priceFilter === 'high-to-low' 
                    ? 'bg-blue-50 border-blue-600 text-blue-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                High to Low
              </button>
            </div>

            {/* Logistics Provider Listing */}
            {showResults && (
              <div className="mt-8 space-y-4">
                {logisticsProviders
                  .filter(provider => {
                    // Apply delivery filter if selected
                    if (deliveryFilter === 'hyperlocal') {
                      return provider.deliveryMode.toLowerCase().includes('hyperlocal');
                    }
                    if (deliveryFilter === 'intercity') {
                      return provider.deliveryMode.toLowerCase().includes('intercity');
                    }
                    return true; // Show all if no delivery filter selected
                  })
                  .sort((a, b) => {
                    // Apply price sorting if selected
                    if (priceFilter === 'low-to-high') {
                      return (a.shippingCharges + a.rtoCharges) - (b.shippingCharges + b.rtoCharges);
                    }
                    if (priceFilter === 'high-to-low') {
                      return (b.shippingCharges + b.rtoCharges) - (a.shippingCharges + a.rtoCharges);
                    }
                    return 0; // No sorting if no price filter selected
                  })
                  .map((provider, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{provider.name}</h3>
                          <p className="text-sm text-gray-600">{provider.domain}</p>
                          <p className="text-sm text-gray-700">{provider.company}</p>
                          <p className="text-sm text-gray-600">Rider Distance: {provider.distance}</p>
                        </div>
                        <div className="text-right">
                          <h4 className="text-blue-600 font-medium">{provider.deliveryType}</h4>
                          <p className="text-sm text-gray-600">Expected Pickup - {provider.expectedPickup}</p>
                          <p className="text-sm text-gray-600">Estimated Delivery - {provider.estimatedDelivery}</p>
                          <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mt-2">
                            {provider.deliveryMode}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div>
                              <p className="text-lg font-semibold text-center">₹ {provider.shippingCharges.toFixed(2)}</p>
                              <p className="text-xs text-gray-600">Shipping Charges</p>
                            </div>
                            <span className="text-gray-400">+</span>
                            <div>
                              <p className="text-lg font-semibold text-center">₹ {provider.rtoCharges.toFixed(2)}</p>
                              <p className="text-xs text-gray-600">RTO Charges</p>
                            </div>
                            <span className="text-gray-400">=</span>
                            <div>
                              <p className="text-lg font-semibold text-center">₹ {(provider.shippingCharges + provider.rtoCharges).toFixed(2)}</p>
                              <p className="text-xs text-gray-600">Total Charges</p>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2">Prices may change according to the package details provided</p>
                          <button 
                            onClick={() => navigate('/confirmation-instructions', {
                              state: {
                                provider: provider // This will pass the selected provider's data
                              }
                            })} 
                            className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 w-full hover:bg-green-600"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLogistics; 