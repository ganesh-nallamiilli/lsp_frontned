import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, ArrowRight, Truck, Package, MapPin, Box } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { initiateLogin, resetAuth, verifyOtp } from '../store/slices/authSlice';

const LogisticsAnimation = () => {
  return (
    <div id="logistics-animation" className="absolute inset-0 overflow-hidden pointer-events-none">
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

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<'identifier' | 'otp'>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { loading: authLoading, error: authError, otpSent, userId } = useAppSelector((state) => state.auth);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const isValidEmail = (email: string): boolean => {
    // Strict email regex that prevents multiple TLDs
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,6})$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    // Matches Indian phone numbers (10 digits, optionally starting with +91 or 91)
    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const maskIdentifier = (value: string): string => {
    const trimmedValue = value.trim();
    
    // Check if it's an email
    if (trimmedValue.includes('@')) {
      const [username, domain] = trimmedValue.split('@');
      const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
      return `${maskedUsername}@${domain}`;
    }
    
    // Phone number
    const cleanPhone = trimmedValue.replace(/\D/g, '').slice(-10); // Get last 10 digits
    return cleanPhone.charAt(0) + '*'.repeat(8) + cleanPhone.slice(-1);
  };

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedIdentifier = identifier.trim();
    if (!isValidEmail(trimmedIdentifier) && !isValidPhone(trimmedIdentifier)) {
      setError('Please enter a valid email address or phone number');
      return;
    }
    
    try {
      const result = await dispatch(initiateLogin(trimmedIdentifier)).unwrap();
      if (result.data.otp_sent) {
        setStep('otp');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await dispatch(verifyOtp({
        id: userId!,
        otp: otp.join('')
      })).unwrap();

      if (result.meta.status) {
        // Store token in localStorage
        localStorage.setItem('token', result.data.token);
        login(result.data.token);
        
        // Check new_user from localStorage instead
        const isNewUser = localStorage.getItem('new_user') === 'true';
        
        if (isNewUser) {
          navigate('/user_registration', { 
            replace: true,
            state: { userData: result.data.user }
          });
        } else {
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleBackToIdentifier = () => {
    setStep('identifier');
    setOtp(['', '', '', '', '', '']);
    dispatch(resetAuth());
  };

  const handleResendOtp = async () => {
    try {
      const result = await dispatch(initiateLogin(identifier)).unwrap();
      if (result.data.otp_sent) {
        setResendTimer(30);
        setCanResend(false);
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  return (
    <div id="login-page" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      <LogisticsAnimation />
      
      <div id="login-container" className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div id="login-form-card" className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div id="login-logo-container" className="flex justify-center">
            <img
              id="login-logo"
              src="https://www.adya.ai/assets/Logo-6c607c84.png"
              alt="Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Title */}
          <div id="login-header" className="text-center">
            <h2 id="login-title" className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p id="login-subtitle" className="mt-5 text-sm text-gray-600">
              {step === 'identifier' 
                ? 'Please enter your email or phone number'
                : <p>Enter the OTP sent to <span className="font-bold">{maskIdentifier(identifier)}</span></p>}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div id="login-error" className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Forms */}
          {step === 'identifier' ? (
            <form id="identifier-form" onSubmit={handleIdentifierSubmit} className="mt-5 space-y-6">
              <div className="rounded-md shadow-sm">
                <div className="relative">
                  <input
                    id="login-identifier-input"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter email or phone number"
                  />
                  <div id="identifier-icon" className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <button
                  id="login-submit-button"
                  type="submit"
                  disabled={loading || !identifier}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white 
                    ${loading || !identifier 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                >
                  {loading ? 'Sending OTP...' : 'Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            <form id="otp-form" onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
              <div id="otp-input-container" className="flex justify-center space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ))}
              </div>

              <div>
                <button
                  id="otp-submit-button"
                  type="submit"
                  disabled={loading || otp.some(digit => !digit)}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white 
                    ${loading || otp.some(digit => !digit)
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>

              <div className="text-center space-y-4">
                <div className="text-sm text-gray-600">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span>Resend OTP in {resendTimer}s</span>
                  )}
                </div>
                <button
                  id="back-to-identifier-button"
                  type="button"
                  onClick={handleBackToIdentifier}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Change email/phone number
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 