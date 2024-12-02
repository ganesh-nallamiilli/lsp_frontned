import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createDraftOrder } from '../store/slices/draftOrderSlice';
import { fetchPickupAddresses, fetchDeliveryAddresses } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';

// Define the form context type
interface FormContextType {
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
  pickupAddresses: PickupAddress[];
  deliveryAddresses: DeliveryAddress[];
}

// Define the form data interface
interface OrderFormData {
  // Order Details
  franchiseOrderId: string;
  franchiseOrderAmount: number;
  franchiseOrderCategory: string;
  categoryType: string;
  preparationTime: string;
  paymentType: 'COD' | 'Prepaid';
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    weight: number;
  }>;
  isReadyForShipment: boolean;
  isRtoEligible: boolean;
  packageLength: number;
  packageWidth: number;
  packageHeight: number;
  packageWeight: number;
  packageValue: number;
  packageType: string;
  shippingService: string;
  isFragile: boolean;
  requiresSignature: boolean;
  pickupAddress?: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    isDefault?: boolean;
  };
  deliveryAddress?: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    alternatePhone?: string;
    landmark?: string;
  };
}

// Add this interface near your other interfaces
interface PickupAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

// Add this interface if not already present
interface DeliveryAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  alternatePhone?: string;
  landmark?: string;
}

// Define a common address interface
interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  alternatePhone?: string;
  landmark?: string;
}

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Create the form provider component
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { pickupAddresses, deliveryAddresses } = useAppSelector(state => state.auth);
  
  // Fetch addresses when component mounts
  useEffect(() => {
    dispatch(fetchPickupAddresses());
    dispatch(fetchDeliveryAddresses());
  }, [dispatch]);

  const [formData, setFormData] = useState<OrderFormData>({
    retailOrderId: '',
    retailOrderAmount: 0,
    retailOrderCategory: '',
    categoryType: '',
    preparationTime: '',
    paymentType: 'COD',
    items: [{ name: '', price: 0, quantity: 1, weight: 0 }],
    isReadyForShipment: false,
    isRtoEligible: false,
    packageLength: 0,
    packageWidth: 0,
    packageHeight: 0,
    packageWeight: 0,
    packageValue: 0,
    packageType: '',
    shippingService: '',
    isFragile: false,
    requiresSignature: false,
    pickupAddress: undefined,
    deliveryAddress: undefined
  });

  // Transform pickup addresses
  const formattedPickupAddresses = useMemo(() => 
    pickupAddresses?.map(addr => ({
      id: addr._id,
      name: addr.person.name,
      address: addr.location.address.building,
      city: addr.location.address.city,
      state: addr.location.address.state,
      pincode: addr.location.address.area_code,
      phone: addr.contact.phone,
      // Add any additional fields if needed
    })) || [], [pickupAddresses]);

  // Transform delivery addresses
  const formattedDeliveryAddresses = useMemo(() => 
    deliveryAddresses?.map(addr => ({
      id: addr._id,
      name: addr.person.name,
      address: addr.location.address.building,
      city: addr.location.address.city,
      state: addr.location.address.state,
      pincode: addr.location.address.area_code,
      phone: addr.contact.phone,
      alternatePhone: addr.contact.alternate_phone,
      landmark: addr.location.address.locality,
      // Add any additional fields if needed
    })) || [], [deliveryAddresses]);

  const contextValue = useMemo(() => ({
    formData,
    setFormData,
    pickupAddresses: formattedPickupAddresses,
    deliveryAddresses: formattedDeliveryAddresses
  }), [formData, formattedPickupAddresses, formattedDeliveryAddresses]);

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook for using the form context
const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

// Add this type for step navigation
type Step = 'order' | 'pickup' | 'delivery' | 'package';

