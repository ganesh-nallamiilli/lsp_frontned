import React, { useEffect } from 'react';
import { Search, X } from 'lucide-react';
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
  filters: {
    search: string;
    category: string;
    provider: string;
    fulfillment_state: string;
    from_date: string;
    to_date: string;
    created_by: string;
  };
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  onSearch,
  onShipmentTypeChange,
  onProviderChange,
  onFulfillmentStatusChange,
  onDateRangeChange,
  onCreatedByChange,
  filters,
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
    <div id="order-filters-container" className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div id="order-filters-container-flex-gap-4-overflow-x-auto-pb-2" className="flex gap-4 overflow-x-auto pb-2">
        {/* Search Input */}
        <div id="order-filters-container-search-input" className="relative min-w-[240px]">
          <input
            id="order-filters-container-search-input-input"
            type="text"
            placeholder="Search Order ID/ Transaction ID"
            value={filters?.search || ""}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <Search id="order-filters-container-search-input-search-icon" className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          {filters?.search && (
            <button
              id="order-filters-container-search-input-button"
              onClick={() => onSearch('')}
              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Shipment Type Dropdown */}
        <div id="order-filters-container-shipment-type-dropdown" className="relative min-w-[200px]">
          <select
            id="order-filters-container-shipment-type-dropdown-select"
            value={filters?.category || ""}
            onChange={(e) => onShipmentTypeChange(e.target.value)}
            className="w-full pl-3 pr-20 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none truncate"
            disabled={loading}
          >
            <option id="order-filters-container-shipment-type-dropdown-select-option" value="">Shipment Type</option>
            {categoryTypes.map((type) => (
              <option id={`order-filters-container-shipment-type-dropdown-select-option-${type.id}`} key={type.id} value={type.lookup_code}>
                {type.display_name}
              </option>
            ))}
          </select>
          <div id="order-filters-container-shipment-type-dropdown-button" className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
            {filters?.category && (
              <button
                id="order-filters-container-shipment-type-dropdown-button-x"
                onClick={() => onShipmentTypeChange('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div id="order-filters-container-shipment-type-dropdown-button-svg" className="pointer-events-none text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Provider Dropdown */}
        <div id="order-filters-container-provider-dropdown" className="relative min-w-[200px]">
          <select
            id="order-filters-container-provider-dropdown-select"
            value={filters?.provider || ""}
            onChange={(e) => onProviderChange(e.target.value)}
            className="w-full pl-3 pr-20 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none truncate"
            disabled={loading}
          >
            <option value="">Provider</option>
            {providers.map((provider) => (
              <option id={`order-filters-container-provider-dropdown-select-option-${provider}`} key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
          <div id="order-filters-container-provider-dropdown-button" className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
            {filters?.provider && (
              <button
                id="order-filters-container-provider-dropdown-button-x"
                onClick={() => onProviderChange('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div id="order-filters-container-provider-dropdown-button-svg" className="pointer-events-none text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Fulfillment Status Dropdown */}
        <div id="order-filters-container-fulfillment-status-dropdown" className="relative min-w-[200px]">
          <select
            id="order-filters-container-fulfillment-status-dropdown-select"
            value={filters?.fulfillment_state || ""}
            onChange={(e) => onFulfillmentStatusChange(e.target.value)}
            className="w-full pl-3 pr-20 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none truncate"
            disabled={loading}
          >
            <option value="">Fulfillment Status</option>
            {fulfillmentStatuses.map((status) => (
              <option id={`order-filters-container-fulfillment-status-dropdown-select-option-${status.id}`} key={status.id} value={status.lookup_code}>
                {status.display_name}
              </option>
            ))}
          </select>
          <div id="order-filters-container-fulfillment-status-dropdown-button" className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
            {filters?.fulfillment_state && (
              <button
                id="order-filters-container-fulfillment-status-dropdown-button-x"
                onClick={() => onFulfillmentStatusChange('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div id="order-filters-container-fulfillment-status-dropdown-button-svg" className="pointer-events-none text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Created By Dropdown */}
        <div id="order-filters-container-created-by-dropdown" className="relative min-w-[200px]">
          <select
            id="order-filters-container-created-by-dropdown-select"
            value={filters?.created_by || ""}
            onChange={(e) => onCreatedByChange(e.target.value)}
            className="w-full pl-3 pr-20 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none truncate"
            disabled={loading}
          >
            <option value="">Created By</option>
            {users.map((user) => (
              <option id={`order-filters-container-created-by-dropdown-select-option-${user.id}`} key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <div id="order-filters-container-created-by-dropdown-button" className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
            {filters?.created_by && (
              <button
                id="order-filters-container-created-by-dropdown-button-x"
                onClick={() => onCreatedByChange('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div id="order-filters-container-created-by-dropdown-button-svg" className="pointer-events-none text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Range Inputs */}
        <div id="order-filters-container-date-range-inputs" className="flex gap-2">
          <div id="order-filters-container-date-range-inputs-from-date" className="relative">
            <input
              id="order-filters-container-date-range-inputs-from-date-input"
              type="date"
              value={filters?.from_date || ""}
              onChange={(e) => onDateRangeChange(e.target.value, filters.to_date)}
              className="w-full pl-3 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            {filters?.from_date && (
              <button
                id="order-filters-container-date-range-inputs-from-date-button"
                onClick={() => onDateRangeChange('', filters.to_date)}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div id="order-filters-container-date-range-inputs-to-date" className="relative">
            <input
              id="order-filters-container-date-range-inputs-to-date-input"
              type="date"
              value={filters?.to_date || ""}
              onChange={(e) => onDateRangeChange(filters.from_date, e.target.value)}
              className="w-full pl-3 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            {filters?.to_date && (
              <button
                id="order-filters-container-date-range-inputs-to-date-button"
                onClick={() => onDateRangeChange(filters.from_date, '')}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;