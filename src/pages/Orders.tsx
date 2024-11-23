import React, { useState } from 'react';
import { Download, Plus, Search as SearchIcon, Trash2 } from 'lucide-react';
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
  },
  {
    id: '4',
    retailOrderId: 'Test001',
    createdAt: '2024-02-15T13:03:00Z',
    status: 'draft',
    pickupAddress: {
      name: 'desk',
      address: 'sector 5,main road,',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '9638527410',
      email: 'desk@adya.ai'
    },
    deliveryAddress: {
      name: 'desk',
      address: 'main road,sector 6,',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '7569316623',
      email: 'saira@tmail.com'
    },
    orderCategory: 'Fashion',
    totalOrderItems: 1,
    packageDeadWeight: '0.5 kilogram',
    packageDimensions: {
      length: '10',
      breadth: '10',
      height: '10'
    },
    orderCategoryType: 'Standard',
    logisticsBuyerNpName: '',
    logisticsSellerNpName: '',
    createdBy: 'System',
    networkOrderId: '',
    networkTransactionId: '',
    logisticsSellerNpOrderId: '',
    fulfillmentStatus: 'pending',
    rtoStatus: 'none',
    updatedAt: '',
    readyToShip: false,
    awbNo: '',
    readyToShipTimestamp: '',
    shipmentType: '',
    logisticsProvider: '',
    promisedTatDelivery: '',
    shippedDateTime: '',
    deliveredDateTime: '',
    cancelledDateTime: '',
    cancelledBy: '',
    cancellationReason: '',
    platformChargeAmount: 0,
    shippingCharges: 0
  },
  {
    id: '5',
    retailOrderId: 'Test002',
    createdAt: '2024-02-15T14:30:00Z',
    status: 'draft',
    pickupAddress: {
      name: 'warehouse',
      address: 'industrial area, phase 1',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '8527419630',
      email: 'warehouse@adya.ai'
    },
    deliveryAddress: {
      name: 'office',
      address: 'tech park, sector 3',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '9632587410',
      email: 'john@tmail.com'
    },
    orderCategory: 'Electronics',
    totalOrderItems: 2,
    packageDeadWeight: '1.2 kilogram',
    packageDimensions: {
      length: '20',
      breadth: '15',
      height: '10'
    },
    orderCategoryType: 'Express',
    logisticsBuyerNpName: '',
    logisticsSellerNpName: '',
    createdBy: 'System',
    networkOrderId: '',
    networkTransactionId: '',
    logisticsSellerNpOrderId: '',
    fulfillmentStatus: 'pending',
    rtoStatus: 'none',
    updatedAt: '',
    readyToShip: false,
    awbNo: '',
    readyToShipTimestamp: '',
    shipmentType: '',
    logisticsProvider: '',
    promisedTatDelivery: '',
    shippedDateTime: '',
    deliveredDateTime: '',
    cancelledDateTime: '',
    cancelledBy: '',
    cancellationReason: '',
    platformChargeAmount: 0,
    shippingCharges: 0
  }
];

// Update the Order interface for draft orders
interface DraftOrder {
  retailOrderId: string;
  createDateTime: string;
  pickupAddress: {
    name: string;
    address: string;
    email: string;
  };
  deliveryAddress: {
    name: string;
    address: string;
    email: string;
  };
  orderCategory: string;
  totalOrderItems: number;
  packageDeadWeight: string;
  packageDimensions: {
    length: string;
    breadth: string;
    height: string;
  };
  orderCategoryType: string;
}

