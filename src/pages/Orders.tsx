import React, { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import OrdersTable from '../components/orders/OrdersTable';
import OrderFilters from '../components/orders/OrderFilters';
import TabPanel from '../components/common/TabPanel';
import { Order } from '../types/orders';
import { useNavigate } from 'react-router-dom';

const mockOrders: Order[] = [
  {
    id: '1',
    logisticsBuyerNpName: 'Buyer Company A',
    logisticsSellerNpName: 'Seller Company B',
    createdAt: '2024-03-15T10:30:00Z',
    createdBy: 'John Doe',
    networkOrderId: 'NET-2024-001',
    retailOrderId: 'RET-2024-001',
    networkTransactionId: 'TRANS-2024-001',
    logisticsSellerNpOrderId: 'SELLER-2024-001',
    status: 'created',
    fulfillmentStatus: 'pending',
    rtoStatus: 'none',
    updatedAt: '2024-03-15T11:30:00Z',
    readyToShip: true,
    awbNo: 'AWB123456789',
    readyToShipTimestamp: '2024-03-15T12:00:00Z',
    shipmentType: 'Express',
    logisticsProvider: 'FastShip Logistics',
    promisedTatDelivery: '2 days',
    shippedDateTime: '2024-03-15T14:00:00Z',
    deliveredDateTime: '2024-03-17T10:00:00Z',
    pickupCity: 'Mumbai',
    deliveryCity: 'Delhi',
    cancelledDateTime: '',
    cancelledBy: '',
    cancellationReason: '',
    platformChargeAmount: 50.00,
    shippingCharges: 25.00
  },
  {
    id: '2',
    logisticsBuyerNpName: 'Buyer Company C',
    logisticsSellerNpName: 'Seller Company D',
    createdAt: '2024-03-14T09:30:00Z',
    createdBy: 'Jane Smith',
    networkOrderId: 'NET-2024-002',
    retailOrderId: 'RET-2024-002',
    networkTransactionId: 'TRANS-2024-002',
    logisticsSellerNpOrderId: 'SELLER-2024-002',
    status: 'completed',
    fulfillmentStatus: 'delivered',
    rtoStatus: 'none',
    updatedAt: '2024-03-16T15:30:00Z',
    readyToShip: true,
    awbNo: 'AWB987654321',
    readyToShipTimestamp: '2024-03-14T11:00:00Z',
    shipmentType: 'Standard',
    logisticsProvider: 'SecureShip Logistics',
    promisedTatDelivery: '3 days',
    shippedDateTime: '2024-03-14T13:00:00Z',
    deliveredDateTime: '2024-03-17T14:00:00Z',
    pickupCity: 'Bangalore',
    deliveryCity: 'Chennai',
    cancelledDateTime: '',
    cancelledBy: '',
    cancellationReason: '',
    platformChargeAmount: 45.00,
    shippingCharges: 20.00
  },
  {
    id: '3',
    logisticsBuyerNpName: 'Buyer Company E',
    logisticsSellerNpName: 'Seller Company F',
    createdAt: '2024-03-13T14:30:00Z',
    createdBy: 'Mike Johnson',
    networkOrderId: 'NET-2024-003',
    retailOrderId: 'RET-2024-003',
    networkTransactionId: 'TRANS-2024-003',
    logisticsSellerNpOrderId: 'SELLER-2024-003',
    status: 'cancelled',
    fulfillmentStatus: 'cancelled',
    rtoStatus: 'none',
    updatedAt: '2024-03-13T16:30:00Z',
    readyToShip: false,
    awbNo: '',
    readyToShipTimestamp: '',
    shipmentType: 'Express',
    logisticsProvider: 'QuickShip Logistics',
    promisedTatDelivery: '2 days',
    shippedDateTime: '',
    deliveredDateTime: '',
    pickupCity: 'Hyderabad',
    deliveryCity: 'Pune',
    cancelledDateTime: '2024-03-13T16:30:00Z',
    cancelledBy: 'Customer',
    cancellationReason: 'Delivery address changed',
    platformChargeAmount: 0.00,
    shippingCharges: 0.00
  }
];

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const navigate = useNavigate();

  const tabs = [
    { label: 'All Orders', count: orders.length },
    { label: 'Ready to Ship', count: orders.filter((o) => o.status === 'ready_to_ship').length },
    { label: 'Created', count: orders.filter((o) => o.status === 'created').length },
    { label: 'Accepted', count: orders.filter((o) => o.status === 'accepted').length },
    { label: 'In Progress', count: orders.filter((o) => o.status === 'in_progress').length },
    { label: 'Completed', count: orders.filter((o) => o.status === 'completed').length },
    { label: 'Cancelled', count: orders.filter((o) => o.status === 'cancelled').length },
  ];

  const handleSearch = (query: string) => {
    // Implement search logic
  };

  const handleDateChange = (date: string) => {
    // Implement date filter logic
  };

  const handleStatusChange = (status: string) => {
    // Implement status filter logic
  };

  const handleExport = () => {
    // Implement export logic
  };

  const handleView = (order: Order) => {
    // Implement view logic
  };

  const handleEdit = (order: Order) => {
    // Implement edit logic
  };

  const handleDelete = (order: Order) => {
    // Implement delete logic
  };

  const handleCreateOrder = () => {
    navigate('/orders/create');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="flex gap-3">
          <button
            onClick={handleCreateOrder}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Order
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === index
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <OrderFilters
            onSearch={handleSearch}
            onDateChange={handleDateChange}
            onStatusChange={handleStatusChange}
          />

          {tabs.map((_, index) => (
            <TabPanel key={index} value={activeTab} index={index}>
              <OrdersTable
                orders={orders}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;