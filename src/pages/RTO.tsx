import React, { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import OrdersTable from '../components/orders/OrdersTable';
import OrderFilters from '../components/orders/OrderFilters';
import { Order } from '../types/orders';

const mockRTOOrders: Order[] = [
  {
    id: '1',
    customerName: 'John Smith',
    orderNumber: 'RTO-2024-001',
    status: 'in_progress',
    createdAt: '2024-03-15',
    total: 199.99,
    items: [
      {
        id: '1',
        name: 'Product 1',
        quantity: 1,
        price: 199.99,
      },
    ],
    shippingAddress: {
      street: '456 Oak St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
  },
];

const RTO: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockRTOOrders);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-full">
              <RotateCcw className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total RTO</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <RotateCcw className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending RTO</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <RotateCcw className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed RTO</p>
              <p className="text-2xl font-bold text-gray-900">16</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <OrderFilters
            onSearch={handleSearch}
            onDateChange={handleDateChange}
            onStatusChange={handleStatusChange}
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