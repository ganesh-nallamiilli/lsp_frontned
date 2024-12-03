import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Upload } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { createFranchise, createMarkup } from '../store/slices/franchiseSlice';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    const franchiseData = {
      "name": formData.franchiseName,
      "mobile_number": formData.mobile,
      "email": formData.email,
      "store_name": formData.franchiseName,
      "profile_image": "",
      "gst_number": formData.gstNumber,
      "pan_number": formData.panNumber,
      "name_as_per_pan": formData.nameAsPerPan,
      "gst_address": {
          "name": formData.ownerName,
          "locality": formData.locality,
          "building": formData.building,
          "city": formData.city,
          "state": formData.stateProvince,
          "area_code": formData.zipPostalCode,
          "country": "India"
      },
      "user_types": [
          {
              "name": "FRANCHISE"
          }
      ],
      "access_template_ids": [
          3
      ],
      "is_active": true,
      "bank_details": {
          "settlement_type": formData.settlementType,
          "beneficiary_name": formData.accountHolderName,
          "upi_address": formData.upiId,
          "settlement_bank_account_no": formData.accountNumber,
          "settlement_ifsc_code": formData.ifscCode,
          "bank_name": formData.bankName
      },
      "draft_reasons": [],
      "wallet": {
          "total_credit": "0.00",
          "total_debit": "0.00",
          "total_available": "0.00"
      },
      "is_franchise": true
    }

    try {
      const response = await dispatch(createFranchise(franchiseData)).unwrap();
      setFranchiseUserId(response.data.id);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error creating franchise:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Transform and create markups one by one
      for (const [service, details] of Object.entries(formData.markupDetails)) {
        // Convert camelCase to Title Case for category_type
        const categoryType = service
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());

        const markupPayload = {
          category_type: categoryType,
          markup_type: details.type.charAt(0).toUpperCase() + details.type.slice(1), // Capitalize first letter
          markup_value: parseFloat(details.value),
          created_by_id: franchise_user_id
        };

        // Create markup for each service type
        await dispatch(createMarkup(markupPayload)).unwrap();
      }
      
      // Navigate after all markups are created
      navigate('/franchise');
    } catch (error) {
      console.error('Error creating franchise markup:', error);
    } finally {
      setLoading(false);
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

  // Stepper component
  const Stepper = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center w-2/3">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center flex-1">
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center
              ${currentStep >= 1 
                ? 'border-blue-600 bg-blue-600 text-white' 
                : 'border-gray-300 text-gray-500'
              }`}
            >
              {currentStep > 1 ? <Check className="w-6 h-6" /> : "1"}
            </div>
            <div className={`mt-2 text-xs font-medium uppercase
              ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              Basic Details
            </div>
          </div>

          {/* Connecting Line */}
          <div className={`flex-auto border-t-2 transition duration-500 ease-in-out
            ${currentStep > 1 ? 'border-blue-600' : 'border-gray-300'}`}>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center flex-1">
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center
              ${currentStep === 2
                ? 'border-blue-600 bg-blue-600 text-white' 
                : 'border-gray-300 text-gray-500'
              }`}
            >
              2
            </div>
            <div className={`mt-2 text-xs font-medium uppercase
              ${currentStep === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              Markup Details
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
        <h1 className="text-2xl font-bold">Create New Franchise</h1>
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
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone Number"
                  />
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email Address"
                  />
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="GST Number"
                  />
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
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="PAN Number"
                    />
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
                      State/Province <span className="text-red-500">*</span>
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
                      ZIP/Postal Code <span className="text-red-500">*</span>
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Account Number"
                  />
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="IFSC Code"
                  />
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
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {currentStep === 1 ? 'Next' : loading ? 'Creating...' : 'Create Franchise'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFranchise; 