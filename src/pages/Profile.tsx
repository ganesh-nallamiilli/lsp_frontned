import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Lock, Save, PlusCircle, Pencil, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserProfile, updateUserProfile } from '../store/slices/authSlice';

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
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState<ProfileForm>({
    storeName: '',
    website: '',
    fullName: user?.fullName || '',
    phoneNumber: '',
    gstNumber: '',
    panNumber: '',
    email: user?.email || '',
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
    }
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editMode, setEditMode] = useState({
    basic: false,
    address: false,
    bank: false
  });

  const dispatch = useAppDispatch();
  const { userProfile, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('Dispatching fetchUserProfile');
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
        }
      });
    }
  }, [userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={() => dispatch(fetchUserProfile())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handler Functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    
    if (child) {
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveAddress = async (addressData: Omit<Address, 'id'>) => {
    try {
      // If editing existing address
      if (editingAddress) {
        const updatedAddresses = addresses.map(addr => 
          addr.id === editingAddress.id ? { ...addressData, id: addr.id } : addr
        );
        setAddresses(updatedAddresses);
      } else {
        // Add new address
        const newAddress = {
          ...addressData,
          id: `addr_${Date.now()}` // Generate temporary ID
        };
        setAddresses([...addresses, newAddress]);
      }
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error deleting address:', error);
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

  const handleSaveBasicInfo = async () => {
    const userId = localStorage.getItem('id');
    if (!userId) return;

    const updateData = {
      store_name: form.storeName,
      name: form.fullName,
      mobile_number: form.phoneNumber,
      gst_number: form.gstNumber,
      pan_number: form.panNumber,
      email: form.email,
      website: form.website,
      gst_address: {
        building: form.address.building,
        locality: form.address.locality,
        city: form.address.city,
        state: form.address.state,
        area_code: form.address.zipCode
      }
    };

    try {
      await dispatch(updateUserProfile(updateData)).unwrap();
      setEditMode(prev => ({ ...prev, basic: false }));
      // Refresh profile data
      dispatch(fetchUserProfile());
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Handle error (show toast notification, etc.)
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
        <div className="p-6">
          <div className="space-y-4">
            {addresses.map((address) => (
              <div 
                key={address.id}
                className="border rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      address.type === 'pickup' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900">{address.building}</p>
                  <p className="text-gray-600 text-sm">
                    {address.locality}, {address.city}, {address.state} - {address.zipCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingAddress(address);
                      setShowAddressModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AddressModal = ({ 
    isOpen, 
    onClose, 
    address, 
    onSave 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    address?: Address | null; 
    onSave: (address: Omit<Address, 'id'>) => void; 
  }) => {
    const [form, setForm] = useState({
      type: address?.type || 'pickup',
      isDefault: address?.isDefault || false,
      building: address?.building || '',
      locality: address?.locality || '',
      city: address?.city || '',
      state: address?.state || '',
      zipCode: address?.zipCode || ''
    });

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {address ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Add form fields for address */}
        </div>
      </div>
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
            onSave={handleSaveAddress}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;