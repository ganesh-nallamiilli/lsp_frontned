import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchCategoryTypes, 
  fetchFulfillmentStatuses,
  fetchProviders,
  fetchUsers 
} from '../../store/slices/lookupSlice';

interface OrderFiltersProps {
  onSearch: (query: string) => void;
  onShipmentTypeChange: (type: string) => void;
  onProviderChange: (provider: string) => void;
  onFulfillmentStatusChange: (status: string) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onCreatedByChange: (userId: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  onSearch,
  onShipmentTypeChange,
  onProviderChange,
  onFulfillmentStatusChange,
  onDateRangeChange,
  onCreatedByChange,
}) => {
  const dispatch = useAppDispatch();
  const { categoryTypes, fulfillmentStatuses, providers, users, loading } = useAppSelector((state) => state.lookup);

  useEffect(() => {
    dispatch(fetchCategoryTypes());
    dispatch(fetchFulfillmentStatuses());
    dispatch(fetchProviders());
    dispatch(fetchUsers());
  }, [dispatch]);

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
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            disabled={loading}
          >
            <option value="">Shipment Type</option>
            {categoryTypes.map((type) => (
              <option key={type.id} value={type.lookup_code}>
                {type.display_name}
              </option>
            ))}
          </select>
        </div>

        {/* Provider Dropdown */}
        <div className="min-w-[160px]">
          <select
            onChange={(e) => onProviderChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white"
            disabled={loading}
          >
            <option value="">Provider</option>
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </div>

        {/* Fulfillment Status Dropdown */}
        <div className="min-w-[160px]">
          <select
            onChange={(e) => onFulfillmentStatusChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white"
            disabled={loading}
          >
            <option value="">Fulfillment Status</option>
            {fulfillmentStatuses.map((status) => (
              <option key={status.id} value={status.lookup_code}>
                {status.display_name}
              </option>
            ))}
          </select>
        </div>

        {/* Created By Dropdown */}
        <div className="min-w-[160px]">
          <select
            onChange={(e) => onCreatedByChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white"
            disabled={loading}
          >
            <option value="">Created By</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Inputs */}
        <div className="flex gap-2">
          <input
            type="date"
            onChange={(e) => onDateRangeChange(e.target.value, '')}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <input
            type="date"
            onChange={(e) => onDateRangeChange('', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;