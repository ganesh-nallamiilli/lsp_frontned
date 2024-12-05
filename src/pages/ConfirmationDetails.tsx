import React from 'react';

interface ConfirmationDetailsProps {
  onBack: () => void;
  onProceed: () => void;
}

const ConfirmationDetails: React.FC<ConfirmationDetailsProps> = ({ onBack, onProceed }) => {
  return (
    <div id="confirmation-details-container" className="container mx-auto p-6">
      {/* Header with ID */}
      <div id="confirmation-details-header" className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-medium">Confirm Details</h2>
        </div>
        <span id="confirmation-details-header-total-amount" className="text-blue-600">15494.97 ₹</span>
      </div>

      {/* Delivery Partner */}
      <div className="mb-6">
        <p id="confirmation-details-delivery-partner" className="text-gray-600">Delivery partner : ONDC Test Courier Services</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Receiver Details */}
        <div className="col-span-2">
          <h3 id="confirmation-details-receiver-details-title" className="font-medium mb-4">Receiver Details</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p id="confirmation-details-receiver-details-name" className="text-gray-600 mb-2">Name</p>
              <p>Saira</p>
              <p id="confirmation-details-receiver-details-phone" className="text-gray-600 mt-4 mb-2">Phone</p>
              <p>9638527410</p>
            </div>
            <div>
              <p id="confirmation-details-receiver-details-address" className="text-gray-600 mb-2">Address</p>
              <div className="space-y-4">
                <div>
                  <p id="confirmation-details-receiver-details-pickup-address" className="font-medium">Pickup Address</p>
                  <p>Bengaluru</p>
                  <p>Y.U.U.prestige tech park,kadubeesanahaali</p>
                  <p>Karnataka, 560103</p>
                  <p>7569316675</p>
                </div>
                <div>
                  <p id="confirmation-details-receiver-details-deliver-address" className="font-medium">Deliver Address</p>
                  <p>Bengaluru</p>
                  <p>Saira,Prestige Tech Park Road,Kadubeesanahaali</p>
                  <p>Karnataka, 560103</p>
                  <p>9638527410</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <div id="confirmation-details-payment-details-container" className="bg-gray-50 p-4 rounded-lg">
            <div id="confirmation-details-payment-details-title-container" className="flex items-center justify-between mb-4">
              <h3 id="confirmation-details-payment-details-title" className="font-medium">Payment Details</h3>
              <label id="confirmation-details-payment-details-use-wallet-amount-label" className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Use Wallet Amount
              </label>
            </div>
            <div className="space-y-2">
              <div id="confirmation-details-payment-details-rto-container" className="flex justify-between">
                <span id="confirmation-details-payment-details-rto-text">RTO</span>
                <span id="confirmation-details-payment-details-rto-amount">NaN/-</span>
              </div>
              <div className="flex justify-between">
                <span id="confirmation-details-payment-details-platform-charge-text">PLATFORM CHARGE</span>
                <span id="confirmation-details-payment-details-platform-charge-amount">NaN/-</span>
              </div>
              <div id="confirmation-details-payment-details-wallet-discount-container" className="flex justify-between">
                <span id="confirmation-details-payment-details-wallet-discount-text">WALLET DISCOUNT</span>
                <span id="confirmation-details-payment-details-wallet-discount-amount">0.00/-</span>
              </div>
              <div id="confirmation-details-payment-details-total-amount-container" className="flex justify-between font-medium pt-2 border-t">
                <span id="confirmation-details-payment-details-total-amount-text">Total Amount</span>
                <span id="confirmation-details-payment-details-total-amount-amount">NaN/-</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={onBack}
          id="confirmation-details-action-buttons-back-button"
          className="px-6 py-2 border rounded-md hover:bg-gray-50"
        >
          BACK
        </button>
        <button
          onClick={onProceed}
          id="confirmation-details-action-buttons-proceed-button"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          PROCEED
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDetails; 