// Progress Bar Component with improved styling
const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = [
    { 
      id: 1, 
      name: 'Order Details',
      description: 'Basic order information and items',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      id: 2, 
      name: 'Pickup Address',
      description: 'Where to pick up the package',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 3, 
      name: 'Delivery Address',
      description: 'Where to deliver the package',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 4, 
      name: 'Package Details',
      description: 'Package dimensions and specifications',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress" className="py-8">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li 
                key={step.name} 
                className={`relative ${
                  stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20 flex-1' : ''
                }`}
              >
                {stepIdx !== steps.length - 1 && (
                  <div 
                    className="absolute top-4 left-0 -right-8 sm:-right-20"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="h-0.5 w-full">
                        <div className="h-full relative">
                          <div className="absolute inset-0 bg-gray-200" />
                          <div 
                            className="absolute inset-0 bg-indigo-600 transition-all duration-500 ease-in-out"
                            style={{ 
                              transform: `scaleX(${currentStep > step.id ? 1 : 0})`,
                              transformOrigin: 'left'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative flex flex-col items-center group">
                  <span className="h-9 flex items-center">
                    <span 
                      className={`
                        relative z-10 w-10 h-10 flex items-center justify-center rounded-full
                        transition-all duration-300 ease-in-out
                        ${currentStep > step.id 
                          ? 'bg-indigo-600 hover:bg-indigo-800' 
                          : currentStep === step.id
                            ? 'border-2 border-indigo-600 bg-white' 
                            : 'border-2 border-gray-300 bg-white hover:border-gray-400'
                        }
                      `}
                    >
                      {currentStep > step.id ? (
                        <CheckIcon className="w-6 h-6 text-white" />
                      ) : (
                        <span className={`w-6 h-6 ${
                          currentStep >= step.id ? 'text-indigo-600' : 'text-gray-400'
                        }`}>
                          {step.icon}
                        </span>
                      )}
                    </span>
                  </span>

                  <div className="mt-3">
                    <span 
                      className={`
                        block text-sm font-medium text-center
                        ${currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'}
                      `}
                    >
                      {step.name}
                    </span>
                    <span 
                      className={`
                        block text-xs mt-1 text-center max-w-[120px] mx-auto
                        ${currentStep >= step.id ? 'text-gray-700' : 'text-gray-400'}
                      `}
                    >
                      {step.description}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

// CheckIcon component
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path 
      fillRule="evenodd" 
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
      clipRule="evenodd" 
    />
  </svg>
);

// Navigation buttons component
interface StepNavigationProps {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
  onComplete: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onNext,
  onBack,
  isLastStep,
  onComplete
}) => {
  const dispatch = useAppDispatch();
  const { formData } = useFormContext();

  const handleSaveForLater = async () => {
    try {
      console.log('Saving draft order with payload:', formData); // Debug log
      
      const payload = {
        draft_order: {
          deliveryAddressId: formData.deliveryAddress?.id,
          deliveryAddress: formData.deliveryAddress,
          pickupAddressId: formData.pickupAddress?.id,
          pickupAddress: formData.pickupAddress,
          packageDetails: {
            height: formData.packageHeight.toString(),
            weight: {
              value: formData.packageWeight.toString(),
              type: "kilogram"
            },
            breadth: formData.packageWidth.toString(),
            length: formData.packageLength.toString(),
            hazardous: formData.isFragile
          },
          order_items: formData.items.map(item => [
            { key: "name", value: item.name },
            { key: "price", value: item.price.toString() },
            { key: "item_quantity", value: item.quantity.toString() },
            { key: "weight", value: item.weight.toString(), type: "kilogram" }
          ]),
          orderDetails: {
            retail_order_payment_method: "POST-FULFILLMENT",
            retail_order_id: formData.franchiseOrderId,
            retail_order_amount: formData.franchiseOrderAmount.toString(),
            retail_order_category: {
              value: formData.franchiseOrderCategory,
              label: formData.franchiseOrderCategory
            },
            retail_order_preparation_time: {
              value: `PT${formData.preparationTime}M`,
              label: `Within ${formData.preparationTime} minutes`
            },
            retail_order_category_type: {
              label: formData.categoryType,
              value: formData.categoryType
            }
          },
          readytoShip: formData.isReadyForShipment,
          rto: formData.isRtoEligible
        }
      };

      const result = await dispatch(createDraftOrder(payload)).unwrap();
      console.log('Draft order created successfully:', result); // Debug log
      
      // Show success message and optionally redirect
      toast.success('Draft order saved successfully');
      // Optional: Redirect to orders page or clear form
      
    } catch (error) {
      console.error('Failed to save draft order:', error); // Debug log
      toast.error('Failed to save draft order. Please try again.');
    }
  };

  return (
    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={currentStep === 1}
        className={`${
          currentStep === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        Back
      </button>
      <div className="flex space-x-3">
        {isLastStep && (
          <button
            type="button"
            onClick={handleSaveForLater}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Save for Later
          </button>
        )}
        <button
          type="button"
          onClick={isLastStep ? onComplete : onNext}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLastStep ? 'Search Logistics' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

// First, define the shared input styles
const inputClasses = "block w-full px-4 py-1 text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 sm:text-sm mt-1";

// Basic Order Information section
const BasicOrderInformation: React.FC = () => {
  const { formData, setFormData } = useFormContext();
  
  const selectClasses = "block w-full px-4 py-1 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 sm:text-sm mt-1";
  
  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Basic Order Information</h3>
      </div>

      {/* Form Fields - Now in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Franchise Order Id */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
              Franchise Order Id
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm ml-2">#</span>
            </div>
            <input
              type="text"
              value={formData.franchiseOrderId}
              onChange={(e) => setFormData(prev => ({ ...prev, franchiseOrderId: e.target.value }))}
              placeholder="Enter order ID"
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Order Amount */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            Order Amount
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm ml-2">₹</span>
            </div>
            <input
              type="number"
              value={formData.franchiseOrderAmount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, franchiseOrderAmount: Number(e.target.value) }))}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Order Category */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            Order Category
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={formData.franchiseOrderCategory}
            onChange={(e) => setFormData(prev => ({ ...prev, franchiseOrderCategory: e.target.value }))}
            className={selectClasses}
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="food">Food</option>
            <option value="furniture">Furniture</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Order Preparation Time */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            Order Preparation Time
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={formData.preparationTime}
            onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
            className={selectClasses}
          >
            <option value="">Select Preparation Time</option>
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="45">45 Minutes</option>
            <option value="60">60 Minutes</option>
          </select>
        </div>

        {/* Payment Type
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            Payment Type
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={formData.paymentType}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentType: e.target.value as 'COD' | 'Prepaid' }))}
            className={selectClasses}
          >
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="Prepaid">Prepaid</option>
          </select>
        </div> */}

        {/* Order Category Type */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            Order Category Type
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={formData.categoryType}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryType: e.target.value }))}
            className={selectClasses}
          >
            <option value="">Select Category Type</option>
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="45">45 Minutes</option>
            <option value="60">60 Minutes</option>
          </select>
        </div>

        {/* Additional Options - Full width */}
        <div className="pt-4 md:col-span-2">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Additional Options</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isReadyForShipment}
                onChange={(e) => setFormData(prev => ({ ...prev, isReadyForShipment: e.target.checked }))}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-100"
              />
              <span className="ml-2 text-sm text-gray-700">Order Ready for Shipment</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRtoEligible}
                onChange={(e) => setFormData(prev => ({ ...prev, isRtoEligible: e.target.checked }))}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-100"
              />
              <span className="ml-2 text-sm text-gray-700">RTO Eligible</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// OrderDetailsForm component with side-by-side layout
const OrderDetailsForm: React.FC = () => {
  const { formData, setFormData } = useFormContext();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Left Column - Basic Order Information */}
      <div className="w-full">
        <div className="bg-white rounded-lg border border-gray-200">
          
          <BasicOrderInformation />
        </div>
      </div>

      {/* Right Column - Order Items */}
      <div className="w-full">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <span className="bg-indigo-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
              Order Items
            </h3>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                items: [...prev.items, { name: '', price: 0, quantity: 1, weight: 0 }]
              }))}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>

          {/* Order Items List */}
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 text-xs font-bold">
                      {index + 1}
                    </span>
                    Item #{index + 1}
                  </h4>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        items: prev.items.filter((_, i) => i !== index)
                      }))}
                      className="inline-flex items-center text-sm text-red-600 hover:text-red-900"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter item name"
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[index].name = e.target.value;
                        setFormData(prev => ({ ...prev, items: newItems }));
                      }}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm ml-2">₹</span>
                      </div>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.price || ''}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[index].price = Number(e.target.value);
                          setFormData(prev => ({ ...prev, items: newItems }));
                        }}
                        className={`${inputClasses} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="1"
                      value={item.quantity || ''}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[index].quantity = Number(e.target.value);
                        setFormData(prev => ({ ...prev, items: newItems }));
                      }}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Weight (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.1"
                      placeholder="0.0"
                      value={item.weight || ''}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[index].weight = Number(e.target.value);
                        setFormData(prev => ({ ...prev, items: newItems }));
                      }}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this component
const AddAddressModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<PickupAddress, 'id'>) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ name: '', address: '', city: '', state: '', pincode: '', phone: '', isDefault: false });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />

        {/* Modal */}
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Add New Pickup Address</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={inputClasses}
                placeholder="e.g., Main Warehouse"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className={inputClasses}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className={inputClasses}
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className={inputClasses}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                  className={inputClasses}
                  placeholder="Pincode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={inputClasses}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">Set as default pickup address</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Address Table Component that can be reused for both pickup and delivery
const AddressTable: React.FC<{
  addresses: Address[];
  selectedId?: string;
  onSelect: (address: Address) => void;
  type: 'pickup' | 'delivery';
}> = ({ addresses, selectedId, onSelect, type }) => {
  return (
    <div className="mt-4 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Select
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Address
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    City
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    State
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Pincode
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Contact
                  </th>
                  {type === 'delivery' && (
                    <>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Alt. Contact
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Landmark
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {addresses.map((address) => (
                  <tr 
                    key={address.id}
                    className={`${selectedId === address.id ? 'bg-indigo-50' : 'hover:bg-gray-50'} cursor-pointer`}
                    onClick={() => onSelect(address)}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <input
                        type="radio"
                        checked={selectedId === address.id}
                        onChange={() => onSelect(address)}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{address.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{address.address}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{address.city}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{address.state}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{address.pincode}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{address.phone}</td>
                    {type === 'delivery' && (
                      <>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {address.alternatePhone || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {address.landmark || '-'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pickup Address Step Component
const PickupAddressStep: React.FC = () => {
  const { formData, setFormData, pickupAddresses } = useFormContext();

  const handleSelectAddress = (address: Address) => {
    setFormData(prev => ({
      ...prev,
      pickupAddress: address
    }));
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Select Pickup Address</h3>
      </div>

      <AddressTable
        addresses={pickupAddresses}
        selectedId={formData.pickupAddress?.id}
        onSelect={handleSelectAddress}
        type="pickup"
      />
    </div>
  );
};

// Delivery Address Step Component
const DeliveryAddressStep: React.FC = () => {
  const { formData, setFormData, deliveryAddresses } = useFormContext();

  const handleSelectAddress = (address: Address) => {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: address
    }));
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Select Delivery Address</h3>
      </div>

      <AddressTable
        addresses={deliveryAddresses}
        selectedId={formData.deliveryAddress?.id}
        onSelect={handleSelectAddress}
        type="delivery"
      />
    </div>
  );
};

const PackageDetails: React.FC = () => {
  const { formData, setFormData } = useFormContext();
  
  const selectClasses = "block w-full px-4 py-1 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 sm:text-sm mt-1";
  
  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Package Details</h3>
      </div>

      {/* Form Fields in Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Package Length */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            Package Length
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.packageLength || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, packageLength: Number(e.target.value) }))}
              className={inputClasses}
              placeholder="Length in cm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">cm</span>
            </div>
          </div>
        </div>

        {/* Package Width */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            Package Breadth
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.packageWidth || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, packageWidth: Number(e.target.value) }))}
              className={inputClasses}
              placeholder="Width in cm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">cm</span>
            </div>
          </div>
        </div>

        {/* Package Height */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            Package Height
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.packageHeight || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, packageHeight: Number(e.target.value) }))}
              className={inputClasses}
              placeholder="Height in cm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">cm</span>
            </div>
          </div>
        </div>

        {/* Package Weight */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
            Package Dead Weight
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.packageWeight || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, packageWeight: Number(e.target.value) }))}
              className={inputClasses}
              placeholder="Weight in kg"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Additional Options</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isFragile}
              onChange={(e) => setFormData(prev => ({ ...prev, isFragile: e.target.checked }))}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-100"
            />
            <span className="ml-2 text-sm text-gray-700">Hazard/Fragile</span>
          </label>
        </div>
      </div>
    </div>
  );
};

// Main CreateOrder component
const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { formData } = useFormContext();

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = () => {
    // Add null checks for the optional fields
    const searchParams = new URLSearchParams({
      from: formData.pickupAddress?.city || 'Unknown',
      to: formData.deliveryAddress?.city || 'Unknown',
      length: formData.packageLength?.toString() || '0',
      breadth: formData.packageWidth?.toString() || '0',
      height: formData.packageHeight?.toString() || '0',
      weight: formData.packageWeight?.toString() || '0',
    });

    navigate(`/search-logistics?${searchParams.toString()}`);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return <OrderDetailsForm />;
      case 2:
        return <PickupAddressStep />;
      case 3:
        return <DeliveryAddressStep />;
      case 4:
        return <PackageDetails />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40">
        <ProgressBar currentStep={currentStep} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {renderStepContent(currentStep)}
            
            <StepNavigation
              currentStep={currentStep}
              onNext={handleNext}
              onBack={handleBack}
              isLastStep={currentStep === 4}
              onComplete={handleComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap the CreateOrder component with FormProvider in the parent component or route
const CreateOrderPage: React.FC = () => {
  return (
    <FormProvider>
      <CreateOrder />
    </FormProvider>
  );
};

export default CreateOrderPage;