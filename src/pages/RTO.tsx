import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRTOOrders } from '../store/slices/rtoSlice';
import { RootState } from '../store/store';
import { Download, RotateCcw } from 'lucide-react';
import OrdersTable from '../components/orders/OrdersTable';
import OrderFilters from '../components/orders/OrderFilters';
import { Order } from '../types/orders';

const RTO: React.FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state: RootState) => state.rto);
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
    dispatch(fetchRTOOrders(filters) as any);
  }, [dispatch, filters]);

  console.log("orders>>>>>>>>>>>>>>>>>>>>>",orders);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800">Error Loading Orders</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={() => dispatch(fetchRTOOrders(filters))}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RTO Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track Return to Origin orders
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export RTO Data
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <OrderFilters
            onSearch={handleSearch}
            onShipmentTypeChange={handleShipmentTypeChange}
            onProviderChange={handleProviderChange}
            onFulfillmentStatusChange={handleFulfillmentStatusChange}
            onDateRangeChange={handleDateRangeChange}
            onCreatedByChange={handleCreatedByChange}
          />
          <OrdersTable
            orders={orders}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default RTO;