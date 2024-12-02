import React, { useState, useEffect } from 'react';
import { Download, Plus, Search as SearchIcon, Trash2 } from 'lucide-react';
import OrdersTable from '../components/orders/OrdersTable';
import OrderFilters from '../components/orders/OrderFilters';
import TabPanel from '../components/common/TabPanel';
import { Order } from '../types/orders';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders } from '../store/slices/ordersSlice';

const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    provider: '',
    fulfillment_state: '',
    from_date: '',
    to_date: '',
    created_by: ''
  });

  useEffect(() => {
    // Create query parameters based on active tab
    const tabFilters = { ...filters };
    
    switch (activeTab) {
      case 1: // Ready to Ship
        tabFilters.rts = 'true';
        break;
      case 2: // Created
        tabFilters.state = 'Created';
        break;
      case 3: // Accepted
        tabFilters.state = 'Accepted';
        break;
      case 4: // In Progress
        tabFilters.state = 'In-Progress';
        break;
      case 5: // Completed
        tabFilters.state = 'Completed';
        break;
      case 6: // Cancelled
        tabFilters.state = 'Cancelled';
        break;
      case 7: // Draft Orders
        // Will be handled later
        break;
    }

    dispatch(fetchOrders(tabFilters));
  }, [dispatch, filters, activeTab]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleShipmentTypeChange = (type: string) => {
    setFilters(prev => ({ ...prev, category: type }));
  };

  const handleProviderChange = (provider: string) => {
    setFilters(prev => ({ ...prev, provider }));
  };

  const handleFulfillmentStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, fulfillment_state: status }));
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setFilters(prev => ({
      ...prev,
      from_date: startDate,
      to_date: endDate
    }));
  };

  const handleCreatedByChange = (userId: string) => {
    setFilters(prev => ({ ...prev, created_by: userId }));
  };

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

  // Remove or simplify getFilteredOrders since filtering will now happen on the server
  const getFilteredOrders = () => orders;

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
        onShipmentTypeChange={handleShipmentTypeChange}
        onProviderChange={handleProviderChange}
        onFulfillmentStatusChange={handleFulfillmentStatusChange}
        onDateRangeChange={handleDateRangeChange}
        onCreatedByChange={handleCreatedByChange}
        filters={filters}
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

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            tabs.map((_, index) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;