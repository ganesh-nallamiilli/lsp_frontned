import React, { useState, useEffect } from 'react';
import { Eye, Edit, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFranchises } from '../store/slices/franchiseSlice';

interface Franchise {
  franchiseName: string;
  ownerName: string;
  email: string;
  mobile: string;
  panNumber: string;
  createDate: string;
  status: boolean;
}

const Franchise: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { franchises, loading, error } = useAppSelector((state) => state.franchise);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchFranchises());
  }, [dispatch]);

  // Filter franchises based on search term and status
  const filteredFranchises = franchises.filter((franchise) => {
    console.log("franchise",franchise);
    const matchesSearch = franchise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' ? franchise.status : !franchise.status);
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredFranchises.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredFranchises.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Previous button
    buttons.push(
      <button
        id="franchise-pagination-button-prev"
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          id="franchise-pagination-button-1"
          key={1}
          onClick={() => goToPage(1)}
          className="px-3 py-1 rounded-md hover:bg-gray-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="dots1">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          id={`franchise-pagination-button-${i}`}
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="dots2">...</span>);
      }
      buttons.push(
        <button
          id={`franchise-pagination-button-${totalPages}`}
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="px-3 py-1 rounded-md hover:bg-gray-100"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        id="franchise-pagination-button-next"
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    );

    return buttons;
  };

  return (
    <div id="franchise-container-p-6" className="p-6">
      {/* Header Section */}
      <div id="franchise-container-flex-justify-between-items-center-mb-6" className="flex justify-between items-center mb-6">
        <button 
          className="bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-blue-800"
          onClick={() => navigate('/franchise/create')}
        >
          <Plus size={20} />
          CREATE
        </button>

        <div className="flex gap-4">
          {/* Search Input */}
          <div id="franchise-container-flex-gap-4-div-relative" className="relative">
            <input
              id="franchise-container-flex-gap-4-div-relative-input"
              type="text"
              placeholder="Search Franchise Name"
              className="pl-10 pr-4 py-2 border rounded-md w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          {/* Status Filter */}
          <select
            id="franchise-container-flex-gap-4-select"
            className="border rounded-md px-4 py-2 w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div id="franchise-container-text-center-py-4" className="text-center py-4">Loading...</div>
      ) : error ? (
        <div id="franchise-container-text-center-text-red-600-py-4" className="text-center text-red-600 py-4">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table id="franchise-container-table-min-w-full" className="min-w-full">
            <thead id="franchise-container-table-thead-bg-gray-50" className="bg-gray-50">
              <tr>
                <th id="franchise-container-table-franchise-name" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Franchise Name
                </th>
                <th id="franchise-container-table-owner-name" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner Name
                </th>
                <th id="franchise-container-table-email" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th id="franchise-container-table-mobile" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th id="franchise-container-table-pan-number" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PAN Number
                </th>
                <th id="franchise-container-table-create-date" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Create Date & time
                </th>
                <th id="franchise-container-table-status" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th id="franchise-container-table-action" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((franchise, index) => (
                <tr key={index}>
                  <td id="franchise-container-table-franchise-name" className="px-6 py-4 whitespace-nowrap">{franchise.store_name}</td>
                  <td id="franchise-container-table-owner-name" className="px-6 py-4 whitespace-nowrap">{franchise.name}</td>
                  <td id="franchise-container-table-email" className="px-6 py-4 whitespace-nowrap">{franchise.email}</td>
                  <td id="franchise-container-table-mobile" className="px-6 py-4 whitespace-nowrap">{franchise.mobile_number}</td>
                  <td id="franchise-container-table-pan-number" className="px-6 py-4 whitespace-nowrap">{franchise.pan_number}</td>
                  <td id="franchise-container-table-create-date" className="px-6 py-4 whitespace-nowrap">{franchise.createdAt}</td>
                  <td id="franchise-container-table-status" className="px-6 py-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        id="franchise-container-table-status-input"
                        type="checkbox" 
                        className="sr-only peer"
                        checked={franchise.is_active}
                        onChange={() => {/* Handle status change */}}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-3">
                      <button 
                        id="franchise-container-table-action-button-eye"
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() => navigate(`/franchise/view/${franchise.id}`)}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        id="franchise-container-table-action-button-edit"
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() => navigate(`/franchise/edit/${franchise.id}`)}
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div id="franchise-container-table-pagination-main" className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div id="franchise-container-table-pagination-main-text-sm-text-gray-500" className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{' '}
              {totalItems} results
            </div>
            <div className="flex gap-2 items-center">
              {renderPaginationButtons()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Franchise; 