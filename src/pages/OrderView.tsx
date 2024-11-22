import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const OrderView: React.FC = () => {
  const navigate = useNavigate();
  const { selectedOrder } = useOrder();

  if (!selectedOrder) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">Order not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
      </div>

      {/* Order Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Information</h2>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Network Order ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.networkOrderId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Retail Order ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.retailOrderId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {selectedOrder.status.toUpperCase()}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created By</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.createdBy}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedOrder.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-white shadow rounded-lg mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">AWB Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.awbNo || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Shipment Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.shipmentType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Logistics Provider</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.logisticsProvider}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Pickup City</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.pickupCity}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Delivery City</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.deliveryCity}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Promised TAT</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder.promisedTatDelivery}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Charges Information */}
      <div className="bg-white shadow rounded-lg mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Charges</h2>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Platform Charge</dt>
              <dd className="mt-1 text-sm text-gray-900">
                ${selectedOrder.platformChargeAmount?.toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Shipping Charges</dt>
              <dd className="mt-1 text-sm text-gray-900">
                ${selectedOrder.shippingCharges?.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default OrderView; 