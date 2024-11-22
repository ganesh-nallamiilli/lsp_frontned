import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaPalette } from 'react-icons/fa';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  required?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange, required = false }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <label className="text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-full border"
          style={{ backgroundColor: color }}
        />
        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = color;
            input.addEventListener('change', (e) => {
              onChange((e.target as HTMLInputElement).value);
            });
            input.click();
          }}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Select Color
        </button>
      </div>
    </div>
  );
};

const UIConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const [logo, setLogo] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);
  const [colors, setColors] = useState({
    headerBg: '#FFA500',
    headerText: '#000000',
    buttonBg: '#FFA500',
    buttonText: '#000000',
    tableHeaderBg: '#FFA500',
    tableHeaderText: '#000000',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'logo') setLogo(file);
      else setFavicon(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-amber-800"
          >
            <IoArrowBack className="text-xl" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Upload Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">UI Configuration</h2>
            
            {/* Logo Upload */}
            <div className="mb-6">
              <label className="block mb-2">
                Upload Your Logo <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".png,.svg"
                onChange={(e) => handleFileChange(e, 'logo')}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="block w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                {logo ? (
                  <img
                    src={URL.createObjectURL(logo)}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Click to upload
                  </div>
                )}
              </label>
              <p className="text-sm text-gray-500 mt-2">
                For the logo image, please ensure it has a transparent background. Additionally, the
                file size should not exceed 10 megabytes. Accepted formats include PNG, SVG.
              </p>
            </div>

            {/* Favicon Upload */}
            <div>
              <label className="block mb-2">
                Browser Favicon Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".png,.svg"
                onChange={(e) => handleFileChange(e, 'favicon')}
                className="hidden"
                id="favicon-upload"
              />
              <label
                htmlFor="favicon-upload"
                className="block w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                {favicon ? (
                  <img
                    src={URL.createObjectURL(favicon)}
                    alt="Favicon Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Click to upload
                  </div>
                )}
              </label>
              <p className="text-sm text-gray-500 mt-2">
                For the logo image, please ensure it has a transparent background. Additionally, the
                file size should not exceed 10 megabytes. Accepted formats include PNG, SVG.
              </p>
            </div>
          </div>

          {/* Right Column - Color Selection */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Choose Your Brand Colors</h2>
            
            <ColorPicker
              label="Header Background Color"
              color={colors.headerBg}
              onChange={(color) => setColors({ ...colors, headerBg: color })}
              required
            />
            <ColorPicker
              label="Header Text Color"
              color={colors.headerText}
              onChange={(color) => setColors({ ...colors, headerText: color })}
              required
            />
            <ColorPicker
              label="Button Background Color"
              color={colors.buttonBg}
              onChange={(color) => setColors({ ...colors, buttonBg: color })}
              required
            />
            <ColorPicker
              label="Button Text Color"
              color={colors.buttonText}
              onChange={(color) => setColors({ ...colors, buttonText: color })}
              required
            />
            <ColorPicker
              label="Table Header Color"
              color={colors.tableHeaderBg}
              onChange={(color) => setColors({ ...colors, tableHeaderBg: color })}
              required
            />
            <ColorPicker
              label="Table Header Text Color"
              color={colors.tableHeaderText}
              onChange={(color) => setColors({ ...colors, tableHeaderText: color })}
              required
            />

            <div className="mt-8 flex justify-end">
              <button
                className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                UPDATE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIConfiguration; 