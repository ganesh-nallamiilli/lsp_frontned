import React from 'react';
import { Bell, Search, User, ChevronDown, Menu, Wallet, Phone } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isOpen, toggle } = useSidebar();
  const { logout } = useAuth();

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
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div 
            onClick={() => navigate('/wallet')}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <Wallet className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">₹10,000</span>
          </div>

          <a 
            href="tel:+918806500700"
            className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <Phone className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">+91 8806500700</span>
          </a>

          <button 
            onClick={() => navigate('/notifications')} 
            className="p-2 hover:bg-gray-100 rounded-full relative"
          >
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || "Ganesh"} </p>
                <p className="text-xs text-gray-500">{localStorage.getItem("user_type") == "STANDALONE_USER"? "user": localStorage.getItem("user_type") == "STANDALONE_ADMIN" ? "admin":"franchise" || "user type"}</p>
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
}

export default Header;