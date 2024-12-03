import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFranchiseById, fetchMarkupDetails } from '../store/slices/franchiseSlice';

const FranchiseView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { 
    currentFranchise, 
    markupDetails, 
    loading, 
    error 
  } = useAppSelector((state) => state.franchise);

  useEffect(() => {
    if (id) {
      dispatch(fetchFranchiseById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentFranchise?.id) {
      dispatch(fetchMarkupDetails(currentFranchise.id.toString()));
    }
  }, [dispatch, currentFranchise?.id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!currentFranchise) return <div className="p-6 text-center">Franchise not found</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} />
          Back
        </button>
      </div>

      {/* Franchise Details Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Franchise Details</h2>
          <p className="text-sm text-gray-500">This information will help us to setup your franchise with our buyer application and go live on ONDC network.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <DetailItem label="Franchise Name" value={currentFranchise.store_name} required />
            <DetailItem label="Owner Full Name" value={currentFranchise.name} required />
            <DetailItem label="Phone Number" value={currentFranchise.mobile_number} required />
            <DetailItem label="GST Number" value={currentFranchise.gst_number} />
            <DetailItem label="Email Address" value={currentFranchise.email} required />
            <DetailItem label="PAN Number" value={currentFranchise.pan_number} required />
            <DetailItem label="Name as per PAN" value={currentFranchise.name_as_per_pan} required />
          </div>

          {/* Franchise Logo */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Your franchise Logo</p>
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              {currentFranchise.profile_image ? (
                <img 
                  src={currentFranchise.profile_image} 
                  alt="Franchise Logo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-4">Address as per GST</p>
            <div className="grid grid-cols-3 gap-6">
              <DetailItem label="Building" value={currentFranchise.gst_address?.building} required />
              <DetailItem label="Locality" value={currentFranchise.gst_address?.locality} required />
              <DetailItem label="City" value={currentFranchise.gst_address?.city} required />
              <DetailItem label="State/Province" value={currentFranchise.gst_address?.state} required />
              <DetailItem label="Zip/Postal Code" value={currentFranchise.gst_address?.area_code} required />
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Bank Details</h2>
          <p className="text-sm text-gray-500">This information will help us to setup your transactions and payments with the ONDC network.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <DetailItem label="Settlement Type" value={currentFranchise.bank_details?.settlement_type} required />
            <DetailItem label="Account Holder Name" value={currentFranchise.bank_details?.beneficiary_name} required />
            <DetailItem label="Account Number" value={currentFranchise.bank_details?.settlement_bank_account_no} required />
            <DetailItem label="IFSC Code" value={currentFranchise.bank_details?.settlement_ifsc_code} required />
            <DetailItem label="UPI Id" value={currentFranchise.bank_details?.upi_address} />
            <DetailItem label="Bank Name" value={currentFranchise.bank_details?.bank_name} required />
          </div>
        </div>
      </div>

      {/* Markup Details Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Markup Details</h2>
          <p className="text-sm text-gray-500">These are other important details for the franchise.</p>
        </div>
        <div className="p-6">
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="w-1/2 px-4 py-2 text-sm font-medium text-gray-600">Markup Type</th>
                <th className="w-1/2 px-4 py-2 text-sm font-medium text-gray-600">Markup Value</th>
              </tr>
            </thead>
            <tbody>
              {markupDetails.map((markup, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{markup.markup_type}</td>
                  <td className="px-4 py-3 text-sm font-medium">{markup.markup_value}</td>
                </tr>
              ))}
              {markupDetails.length === 0 && (
                <tr className="border-t">
                  <td colSpan={2} className="px-4 py-6 text-center text-sm text-gray-500">
                    No markup details found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value?: string;
  required?: boolean;
  valueClassName?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ 
  label, 
  value = '', 
  required = false, 
  valueClassName = "text-gray-900" 
}) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </p>
    <p className={`font-medium ${valueClassName}`}>{value}</p>
  </div>
);

export default FranchiseView; 