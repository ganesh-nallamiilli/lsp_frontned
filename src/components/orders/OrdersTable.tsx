import React, { useState } from 'react';
import { Package, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Order } from '../../types/orders';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { fetchOrderById } from '../../store/slices/ordersSlice';
import PaginationControls from './PaginationControls';

interface OrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  console.log("Current Items",currentItems);
  // Pagination controls
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getStatusColor = (status: string) => {
    const colors = {
      created: 'bg-blue-100 text-blue-800',
      ready_to_ship: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleActionChange = async (event: React.ChangeEvent<HTMLSelectElement>, order: Order) => {
    const action = event.target.value;
    
    if (action === 'view') {
      try {
        await dispatch(fetchOrderById(order.network_order_id)).unwrap();
        navigate(`/orders/${order.network_order_id}`);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        // You might want to show an error toast here
      }
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* Items per page selector */}
      <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded-lg text-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>
{/*         
        <div className="text-sm text-gray-700">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, orders.length)} of {orders.length} entries
        </div> */}
      </div>

      <div className="overflow-x-scroll">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Logistics Buyer NP name</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Logistics Seller NP name</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Order Create Date & time</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Create By</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Network order ID</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Retail Order ID</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Network Transaction ID</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Logistics Seller NP order ID</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Order Status</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Fulfillment Status</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">RTO Status</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Order Updated Date & time</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Ready to Ship</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">AWB No</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Ready to Ship timestamp</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Shipment Type</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Logistics Provider</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Promised TAT of delivery</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Shipped date and time</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Delivered at date and time</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Pickup City</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Delivery City</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Cancelled at date & time</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Cancelled by</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Cancellation/Failure/return reason</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Platform Charge Amount</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Shipping charges</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((order) => (
              <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{order?.context?.bap_id || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.context?.bpp_id || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order?.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.billing_address?.name || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.network_order_id || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order["@ondc/org/linked_order"]?.order?.id || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.transaction_id || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.network_order_id || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.state)}`}>
                      {order?.state && order?.state.replace('_', ' ').toUpperCase() || "-"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.fulfilment_state || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.rto_fulfillment_state || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order?.updatedAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.ready_to_ship|| "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.fulfillments?.find(item => item?.["@ondc/org/awb_no"])?.["@ondc/org/awb_no"]  || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.context?.timestamp || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.category_type || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.provider_descriptor?.name || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.end_location?.time?.range?.end || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.shipped_at || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.ready_to_ship_timeline || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.billing_address?.address?.city || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.end_location?.location?.address?.city || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.cancelled_at || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.cancelled_by || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.cancellationReason || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.platform_charges ? parseInt(order?.platform_charges).toFixed(2) : "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order?.quote?.price?.value ? parseInt(order?.quote?.price?.value).toFixed(2) : "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    className="border border-gray-300 rounded-lg text-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => handleActionChange(e, order)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select Action</option>
                    <option value="view">View</option>
                    <option value="download">Download Platform Charge Invoice</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between p-4 bg-white border-t">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;