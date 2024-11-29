import React from 'react';
import { Search } from 'lucide-react';

interface OrderFiltersProps {
  onSearch: (query: string) => void;
  onShipmentTypeChange: (type: string) => void;
  onProviderChange: (provider: string) => void;
  onFulfillmentStatusChange: (status: string) => void;
  onCreatedByChange: (creator: string) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  onSearch,
  onShipmentTypeChange,
  onProviderChange,
  onFulfillmentStatusChange,
  onCreatedByChange,
  onDateRangeChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search Order ID/ Transaction ID"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        {/* Shipment Type Dropdown */}
        <div className="min-w-[160px]">
          <select
            onChange={(e) => onShipmentTypeChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white"
          >
            <option value="">Shipment Type</option>
            <option value="express">Express</option>
            <option value="standard">Standard</option>
            {/* Add more shipment types as needed */}
          </select>
        </div>

        {/* Provider Dropdown */}
        <div className="min-w-[160px]">
          <select
            onChange={(e) => onProviderChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white"
          >
            <option value="">Provider</option>
            {/* Add provider options */}
          </select>
        </div>

        {/* Fulfillment Status Dropdown */}
        <div className="min-w-[160px]">
          <select
            onChange={(e) => onFulfillmentStatusChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white"
          >
            <option value="">Fulfillment Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            {/* Add more status options */}
          </select>
        </div>

        {/* Created By Dropdown */}
        <div className="min-w-[160px]">
          <select
            onChange={(e) => onCreatedByChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white"
          >
            <option value="">Created By</option>
            {/* Add creator options */}
          </select>
        </div>

        {/* Date Range Inputs */}
        <div className="flex gap-2">
          <input
            type="date"
            onChange={(e) => onDateRangeChange(e.target.value, '')}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            placeholder="From Date"
          />
          <input
            type="date"
            onChange={(e) => onDateRangeChange('', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            placeholder="To Date"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;