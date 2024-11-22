import React, { useState } from 'react';
import { Download, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import OrdersTable from '../components/orders/OrdersTable';
import OrderFilters from '../components/orders/OrderFilters';
import { Order } from '../types/orders';

const mockReturns: Order[] = [
  {
    id: '1',
    customerName: 'Jane Doe',
    orderNumber: 'RTN-2024-001',
    status: 'in_progress',
    createdAt: '2024-03-15',
    total: 299.99,
    items: [
      {
        id: '1',
        name: 'Product 1',
        quantity: 1,
        price: 299.99,
      },
    ],
    shippingAddress: {
      street: '789 Pine St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
  },
];

const Returns: React.FC = () => {
  const [returns, setReturns] = useState<Order[]>(mockReturns);

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
          <h1 className="text-2xl font-bold text-gray-900">Returns Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Process and manage customer returns
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve Selected
          </button>
          <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <XCircle className="w-4 h-4 mr-2" />
            Reject Selected
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Returns
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-100 rounded-full">
              <RefreshCcw className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Returns</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <RefreshCcw className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
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
            orders={returns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Returns;