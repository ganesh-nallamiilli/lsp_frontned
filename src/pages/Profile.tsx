import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Lock, Save, PlusCircle, Pencil, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserProfile, updateUserProfile, createPickupAddress, fetchPickupAddresses, fetchDeliveryAddresses, createDeliveryAddress, updatePickupAddress } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import TimeInput from '../components/TimeInput';

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

  const [form, setForm] = useState<ProfileForm>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await dispatch(updateUserProfile({
        name: form.fullName,
        store_name: form.storeName,
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
      }));
      setEditMode(prev => ({ ...prev, basic: false }));
      toast.success('Basic information updated successfully');
    } catch (error) {
      toast.error('Failed to update basic information');
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
        const result = await dispatch(createDeliveryAddress(payload)).unwrap();
        if (result.meta.status) {
          toast.success('Delivery address created successfully');
          dispatch(fetchDeliveryAddresses());
          onClose();
        }
      } catch (error) {
        toast.error(error.message || 'Failed to create delivery address');
      }
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
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
    const userId = localStorage.getItem('id');
    if (!userId) return;

    const updateData = {
      bank_details: {
        settlement_type: form.bankDetails.settlement_type,
        upi_address: form.bankDetails.upi_address,
        beneficiary_name: form.bankDetails.beneficiary_name,
        settlement_bank_account_no: form.bankDetails.settlement_bank_account_no,
        bank_name: form.bankDetails.bank_name,
        settlement_ifsc_code: form.bankDetails.settlement_ifsc_code
      }
    };

    try {
      await dispatch(updateUserProfile(updateData)).unwrap();
      setEditMode(prev => ({ ...prev, bank: false }));
      dispatch(fetchUserProfile());
    } catch (error) {
      console.error('Failed to update bank details:', error);
    }
  };

  const renderBasicInformation = () => {
    if (!editMode.basic) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Profile Image:</span>
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
              {form.logo ? (
                <img src={form.logo} alt="Profile" className="h-full w-full rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Store Name:</span>
            <span className="text-gray-900">{userProfile?.store_name || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Website:</span>
            <span className="text-gray-900">{form.website || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Full Name:</span>
            <span className="text-gray-900">{userProfile?.name || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Email:</span>
            <span className="text-gray-900">{form.email}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Phone:</span>
            <span className="text-gray-900">{userProfile?.mobile_number || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">GST Number:</span>
            <span className="text-gray-900">{userProfile?.gst_number || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">PAN Number:</span>
            <span className="text-gray-900">{userProfile?.pan_number || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Status:</span>
            <div>
              <span className={`px-2 py-1 rounded-full text-sm ${
                userProfile?.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {userProfile?.is_active ? 'Active' : 'Inactive'}
              </span>
              
              {/* Show draft reasons if status is inactive */}
              {!userProfile?.is_active && userProfile?.draft_reasons && userProfile.draft_reasons.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Reasons:</p>
                  <ul className="list-disc list-inside space-y-1">
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
          <div className="mt-6 border-t pt-6">
            <h5 className="text-sm font-medium text-gray-900 mb-4">GST Address</h5>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 w-32">Building:</span>
                <span className="text-gray-900">{userProfile?.gst_address?.building || '-'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 w-32">Locality:</span>
                <span className="text-gray-900">{userProfile?.gst_address?.locality || '-'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 w-32">City:</span>
                <span className="text-gray-900">{userProfile?.gst_address?.city || '-'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 w-32">State:</span>
                <span className="text-gray-900">{userProfile?.gst_address?.state || '-'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 w-32">Area Code:</span>
                <span className="text-gray-900">{userProfile?.gst_address?.area_code || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              maxLength={10}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GST Number
            </label>
            <input
              type="text"
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              maxLength={15}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PAN Number
            </label>
            <input
              type="text"
              name="panNumber"
              value={form.panNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              maxLength={10}
            />
          </div>
        </div>

        {/* GST Address Section */}
        <div className="mt-8">
          <h5 className="text-sm font-medium text-gray-900 mb-4">GST Address</h5>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Building
              </label>
              <input
                type="text"
                name="address.building"
                value={form.address.building}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Locality
              </label>
              <input
                type="text"
                name="address.locality"
                value={form.address.locality}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={form.address.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area Code
              </label>
              <input
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
      </div>
    );
  };

  const renderAddressInformation = () => {
    if (!editMode.address) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Building:</span>
            <span className="text-gray-900">{userProfile?.gst_address?.building || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Locality:</span>
            <span className="text-gray-900">{userProfile?.gst_address?.locality || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">City:</span>
            <span className="text-gray-900">{userProfile?.gst_address?.city || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">State:</span>
            <span className="text-gray-900">{userProfile?.gst_address?.state || '-'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Zip Code:</span>
            <span className="text-gray-900">{userProfile?.gst_address?.area_code || '-'}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building
          </label>
          <input
            type="text"
            name="address.building"
            value={form.address.building}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locality
          </label>
          <input
            type="text"
            name="address.locality"
            value={form.address.locality}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            name="address.city"
            value={form.address.city}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zip Code
          </label>
          <input
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
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 w-32">Settlement Type:</span>
            <span className="text-gray-900 capitalize">{form.bankDetails.settlement_type}</span>
          </div>
          {form.bankDetails.settlement_type === 'upi' ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 w-32">UPI ID:</span>
              <span className="text-gray-900">{form.bankDetails.upi_address}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 w-32">Beneficiary Name:</span>
                <span className="text-gray-900">{form.bankDetails.beneficiary_name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 w-32">Account Number:</span>
                <span className="text-gray-900">{form.bankDetails.settlement_bank_account_no}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 w-32">Bank Name:</span>
                <span className="text-gray-900">{form.bankDetails.bank_name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 w-32">IFSC Code:</span>
                <span className="text-gray-900">{form.bankDetails.settlement_ifsc_code}</span>
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Settlement Type
          </label>
          <select
            name="bankDetails.settlement_type"
            value={form.bankDetails.settlement_type}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
          >
            <option value="upi">UPI</option>
            <option value="bank">Bank Account</option>
          </select>
        </div>

        {form.bankDetails.settlement_type === 'upi' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiary Name
              </label>
              <input
                type="text"
                name="bankDetails.beneficiary_name"
                value={form.bankDetails.beneficiary_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                name="bankDetails.settlement_bank_account_no"
                value={form.bankDetails.settlement_bank_account_no}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bankDetails.bank_name"
                value={form.bankDetails.bank_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code
              </label>
              <input
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

  const renderAddressTab = () => {
    return (
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <div>
              <h4 className="text-base font-medium text-gray-900">Addresses</h4>
              <p className="text-sm text-gray-500 mt-1">Manage your pickup and delivery addresses</p>
            </div>
            <button
              onClick={() => {
                setEditingAddress(null);
                setShowAddressModal(true);
              }}
              className="px-4 py-2 text-sm flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <PlusCircle className="w-4 h-4" />
              Add Address
            </button>
          </div>

          {/* Pickup Addresses Section */}
          <div className="p-6 border-b border-gray-100">
            <h5 className="text-sm font-medium text-gray-900 mb-4">Pickup Addresses</h5>
            {pickupAddresses.length === 0 ? (
              <p className="text-gray-500 text-sm">No pickup addresses found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pickupAddresses.map((address) => (
                  <div 
                    key={address.id}
                    className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h6 className="font-medium text-gray-900">{address.location.address.name}</h6>
                        <p className="text-sm text-gray-600">{address.person.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAddress({
                              id: String(address.id),
                              type: 'pickup',
                              isDefault: false,
                              building: address.location.address.building,
                              locality: address.location.address.locality,
                              city: address.location.address.city,
                              state: address.location.address.state,
                              zipCode: address.location.address.area_code,
                              storeName: address.location.address.name,
                              contactPersonName: address.person.name,
                              email: address.contact.email,
                              phoneNumber: address.contact.phone,
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
                            });
                            setShowAddressModal(true);
                          }}
                          className="p-1.5 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(String(address.id))}
                          className="p-1.5 text-gray-600 hover:text-red-600 rounded-md hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        {address.location.address.building}, {address.location.address.locality}
                      </p>
                      <p className="text-gray-600">
                        {address.location.address.city}, {address.location.address.state} - {address.location.address.area_code}
                      </p>
                      <p className="text-gray-600">
                        {address.contact.phone} | {address.contact.email}
                      </p>
                      {address.provider_store_details?.time && (
                        <p className="text-gray-600 mt-2">
                          Working hours: {address.provider_store_details.time.range.start} - {address.provider_store_details.time.range.end}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Addresses Section */}
          <div className="p-6">
            <h5 className="text-sm font-medium text-gray-900 mb-4">Delivery Addresses</h5>
            {deliveryAddresses.length === 0 ? (
              <p className="text-gray-500 text-sm">No delivery addresses found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveryAddresses.map((address) => (
                  <div 
                    key={address.id}
                    className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h6 className="font-medium text-gray-900">{address.location.address.name}</h6>
                        <p className="text-sm text-gray-600">{address.person.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAddress({
                              id: String(address.id),
                              type: 'delivery',
                              isDefault: false,
                              building: address.location.address.building,
                              locality: address.location.address.locality,
                              city: address.location.address.city,
                              state: address.location.address.state,
                              zipCode: address.location.address.area_code,
                              storeName: address.location.address.name,
                              contactPersonName: address.person.name,
                              email: address.contact.email,
                              phoneNumber: address.contact.phone
                            });
                            setShowAddressModal(true);
                          }}
                          className="p-1.5 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(String(address.id))}
                          className="p-1.5 text-gray-600 hover:text-red-600 rounded-md hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        {address.location.address.building}, {address.location.address.locality}
                      </p>
                      <p className="text-gray-600">
                        {address.location.address.city}, {address.location.address.state} - {address.location.address.area_code}
                      </p>
                      <p className="text-gray-600">
                        {address.contact.phone} | {address.contact.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const AddressModal = ({ isOpen, onClose, address, onSave }) => {
    const [form, setForm] = useState({
      type: address?.type || 'pickup',
      isDefault: address?.isDefault || false,
      building: address?.building || '',
      locality: address?.locality || '',
      city: address?.city || '',
      state: address?.state || '',
      zipCode: address?.zipCode || '',
      storeName: address?.storeName || '',
      contactPersonName: address?.contactPersonName || '',
      email: address?.email || '',
      phoneNumber: address?.phoneNumber || '',
      workingDays: address?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shopTime: {
        start: address?.shopTime?.start || '',
        end: address?.shopTime?.end || ''
      }
    });

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

    if (!isOpen) return null;

    return (
      <>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]" onClick={onClose} />
        
        <div className="fixed inset-0 flex items-center justify-center z-[160] p-4">
          <div 
            className="bg-white rounded-xl w-full max-w-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {address ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-6">
                {/* Address Type Selection */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Address Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1">
                      <input
                        type="radio"
                        name="type"
                        value="pickup"
                        checked={form.type === 'pickup'}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="flex items-center justify-center p-4 border rounded-lg cursor-pointer
                                    peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
                        <span className="text-sm font-medium peer-checked:text-blue-600">Pickup Address</span>
                      </div>
                    </label>
                    <label className="flex-1">
                      <input
                        type="radio"
                        name="type"
                        value="delivery"
                        checked={form.type === 'delivery'}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="flex items-center justify-center p-4 border rounded-lg cursor-pointer
                                    peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
                        <span className="text-sm font-medium peer-checked:text-blue-600">Delivery Address</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Pickup Address Specific Fields */}
                {form.type === 'pickup' && (
                  <div className="space-y-6 border-b border-gray-100 pb-6">
                    <h4 className="font-medium text-gray-900">Pickup Location Details</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Name *
                      </label>
                      <input
                        type="text"
                        name="storeName"
                        value={form.storeName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working Days *
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <label key={day} className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              name="workingDays"
                              value={day}
                              checked={form.workingDays.includes(day)}
                              onChange={(e) => {
                                const days = e.target.checked 
                                  ? [...form.workingDays, day]
                                  : form.workingDays.filter(d => d !== day);
                                setForm(prev => ({ ...prev, workingDays: days }));
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-full py-2 text-center text-sm border rounded-md cursor-pointer
                                          peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-600
                                          hover:bg-gray-50">
                              {day.slice(0, 3)}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <TimeInput
                        label="Shop Opening Time"
                        name="shopTime.start"
                        value={form.shopTime.start}
                        onChange={handleInputChange}
                        required
                      />
                      <TimeInput
                        label="Shop Closing Time"
                        name="shopTime.end"
                        value={form.shopTime.end}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Contact Details */}
                <div className="space-y-6 border-b border-gray-100 pb-6">
                  <h4 className="font-medium text-gray-900">Contact Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        name="contactPersonName"
                        value={form.contactPersonName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email ID *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900">Address Details</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Building *
                    </label>
                    <input
                      type="text"
                      name="building"
                      value={form.building}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Locality *
                    </label>
                    <input
                      type="text"
                      name="locality"
                      value={form.locality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pin Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={form.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={6}
                        pattern="[0-9]*"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onSave(form)}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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

  const renderTabs = () => {
    return (
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Profile sections">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-4 px-1 relative ${
              activeTab === 'basic'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Basic Information
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-4 px-1 relative ${
              activeTab === 'addresses'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Addresses
          </button>
        </nav>
      </div>
    );
  };

  const formatTimeForApi = (time: string) => {
    // Convert "HH:mm" to "HHmm"
    return time.replace(':', '');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {renderTabs()}
        <div className="space-y-6">
          {activeTab === 'basic' ? (
            <>
              {/* Basic Information Section */}
              <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Basic Information</h4>
                    <p className="text-sm text-gray-500 mt-1">Your personal and business details</p>
                  </div>
                  <button
                    onClick={() => {
                      if (editMode.basic) {
                        handleSaveBasicInfo();
                      } else {
                        setEditMode(prev => ({ ...prev, basic: true }));
                      }
                    }}
                    className={`px-4 py-2 rounded-md ${
                      editMode.basic 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {editMode.basic ? 'Save' : 'Edit'}
                  </button>
                </div>
                <div className="p-6">
                  {renderBasicInformation()}
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Bank Details</h4>
                    <p className="text-sm text-gray-500 mt-1">Your payment settlement information</p>
                  </div>
                  <button
                    onClick={() => {
                      if (editMode.bank) {
                        handleSaveBankDetails();
                      } else {
                        setEditMode(prev => ({ ...prev, bank: true }));
                      }
                    }}
                    className={`px-4 py-2 rounded-md ${
                      editMode.bank 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {editMode.bank ? 'Save' : 'Edit'}
                  </button>
                </div>
                <div className="p-6">
                  {renderBankDetails()}
                </div>
              </div>
            </>
          ) : (
            /* Address Tab */
            renderAddressTab()
          )}
        </div>
        {showAddressModal && (
          <AddressModal
            isOpen={showAddressModal}
            onClose={() => setShowAddressModal(false)}
            address={editingAddress}
            onSave={handleSaveAddressForm}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;