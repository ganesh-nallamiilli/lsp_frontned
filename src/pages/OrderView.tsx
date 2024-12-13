import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchOrderById } from '../store/slices/ordersSlice';

const OrderView: React.FC = () => {
  const navigate = useNavigate();
  const { network_order_id } = useParams<{ network_order_id: string }>();
  const dispatch = useAppDispatch();
  const { selectedOrder, loading, error } = useAppSelector((state) => state.orders);
  console.log("network_order_id >>>>>>>>.",network_order_id);
  useEffect(() => {
    if (network_order_id) {
      dispatch(fetchOrderById(network_order_id));
      console.log("selectedOrder >>>>>>>>.",selectedOrder);
    }
  }, [dispatch, network_order_id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }
  console.log("selectedOrder >>>>>",selectedOrder);
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          
          <button
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => {/* Add call logic */}}
            className="p-4 rounded-full bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Phone className="w-6 h-6" /> {/* Import Phone icon from lucide-react */}
          </button>
    
          <button
            onClick={() => {/* Add get status logic */}}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Status
          </button>
          
          <button
            onClick={() => {/* Add cancel order logic */}}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cancel Order
          </button>
          
          <button
            onClick={() => {/* Add create ticket logic */}}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create Ticket
          </button>
        </div>
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
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.network_order_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Retail Order ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder['@ondc/org/linked_order']?.order?.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${selectedOrder && selectedOrder?.state === 'completed' ? 'bg-green-100 text-green-800' : 
                    selectedOrder && selectedOrder?.state === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {selectedOrder?.state && selectedOrder?.state.toUpperCase()}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedOrder?.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created By</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.created_by}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedOrder?.updatedAt).toLocaleString()}
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
              <dd className="mt-1 text-sm text-gray-900">{'-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Shipment Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.category_type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Logistics Provider</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.context?.bap_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Pickup City</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.billing_address?.address?.city}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Delivery City</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.end_location?.location?.address?.city}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Promised TAT</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.context?.timestamp}</dd>
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
                ${selectedOrder?.platformChargeAmount?.toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Shipping Charges</dt>
              <dd className="mt-1 text-sm text-gray-900">
                ${selectedOrder?.shippingCharges?.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default OrderView; 