// Add this component for Draft Orders Table
const DraftOrdersTable: React.FC<{
  orders: Order[];
  onEdit: (order: Order) => void;
  onShipNow: (order: Order) => void;
  selectedOrders: string[];
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOrder: (orderId: string) => void;
}> = ({ 
  orders, 
  onEdit, 
  onShipNow, 
  selectedOrders, 
  onSelectAll, 
  onSelectOrder 
}) => {
  const draftOrders = orders.filter(order => order.status === 'draft');
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="w-12 px-6 py-3">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={selectedOrders.length === draftOrders.length && draftOrders.length > 0}
                onChange={onSelectAll}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Retail Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Create Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Pickup Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Delivery Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Order Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Total Order Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Package Dead Weight
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Package Dimensions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Order Category Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {draftOrders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => onSelectOrder(order.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                {order.retailOrderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.createDateTime}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>{order.pickupAddress.name}</div>
                <div>{order.pickupAddress.address}</div>
                <div>{order.pickupAddress.email}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>{order.deliveryAddress.name}</div>
                <div>{order.deliveryAddress.address}</div>
                <div>{order.deliveryAddress.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.orderCategory}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.totalOrderItems}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.packageDeadWeight}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                L - {order.packageDimensions.length} cm<br />
                B - {order.packageDimensions.breadth} cm<br />
                H - {order.packageDimensions.height} cm
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.orderCategoryType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onShipNow(order)}
                  className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                >
                  SHIP NOW
                </button>
                <button
                  onClick={() => onEdit(order)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const navigate = useNavigate();

  const tabs = [
    { label: 'All Orders', count: orders.length },
    { label: 'Ready to Ship', count: orders.filter((o) => o.status === 'ready_to_ship').length },
    { label: 'Created', count: orders.filter((o) => o.status === 'created').length },
    { label: 'Accepted', count: orders.filter((o) => o.status === 'accepted').length },
    { label: 'In Progress', count: orders.filter((o) => o.status === 'in_progress').length },
    { label: 'Completed', count: orders.filter((o) => o.status === 'completed').length },
    { label: 'Cancelled', count: orders.filter((o) => o.status === 'cancelled').length },
    { label: 'Draft Orders', count: orders.filter((o) => o.status === 'draft').length },

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
    // Update the navigation path to match your route structure
    navigate('/orders/create', { 
      state: { 
        mode: 'edit',
        orderData: order 
      }
    });
  };

  const handleDelete = (order: Order) => {
    // Implement delete logic
  };

  const handleCreateOrder = () => {
    navigate('/orders/create');
  };

  // Function to get filtered orders based on active tab
  const getFilteredOrders = () => {
    switch (activeTab) {
      case 0: // All Orders
        return orders;
      case 1: // Ready to Ship
        return orders.filter(order => order.status === 'ready_to_ship');
      case 2: // Created
        return orders.filter(order => order.status === 'created');
      case 3: // Accepted
        return orders.filter(order => order.status === 'accepted');
      case 4: // In Progress
        return orders.filter(order => order.status === 'in_progress');
      case 5: // Completed
        return orders.filter(order => order.status === 'completed');
      case 6: // Cancelled
        return orders.filter(order => order.status === 'cancelled');
      case 7: // Draft Orders
        return orders.filter(order => order.status === 'draft');
      default:
        return orders;
    }
  };

  // Render different filters based on active tab
  const renderFilters = () => {
    if (activeTab === 7) { // Draft Orders tab
      return (
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Retail Order ID"
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon className="w-5 h-5" />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedOrders.length > 0 && (
              <button
                onClick={() => handleBulkDelete()}
                className="flex items-center px-3 py-2 text-red-600 hover:text-red-700"
                title="Delete selected orders"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleBulkOrder}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              BULK ORDER
            </button>
          </div>
        </div>
      );
    }

    // Return default filters for other tabs
    return (
      <OrderFilters
        onSearch={handleSearch}
        onDateChange={handleDateChange}
        onStatusChange={handleStatusChange}
      />
    );
  };

  const handleBulkOrder = () => {
    navigate('/orders/bulk');
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) {
      // Implement delete logic here
      console.log('Deleting orders:', selectedOrders);
      setSelectedOrders([]); // Clear selection after delete
    }
  };

  // Add these handlers for selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const draftOrders = orders.filter(order => order.status === 'draft');
    if (e.target.checked) {
      setSelectedOrders(draftOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleShipNow = (order: Order) => {
    // Navigate to Search Logistics page with order data
    navigate('/search-logistics', {
      state: {
        orderId: order.id,
        retailOrderId: order.retailOrderId
      }
    });
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
          {renderFilters()}

          {tabs.map((_, index) => (
            <TabPanel key={index} value={activeTab} index={index}>
              {activeTab === 7 ? (
                <DraftOrdersTable
                  orders={getFilteredOrders()}
                  onEdit={handleEdit}
                  onShipNow={handleShipNow}
                  selectedOrders={selectedOrders}
                  onSelectAll={handleSelectAll}
                  onSelectOrder={handleSelectOrder}
                />
              ) : (
                <OrdersTable
                  orders={getFilteredOrders()}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </TabPanel>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;