import React from 'react';
import { Bell, Search, User, ChevronDown, Menu, Wallet, Phone } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchWalletDetails, fetchUserProfile } from '../../store/slices/dashboardSlice';
const Header: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isOpen, toggle } = useSidebar();
  const { logout } = useAuth();
  const { walletDetails } = useAppSelector((state) => state.dashboard);
  const { userProfile } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchWalletDetails());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    try {
      // Clear any local storage items
      localStorage.clear();
      // Call the logout function from AuthContext
      logout();
      // Close the dropdown
      setIsDropdownOpen(false);
      // Navigate to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header 
      className={`
        bg-white shadow-sm fixed top-0 z-[100]
        transition-all duration-300 ease-in-out
        right-0 
        ${isOpen ? 'left-64' : 'left-16'}
      `}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              id="global_search"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {localStorage.getItem("user_type") != "STANDALONE_ADMIN" && <div 
            onClick={() => navigate('/wallet')}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <Wallet className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">₹{walletDetails?.total_available || '0.00'}</span>
          </div>}

          { localStorage.getItem("user_type") != "STANDALONE_ADMIN" && <div className="relative group">
            <button 
              className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <Phone className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Support</span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-200 ease-in-out transform 
              translate-y-[-10px] group-hover:translate-y-0 z-[110]"
            >
              <a
                href="tel:+918806500700"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Phone className="h-4 w-4" />
                <span>Call +91 8806500700</span>
              </a>
              <a
                href="https://wa.me/918806500700"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>}

          {localStorage.getItem("user_type") != "STANDALONE_ADMIN" && <button 
            onClick={() => navigate('/notifications')} 
            className="p-2 hover:bg-gray-100 rounded-full relative"
          >
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>}

          <div className="rel ative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {localStorage.getItem("user_type") == "STANDALONE_ADMIN" ? "LSP": userProfile?.name || "Guest"}
                </p>
                <p className="text-xs text-gray-500">
                  {localStorage.getItem("user_type") == "STANDALONE_USER" ? "user" : 
                   localStorage.getItem("user_type") == "STANDALONE_ADMIN" ? "admin" : 
                   "franchise" || "user type"}
                </p>
              </div>
              <User className="h-8 w-8 text-gray-600" />
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[110] border border-gray-200">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Update
                </button>
                {localStorage.getItem("user_type") === "STANDALONE_ADMIN" && (
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/settings');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
  

export default Header;