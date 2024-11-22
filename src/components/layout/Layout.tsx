import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { SidebarProvider } from '../../context/SidebarContext';
import { useSidebar } from '../../context/SidebarContext';

const LayoutContent: React.FC = () => {
  const { isOpen } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main 
        className={`
          transition-all duration-300 ease-in-out 
          pt-16 
          ${isOpen ? 'ml-64' : 'ml-16'}
        `}
      >
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default Layout;