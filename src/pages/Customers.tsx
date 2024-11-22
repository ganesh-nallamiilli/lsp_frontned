import React, { useState, useEffect } from 'react';
import { Table } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Customer {
  id: string;
  userName: string;
  email: string;
  mobileNumber: string;
  userType: "STANDALONE_USER";
  totalCancelledOrders: number;
  totalOrders: number;
  totalDeliveredOrders: number;
  totalRTO: number;
  totalAmount: number;
  walletAmount: number;
  createdAt: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    userName: "John Doe",
    email: "john.doe@example.com",
    mobileNumber: "9876543210",
    userType: "STANDALONE_USER",
    totalCancelledOrders: 2,
    totalOrders: 15,
    totalDeliveredOrders: 12,
    totalRTO: 1,
    totalAmount: 25000,
    walletAmount: 500,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    userName: "Jane Smith",
    email: "jane.smith@example.com",
    mobileNumber: "9876543211",
    userType: "STANDALONE_USER",
    totalCancelledOrders: 1,
    totalOrders: 25,
    totalDeliveredOrders: 23,
    totalRTO: 1,
    totalAmount: 45000,
    walletAmount: 1200,
    createdAt: "2024-01-20T14:20:00Z"
  },
  {
    id: "3",
    userName: "Robert Johnson",
    email: "robert.j@example.com",
    mobileNumber: "9876543212",
    userType: "STANDALONE_USER",
    totalCancelledOrders: 0,
    totalOrders: 8,
    totalDeliveredOrders: 8,
    totalRTO: 0,
    totalAmount: 12000,
    walletAmount: 200,
    createdAt: "2024-02-01T09:15:00Z"
  },
  {
    id: "4",
    userName: "Sarah Williams",
    email: "sarah.w@example.com",
    mobileNumber: "9876543213",
    userType: "STANDALONE_USER",
    totalCancelledOrders: 3,
    totalOrders: 30,
    totalDeliveredOrders: 25,
    totalRTO: 2,
    totalAmount: 55000,
    walletAmount: 1500,
    createdAt: "2024-02-05T16:45:00Z"
  },
  {
    id: "5",
    userName: "Michael Brown",
    email: "michael.b@example.com",
    mobileNumber: "9876543214",
    userType: "STANDALONE_USER",
    totalCancelledOrders: 1,
    totalOrders: 12,
    totalDeliveredOrders: 10,
    totalRTO: 1,
    totalAmount: 18000,
    walletAmount: 300,
    createdAt: "2024-02-10T11:30:00Z"
  },
  {
    id: "6",
    userName: "Emily Davis",
    email: "emily.d@example.com",
    mobileNumber: "9876543215",
    userType: "STANDALONE_USER",
    totalCancelledOrders: 2,
    totalOrders: 20,
    totalDeliveredOrders: 17,
    totalRTO: 1,
    totalAmount: 35000,
    walletAmount: 800,
    createdAt: "2024-02-15T13:20:00Z"
  },
  {
    id: "7",
    userName: "David Wilson",
    email: "david.w@example.com",
    mobileNumber: "9876543216",
    userType: "STANDALONE_USER",
    totalCancelledOrders: 0,
    totalOrders: 5,
    totalDeliveredOrders: 5,
    totalRTO: 0,
    totalAmount: 8000,
    walletAmount: 100,
    createdAt: "2024-02-20T10:10:00Z"
  },
  {
    id: "8",
    userName: "Lisa Anderson",
    email: "lisa.a@example.com",
    mobileNumber: "9876543217",
    userType: "STANDALONE_USER",
    totalCancelledOrders: 1,
    totalOrders: 28,
    totalDeliveredOrders: 26,
    totalRTO: 1,
    totalAmount: 48000,
    walletAmount: 1000,
    createdAt: "2024-02-25T15:30:00Z"
  },
  {
    id: "9",
    userName: "James Taylor",
    email: "james.t@example.com",
    mobileNumber: "9876543218",
    userType: "STANDALONE_USER",
    totalCancelledOrders: 1,
    totalOrders: 10,
    totalDeliveredOrders: 8,
    totalRTO: 1,
    totalAmount: 15000,
    walletAmount: 250,
    createdAt: "2024-03-01T09:45:00Z"
  },
  {
    id: "10",
    userName: "Emma Martinez",
    email: "emma.m@example.com",
    mobileNumber: "9876543219",
    userType: "STANDALONE_USER",
    totalCancelledOrders: 2,
    totalOrders: 22,
    totalDeliveredOrders: 19,
    totalRTO: 1,
    totalAmount: 40000,
    walletAmount: 900,
    createdAt: "2024-03-05T14:15:00Z"
  }
];

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchCustomers = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCustomers(mockCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobileNumber.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

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

      {isLoading ? (
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
                {paginatedCustomers.map((customer) => (
                  <Table.Row key={customer.id}>
                    <Table.Cell>{customer.userName}</Table.Cell>
                    <Table.Cell>{customer.email}</Table.Cell>
                    <Table.Cell>{customer.mobileNumber}</Table.Cell>
                    <Table.Cell>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        STANDALONE_USER
                      </span>
                    </Table.Cell>
                    <Table.Cell>{customer.totalCancelledOrders}</Table.Cell>
                    <Table.Cell>{customer.totalOrders}</Table.Cell>
                    <Table.Cell>{customer.totalDeliveredOrders}</Table.Cell>
                    <Table.Cell>{customer.totalRTO}</Table.Cell>
                    <Table.Cell>₹{customer.totalAmount.toLocaleString()}</Table.Cell>
                    <Table.Cell>₹{customer.walletAmount.toLocaleString()}</Table.Cell>
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
            totalPages={totalPages}
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