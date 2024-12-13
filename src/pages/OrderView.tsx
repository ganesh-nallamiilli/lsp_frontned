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
              <dt className="text-sm font-medium text-gray-500">Order Created Date & Time</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedOrder?.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Retail Order ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder["@ondc/org/linked_order"]?.order?.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Retail Order Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">
                ₹{selectedOrder?.payment["@ondc/org/collection_amount"].toFixed(2)}
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  PAID
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Retail Order Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder["@ondc/org/linked_order"]?.items[0]?.category_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Logistics Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.provider_descriptor?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fulfillment Status</dt>
              <dd className="mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${selectedOrder?.fulfilment_state|| "Pending" === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    selectedOrder?.fulfilment_state === 'Completed' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {selectedOrder?.fulfilment_state || "Pending"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Logistics Buyer NP Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.context?.bap_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Logistics Seller NP Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.context?.bpp_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Network Transaction ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.context?.transaction_id}</dd>
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
              <dt className="text-sm font-medium text-gray-500">Eway Bill number</dt>
              <dd className="mt-1 text-sm text-gray-900">{'-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">AWB Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{'-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Ready to Ship</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.ready_to_ship}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Shipment Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.category_type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Promised TAT of delivery</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.context?.timestamp}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Pickup Slot</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedOrder?.fulfillments[0]?.start?.time?.range?.start} to {selectedOrder?.fulfillments[0]?.start?.time?.range?.end}</dd>
            </div>
            
          </dl>
        </div>
      </div>

      {/* Charges Information */}
      <div className="bg-white shadow rounded-lg mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Pickup Details</h2>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.start_location?.location?.address?.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact No.</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.start_location?.contact?.phone}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.start_location?.contact?.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.start_location?.location?.address?.name}, {selectedOrder?.start_location?.location?.address?.building}, {selectedOrder?.start_location?.location?.address?.locality}, {selectedOrder?.start_location?.location?.address?.city}, {selectedOrder?.start_location?.location?.address?.state}, {selectedOrder?.start_location?.location?.address?.area_code}, {selectedOrder?.start_location?.location?.address?.country}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Pickup confirmation type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.start_location?.contact?.type}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">otp</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.start_location?.instructions?.short_desc}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Delivery Details</h2>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.end_location?.location?.address?.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact No.</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.end_location?.contact?.phone}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.end_location?.contact?.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.end_location?.location?.address?.name}, {selectedOrder?.end_location?.location?.address?.building}, {selectedOrder?.end_location?.location?.address?.locality}, {selectedOrder?.end_location?.location?.address?.city}, {selectedOrder?.end_location?.location?.address?.state}, {selectedOrder?.end_location?.location?.address?.area_code}, {selectedOrder?.end_location?.location?.address?.country}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Delivery confirmation type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.end_location?.contact?.type}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">otp</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.end_location?.instructions?.short_desc}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Additional Details</h2>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Platform Charge Value</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.platform_charge_value}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Platform Charge Type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.platform_charges_type}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Platform Charge Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.platform_charge_value_amount}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">GST on Platform Charge</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.platform_charge_gst}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total platform charge</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder?.platform_charges}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Package Details */}
      <div className="bg-white shadow rounded-lg mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Package Details</h2>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Weight (Kg)</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder["@ondc/org/linked_order"]?.order?.weight?.value || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Length (cms)</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder["@ondc/org/linked_order"]?.order?.dimensions?.length?.value || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Breadth (cms)</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder["@ondc/org/linked_order"]?.order?.dimensions?.breadth?.value || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Height (cms)</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedOrder["@ondc/org/linked_order"]?.order?.dimensions?.height?.value || '-'}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white shadow rounded-lg mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
        </div>
        <div className="px-6 py-5">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-orange-400">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Weight (Kg)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">Price (INR)</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {selectedOrder["@ondc/org/linked_order"]?.items?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item?.descriptor?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item?.quantity?.count}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item?.quantity?.measure?.value || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item?.price?.value || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white shadow rounded-lg mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
        </div>
        <div className="px-6 py-5">
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Delivery</dt>
              <dd className="text-sm text-gray-900">₹{selectedOrder?.quote?.breakup.map((item:any)=>item["@ondc/org/title_type"] === "delivery" ? item?.price?.value : null) || '0.00'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Tax</dt>
              <dd className="text-sm text-gray-900">₹{selectedOrder?.quote?.breakup.map((item:any)=>item["@ondc/org/title_type"] === "tax" ? item?.price?.value : null) || '0.00'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">RTO Charge</dt>
              <dd className="text-sm text-gray-900">₹{selectedOrder?.quote?.price?.value || '0.00'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Platform Charge</dt>
              <dd className="text-sm text-gray-900">₹{selectedOrder?.platform_charges || '0.00'}</dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <dt className="text-sm font-medium text-gray-900">Total</dt>
              <dd className="text-sm font-medium text-gray-900">₹{parseFloat(selectedOrder?.quote?.breakup.map((item:any)=>item["@ondc/org/title_type"] === "delivery" ? item?.price?.value : 0)) + parseFloat(selectedOrder?.quote?.breakup.map((item:any)=>item["@ondc/org/title_type"] === "tax" ? item?.price?.value : 0)) + parseFloat(selectedOrder?.quote?.price?.value) + parseFloat(selectedOrder?.platform_charges) || '0.00'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default OrderView;