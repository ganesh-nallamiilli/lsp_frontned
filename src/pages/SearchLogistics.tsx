import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDraftOrderById, searchLSP } from '../store/slices/draftOrderSlice';

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
  const dispatch = useAppDispatch();
  const { selectedDraftOrder, loading: draftOrderLoading, error: draftOrderError } = useAppSelector(
    (state) => state.draftOrders
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<string>('same_day');
  const [showResults, setShowResults] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);

  const draftOrderId = searchParams.get('draftOrderId');

  // Add null check for selectedDraftOrder before accessing its properties
  const fromCity = searchParams.get('from') || selectedDraftOrder?.fromCity || 'Bengaluru';
  const toCity = searchParams.get('to') || selectedDraftOrder?.toCity || 'Bengaluru';
  const length = searchParams.get('length') || selectedDraftOrder?.packageDimensions?.length?.toString() || '20';
  const breadth = searchParams.get('breadth') || selectedDraftOrder?.packageDimensions?.breadth?.toString() || '20';
  const height = searchParams.get('height') || selectedDraftOrder?.packageDimensions?.height?.toString() || '10';
  const weight = searchParams.get('weight') || selectedDraftOrder?.packageDimensions?.weight?.toString() || '0.3';

  // Move useEffect hooks before any rendering logic
  useEffect(() => {
    if (selectedDraftOrder) {
      setSelectedDeliveryType(selectedDraftOrder.deliveryType || 'same_day');
    }
  }, [selectedDraftOrder]);

  // Fetch draft order data when component mounts
  useEffect(() => {
    console.log('Current draftOrderId from query params:', draftOrderId); // Debug log
    if (!draftOrderId) {
      console.log('No draftOrderId present in query params'); // Debug log
      return;
    }
    
    console.log('Initiating draft order fetch for ID:', draftOrderId);
    dispatch(fetchDraftOrderById(draftOrderId))
      .unwrap()
      .then((result) => {
        console.log('Draft order fetch successful:', result);
      })
      .catch((error) => {
        console.error('Draft order fetch failed:', error);
      });
  }, [dispatch, draftOrderId]);

  // Add error boundary for animations
  const [animationError, setAnimationError] = useState(false);
  const [animations, setAnimations] = useState<{
    package: any;
    truck: any;
    delivered: any;
  }>({
    package: null,
    truck: null,
    delivered: null,
  });

  // Load animations with error handling
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
        setAnimationError(true);
      }
    };

    loadAnimations();
  }, []);

  // Wrap the animation rendering in a try-catch
  const renderAnimationOrFallback = (animation: any, fallbackIcon: string) => {
    try {
      if (animationError || !animation) {
        return <span className="text-2xl">{fallbackIcon}</span>;
      }
      return (
        <Lottie
          animationData={animation}
          loop={true}
          style={{ width: 50, height: 50 }}
        />
      );
    } catch (error) {
      console.error('Animation render error:', error);
      return <span className="text-2xl">{fallbackIcon}</span>;
    }
  };

  // Show loading state first
  if (draftOrderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state
  if (draftOrderError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {draftOrderError}</div>
      </div>
    );
  }

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

  useEffect(() => {
    if (selectedDraftOrder) {
      dispatch(searchLSP(selectedDraftOrder));
    }
  }, [selectedDraftOrder]);

  return (
    <div id="search-logistics-page-container" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div id="search-logistics-page-header" className="bg-white shadow">
        <div id="search-logistics-page-header-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div id="search-logistics-page-header-content-back-button" className="flex justify-between items-center">
            <button 
              id="search-logistics-page-header-content-back-button"
              className="flex items-center text-blue-600 font-medium"
              onClick={() => navigate(-1)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              BACK
            </button>
            <div id="search-logistics-page-header-content-actions" className="flex gap-4">
              <select id="search-logistics-page-header-content-actions-delivery-type-select" className="border border-gray-300 rounded-md px-3 py-1.5 text-blue-600">
                <option id="search-logistics-page-header-content-actions-delivery-type-select-option-delivery" value="delivery">Delivery</option>
                <option id="search-logistics-page-header-content-actions-delivery-type-select-option-return" value="return">Return</option>
              </select>
              <select id="search-logistics-page-header-content-actions-version-select" className="border border-gray-300 rounded-md px-3 py-1.5 text-blue-600">
                <option id="search-logistics-page-header-content-actions-version-select-option-version-1-1" value="version-1-1">Version 1.1</option>
                <option id="search-logistics-page-header-content-actions-version-select-option-version-1-2" value="version-1-2" selected>Version 1.2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="search-logistics-page-main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="search-logistics-page-main-content-location-details" className="bg-white rounded-lg shadow">
          {/* Location Details */}
          <div id="search-logistics-page-main-content-location-details-content" className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-b">
            {/* From Location */}
            <div>
              <div id="search-logistics-page-main-content-location-details-content-from-location-title" className="text-sm text-gray-500 mb-1">From</div>
              <div id="search-logistics-page-main-content-location-details-content-from-location-city" className="text-xl font-semibold mb-1">{fromCity}</div>
              <div id="search-logistics-page-main-content-location-details-content-from-location-address" className="text-sm text-gray-600">
                prestige tech park, kadubeesanahalli - 560103
              </div>
              <div className="text-sm text-gray-500 mt-1">7569316575</div>
            </div>

            {/* To Location */}
            <div>
              <div id="search-logistics-page-main-content-location-details-content-to-location-title" className="text-sm text-gray-500 mb-1">To</div>
              <div id="search-logistics-page-main-content-location-details-content-to-location-city" className="text-xl font-semibold mb-1">{toCity}</div>
              <div id="search-logistics-page-main-content-location-details-content-to-location-address" className="text-sm text-gray-600">
                Prestige Tech Park Road, Kadubeesanahalli - 560103
              </div>
              <div className="text-sm text-gray-500 mt-1">9638527410</div>
            </div>

            {/* Pickup Date */}
            <div>
              <div id="search-logistics-page-main-content-location-details-content-pickup-date-title" className="text-sm text-gray-500 mb-1">Pickup Date</div>
              <div id="search-logistics-page-main-content-location-details-content-pickup-date-date" className="text-xl font-semibold mb-1">20 Nov '24</div>
              <div id="search-logistics-page-main-content-location-details-content-pickup-date-time" className="text-sm text-gray-600">
                Wednesday, 12:00 AM - 11:00 PM
              </div>
            </div>

            {/* Package Dimensions */}
            <div>
              <div id="search-logistics-page-main-content-location-details-content-package-dimensions-title" className="text-sm text-gray-500 mb-1">Package Dimensions</div>
              <div id="search-logistics-page-main-content-location-details-content-package-dimensions-dimensions" className="space-y-1">
                <div id="search-logistics-page-main-content-location-details-content-package-dimensions-dimensions-length" className="text-sm text-gray-600">L: {length}cm</div>
                <div id="search-logistics-page-main-content-location-details-content-package-dimensions-dimensions-breadth" className="text-sm text-gray-600">B: {breadth}cm</div>
                <div id="search-logistics-page-main-content-location-details-content-package-dimensions-dimensions-height" className="text-sm text-gray-600">H: {height}cm</div>
                <div id="search-logistics-page-main-content-location-details-content-package-dimensions-dimensions-weight" className="text-sm text-gray-600">Weight: {weight} kg</div>
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div id="search-logistics-page-main-content-delivery-options" className="p-6">
            <div id="search-logistics-page-main-content-delivery-options-options" className="flex flex-wrap gap-4 justify-center mb-6">
              {deliveryOptions.map((option) => (
                <button
                  id={`search-logistics-page-main-content-delivery-options-options-${option.id}-button`}
                  key={option.id}
                  onClick={() => setSelectedDeliveryType(option.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    selectedDeliveryType === option.id
                      ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span id={`search-logistics-page-main-content-delivery-options-options-${option.id}-button-icon`}>{option.icon}</span>
                  <span id={`search-logistics-page-main-content-delivery-options-options-${option.id}-button-label`}>{option.label}</span>
                </button>
              ))}
            </div>

            {/* Search Button */}
            <div id="search-logistics-page-main-content-search-button" className="text-center">
              <button 
                id="search-logistics-page-main-content-search-button-button"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
                onClick={() => setShowResults(true)}
              >
                SEARCH LOGISTICS
              </button>
            </div>

             {/* Delivery Progress Indicator */}
             <div id="search-logistics-page-main-content-delivery-progress-indicator" className="mt-8 flex items-center justify-center gap-4">
              <div id="search-logistics-page-main-content-delivery-progress-indicator-package" className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                {renderAnimationOrFallback(animations.package, '📦')}
              </div>
              <div id="search-logistics-page-main-content-delivery-progress-indicator-truck" className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                {renderAnimationOrFallback(animations.truck, '🚚')}
              </div>
              <div id="search-logistics-page-main-content-delivery-progress-indicator-delivered" className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                {renderAnimationOrFallback(animations.delivered, '✅')}
              </div>
            </div>

            {/* Filter Buttons */}
            <div id="search-logistics-page-main-content-filter-buttons" className="mt-8 flex justify-center gap-2">
              {/* Delivery Type Filters */}
              <button
                id={`search-logistics-page-main-content-filter-buttons-hyperlocal-button`}
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
                id={`search-logistics-page-main-content-filter-buttons-intercity-button`}
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
                id={`search-logistics-page-main-content-filter-buttons-low-to-high-button`}
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
                id={`search-logistics-page-main-content-filter-buttons-high-to-low-button`}
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
              <div id="search-logistics-page-main-content-logistics-providers" className="mt-8 space-y-4">
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
                    <div key={index} id={`search-logistics-page-main-content-logistics-providers-provider-${index}`} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content`} className="flex justify-between items-start">
                        <div>
                          <h3 id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-name`} className="font-semibold text-lg">{provider.name}</h3>
                          <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-domain`} className="text-sm text-gray-600">{provider.domain}</p>
                          <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-company`} className="text-sm text-gray-700">{provider.company}</p>
                          <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-distance`} className="text-sm text-gray-600">Rider Distance: {provider.distance}</p>
                        </div>
                        <div id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-right`} className="text-right">
                          <h4 id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-delivery-type`} className="text-blue-600 font-medium">{provider.deliveryType}</h4>
                          <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-expected-pickup`} className="text-sm text-gray-600">Expected Pickup - {provider.expectedPickup}</p>
                          <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-estimated-delivery`} className="text-sm text-gray-600">Estimated Delivery - {provider.estimatedDelivery}</p>
                          <span id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-delivery-mode`} className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mt-2">
                            {provider.deliveryMode}
                          </span>
                        </div>
                        <div id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-pricing`} className="text-right">
                          <div id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-pricing-shipping-charges`} className="flex items-center justify-end gap-2">
                            <div>
                              <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-pricing-shipping-charges-amount`} className="text-lg font-semibold text-center">₹ {provider.shippingCharges.toFixed(2)}</p>
                              <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-pricing-shipping-charges-label`} className="text-xs text-gray-600">Shipping Charges</p>
                            </div>
                            <span className="text-gray-400">+</span>
                            <div>
                              <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-pricing-rto-charges-amount`} className="text-lg font-semibold text-center">₹ {provider.rtoCharges.toFixed(2)}</p>
                              <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-pricing-rto-charges-label`} className="text-xs text-gray-600">RTO Charges</p>
                            </div>
                            <span className="text-gray-400">=</span>
                            <div>
                              <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-pricing-total-charges-amount`} className="text-lg font-semibold text-center">₹ {(provider.shippingCharges + provider.rtoCharges).toFixed(2)}</p>
                              <p id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-pricing-total-charges-label`} className="text-xs text-gray-600">Total Charges</p>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2">Prices may change according to the package details provided</p>
                          <button 
                            id={`search-logistics-page-main-content-logistics-providers-provider-${index}-content-book-now-button`}
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