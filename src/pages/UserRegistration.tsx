import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Truck, Package, MapPin, Box } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser } from '../store/slices/authSlice';

interface RegistrationForm {
  storeName: string;
  storeEmail: string;
  storeMobile: string;
  fullName: string;
  gstNumber: string;
  panNumber: string;
  building: string;
  locality: string;
  city: string;
  state: string;
  areaCode: string;
}

const LogisticsAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute animate-drive-right">
        <Truck className="w-12 h-12 text-blue-500 opacity-30" />
      </div>
      <div className="absolute top-1/4 animate-drive-left delay-1000">
        <Truck className="w-10 h-10 text-indigo-500 opacity-30" />
      </div>

      <div className="absolute top-1/3 right-10 animate-float delay-500">
        <Package className="w-8 h-8 text-orange-500 opacity-30" />
      </div>
      <div className="absolute bottom-1/4 left-20 animate-float delay-1500">
        <Box className="w-10 h-10 text-yellow-500 opacity-30" />
      </div>

      <div className="absolute top-1/2 right-1/4 animate-bounce delay-1000">
        <MapPin className="w-8 h-8 text-red-500 opacity-30" />
      </div>
      <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-2000">
        <MapPin className="w-6 h-6 text-green-500 opacity-30" />
      </div>

      <div className="absolute inset-0">
        <svg className="w-full h-full">
          <path
            d="M0,50 Q300,300 600,50 T1200,50"
            className="stroke-blue-300/20 stroke-2 fill-none animate-draw-path"
          />
          <path
            d="M100,200 Q400,50 700,200 T1300,200"
            className="stroke-indigo-300/20 stroke-2 fill-none animate-draw-path delay-1000"
          />
        </svg>
      </div>
    </div>
  );
};

const UserRegistration: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [error, setError] = useState('');
  
  // Get user data from location state
  const location = useLocation();
  const userData = location.state?.userData;

  const [formData, setFormData] = useState<RegistrationForm>({
    storeName: '',
    storeEmail: userData?.email || '',
    storeMobile: userData?.mobile_number || '',
    fullName: '',
    gstNumber: '',
    panNumber: '',
    building: '',
    locality: '',
    city: '',
    state: '',
    areaCode: ''
  });

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'gstNumber':
        if (value.length !== 15) {
          return 'GST Number must be exactly 15 characters';
        }
        break;
      case 'panNumber':
        if (value.length !== 10) {
          return 'PAN Number must be exactly 10 characters';
        }
        break;
      case 'storeMobile':
        if (!/^\d{10}$/.test(value)) {
          return 'Mobile number must be exactly 10 digits';
        }
        break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const fieldError = validateField(name, value);
    setError(fieldError);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate GST and PAN numbers before submission
    if (formData.gstNumber.length !== 15) {
      setError('GST Number must be exactly 15 characters');
      return;
    }
    if (formData.panNumber.length !== 10) {
      setError('PAN Number must be exactly 10 characters');
      return;
    }
    
    try {
      const registrationData = {
        store_name: formData.storeName,
        gst_number: formData.gstNumber,
        pan_number: formData.panNumber,
        name: formData.fullName,
        mobile_number: formData.storeMobile,
        email: formData.storeEmail,
        address: {
          building: formData.building,
          locality: formData.locality,
          city: formData.city,
          state: formData.state,
          area_code: formData.areaCode
        }
      };

      await dispatch(registerUser(registrationData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to register user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      <LogisticsAnimation />

      <div className="relative min-h-screen p-6">
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">User Registration</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                  Store name as per GST <span className="text-red-500">*</span>
                </label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700">
                  Store Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="storeEmail"
                  name="storeEmail"
                  type="email"
                  value={formData.storeEmail}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="storeMobile" className="block text-sm font-medium text-gray-700">
                  Store Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex mt-1">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <Input
                    id="storeMobile"
                    name="storeMobile"
                    type="tel"
                    value={formData.storeMobile}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    className="rounded-l-none"
                    placeholder="Enter 10 digit mobile number"
                  />
                </div>
                {error && formData.storeMobile.length > 0 && error.includes('mobile') && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                  GST Number <span className="text-red-500">*</span>
                </label>
                <Input
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  required
                  maxLength={15}
                  className="mt-1"
                />
                {error && formData.gstNumber.length > 0 && error.includes('GST') && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              <div>
                <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <Input
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  className="mt-1"
                />
                {error && formData.panNumber.length > 0 && error.includes('PAN') && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              <div>
                <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                  Building <span className="text-red-500">*</span>
                </label>
                <Input
                  id="building"
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="locality" className="block text-sm font-medium text-gray-700">
                  Locality <span className="text-red-500">*</span>
                </label>
                <Input
                  id="locality"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="areaCode" className="block text-sm font-medium text-gray-700">
                  Area code <span className="text-red-500">*</span>
                </label>
                <Input
                  id="areaCode"
                  name="areaCode"
                  value={formData.areaCode}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white"
            >
              Get Started
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration; 