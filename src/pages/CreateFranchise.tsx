import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Upload, Edit } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createFranchise, createMarkup, fetchFranchiseById, fetchMarkupDetails, updateFranchise, updateMarkup } from '../store/slices/franchiseSlice';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface FranchiseFormData {
  // Franchise Details
  franchiseName: string;
  ownerName: string;
  email: string;
  mobile: string;
  gstNumber: string;
  panNumber: string;
  nameAsPerPan: string;
  franchiseLogo?: File;
  building: string;
  locality: string;
  city: string;
  stateProvince: string;
  zipPostalCode: string;
  // Bank Details
  settlementType: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  upiId: string;
  // Markup Details
  markupDetails: {
    nextDayDelivery: { type: string; value: string };
    standardDelivery: { type: string; value: string };
    expressDelivery: { type: string; value: string };
    immediateDelivery: { type: string; value: string };
    sameDayDelivery: { type: string; value: string };
  };
}

const CreateFranchise: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { currentFranchise, markupDetails } = useAppSelector((state) => state.franchise);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [franchise_user_id, setFranchiseUserId] = useState<number>(0);
  const [formData, setFormData] = useState<FranchiseFormData>({
    // Step 1 initial values
    franchiseName: '',
    ownerName: '',
    email: '',
    mobile: '',
    gstNumber: '',
    panNumber: '',
    nameAsPerPan: '',
    franchiseLogo: undefined,
    building: '',
    locality: '',
    city: '',
    stateProvince: '',
    zipPostalCode: '',
    // Step 2 initial values
    forwardingCharges: '',
    codCharges: '',
    rtoCharges: '',
    reversePickupCharges: '',
    surfaceMarkup: '',
    airMarkup: '',
    // Bank Details
    settlementType: '',
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    upiId: '',
    // Markup Details
    markupDetails: {
      nextDayDelivery: { type: 'flat', value: '' },
      standardDelivery: { type: 'percentage', value: '' },
      expressDelivery: { type: 'flat', value: '' },
      immediateDelivery: { type: 'percentage', value: '' },
      sameDayDelivery: { type: 'percentage', value: '' }
    }
  });
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchFranchiseById(id));
      dispatch(fetchMarkupDetails(id));
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentFranchise) {
      setFormData({
        ...formData,
        franchiseName: currentFranchise.store_name,
        ownerName: currentFranchise.gst_address.name,
        email: currentFranchise.email,
        mobile: currentFranchise.mobile_number,
        gstNumber: currentFranchise.gst_number,
        panNumber: currentFranchise.pan_number,
        nameAsPerPan: currentFranchise.name_as_per_pan,
        locality: currentFranchise.gst_address.locality,
        building: currentFranchise.gst_address.building,
        city: currentFranchise.gst_address.city,
        stateProvince: currentFranchise.gst_address.state,
        zipPostalCode: currentFranchise.gst_address.area_code,
        settlementType: currentFranchise.bank_details.settlement_type,
        accountHolderName: currentFranchise.bank_details.beneficiary_name,
        accountNumber: currentFranchise.bank_details.settlement_bank_account_no,
        bankName: currentFranchise.bank_details.bank_name,
        ifscCode: currentFranchise.bank_details.settlement_ifsc_code,
        upiId: currentFranchise.bank_details.upi_address,
        // Replace the markupDetails instead of merging
        markupDetails: markupDetails.reduce((acc, markup) => ({
          ...acc,
          [markup.category_type.toLowerCase().replace(/\s+/g, '')]: {
            type: markup.markup_type.toLowerCase(),
            value: markup.markup_value.toString()
          }
        }), {}) // Remove formData.markupDetails from here
      });
    }
  }, [currentFranchise, markupDetails, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For GST and PAN, convert to uppercase
    const processedValue = ['gstNumber', 'panNumber', 'ifscCode'].includes(name) 
      ? value.toUpperCase() 
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Validate the field
    const error = validateField(name, processedValue);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        franchiseLogo: file
      }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Validate first step data
      if (!validateFirstStep()) {
        return;
      }

      // Prepare the franchise data according to the API requirements
      const franchiseData = {
        name: formData.ownerName,
        mobile_number: formData.mobile,
        email: formData.email,
        store_name: formData.franchiseName,
        profile_image: formData.franchiseLogo,
        gst_number: formData.gstNumber,
        pan_number: formData.panNumber,
        name_as_per_pan: formData.nameAsPerPan,
        gst_address: {
          building: formData.building,
          locality: formData.locality,
          city: formData.city,
          state: formData.stateProvince,
          area_code: formData.zipPostalCode,
          country: "India"
        },
        bank_details: {
          settlement_type: formData.settlementType,
          beneficiary_name: formData.accountHolderName,
          upi_address: formData.upiId || '',
          settlement_bank_account_no: formData.accountNumber,
          settlement_ifsc_code: formData.ifscCode,
          bank_name: formData.bankName
        },
        user_types: [{ name: "FRANCHISE_USER" }],
        access_template_ids: [1],
        is_active: true
      };

      console.log('Sending franchise data:', franchiseData); // Debug log

      if (isEditMode && id) {
        const result = await dispatch(updateFranchise({ 
          id, 
          franchiseData 
        })).unwrap();
        console.log('Update response:', result); // Debug log
      } else {
        const result = await dispatch(createFranchise(franchiseData)).unwrap();
        console.log('Create response:', result); // Debug log
        // Store the newly created franchise ID if needed
        if (result?.data?.id) {
          localStorage.setItem('currentFranchiseId', result.data.id.toString());
        }
      }

      // Move to next step only if API call was successful
      setCurrentStep(2);
      toast.success('Franchise details saved successfully');
      
    } catch (error: any) {
      console.error('Error in handleNext:', error);
      toast.error(error?.message || 'Failed to save franchise details');
    } finally {
      setLoading(false);
    }
  };

  const validateFirstStep = () => {
    const errors: { [key: string]: string } = {};

    // Validate required fields
    if (!formData.franchiseName) errors.franchiseName = 'Franchise name is required';
    if (!formData.ownerName) errors.ownerName = 'Owner name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.mobile) errors.mobile = 'Mobile number is required';
    if (!formData.panNumber) errors.panNumber = 'PAN number is required';
    if (!formData.nameAsPerPan) errors.nameAsPerPan = 'Name as per PAN is required';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Validate mobile number
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = 'Mobile number must be 10 digits';
    }

    // Validate PAN format (assuming Indian PAN format)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (formData.panNumber && !panRegex.test(formData.panNumber)) {
      errors.panNumber = 'Invalid PAN format';
    }

    // If GST number is provided, validate its format
    if (formData.gstNumber && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/.test(formData.gstNumber)) {
      errors.gstNumber = 'Invalid GST format';
    }

    // Update field errors
    setFieldErrors(errors);

    // Return true if no errors, false otherwise
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      const franchiseId = isEditMode ? id : localStorage.getItem('currentFranchiseId');
      
      if (!franchiseId) {
        throw new Error('Franchise ID not found');
      }

      // Prepare markup details
      const markupData = {
        markup_details: Object.entries(formData.markupDetails).map(([type, details]) => ({
          shipping_service_type: type,
          markup_type: details.type,
          markup_value: parseFloat(details.value)
        }))
      };

      console.log('Sending markup data:', markupData); // Debug log

      // Update franchise with markup details
      const result = await dispatch(updateFranchise({
        id: franchiseId,
        franchiseData: markupData
      })).unwrap();

      console.log('Final update response:', result); // Debug log

      toast.success('Franchise saved successfully');
      navigate('/franchises');
      
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      toast.error(error?.message || 'Failed to save franchise');
    } finally {
      setLoading(false);
      // Clean up
      localStorage.removeItem('currentFranchiseId');
    }
  };

  const handleMarkupChange = (
    service: keyof typeof formData.markupDetails,
    field: 'type' | 'value',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      markupDetails: {
        ...prev.markupDetails,
        [service]: {
          ...prev.markupDetails[service],
          [field]: value
        }
      }
    }));
  };

  const handleBack = async () => {
    if (currentStep === 2) {
      try {
        setLoading(true);
        
        // Store the current form data in localStorage to persist it
        localStorage.setItem('franchiseFormData', JSON.stringify(formData));

        // If we're in edit mode, update the franchise data
        if (isEditMode && id) {
          const franchiseData = {
            name: formData.ownerName,
            mobile_number: formData.mobile,
            email: formData.email,
            store_name: formData.franchiseName,
            profile_image: formData.franchiseLogo,
            gst_number: formData.gstNumber,
            pan_number: formData.panNumber,
            name_as_per_pan: formData.nameAsPerPan,
            gst_address: {
              building: formData.building,
              locality: formData.locality,
              city: formData.city,
              state: formData.stateProvince,
              area_code: formData.zipPostalCode,
              country: "India"
            },
            bank_details: {
              settlement_type: formData.settlementType,
              beneficiary_name: formData.accountHolderName,
              upi_address: formData.upiId || '',
              settlement_bank_account_no: formData.accountNumber,
              settlement_ifsc_code: formData.ifscCode,
              bank_name: formData.bankName
            }
          };

          await dispatch(updateFranchise({ 
            id, 
            franchiseData 
          })).unwrap();
        }

        // Set current step to 1 and ensure edit mode
        setCurrentStep(1);
        
        // If not already in edit mode, get the franchise ID from localStorage
        const franchiseId = id || localStorage.getItem('currentFranchiseId');
        
        if (franchiseId) {
          // Fetch the latest franchise data
          await dispatch(fetchFranchiseById(franchiseId));
          await dispatch(fetchMarkupDetails(franchiseId));
        }

      } catch (error) {
        console.error('Error handling back:', error);
        toast.error('Failed to update franchise details');
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(1);
    }
  };

  // Add this useEffect to handle data restoration when component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem('franchiseFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }

    // Cleanup when component unmounts
    return () => {
      localStorage.removeItem('franchiseFormData');
    };
  }, []);

  // Update the useEffect that handles fetching franchise data
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchFranchiseById(id));
      dispatch(fetchMarkupDetails(id));
    } else {
      // Check if we have saved form data
      const savedFormData = localStorage.getItem('franchiseFormData');
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
    }
  }, [dispatch, id, isEditMode]);

  // Stepper component
  const Stepper = () => (
    <div id="create-franchise-stepper" className="mb-8">
      <div id="create-franchise-stepper-container" className="flex items-center justify-center">
        <div id="create-franchise-stepper-steps-container" className="flex items-center w-2/3">
          {/* Step 1 */}
          <div id="create-franchise-stepper-step-1" className="relative flex flex-col items-center flex-1">
            <div id="create-franchise-stepper-step-1-circle" className={`w-12 h-12 rounded-full border-2 flex items-center justify-center
              ${currentStep >= 1 
                ? 'border-blue-600 bg-blue-600 text-white' 
                : 'border-gray-300 text-gray-500'
              }`}
            >
              {currentStep > 1 ? <Check className="w-6 h-6" /> : "1"}
            </div>
            <div id="create-franchise-stepper-step-1-title" className={`mt-2 text-xs font-medium uppercase
              ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              Basic Details
            </div>
          </div>

          {/* Connecting Line */}
          <div className={`flex-auto border-t-2 transition duration-500 ease-in-out
            ${currentStep > 1 ? 'border-blue-600' : 'border-gray-300'}`}>
          </div>

          {/* Step 2 */}
          <div id="create-franchise-stepper-step-2" className="relative flex flex-col items-center flex-1">
            <div id="create-franchise-stepper-step-2-circle" className={`w-12 h-12 rounded-full border-2 flex items-center justify-center
              ${currentStep === 2
                ? 'border-blue-600 bg-blue-600 text-white' 
                : 'border-gray-300 text-gray-500'
              }`}
            >
              2
            </div>
            <div id="create-franchise-stepper-step-2-title" className={`mt-2 text-xs font-medium uppercase
              ${currentStep === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              Markup Details
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'gstNumber':
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(value)) {
          return 'Invalid GST Number format. Example: 27AAPFU0939F1Z5';
        }
        
        // Extract PAN from GST and compare if PAN exists
        const panFromGst = value.substring(2, 12);
        if (formData.panNumber && formData.panNumber !== panFromGst) {
          return 'PAN number should match with the PAN in GST';
        }
        break;

      case 'panNumber':
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(value)) {
          return 'Invalid PAN Number format. Example: ABCDE1234F';
        }
        
        // If GST exists, validate PAN against it
        if (formData.gstNumber) {
          const panFromGst = formData.gstNumber.substring(2, 12);
          if (value !== panFromGst) {
            return 'PAN number should match with the PAN in GST';
          }
        }
        break;

      case 'email':
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}$/;
        const domainParts = value.split('@')[1]?.split('.') || [];
        if (domainParts.length > 2 || !emailRegex.test(value)) {
          return 'Invalid email address format';
        }
        break;

      case 'mobile':
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(value)) {
          return 'Invalid mobile number. Must be 10 digits starting with 6-9';
        }
        break;

      case 'zipPostalCode':
        const pincodeRegex = /^[1-9][0-9]{5}$/;
        if (!pincodeRegex.test(value)) {
          return 'Invalid pincode. Must be 6 digits and cannot start with 0';
        }
        break;

      case 'accountNumber':
        if (value.length < 9 || value.length > 18) {
          return 'Account number should be between 9 and 18 digits';
        }
        break;

      case 'ifscCode':
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(value)) {
          return 'Invalid IFSC Code format. Example: HDFC0123456';
        }
        break;

      case 'upiId':
        if (value) {  // Only validate if UPI ID is provided
          const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
          if (!upiRegex.test(value)) {
            return 'Invalid UPI address format. Example: username@upi';
          }
        }
        break;
    }
    return '';
  };

  // Add this useEffect to log the current state for debugging
  useEffect(() => {
    console.log('Current form data:', formData);
    console.log('Current step:', currentStep);
    console.log('Is edit mode:', isEditMode);
  }, [formData, currentStep, isEditMode]);

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/franchise')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Franchise' : 'Create New Franchise'}
        </h1>
      </div>

      <Stepper />

      {/* Form */}
      <form onSubmit={currentStep === 1 ? handleNext : handleSubmit} className="bg-white rounded-lg shadow p-6">
        {currentStep === 1 ? (
          <div className="space-y-8">
            {/* Franchise Details Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Franchise Details</h2>
              <p className="text-sm text-gray-500 mb-6">This information will help us to setup your franchise with our buyer application and go live on ONDC network.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Franchise Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="franchiseName"
                    required
                    value={formData.franchiseName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Franchise Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    required
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Owner Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Phone Number"
                  />
                  {fieldErrors.mobile && (
                    <p className="text-sm text-red-500 mt-1">{fieldErrors.mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Email Address"
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${fieldErrors.gstNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="GST Number"
                  />
                  {fieldErrors.gstNumber && (
                    <p className="text-sm text-red-500 mt-1">{fieldErrors.gstNumber}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      required
                      value={formData.panNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${fieldErrors.panNumber ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="PAN Number"
                    />
                    {fieldErrors.panNumber && (
                      <p className="text-sm text-red-500 mt-1">{fieldErrors.panNumber}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="mt-7 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Verify
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name As Per PAN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nameAsPerPan"
                    required
                    value={formData.nameAsPerPan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name as per PAN"
                  />
                </div>

                {/* Address Fields */}
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Address as per GST</h3>
                </div>

                <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Building <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="building"
                      required
                      value={formData.building}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Building"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Locality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="locality"
                      required
                      value={formData.locality}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Locality"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="stateProvince"
                      required
                      value={formData.stateProvince}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="State/Province"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pin Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipPostalCode"
                      required
                      value={formData.zipPostalCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ZIP/Postal Code"
                    />
                  </div>
                </div>

                {/* Franchise Logo Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Franchise Logo
                  </label>
                  <div className="mt-1 flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative w-24 h-24">
                        <img
                          src={logoPreview}
                          alt="Franchise Logo Preview"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPreview('');
                            setFormData(prev => ({ ...prev, franchiseLogo: undefined }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg">
                        <label className="cursor-pointer flex flex-col items-center">
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="mt-1 text-xs text-gray-500">Change Image</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                        </label>
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      <p>Upload your franchise logo</p>
                      <p>Recommended size: 200x200px</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Bank Details</h2>
              <p className="text-sm text-gray-500 mb-6">This information will help us to setup your transactions and payments with the ONDC network.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Settlement Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="settlementType"
                    required
                    value={formData.settlementType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Settlement Type</option>
                    <option value="neft">NEFT</option>
                    <option value="rtgs">RTGS</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    required
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Account Holder Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    required
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${fieldErrors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Account Number"
                  />
                  {fieldErrors.accountNumber && (
                    <p className="text-sm text-red-500 mt-1">{fieldErrors.accountNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    required
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Bank Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    required
                    value={formData.ifscCode}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${fieldErrors.ifscCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="IFSC Code"
                  />
                  {fieldErrors.ifscCode && (
                    <p className="text-sm text-red-500 mt-1">{fieldErrors.ifscCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI Id
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="UPI Id"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Step 2: Markup Details
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Markup Details</h2>
            <p className="text-sm text-gray-500 mb-6">These are other important details for the franchise.</p>

            <div className="grid grid-cols-1 gap-6">
              {/* Markup Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Shipping Service Type</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Markup Type</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Markup Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(formData.markupDetails).map(([service, details]) => (
                      <tr key={service}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {service.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={details.type}
                            onChange={(e) => handleMarkupChange(service as keyof typeof formData.markupDetails, 'type', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="flat">Flat</option>
                            <option value="percentage">Percentage</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={details.value}
                            onChange={(e) => handleMarkupChange(service as keyof typeof formData.markupDetails, 'value', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter value"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className={`px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Updating...' : 'Back'}
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {currentStep === 1 
              ? (isEditMode ? 'Next' : 'Next')
              : (loading 
                  ? 'Updating...' 
                  : (isEditMode ? 'Update Markup Details' : 'Create Franchise')
                )
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFranchise;  