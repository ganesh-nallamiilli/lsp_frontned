import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaExternalLinkAlt } from 'react-icons/fa';

const MapServiceConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { provider } = useParams();

  const handleCreateAccount = () => {
    window.open('https://console.cloud.google.com/getting-started', '_blank');
  };

  const handleReadDocs = () => {
    window.open('https://developers.google.com/maps/documentation', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center">
            <IoArrowBack className="text-xl" />
          </button>
          <span>Maps Service providers</span>
          <span>/</span>
          <span>{provider}</span>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Google Maps</h1>
              <p className="text-gray-600 mt-2">
                Build awesome apps with Google's knowledge of the real world
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateAccount}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Create Account Now
                <FaExternalLinkAlt className="text-sm" />
              </button>
              <button
                onClick={handleReadDocs}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Read Documentation
                <FaExternalLinkAlt className="text-sm" />
              </button>
            </div>
          </div>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Api Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your Google API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps Api <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                defaultValue="https://maps.googleapis.com/maps/api/js"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Geo Code Api <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                defaultValue="https://maps.googleapis.com/maps/api/geocode/json"
                readOnly
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Save & Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MapServiceConfiguration; 