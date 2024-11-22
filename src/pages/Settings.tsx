import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { 
  FaUserCog, 
  FaUniversity, 
  FaEnvelope, 
  FaMap,
  FaPalette,
  FaCheckCircle,
  FaCreditCard
} from 'react-icons/fa';

interface SettingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const SettingCard: React.FC<SettingCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="p-6 bg-white rounded-lg shadow-sm border hover:border-blue-500 cursor-pointer transition-all duration-200 flex items-start gap-4"
    >
      <div className="text-blue-500 text-2xl">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const settingsData = [
    {
      icon: <FaUserCog />,
      title: "Account Details",
      description: "This information will help us to setup your account in our seller application and ensure smooth running.",
      path: "/settings/account"
    },
    {
      icon: <FaUniversity />,
      title: "Banking & Business Details",
      description: "This information will help us to setup your Bank accounts in our seller application and ensure smooth running of funds from different network participants.",
      path: "/settings/banking"
    },
    {
      icon: <FaEnvelope />,
      title: "Email & SMS Services",
      description: "Business information will help us to verify your business so the store at ONDC works smoothly and help us in smoother interactions.",
      path: "/settings/notifications"
    },
    {
      icon: <FaMap />,
      title: "Maps Services",
      description: "This information will help us to setup your account in our seller application and ensure smooth running.",
      path: "/settings/maps"
    },
    {
      icon: <FaPalette />,
      title: "UI Configuration",
      description: "This information will help you customize the look and feel of the platform. Change your brand Colors, CTA colors and tables and Data's visual look and feel",
      path: "/settings/ui"
    },
    {
      icon: <FaCheckCircle />,
      title: "Penny Drop Verification Services",
      description: "This information will help you customize the look and feel of the platform. Change your brand Colors, CTA colors and tables and Data's visual look and feel",
      path: "/settings/verification"
    },
    {
      icon: <FaCreditCard />,
      title: "Payment Providers",
      description: "These providers enable businesses to accept credit and debit card payments. They typically partner with banks to authorize and process transactions.",
      path: "/settings/payment-providers"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
          >
            <IoArrowBack />
            BACK
          </button>
          <h1 className="text-2xl font-bold">Application Settings</h1>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {settingsData.map((setting, index) => (
            <SettingCard
              key={index}
              icon={setting.icon}
              title={setting.title}
              description={setting.description}
              onClick={() => navigate(setting.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings; 