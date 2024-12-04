import React, { useState, useEffect } from 'react';
import { Table } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCustomers } from '../store/slices/customerSlice';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange 
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700">
          Show
        </p>
        <select
          className="border rounded-md px-2 py-1 text-sm"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <p className="text-sm text-gray-700">entries</p>
      </div>

      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="outline"
              className="rounded-l-md"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? "default" : "outline"}
                onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              className="rounded-r-md"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

const Customers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, loading, error, pagination } = useAppSelector((state) => state.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCustomers({ 
          page: currentPage, 
          perPage: itemsPerPage,
          search: searchTerm 
        })).unwrap();
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      }
    };

    fetchData();
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Customers</h1>
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by name, email or mobile..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>User Name</Table.Head>
                  <Table.Head>Email</Table.Head>
                  <Table.Head>Mobile Number</Table.Head>
                  <Table.Head>User Type</Table.Head>
                  <Table.Head>Cancelled Orders</Table.Head>
                  <Table.Head>Total Orders</Table.Head>
                  <Table.Head>Delivered Orders</Table.Head>
                  <Table.Head>Total RTO</Table.Head>
                  <Table.Head>Total Amount</Table.Head>
                  <Table.Head>Wallet Amount</Table.Head>
                  <Table.Head>Created Date & Time</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {customers?.map((customer) => (
                  <Table.Row key={customer.id}>
                    <Table.Cell>{customer.name || 'N/A'}</Table.Cell>
                    <Table.Cell>{customer.email}</Table.Cell>
                    <Table.Cell>{customer.mobile_number || 'N/A'}</Table.Cell>
                    <Table.Cell>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {customer.user_types?.[0]?.name || 'N/A'}
                      </span>
                    </Table.Cell>
                    <Table.Cell>{customer.aggrigate?.total_cancelled_orders_count || 0}</Table.Cell>
                    <Table.Cell>{customer.aggrigate?.total_orders_count || 0}</Table.Cell>
                    <Table.Cell>{customer.aggrigate?.total_delivered_orders || 0}</Table.Cell>
                    <Table.Cell>{customer.aggrigate?.total_rto || 0}</Table.Cell>
                    <Table.Cell>₹{(customer.aggrigate?.total_amount || 0).toLocaleString()}</Table.Cell>
                    <Table.Cell>₹{parseFloat(customer.wallet?.total_available || '0').toLocaleString()}</Table.Cell>
                    <Table.Cell>
                      {new Date(customer.createdAt).toLocaleString()}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Customers;