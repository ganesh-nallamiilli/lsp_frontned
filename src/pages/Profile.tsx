import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Lock, Save, PlusCircle, Pencil, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserProfile, updateUserProfile, createPickupAddress, fetchPickupAddresses, fetchDeliveryAddresses, createDeliveryAddress, updatePickupAddress, updateDeliveryAddress, deletePickupAddress, deleteDeliveryAddress } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import TimeInput from '../components/TimeInput';
import { useDispatch } from 'react-redux';

interface ProfileForm {
  storeName: string;
  website: string;
  fullName: string;
  phoneNumber: string;
  gstNumber: string;
  panNumber: string;
  email: string;
  logo: string;
  address: {
    building: string;
    locality: string;
    city: string;
    state: string;
    zipCode: string;
  };
  bankDetails: {
    settlement_type: string;
    upi_address: string;
    beneficiary_name: string;
    settlement_bank_account_no: string;
    bank_name: string;
    settlement_ifsc_code: string;
  };
  shopTime: {
    start: string;
    end: string;
  };
}

interface Address {
  id: string;
  type: 'pickup' | 'delivery';
  isDefault: boolean;
  building: string;
  locality: string;
  city: string;
  state: string;
  zipCode: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

type UserType = 'STANDALONE_USER' | 'STANDALONE_ADMIN';

const getUserType = (): UserType => {
  return (localStorage.getItem('user_type') as UserType) || 'STANDALONE_USER';
};

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuthStore();
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const [activeTab, setActiveTab] = useState('basic');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editMode, setEditMode] = useState({
    basic: false,
    bank: false
  });
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [userType, setUserType] = useState<UserType>('STANDALONE_USER');
  const [signature, setSignature] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string>('');

  const [form, setForm] = useState({
    storeName: '',
    website: '',
    fullName: '',
    phoneNumber: '',
    gstNumber: '',
    panNumber: '',
    email: '',
    logo: '',
    address: {
      building: '',
      locality: '',
      city: '',
      state: '',
      zipCode: '',
    },
    bankDetails: {
      settlement_type: 'upi',
      upi_address: '',
      beneficiary_name: '',
      settlement_bank_account_no: '',
      bank_name: '',
      settlement_ifsc_code: '',
    },
    shopTime: {
      start: '',
      end: ''
    }
  });

  const pickupAddresses = useAppSelector((state) => state.auth.pickupAddresses);
  const deliveryAddresses = useAppSelector((state) => state.auth.deliveryAddresses);

  // Add email validation regex
  const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Add phone validation regex near EMAIL_REGEX
  const PHONE_REGEX = /^[6-9]\d{9}$/;

  // Add these regex constants near EMAIL_REGEX and PHONE_REGEX
  const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  // Add these state declarations near other error states
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [gstError, setGstError] = useState('');
  const [panError, setPanError] = useState('');

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile) {
      setForm({
        storeName: userProfile.store_name || '',
        website: userProfile.website || '',
        fullName: userProfile.name || '',
        phoneNumber: userProfile.mobile_number || '',
        gstNumber: userProfile.gst_number || '',
        panNumber: userProfile.pan_number || '',
        email: userProfile.email || '',
        logo: '',
        address: {
          building: userProfile.gst_address?.building || '',
          locality: userProfile.gst_address?.locality || '',
          city: userProfile.gst_address?.city || '',
          state: userProfile.gst_address?.state || '',
          zipCode: userProfile.gst_address?.area_code || '',
        },
        bankDetails: {
          settlement_type: userProfile.bank_details?.settlement_type || 'upi',
          upi_address: userProfile.bank_details?.upi_address || '',
          beneficiary_name: userProfile.bank_details?.beneficiary_name || '',
          settlement_bank_account_no: userProfile.bank_details?.settlement_bank_account_no || '',
          bank_name: userProfile.bank_details?.bank_name || '',
          settlement_ifsc_code: userProfile.bank_details?.settlement_ifsc_code || '',
        },
        shopTime: {
          start: userProfile.provider_store_details?.time?.range?.start || '',
          end: userProfile.provider_store_details?.time?.range?.end || ''
        }
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (activeTab === 'addresses') {
      dispatch(fetchPickupAddresses());
      dispatch(fetchDeliveryAddresses());
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    setUserType(getUserType());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      // Clear email error when user starts typing
      setEmailError('');
      
      // Validate email
      if (value && !EMAIL_REGEX.test(value)) {
        setEmailError('Please enter a valid email address');
      }
    }
    
    if (name === 'phoneNumber') {
      // Clear phone error when user starts typing
      setPhoneError('');
      
      // Remove any non-digit characters
      const cleanedValue = value.replace(/\D/g, '');
      
      // Validate phone number
      if (cleanedValue && !PHONE_REGEX.test(cleanedValue)) {
        setPhoneError('Please enter a valid 10-digit Indian mobile number');
      }
      
      // Update form with cleaned value
      setForm(prev => ({
        ...prev,
        [name]: cleanedValue
      }));
      return;
    }
    
    if (name === 'gstNumber') {
      // Clear GST error when user starts typing
      setGstError('');
      
      // Convert to uppercase
      const upperValue = value.toUpperCase();
      
      // Only update if within maxLength
      if (upperValue.length <= 15) {
        // Validate GST format
        if (upperValue && !GST_REGEX.test(upperValue)) {
          setGstError('Please enter a valid GST number');
        }
        
        // Update form with uppercase value
        setForm(prev => ({
          ...prev,
          [name]: upperValue
        }));
      }
      return;
    }
    
    if (name === 'panNumber') {
      // Clear PAN error when user starts typing
      setPanError('');
      
      // Convert to uppercase
      const upperValue = value.toUpperCase();
      
      // Only update if within maxLength
      if (upperValue.length <= 10) {
        // Validate PAN format
        if (upperValue && !PAN_REGEX.test(upperValue)) {
          setPanError('Please enter a valid PAN number');
        }
        
        // Update form with uppercase value
        setForm(prev => ({
          ...prev,
          [name]: upperValue
        }));
      }
      return;
    }
    
    if (name.startsWith('shopTime.')) {
      const timeField = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        shopTime: {
          ...prev.shopTime,
          [timeField]: value
        }
      }));
    } else if (name.startsWith('bankDetails.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value
        }
      }));
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveBasicInfo = async () => {
    try {
      // Validate GST if provided
      if (form.gstNumber && !GST_REGEX.test(form.gstNumber)) {
        setGstError('Please enter a valid GST number');
        return;
      }

      // Validate PAN if provided
      if (form.panNumber && !PAN_REGEX.test(form.panNumber)) {
        setPanError('Please enter a valid PAN number');
        return;
      }

      // Validate email before saving
      if (!EMAIL_REGEX.test(form.email)) {
        setEmailError('Please enter a valid email address');
        return;
      }

      // Validate phone number before saving
      if (!PHONE_REGEX.test(form.phoneNumber)) {
        setPhoneError('Please enter a valid 10-digit Indian mobile number');
        return;
      }

      await dispatch(updateUserProfile({
        name: form.fullName,
        store_name: form.storeName,
        website: form.website,
        mobile_number: form.phoneNumber,
        email: form.email,
        gst_number: form.gstNumber,
        pan_number: form.panNumber,
        gst_address: {
          building: form.address.building,
          locality: form.address.locality,
          city: form.address.city,
          state: form.address.state,
          area_code: form.address.zipCode,
        },
        provider_store_details: {
          time: {
            range: {
              start: form.shopTime.start,
              end: form.shopTime.end
            }
          }
        }
      })).unwrap();
      
      setEditMode(prev => ({ ...prev, basic: false }));
      dispatch(fetchUserProfile()); // Refresh the profile data
      toast.success('Basic information updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update basic information');
    }
  };

  const handleSaveAddressForm = async (formData: any) => {
    try {
      await handleSaveAddress(formData);
      setShowAddressModal(false);
      
      if (userProfile?.pickup_addresses) {
        const formattedAddresses = userProfile.pickup_addresses.map(addr => ({
          id: addr.id || String(Math.random()),
          type: 'pickup' as const,
          isDefault: addr.is_default || false,
          building: addr.location?.address?.building || '',
          locality: addr.location?.address?.locality || '',
          city: addr.location?.address?.city || '',
          state: addr.location?.address?.state || '',
          zipCode: addr.location?.address?.area_code || ''
        }));
        setAddresses(formattedAddresses);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const handleSaveAddress = async (formData) => {
    if (formData.type === 'pickup') {
      const workingDays = formData.workingDays.map(day => {
        const daysMap = {
          'Monday': '1', 'Tuesday': '2', 'Wednesday': '3', 'Thursday': '4',
          'Friday': '5', 'Saturday': '6', 'Sunday': '7'
        };
        return daysMap[day];
      }).join(',');

      const payload = {
        person: {
          name: formData.contactPersonName
        },
        contact: {
          phone: formData.phoneNumber,
          email: formData.email
        },
        location: {
          address: {
            name: formData.storeName,
            building: formData.building,
            locality: formData.locality,
            city: formData.city,
            state: formData.state,
            country: 'INDIA',
            area_code: formData.zipCode
          },
          gps: "12.9789845,77.728393"
        },
        provider_store_details: {
          time: {
            days: workingDays,
            schedule: {
              holidays: []
            },
            range: {
              start: formatTimeForApi(formData.shopTime.start),
              end: formatTimeForApi(formData.shopTime.end)
            }
          }
        }
      };

      try {
        let result;
        if (editingAddress?.id) {
          // Update existing address
          result = await dispatch(updatePickupAddress({
            id: editingAddress.id,
            addressData: payload
          })).unwrap();
        } else {
          // Create new address
          result = await dispatch(createPickupAddress(payload)).unwrap();
        }

        if (result.meta.status) {
          toast.success(editingAddress?.id ? 'Pickup address updated successfully' : 'Pickup address created successfully');
          dispatch(fetchPickupAddresses());
          setShowAddressModal(false);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to save pickup address');
      }
    } else {
      const payload = {
        person: {
          name: formData.contactPersonName
        },
        contact: {
          phone: formData.phoneNumber,
          email: formData.email
        },
        location: {
          address: {
            name: formData.storeName || formData.contactPersonName,
            building: formData.building,
            locality: formData.locality,
            city: formData.city,
            state: formData.state,
            country: 'INDIA',
            area_code: formData.zipCode
          },
          gps: "12.9789845,77.728393"
        }
      };

      try {
        let result;
        if (editingAddress?.id) {
          // Update existing delivery address
          result = await dispatch(updateDeliveryAddress({
            id: editingAddress.id,
            addressData: payload
          })).unwrap();
        } else {
          // Create new delivery address
          result = await dispatch(createDeliveryAddress(payload)).unwrap();
        }

        if (result.meta.status) {
          toast.success(editingAddress?.id ? 'Delivery address updated successfully' : 'Delivery address created successfully');
          dispatch(fetchDeliveryAddresses());
          setShowAddressModal(false);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to save delivery address');
      }
    }
  };

  const handleDeleteAddress = async (addressId: string, type: 'pickup' | 'delivery') => {
    try {
      if (type === 'pickup') {
        await dispatch(deletePickupAddress(addressId)).unwrap();
        toast.success('Pickup address deleted successfully');
        dispatch(fetchPickupAddresses()); // Refresh the list
      } else {
        await dispatch(deleteDeliveryAddress(addressId)).unwrap();
        toast.success('Delivery address deleted successfully');
        dispatch(fetchDeliveryAddresses()); // Refresh the list
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to delete ${type} address`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic
    console.log('Profile updated:', form);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic
  };

  const toggleEdit = (section: 'basic' | 'address' | 'bank') => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = async (section: 'basic' | 'address' | 'bank') => {
    try {
      // Add your API call to save the data here
      // For example:
      // await updateProfile(form);
      toggleEdit(section);
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handleSaveBankDetails = async () => {
    try {
      await dispatch(updateUserProfile({
        bank_details: {
          settlement_type: form.bankDetails.settlement_type,
          upi_address: form.bankDetails.upi_address,
          beneficiary_name: form.bankDetails.beneficiary_name,
          settlement_bank_account_no: form.bankDetails.settlement_bank_account_no,
          bank_name: form.bankDetails.bank_name,
          settlement_ifsc_code: form.bankDetails.settlement_ifsc_code
        }
      })).unwrap();
      
      setEditMode(prev => ({ ...prev, bank: false }));
      dispatch(fetchUserProfile()); // Refresh the profile data
      toast.success('Bank details updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update bank details');
    }
  };

  const renderBasicInformation = () => {
    if (!editMode.basic) {
      return (
        <div id="profile-basic-information-container" className="space-y-4">
          <div id="profile-basic-information-container-profile-image" className="flex items-center space-x-4">
            <span id="profile-basic-information-container-profile-image-label" className="text-gray-500 w-32">Profile Image:</span>
            <div id="profile-basic-information-container-profile-image-image" className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
              {form.logo ? (
                <img id="profile-basic-information-container-profile-image-image-img" src={form.logo} alt="Profile" className="h-full w-full rounded-full object-cover" />
              ) : (
                <User id="profile-basic-information-container-profile-image-image-user-icon" className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span id="profile-basic-information-container-store-name-label" className="text-gray-500 w-32">Store Name:</span>
            <span id="profile-basic-information-container-store-name-value" className="text-gray-900">{userProfile?.store_name || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span id="profile-basic-information-container-website-label" className="text-gray-500 w-32">Website:</span>
            <span id="profile-basic-information-container-website-value" className="text-gray-900">{form.website || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span id="profile-basic-information-container-full-name-label" className="text-gray-500 w-32">Full Name:</span>
            <span id="profile-basic-information-container-full-name-value" className="text-gray-900">{userProfile?.name || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span id="profile-basic-information-container-email-label" className="text-gray-500 w-32">Email:</span>
            <span id="profile-basic-information-container-email-value" className="text-gray-900">{form.email}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span id="profile-basic-information-container-phone-label" className="text-gray-500 w-32">Phone:</span>
            <span id="profile-basic-information-container-phone-value" className="text-gray-900">{userProfile?.mobile_number || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span id="profile-basic-information-container-gst-number-label" className="text-gray-500 w-32">GST Number:</span>
            <span id="profile-basic-information-container-gst-number-value" className="text-gray-900">{userProfile?.gst_number || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span id="profile-basic-information-container-pan-number-label" className="text-gray-500 w-32">PAN Number:</span>
            <span id="profile-basic-information-container-pan-number-value" className="text-gray-900">{userProfile?.pan_number || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span id="profile-basic-information-container-status-label" className="text-gray-500 w-32">Status:</span>
            <div>
              <span id="profile-basic-information-container-status-value" className={`px-2 py-1 rounded-full text-sm ${
                userProfile?.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {userProfile?.is_active ? 'Active' : 'Inactive'}
              </span>
              
              {/* Show draft reasons if status is inactive */}
              {!userProfile?.is_active && userProfile?.draft_reasons && userProfile.draft_reasons.length > 0 && (
                <div id="profile-basic-information-container-status-reasons" className="mt-2">
                  <p id="profile-basic-information-container-status-reasons-label" className="text-sm font-medium text-gray-700 mb-1">Reasons:</p>
                  <ul id="profile-basic-information-container-status-reasons-list" className="list-disc list-inside space-y-1">
                    {userProfile.draft_reasons.map((reason, index) => (
                      <li key={index} className="text-sm text-red-600 ml-2">
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div id="profile-basic-information-container-gst-address" className="mt-6 border-t pt-6">
            <h5 id="profile-basic-information-container-gst-address-label" className="text-sm font-medium text-gray-900 mb-4">GST Address</h5>
            <div id="profile-basic-information-container-gst-address-details" className="space-y-2">
              <div id="profile-basic-information-container-gst-address-details-building" className="flex items-center space-x-4">
                <span id="profile-basic-information-container-gst-address-details-building-label" className="text-gray-500 w-32">Building:</span>
                <span id="profile-basic-information-container-gst-address-details-building-value" className="text-gray-900">{userProfile?.gst_address?.building || '-'}</span>
              </div>
              <div id="profile-basic-information-container-gst-address-details-locality" className="flex items-center space-x-4">
                <span id="profile-basic-information-container-gst-address-details-locality-label" className="text-gray-500 w-32">Locality:</span>
                <span id="profile-basic-information-container-gst-address-details-locality-value" className="text-gray-900">{userProfile?.gst_address?.locality || '-'}</span>
              </div>
              <div id="profile-basic-information-container-gst-address-details-city" className="flex items-center space-x-4">
                <span id="profile-basic-information-container-gst-address-details-city-label" className="text-gray-500 w-32">City:</span>
                <span id="profile-basic-information-container-gst-address-details-city-value" className="text-gray-900">{userProfile?.gst_address?.city || '-'}</span>
              </div>
              <div id="profile-basic-information-container-gst-address-details-state" className="flex items-center space-x-4">
                <span id="profile-basic-information-container-gst-address-details-state-label" className="text-gray-500 w-32">State:</span>
                <span id="profile-basic-information-container-gst-address-details-state-value" className="text-gray-900">{userProfile?.gst_address?.state || '-'}</span>
              </div>
              <div id="profile-basic-information-container-gst-address-details-area-code" className="flex items-center space-x-4">
                <span id="profile-basic-information-container-gst-address-details-area-code-label" className="text-gray-500 w-32">Area Code:</span>
                <span id="profile-basic-information-container-gst-address-details-area-code-value" className="text-gray-900">{userProfile?.gst_address?.area_code || '-'}</span>
              </div>
            </div>
          </div>
          
          {userType === 'STANDALONE_ADMIN' && (
            <div id="profile-basic-information-container-signature" className="flex items-center space-x-4">
              <span id="profile-basic-information-container-signature-label" className="text-gray-500 w-32">Signature:</span>
              {signaturePreview ? (
                <img 
                  id="profile-basic-information-container-signature-image"
                  src={signaturePreview} 
                  alt="Signature" 
                  className="h-20 max-w-[200px] object-contain"
                />
              ) : (
                <span id="profile-basic-information-container-signature-no-signature" className="text-gray-900">No signature uploaded</span>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div id="profile-basic-information-container-form" className="space-y-6">
        <div id="profile-basic-information-container-form-grid" className="grid grid-cols-2 gap-6">
          <div>
            <label id="profile-basic-information-container-form-grid-store-name-label" className="block text-sm font-medium text-gray-700 mb-2">
              Store Name *
            </label>
            <input
              type="text"
              name="storeName"
              value={form.storeName}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
            />
          </div>
          <div>
            <label id="profile-basic-information-container-form-grid-website-label" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
            />
          </div>
          <div>
            <label id="profile-basic-information-container-form-grid-full-name-label" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
            />
          </div>
          <div>
            <label id="profile-basic-information-container-form-grid-email-label" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                emailError ? 'border-red-500' : 'border-gray-300'
              } ${emailError ? 'bg-red-50' : 'bg-white'}`}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">
                {emailError}
              </p>
            )}
          </div>
          <div>
            <label id="profile-basic-information-container-form-grid-phone-number-label" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+91</span>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-2.5 rounded-lg border ${
                  phoneError ? 'border-red-500' : 'border-gray-300'
                } ${phoneError ? 'bg-red-50' : 'bg-white'}`}
                maxLength={10}
                placeholder="Enter 10-digit number"
              />
            </div>
            {phoneError && (
              <p className="mt-1 text-sm text-red-600">
                {phoneError}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GST Number *
            </label>
            <input
              type="text"
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                gstError ? 'border-red-500' : 'border-gray-300'
              } ${gstError ? 'bg-red-50' : 'bg-white'}`}
              maxLength={15}
              placeholder="22AAAAA0000A1Z5"
            />
            {gstError && (
              <p className="mt-1 text-sm text-red-600">
                {gstError}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Format: 22AAAAA0000A1Z5 (2 digits state code + 10 characters PAN + 1 entity number + 1 Z + 1 check digit)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PAN Number *
            </label>
            <input
              type="text"
              name="panNumber"
              value={form.panNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                panError ? 'border-red-500' : 'border-gray-300'
              } ${panError ? 'bg-red-50' : 'bg-white'}`}
              maxLength={10}
              placeholder="AAAAA0000A"
            />
            {panError && (
              <p className="mt-1 text-sm text-red-600">
                {panError}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Format: AAAAA0000A (5 letters + 4 numbers + 1 letter)
            </p>
          </div>
        </div>

        {/* GST Address Section */}
        <div className="mt-8">
          <h5 className="text-sm font-medium text-gray-900 mb-4">GST Address</h5>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label id="profile-basic-information-container-form-grid-building-label" className="block text-sm font-medium text-gray-700 mb-2">
                Building *
              </label>
              <input
                type="text"
                id="profile-basic-information-container-form-grid-building-input"
                name="address.building"
                value={form.address.building}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label id="profile-basic-information-container-form-grid-locality-label" className="block text-sm font-medium text-gray-700 mb-2">
                Locality *  
              </label>
              <input
                type="text"
                id="profile-basic-information-container-form-grid-locality-input"
                name="address.locality"
                value={form.address.locality}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label id="profile-basic-information-container-form-grid-city-label" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="profile-basic-information-container-form-grid-city-input"
                name="address.city"
                value={form.address.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label id="profile-basic-information-container-form-grid-state-label" className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                id="profile-basic-information-container-form-grid-state-select"
                  name="address.state"
                value={form.address.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label id="profile-basic-information-container-form-grid-area-code-label" className="block text-sm font-medium text-gray-700 mb-2">
                Area Code *
              </label>
              <input
                id="profile-basic-information-container-form-grid-area-code-input"
                type="text"
                name="address.zipCode"
                value={form.address.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                maxLength={6}
              />
            </div>
          </div>
        </div>
        
        {userType === 'STANDALONE_ADMIN' && (
          <div>
            <label id="profile-basic-information-container-form-signature-label" className="block text-sm font-medium text-gray-700 mb-2">
              Signature * 
            </label>
            <div id="profile-basic-information-container-form-signature-upload" className="flex items-center space-x-4">
              <input
                
                type="file"
                accept="image/*"
                onChange={handleSignatureChange}
                className="hidden"
                id="signature-upload"
              />
              <label
                id="profile-basic-information-container-form-signature-upload-label"
                htmlFor="signature-upload"
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Upload Signature
              </label>
              {signaturePreview && (
                <img 
                  id="profile-basic-information-container-form-signature-image"
                  src={signaturePreview} 
                  alt="Signature Preview" 
                  className="h-20 max-w-[200px] object-contain"
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAddressInformation = () => {
    if (!editMode.address) {
      return (
        <div id="profile-address-information-container" className="space-y-4">
          <div id="profile-address-information-container-building" className="flex items-center space-x-4">
            <span id="profile-address-information-container-building-label" className="text-gray-500 w-32">Building:</span>
            <span id="profile-address-information-container-building-value" className="text-gray-900">{userProfile?.gst_address?.building || '-'}</span>
          </div>
          <div id="profile-address-information-container-locality" className="flex items-center space-x-4">
            <span id="profile-address-information-container-locality-label" className="text-gray-500 w-32">Locality:</span>
            <span id="profile-address-information-container-locality-value" className="text-gray-900">{userProfile?.gst_address?.locality || '-'}</span>
          </div>
          <div id="profile-address-information-container-city" className="flex items-center space-x-4">
            <span id="profile-address-information-container-city-label" className="text-gray-500 w-32">City:</span>
            <span id="profile-address-information-container-city-value" className="text-gray-900">{userProfile?.gst_address?.city || '-'}</span>
          </div>
          <div id="profile-address-information-container-state" className="flex items-center space-x-4">
            <span id="profile-address-information-container-state-label" className="text-gray-500 w-32">State:</span>
            <span id="profile-address-information-container-state-value" className="text-gray-900">{userProfile?.gst_address?.state || '-'}</span>
          </div>
          <div id="profile-address-information-container-zip-code" className="flex items-center space-x-4">
            <span id="profile-address-information-container-zip-code-label" className="text-gray-500 w-32">Zip Code:</span>
            <span id="profile-address-information-container-zip-code-value" className="text-gray-900">{userProfile?.gst_address?.area_code || '-'}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label id="profile-address-information-container-form-grid-building-label" className="block text-sm font-medium text-gray-700 mb-2">
            Building *
          </label>
          <input
            id="profile-address-information-container-form-grid-building-input"
            type="text"
            name="address.building"
            value={form.address.building}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
          />
        </div>
        <div>
          <label id="profile-address-information-container-form-grid-locality-label" className="block text-sm font-medium text-gray-700 mb-2">
            Locality *
          </label>
          <input
            id="profile-address-information-container-form-grid-locality-input"
            type="text"
            name="address.locality"
            value={form.address.locality}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
          />
        </div>
        <div>
          <label id="profile-address-information-container-form-grid-city-label" className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            id="profile-address-information-container-form-grid-city-input"
            type="text"
            name="address.city"
            value={form.address.city}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
          />
        </div>
        <div>
          <label id="profile-address-information-container-form-grid-state-label" className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            id="profile-address-information-container-form-grid-state-select"
            name="address.state"
            value={form.address.state}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label id="profile-address-information-container-form-grid-zip-code-label" className="block text-sm font-medium text-gray-700 mb-2">
            Zip Code *    
          </label>
          <input
            id="profile-address-information-container-form-grid-zip-code-input"
            type="text"
            name="address.zipCode"
            value={form.address.zipCode}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
            maxLength={6}
          />
        </div>
      </div>
    );
  };

  const renderBankDetails = () => {
    if (!editMode.bank) {
      return (
        <div id="profile-bank-details-container" className="space-y-4">
          <div id="profile-bank-details-container-settlement-type" className="flex items-center space-x-4">
            <span id="profile-bank-details-container-settlement-type-label" className="text-gray-500 w-32">Settlement Type:</span>
            <span id="profile-bank-details-container-settlement-type-value" className="text-gray-900 capitalize">{form.bankDetails.settlement_type}</span>
          </div>
          {form.bankDetails.settlement_type === 'upi' ? (
            <div id="profile-bank-details-container-upi-id" className="flex items-center space-x-4">
              <span id="profile-bank-details-container-upi-id-label" className="text-gray-500 w-32">UPI ID:</span>
              <span id="profile-bank-details-container-upi-id-value" className="text-gray-900">{form.bankDetails.upi_address}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <span id="profile-bank-details-container-beneficiary-name-label" className="text-gray-500 w-32">Beneficiary Name:</span>
                <span id="profile-bank-details-container-beneficiary-name-value" className="text-gray-900">{form.bankDetails.beneficiary_name}</span>
              </div>
              <div id="profile-bank-details-container-account-number" className="flex items-center space-x-4">
                <span id="profile-bank-details-container-account-number-label" className="text-gray-500 w-32">Account Number:</span>
                <span id="profile-bank-details-container-account-number-value" className="text-gray-900">{form.bankDetails.settlement_bank_account_no}</span>
              </div>
              <div id="profile-bank-details-container-bank-name" className="flex items-center space-x-4">
                <span id="profile-bank-details-container-bank-name-label" className="text-gray-500 w-32">Bank Name:</span>
                <span id="profile-bank-details-container-bank-name-value" className="text-gray-900">{form.bankDetails.bank_name}</span>
              </div>
              <div id="profile-bank-details-container-ifsc-code" className="flex items-center space-x-4">
                <span id="profile-bank-details-container-ifsc-code-label" className="text-gray-500 w-32">IFSC Code:</span>
                <span id="profile-bank-details-container-ifsc-code-value" className="text-gray-900">{form.bankDetails.settlement_ifsc_code}</span>
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <div id="profile-bank-details-container-form" className="space-y-6">
        <div>
          <label id="profile-bank-details-container-form-settlement-type-label" className="block text-sm font-medium text-gray-700 mb-2">
            Settlement Type *
          </label>
          <select
            id="profile-bank-details-container-form-settlement-type-select"
            name="bankDetails.settlement_type"
            value={form.bankDetails.settlement_type}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
          >
            <option id="profile-bank-details-container-form-settlement-type-select-option-upi" value="upi">UPI</option>
            <option id="profile-bank-details-container-form-settlement-type-select-option-bank" value="bank">Bank Account</option>
          </select>
        </div>

        {form.bankDetails.settlement_type === 'upi' ? (
          <div>
            <label id="profile-bank-details-container-form-upi-id-label" className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID *
            </label>
            <input
              id="profile-bank-details-container-form-upi-id-input"
              type="text"
              name="bankDetails.upi_address"
              value={form.bankDetails.upi_address}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label id="profile-bank-details-container-form-beneficiary-name-label" className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiary Name *
              </label>
              <input
                id="profile-bank-details-container-form-beneficiary-name-input"
                type="text"
                name="bankDetails.beneficiary_name"
                value={form.bankDetails.beneficiary_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label id="profile-bank-details-container-form-account-number-label" className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                id="profile-bank-details-container-form-account-number-input"
                type="text"
                name="bankDetails.settlement_bank_account_no"
                value={form.bankDetails.settlement_bank_account_no}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label id="profile-bank-details-container-form-bank-name-label" className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                id="profile-bank-details-container-form-bank-name-input"
                type="text"
                name="bankDetails.bank_name"
                value={form.bankDetails.bank_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label id="profile-bank-details-container-form-ifsc-code-label" className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code *
              </label>
              <input
                id="profile-bank-details-container-form-ifsc-code-input"
                type="text"
                name="bankDetails.settlement_ifsc_code"
                value={form.bankDetails.settlement_ifsc_code}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAddressCard = (address: any, type: 'pickup' | 'delivery') => {
    return (
      <div id={`profile-address-card-${address.id}`} key={address.id} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="space-y-4">
          {/* Header with actions */}
          <div id={`profile-address-card-${address.id}-header`} className="flex justify-between items-start">
            <div id={`profile-address-card-${address.id}-header-title`} className="space-y-1">
              {type === 'pickup' ? (
                // Pickup address header
                <h4 id={`profile-address-card-${address.id}-header-title-text`} className="font-medium text-gray-900">
                  {address.location?.address?.name}
                </h4>
              ) : (
                // Delivery address header - Contact Person Name prominent
                <>
                  <h4 id={`profile-address-card-${address.id}-header-title-text`} className="font-medium text-gray-900">
                    {address.person?.name}
                  </h4>
                  {/* <p className="text-sm text-gray-500">
                    {address.location?.address?.name}
                  </p> */}
                </>
              )}
            </div>
            <div id={`profile-address-card-${address.id}-header-actions`} className="flex items-center gap-2">
              <button
                id={`profile-address-card-${address.id}-header-actions-edit-button`}
                onClick={() => {
                  setEditingAddress({
                    id: address.id,
                    type,
                    building: address.location?.address?.building,
                    locality: address.location?.address?.locality,
                    city: address.location?.address?.city,
                    state: address.location?.address?.state,
                    zipCode: address.location?.address?.area_code,
                    storeName: address.location?.address?.name,
                    contactPersonName: address.person?.name,
                    email: address.contact?.email,
                    phoneNumber: address.contact?.phone,
                    ...(type === 'pickup' && {
                      workingDays: address.provider_store_details?.time?.days?.split(',').map(day => {
                        const daysMap = {
                          '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday',
                          '5': 'Friday', '6': 'Saturday', '7': 'Sunday'
                        };
                        return daysMap[day];
                      }) || [],
                      shopTime: {
                        start: address.provider_store_details?.time?.range?.start?.replace(/^(\d{2})(\d{2})$/, '$1:$2') || '',
                        end: address.provider_store_details?.time?.range?.end?.replace(/^(\d{2})(\d{2})$/, '$1:$2') || ''
                      }
                    })
                  });
                  setShowAddressModal(true);
                }}
                className="p-1.5 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50"
              >
                <Pencil id={`profile-address-card-${address.id}-header-actions-edit-button-icon`} className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteAddress(address.id, type)}
                className="p-1.5 text-gray-600 hover:text-red-600 rounded-md hover:bg-red-50"
              >
                <Trash2 id={`profile-address-card-${address.id}-header-actions-delete-button-icon`} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <div id={`profile-address-card-${address.id}-contact-details-phone`} className="flex items-center gap-2 text-sm text-gray-600">
              <Phone id={`profile-address-card-${address.id}-contact-details-phone-icon`} className="w-4 h-4" />
              <span>{address.contact?.phone}</span>
            </div>
            <div id={`profile-address-card-${address.id}-contact-details-email`} className="flex items-center gap-2 text-sm text-gray-600">
              <Mail id={`profile-address-card-${address.id}-contact-details-email-icon`} className="w-4 h-4" />
              <span>{address.contact?.email}</span>
            </div>
          </div>

          {/* Address Details */}
          <div id={`profile-address-card-${address.id}-address-details`} className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin id={`profile-address-card-${address.id}-address-details-icon`} className="w-4 h-4 mt-0.5" />
            <span id={`profile-address-card-${address.id}-address-details-text`}>
              {[
                address.location?.address?.building,
                address.location?.address?.locality,
                address.location?.address?.city,
                address.location?.address?.state,
                address.location?.address?.area_code
              ].filter(Boolean).join(', ')}
            </span>
          </div>

          {/* Shop Timings - Only for Pickup Addresses */}
          {type === 'pickup' && (
            <div id={`profile-address-card-${address.id}-shop-timings`} className="border-t border-gray-100 pt-3 mt-3">
              <div id={`profile-address-card-${address.id}-shop-timings-content`} className="text-sm text-gray-600">
                <div id={`profile-address-card-${address.id}-shop-timings-working-hours`} className="mb-1">
                  <span id={`profile-address-card-${address.id}-shop-timings-working-hours-label`} className="font-medium">Working Hours: </span>
                  {address.provider_store_details?.time?.range?.start?.replace(/^(\d{2})(\d{2})$/, '$1:$2')} - 
                  {address.provider_store_details?.time?.range?.end?.replace(/^(\d{2})(\d{2})$/, '$1:$2')}
                </div>
                <div>
                  <span id={`profile-address-card-${address.id}-shop-timings-working-days-label`} className="font-medium">Working Days: </span>
                  {address.provider_store_details?.time?.days?.split(',').map(day => {
                    const daysMap = {
                      '1': 'Mon', '2': 'Tue', '3': 'Wed', '4': 'Thu',
                      '5': 'Fri', '6': 'Sat', '7': 'Sun'
                    };
                    return daysMap[day];
                  }).join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAddressTab = () => {
    return (
      <div id="profile-address-tab-container" className="space-y-6">
        {/* Pickup Addresses */}
        <div>
          <div id="profile-address-tab-container-pickup-addresses-header" className="flex justify-between items-center mb-4">
            <h4 id="profile-address-tab-container-pickup-addresses-header-title" className="text-lg font-medium">Pickup Addresses</h4>
            <button
              id="profile-address-tab-container-pickup-addresses-header-add-new-address-button"
              onClick={() => {
                setEditingAddress(null);
                setShowAddressModal(true);
              }}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Address
            </button>
          </div>
          <div id="profile-address-tab-container-pickup-addresses-content" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pickupAddresses.map(address => renderAddressCard(address, 'pickup'))}
          </div>
        </div>

        {/* Delivery Addresses */}
        <div>
          <div id="profile-address-tab-container-delivery-addresses-header" className="flex justify-between items-center mb-4">
            <h4 id="profile-address-tab-container-delivery-addresses-header-title" className="text-lg font-medium">Delivery Addresses</h4>
            <button
              id="profile-address-tab-container-delivery-addresses-header-add-new-address-button"
              onClick={() => {
                setEditingAddress(null);
                setShowAddressModal(true);
              }}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <PlusCircle id="profile-address-tab-container-delivery-addresses-header-add-new-address-button-icon" className="w-4 h-4" />
              Add New Address
            </button>
          </div>
          <div id="profile-address-tab-container-delivery-addresses-content" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryAddresses.map(address => renderAddressCard(address, 'delivery'))}
          </div>
        </div>
      </div>
    );
  };

  const AddressModal = ({ isOpen, onClose, address, onSave }) => {
    const [form, setForm] = useState({
      type: 'pickup',
      isDefault: false,
      building: '',
      locality: '',
      city: '',
      state: '',
      zipCode: '',
      storeName: '',
      contactPersonName: '',
      email: '',
      phoneNumber: '',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shopTime: {
        start: '',
        end: ''
      }
    });

    // Initialize form with address data when editing
    useEffect(() => {
      if (address) {
        setForm({
          type: address.type || 'pickup',
          isDefault: address.isDefault || false,
          building: address.building || '',
          locality: address.locality || '',
          city: address.city || '',
          state: address.state || '',
          zipCode: address.zipCode || '',
          storeName: address.storeName || '',
          contactPersonName: address.contactPersonName || '',
          email: address.email || '',
          phoneNumber: address.phoneNumber || '',
          workingDays: address.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          shopTime: {
            start: address.shopTime?.start || '',
            end: address.shopTime?.end || ''
          }
        });
      }
    }, [address]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      
      if (name.startsWith('shopTime.')) {
        const timeField = name.split('.')[1];
        setForm(prev => ({
          ...prev,
          shopTime: {
            ...prev.shopTime,
            [timeField]: value
          }
        }));
      } else {
        setForm(prev => ({
          ...prev,
          [name]: value
        }));
      }
    };

    const handleWorkingDaysChange = (day: string) => {
      setForm(prev => ({
        ...prev,
        workingDays: prev.workingDays.includes(day)
          ? prev.workingDays.filter(d => d !== day)
          : [...prev.workingDays, day]
      }));
    };

    const handleSave = async () => {
      try {
        if (form.type === 'pickup') {
          const pickupAddressData = {
            person: {
              name: form.contactPersonName
            },
            contact: {
              phone: form.phoneNumber,
              email: form.email
            },
            location: {
              address: {
                name: form.storeName,
                building: form.building,
                locality: form.locality,
                city: form.city,
                state: form.state,
                country: 'India',
                area_code: form.zipCode
              },
              gps: ''
            },
            provider_store_details: {
              time: {
                days: form.workingDays.map(day => {
                  const daysMap = {
                    'Monday': '1', 'Tuesday': '2', 'Wednesday': '3', 
                    'Thursday': '4', 'Friday': '5', 'Saturday': '6', 'Sunday': '7'
                  };
                  return daysMap[day];
                }).join(','),
                schedule: {
                  holidays: []
                },
                range: {
                  start: form.shopTime.start.replace(':', ''),
                  end: form.shopTime.end.replace(':', '')
                }
              }
            }
          };

          if (editingAddress) {
            await dispatch(updatePickupAddress({ 
              id: editingAddress.id, 
              addressData: pickupAddressData 
            })).unwrap();
          } else {
            await dispatch(createPickupAddress(pickupAddressData)).unwrap();
          }
        } else {
          const deliveryAddressData = {
            person: {
              name: form.contactPersonName
            },
            contact: {
              phone: form.phoneNumber,
              email: form.email
            },
            location: {
              address: {
                name: form.contactPersonName,
                building: form.building,
                locality: form.locality,
                city: form.city,
                state: form.state,
                country: 'India',
                area_code: form.zipCode
              },
              gps: ''
            }
          };

          if (editingAddress) {
            await dispatch(updateDeliveryAddress({
              id: editingAddress.id,
              addressData: deliveryAddressData
            })).unwrap();
          } else {
            await dispatch(createDeliveryAddress(deliveryAddressData)).unwrap();
          }
        }

        // Refresh the address lists
        dispatch(fetchPickupAddresses());
        dispatch(fetchDeliveryAddresses());
        
        onClose();
      } catch (error) {
        console.error('Error saving address:', error);
        toast.error('Failed to save address');
      }
    };

    if (!isOpen) return null;

    return (
      <>
        {/* Overlay - Increased z-index */}
        <div id="profile-address-modal-overlay" className="fixed inset-0 bg-black/50 z-[150]" onClick={onClose} />
        
        {/* Modal Container - Increased z-index */}
        <div id="profile-address-modal-container" className="fixed inset-0 z-[160] overflow-y-auto">
          <div id="profile-address-modal-content" className="flex min-h-full items-center justify-center p-4">
            <div id="profile-address-modal-card" className="bg-white rounded-xl w-full max-w-xl shadow-2xl">
              {/* Modal Header */}
              <div id="profile-address-modal-header" className="sticky top-0 bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h3 id="profile-address-modal-header-title" className="text-lg font-semibold text-gray-900">
                  {address ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X id="profile-address-modal-header-close-button-icon" className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div id="profile-address-modal-body" className="p-4 overflow-y-auto max-h-[calc(100vh-180px)]">
                <div id="profile-address-modal-body-content" className="space-y-4">
                  {/* Address Type Selection */}
                  <div id="profile-address-modal-body-content-address-type-selection" className="bg-gray-50 p-3 rounded-lg">
                    <label id="profile-address-modal-body-content-address-type-selection-label" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Address Type
                    </label>
                    <div id="profile-address-modal-body-content-address-type-selection-options" className="flex gap-3">
                      <label id="profile-address-modal-body-content-address-type-selection-options-pickup-label" className="flex-1">
                        <input
                          id="profile-address-modal-body-content-address-type-selection-options-pickup-input"
                          type="radio"
                          name="type"
                          value="pickup"
                          checked={form.type === 'pickup'}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div id="profile-address-modal-body-content-address-type-selection-options-pickup-option" className="flex items-center justify-center p-4 border rounded-lg cursor-pointer
                                      peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
                          <span id="profile-address-modal-body-content-address-type-selection-options-pickup-option-title" className="text-sm font-medium peer-checked:text-blue-600">Pickup Address</span>
                        </div>
                      </label>
                      <label id="profile-address-modal-body-content-address-type-selection-options-delivery-label" className="flex-1">
                        <input
                          id="profile-address-modal-body-content-address-type-selection-options-delivery-input"
                          type="radio"
                          name="type"
                          value="delivery"
                          checked={form.type === 'delivery'}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div id="profile-address-modal-body-content-address-type-selection-options-delivery-option" className="flex items-center justify-center p-4 border rounded-lg cursor-pointer
                                      peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
                          <span id="profile-address-modal-body-content-address-type-selection-options-delivery-option-title" className="text-sm font-medium peer-checked:text-blue-600">Delivery Address</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Form Fields in Grid Layout */}
                  <div className="grid gap-4">
                    {/* Store Name - Only for pickup */}
                    {form.type === 'pickup' && (
                      <div>
                        <label id="profile-address-modal-body-content-form-fields-store-name-label" className="block text-sm font-medium text-gray-700 mb-1">
                          Store Name *
                        </label>
                        <input
                          id="profile-address-modal-body-content-form-fields-store-name-input"
                          type="text"
                          name="storeName"
                          value={form.storeName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                          required
                        />
                      </div>
                    )}

                    {/* Contact Person */}
                    <div>
                      <label id="profile-address-modal-body-content-form-fields-contact-person-name-label" className={`block text-sm font-medium mb-1 ${
                        form.type === 'delivery' ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        Contact Person Name *
                        {form.type === 'delivery' && (
                          <span id="profile-address-modal-body-content-form-fields-contact-person-name-label-description" className="text-xs text-gray-500 ml-1">(This will be used as address name)</span>
                        )}
                      </label>
                      <input
                        id="profile-address-modal-body-content-form-fields-contact-person-name-input"
                        type="text"
                        name="contactPersonName"
                        value={form.contactPersonName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                        required
                      />
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label id="profile-address-modal-body-content-form-fields-email-label" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          id="profile-address-modal-body-content-form-fields-email-input"
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label id="profile-address-modal-body-content-form-fields-phone-number-label" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          id="profile-address-modal-body-content-form-fields-phone-number-input"
                          type="tel"
                          name="phoneNumber"
                          value={form.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Address Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label id="profile-address-modal-body-content-form-fields-building-label" className="block text-sm font-medium text-gray-700 mb-1">
                          Building *
                        </label>
                        <input
                          id="profile-address-modal-body-content-form-fields-building-input"
                          type="text"
                          name="building"
                          value={form.building}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label id="profile-address-modal-body-content-form-fields-locality-label" className="block text-sm font-medium text-gray-700 mb-1">
                          Locality *
                        </label>
                        <input
                          id="profile-address-modal-body-content-form-fields-locality-input"
                          type="text"
                          name="locality"
                          value={form.locality}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label id="profile-address-modal-body-content-form-fields-city-label" className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          id="profile-address-modal-body-content-form-fields-city-input"
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label id="profile-address-modal-body-content-form-fields-state-label" className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          id="profile-address-modal-body-content-form-fields-state-input"
                          type="text"
                          name="state"
                          value={form.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label id="profile-address-modal-body-content-form-fields-zip-code-label" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          id="profile-address-modal-body-content-form-fields-zip-code-input"
                          type="text"
                          name="zipCode"
                          value={form.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Working Days and Shop Timings - Only for pickup addresses */}
                    {form.type === 'pickup' && (
                      <>
                        {/* Working Days */}
                        <div>
                          <label id="profile-address-modal-body-content-form-fields-working-days-label" className="block text-sm font-medium text-gray-700 mb-2">
                            Working Days *
                          </label>
                          <div id="profile-address-modal-body-content-form-fields-working-days-options" className="grid grid-cols-4 gap-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                              <label key={day} className="flex items-center space-x-2">
                                <input
                                  id="profile-address-modal-body-content-form-fields-working-days-input"
                                  type="checkbox"
                                  checked={form.workingDays.includes(day)}
                                  onChange={() => handleWorkingDaysChange(day)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">{day.slice(0, 3)}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Shop Timings */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label id="profile-address-modal-body-content-form-fields-opening-time-label" className="block text-sm font-medium text-gray-700 mb-1">
                              Opening Time *
                            </label>
                            <input
                              id="profile-address-modal-body-content-form-fields-opening-time-input"
                              type="time"
                              name="shopTime.start"
                              value={form.shopTime.start}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label id="profile-address-modal-body-content-form-fields-closing-time-label" className="block text-sm font-medium text-gray-700 mb-1">
                              Closing Time *
                            </label>
                            <input
                              id="profile-address-modal-body-content-form-fields-closing-time-input"
                              type="time"
                              name="shopTime.end"
                              value={form.shopTime.end}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div id="profile-address-modal-body-content-form-fields-footer" className="sticky bottom-0 bg-white px-4 py-3 border-t border-gray-100">
                <div id="profile-address-modal-body-content-form-fields-footer-actions" className="flex justify-end gap-3">
                  <button
                    id="profile-address-modal-body-content-form-fields-footer-actions-cancel-button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    id="profile-address-modal-body-content-form-fields-footer-actions-save-button"
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const formatTimeForApi = (time: string) => {
    // Convert "HH:mm" to "HHmm"
    return time.replace(':', '');
  };

  const renderTabs = () => {
    if (userType === 'STANDALONE_ADMIN') {
      return (
        <nav id="profile-tabs-container-tabs" className="-mb-px flex space-x-8">
          <button
            id="profile-tabs-container-tabs-basic-information-button"
            onClick={() => setActiveTab('basic')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Basic Information
          </button>
        </nav>
      );
    }

    return (
      <nav id="profile-tabs-container-tabs" className="-mb-px flex space-x-8">
        <button
          id="profile-tabs-container-tabs-basic-information-button"
          onClick={() => setActiveTab('basic')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'basic'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Basic Information
        </button>
        <button
          id="profile-tabs-container-tabs-bank-details-button"
          onClick={() => setActiveTab('bank')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'bank'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Bank Details
        </button>
        <button
          id="profile-tabs-container-tabs-addresses-button"
          onClick={() => setActiveTab('addresses')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'addresses'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Addresses
        </button>
      </nav>
    );
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSignature(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <div id="profile-container" className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div id="profile-tabs-container" className="mb-8">
          <div id="profile-tabs-container-tabs" className="border-b border-gray-200">
            {renderTabs()}
          </div>
        </div>

        {/* Tab Content */}
        <div id="profile-tab-content-container" className="space-y-6">
          {activeTab === 'basic' && (
            <div id="profile-basic-information-container" className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
              <div id="profile-basic-information-container-header" className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div>
                  <h4 id="profile-basic-information-container-header-title" className="text-base font-medium text-gray-900">Basic Information</h4>
                  <p id="profile-basic-information-container-header-description" className="text-sm text-gray-500 mt-1">Manage your basic profile information</p>
                </div>
                <button
                  id="profile-basic-information-container-header-edit-button"
                  onClick={() => editMode.basic ? handleSaveBasicInfo() : toggleEdit('basic')}
                  className="px-4 py-2 text-sm flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  {editMode.basic ? (
                    <>
                      <Save id="profile-basic-information-container-header-edit-button-save-icon" className="w-4 h-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Pencil id="profile-basic-information-container-header-edit-button-pencil-icon" className="w-4 h-4" />
                      Edit Details
                    </>
                  )}
                </button>
              </div>
              <div id="profile-basic-information-container-body" className="p-6">{renderBasicInformation()}</div>
            </div>
          )}

          {/* Only show these tabs for STANDALONE_USER */}
          {userType === 'STANDALONE_USER' && (
            <>
              {activeTab === 'addresses' && (
                <div id="profile-addresses-container">{renderAddressTab()}</div>
              )}

              {activeTab === 'bank' && (
                <div id="profile-bank-details-container" className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
                  <div id="profile-bank-details-container-header" className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    <div>
                      <h4 id="profile-bank-details-container-header-title" className="text-base font-medium text-gray-900">Bank Details</h4>
                      <p id="profile-bank-details-container-header-description" className="text-sm text-gray-500 mt-1">Manage your bank account information</p>
                    </div>
                    <button
                      onClick={() => editMode.bank ? handleSaveBankDetails() : toggleEdit('bank')}
                      className="px-4 py-2 text-sm flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      id="profile-bank-details-container-header-edit-button"
                    >
                      {editMode.bank ? (
                        <>
                          <Save id="profile-bank-details-container-header-edit-button-save-icon" className="w-4 h-4" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Pencil id="profile-bank-details-container-header-edit-button-pencil-icon" className="w-4 h-4" />
                          Edit Details
                        </>
                      )}
                    </button>
                  </div>
                  <div id="profile-bank-details-container-body" className="p-6">{renderBankDetails()}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Address Modal - Only for STANDALONE_USER */}
      {userType === 'STANDALONE_USER' && showAddressModal && (
        <AddressModal
          isOpen={showAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          address={editingAddress}
          onSave={handleSaveAddressForm}
        />
      )}
    </>
  );
};

export default Profile;