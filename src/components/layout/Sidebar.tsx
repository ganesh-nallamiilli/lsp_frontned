import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Package,
  RotateCcw,
  RefreshCcw,
  Wallet,
  FileText,
  Users,
  HeadphonesIcon,
  Store,
  Settings,
  Receipt,
  PhoneCall,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { isOpen, toggle } = useSidebar();
  const { user } = useAuthStore();
  const userType = localStorage.getItem("user_type");
  const isAdmin = userType === 'STANDALONE_ADMIN';
  const isUser = userType === 'STANDALONE_USER';
  const isFranchise = userType === 'FRANCHISE';

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Orders', path: '/orders' },
    { icon: RotateCcw, label: 'RTO Management', path: '/rto' },
    { icon: RefreshCcw, label: 'Returns', path: '/returns' },
    { icon: FileText, label: 'Billing', path: '/billing', hideFor: ['STANDALONE_ADMIN'] },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: Wallet, label: 'Payouts', path: '/payouts' },
    { icon: Users, label: 'Customers', path: '/customers', showFor: ['STANDALONE_ADMIN'] },
    { icon: Store, label: 'Franchise', path: '/franchise', showFor: ['STANDALONE_ADMIN'] },
    { icon: HeadphonesIcon, label: 'Support', path: '/support' },
    { icon: Settings, label: 'Settings', path: '/settings',  showFor: ['STANDALONE_ADMIN'] },
    
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => toggle()}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed left-0 top-0 h-screen bg-white shadow-lg 
          transition-all duration-300 ease-in-out z-20
          flex flex-col
          ${isOpen ? 'w-64' : 'w-16'}
        `}
      >
        <div className={`p-4 ${isOpen ? '' : 'flex justify-center'}`}>
          <div className="flex items-center">
            <img 
              src="https://www.adya.ai/assets/Logo-6c607c84.png" 
              alt="Adya Logo" 
              className="w-8 h-8" 
            />
            {isOpen && (
              <span className="ml-3 font-bold text-indigo-600 text-[24px] tracking-wide">
                Adya
              </span>
            )}
          </div>
        </div>
        <nav className="mt-8 flex-1">
          {menuItems.map((item) => {
            const shouldShow = 
              (!item.showFor && !item.hideFor) || // Show if no restrictions
              (item.showFor && item.showFor.includes(userType as string)) || // Show if user type is in showFor
              (item.hideFor && !item.hideFor.includes(userType as string)); // Show if user type is not in hideFor

            return shouldShow ? (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 
                   transition-colors relative group
                   ${isActive ? 'bg-indigo-50 text-indigo-600' : ''}
                   ${!isOpen ? 'justify-center px-3' : ''}`
                }
              >
                <item.icon className={`w-5 h-5 ${isOpen ? 'mr-3' : ''}`} />
                {isOpen ? (
                  <span>{item.label}</span>
                ) : (
                  <div className="
                    absolute left-full rounded-md px-2 py-1 ml-6
                    bg-gray-900 text-white text-sm
                    invisible opacity-0 -translate-x-3 transition-all
                    group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                  ">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ) : null;
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;