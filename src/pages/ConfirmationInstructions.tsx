import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ConfirmationInstructionsProps {
  onCancel: () => void;
  onNext: () => void;
}

const ConfirmationInstructions: React.FC<ConfirmationInstructionsProps> = ({ onCancel, onNext }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProvider = location.state?.provider;

  const [pickupType, setPickupType] = useState('');
  const [pickupCode, setPickupCode] = useState('');
  const [pickupDescription, setPickupDescription] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [deliveryCode, setDeliveryCode] = useState('');
  const [deliveryDescription, setDeliveryDescription] = useState('');
  const [pickupImages, setPickupImages] = useState<File[]>([]);
  const [deliveryImages, setDeliveryImages] = useState<File[]>([]);

  const getPickupCodeLabel = (type: string) => {
    switch (type) {
      case 'Merchant order no':
        return 'Merchant Order Number';
      case 'Order preparation time':
        return 'Preparation Time (minutes)';
      case 'OTP':
        return 'OTP Code';
      default:
        return 'Confirmation Code';
    }
  };

  const getDeliveryCodeLabel = (type: string) => {
    switch (type) {
      case 'Order confirmation code':
        return 'Confirmation Code';
      default:
        return 'Confirmation Code';
    }
  };

  const handleFileUpload = (
    files: FileList | File[],
    setImages: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );
    setImages(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500');
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    setImages: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500');
    
    const files = e.dataTransfer.files;
    if (files) {
      handleFileUpload(files, setImages);
    }
  };

  const handleNext = () => {
    navigate('/confirmation-details', {
      state: {
        pickupType,
        pickupCode,
        pickupDescription,
        pickupImages,
        deliveryType,
        deliveryCode,
        deliveryDescription,
        deliveryImages
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pickup Instructions */}
        <div>
          <h2 className="text-lg font-medium mb-4">Pickup Confirmation Instructions</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">
                Pickup Confirmation Type <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={pickupType}
                onChange={(e) => setPickupType(e.target.value)}
              >
                <option value="Merchant order no">Merchant order no</option>
                <option value="Order preparation time">Order Preparation Time</option>
                <option value="OTP">OTP</option>
                {/* Add more options as needed */}
              </select>
            </div>

            {/* Pickup code input - only show if not OTP */}
            {pickupType !== 'OTP' && (
              <div>
                <label className="block mb-1">
                  {getPickupCodeLabel(pickupType)} <span className="text-red-500">*</span>
                </label>
                <input
                  type={pickupType === 'Order preparation time' ? 'number' : 'text'}
                  className="w-full p-2 border rounded-md"
                  placeholder={getPickupCodeLabel(pickupType)}
                  value={pickupCode}
                  onChange={(e) => setPickupCode(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="Description"
                value={pickupDescription}
                onChange={(e) => setPickupDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Upload Label Images</label>
              <div 
                className="border-2 border-dashed rounded-md p-6 transition-colors duration-200"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, setPickupImages)}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files, setPickupImages)}
                  id="pickup-images"
                />
                <label htmlFor="pickup-images" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <img src="/placeholder-image.svg" alt="Upload" className="w-13 h-8 m-0 p-0" />
                    <p>
                      <span className="text-blue-600">Upload a file</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
                {pickupImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {pickupImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          onClick={() => setPickupImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Instructions */}
        <div>
          <h2 className="text-lg font-medium mb-4">Delivery Confirmation Instructions</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">
                Delivery Confirmation Type <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
              >
                <option value="Order confirmation code">Order confirmation code</option>
                <option value="No delivery code">No delivery code</option>
                <option value="OTP">OTP</option>
                {/* Add more options as needed */}
              </select>
            </div>

            {/* Only show code input if not OTP and not No delivery code */}
            {deliveryType !== 'OTP' && deliveryType !== 'No delivery code' && (
              <div>
                <label className="block mb-1">
                  {getDeliveryCodeLabel(deliveryType)} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder={getDeliveryCodeLabel(deliveryType)}
                  value={deliveryCode}
                  onChange={(e) => setDeliveryCode(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="Description"
                value={deliveryDescription}
                onChange={(e) => setDeliveryDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Upload Label Images</label>
              <div 
                className="border-2 border-dashed rounded-md p-6 transition-colors duration-200"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, setDeliveryImages)}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files, setDeliveryImages)}
                  id="delivery-images"
                />
                <label htmlFor="delivery-images" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <img src="/placeholder-image.svg" alt="Upload" className="w-13 h-8 m-0 p-0" />
                    <p>
                      <span className="text-blue-600">Upload a file</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
                {deliveryImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {deliveryImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          onClick={() => setDeliveryImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          CANCEL
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default ConfirmationInstructions;