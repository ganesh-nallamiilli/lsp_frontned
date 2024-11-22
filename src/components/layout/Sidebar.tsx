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
  Bell,
  UserCircle,
  Settings,
  Receipt,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { isOpen, toggle } = useSidebar();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'STANDALONE_ADMIN';

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Orders', path: '/orders' },
    { icon: RotateCcw, label: 'RTO Management', path: '/rto' },
    { icon: RefreshCcw, label: 'Returns', path: '/returns' },
    // { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: FileText, label: 'Billing', path: '/billing' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: Users, label: 'Customers', path: '/customers', adminOnly: true },
    { icon: HeadphonesIcon, label: 'Support', path: '/support' },
    { icon: Settings, label: 'Settings', path: '/settings', adminOnly: true },
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
        <nav className="mt-8">
          {menuItems.map((item) => (
            (!item.adminOnly || isAdmin) && (
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
            )
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;