import React from 'react';
import { Search, Download, Filter, Calendar, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTickets, createTicket, assignTicket } from '../store/slices/ticketSlice';

interface Ticket {
  status: 'OPEN' | 'CLOSED';
  ticketType: string;
  ticketId: string;
  networkIssueId: string;
  orderId: string;
  category: string;
  network: string;
  participants: string[];
  creationDateTime: string;
  issueCategory: string;
  issueSubCategory: string;
  relayDateTime: string;
  lastUpdateDateTime: string;
  closedDateTime: string;
  assignedAgent: string;
  assignedSeller: string;
}

const Support: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tickets, loading, error } = useAppSelector(state => state.tickets);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const paginatedTickets = tickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTicketClick = (ticketId: string) => {
    navigate(`/support/ticket/${ticketId}`);
  };

  const handleAssign = async (e: React.MouseEvent, ticketId: string) => {
    e.stopPropagation();
    try {
      await dispatch(assignTicket({ 
        ticketId, 
        assigneeData: { /* your assign data */ } 
      })).unwrap();
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [ticketForm, setTicketForm] = React.useState({
    orderId: '',
    issueCategory: '',
    subCategory: '',
    shortDescription: '',
    longDescription: '',
    image: null as File | null
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setTicketForm(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createTicket(ticketForm)).unwrap();
      setIsModalOpen(false);
      // Reset form
      setTicketForm({
        orderId: '',
        issueCategory: '',
        subCategory: '',
        shortDescription: '',
        longDescription: '',
        image: null
      });
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  // Add useEffect to handle body scroll and header fade
  React.useEffect(() => {
    const header = document.querySelector('header');
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      header?.classList.add('opacity-50', 'pointer-events-none');
    } else {
      document.body.style.overflow = 'unset';
      header?.classList.remove('opacity-50', 'pointer-events-none');
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
      header?.classList.remove('opacity-50', 'pointer-events-none');
    };
  }, [isModalOpen]);

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Show error state
  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        {/* Top Row - Title and Raise Ticket */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Support Tickets</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Raise Ticket
          </button>
        </div>

        {/* Search and Filters Row */}
        <div className="flex items-center gap-6">
          {/* Search Bar - Made Larger */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Network Issue Id, Order ID, or Ticket ID"
              className="w-full px-5 py-4 pl-14 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-base"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Filters Group */}
          <div className="flex items-center gap-4">
            <select className="px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-600 min-w-[180px]">
              <option value="">Issue category</option>
              <option value="FULFILLMENT">Fulfillment</option>
              <option value="PAYMENT">Payment</option>
            </select>
            
            <select className="px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-600 min-w-[150px]">
              <option value="">Status</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="date"
                  className="px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 pr-12 min-w-[180px]"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              <span className="text-gray-400 font-medium">to</span>
              <div className="relative">
                <input
                  type="date"
                  className="px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 pr-12 min-w-[180px]"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <button className="p-4 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
              <Download className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1800px]">
            <thead>
              <tr className="bg-purple-50 border-b border-purple-100">
                <th className="sticky left-0 bg-purple-50 py-4 px-5 text-left min-w-[100px]">
                  <div className="text-sm font-medium text-purple-700">Status</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[100px]">
                  <div className="text-sm font-medium text-purple-700">Type</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[180px]">
                  <div className="text-sm font-medium text-purple-700">Ticket ID</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[180px]">
                  <div className="text-sm font-medium text-purple-700">Network Issue ID</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[180px]">
                  <div className="text-sm font-medium text-purple-700">Order ID</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[120px]">
                  <div className="text-sm font-medium text-purple-700">Category</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[250px]">
                  <div className="text-sm font-medium text-purple-700">Network</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[250px]">
                  <div className="text-sm font-medium text-purple-700">Participants</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[160px]">
                  <div className="text-sm font-medium text-purple-700">Creation</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[160px]">
                  <div className="text-sm font-medium text-purple-700">Last Update</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[160px]">
                  <div className="text-sm font-medium text-purple-700">Closed</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[140px]">
                  <div className="text-sm font-medium text-purple-700">Issue Category</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[140px]">
                  <div className="text-sm font-medium text-purple-700">Sub Category</div>
                </th>
                <th className="py-4 px-5 text-left min-w-[120px]">
                  <div className="text-sm font-medium text-purple-700">Assignment</div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedTickets.map((ticket) => (
                <tr 
                  key={ticket.ticketId}
                  onClick={() => handleTicketClick(ticket.ticketId)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <td className="sticky left-0 bg-white py-4 px-5 border-r border-gray-100">
                    <span className={`
                      inline-flex px-3 py-1 text-xs font-medium rounded-full
                      ${ticket.status === 'OPEN' 
                        ? 'bg-red-50 text-red-700' 
                        : 'bg-green-50 text-green-700'
                      }
                    `}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <span className="text-sm text-gray-900">{ticket.ticketType}</span>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <span className="text-sm text-blue-600 hover:text-blue-800">{ticket.ticketId}</span>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <span className="text-sm text-gray-600">{ticket.networkIssueId}</span>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <span className="text-sm text-gray-900">{ticket.orderId}</span>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <span className="text-sm text-gray-600">{ticket.category}</span>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">🏪</span>
                      <span className="text-sm text-gray-900">{ticket.network}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center">🏢</span>
                      <span className="text-sm text-gray-900">{ticket.participants.join(', ')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <span className="text-sm text-gray-600">{ticket.creationDateTime}</span>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <span className="text-sm text-gray-600">{ticket.lastUpdateDateTime}</span>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <span className="text-sm text-gray-600">{ticket.closedDateTime}</span>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <span className="text-sm font-medium text-gray-900">{ticket.issueCategory}</span>
                  </td>
                  <td className="py-4 px-5 border-r border-gray-100">
                    <span className="text-sm text-gray-600">{ticket.issueSubCategory}</span>
                  </td>
                  <td className="py-4 px-5">
                    <button 
                      onClick={(e) => handleAssign(e, ticket.ticketId)}
                      className="px-4 py-1.5 text-xs font-medium text-purple-600 border border-purple-200 rounded-full 
                        hover:bg-purple-50 transition-colors duration-200 
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, tickets.length)} of {tickets.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    px-3.5 py-2 rounded-lg text-sm font-medium
                    ${currentPage === page 
                      ? 'bg-purple-50 text-purple-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal with transition */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full min-h-screen bg-black/50 flex items-center justify-center z-[200] backdrop-blur-sm"
          style={{ minHeight: '100vh', marginTop: '0' }}
        >
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 animate-modal-slide">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Ticket</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-[200px,1fr] items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Order ID <span className="text-red-500">*</span>
                  </label>
                  <select 
                    required
                    value={ticketForm.orderId}
                    onChange={e => setTicketForm(prev => ({ ...prev, orderId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Order ID</option>
                    <option value="order1">Order #1</option>
                    <option value="order2">Order #2</option>
                  </select>
                </div>

                <div className="grid grid-cols-[200px,1fr] items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Issue Category <span className="text-red-500">*</span>
                  </label>
                  <select 
                    required
                    value={ticketForm.issueCategory}
                    onChange={e => setTicketForm(prev => ({ ...prev, issueCategory: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Category</option>
                    <option value="FULFILLMENT">Fulfillment</option>
                    <option value="PAYMENT">Payment</option>
                  </select>
                </div>

                <div className="grid grid-cols-[200px,1fr] items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Sub-Category <span className="text-red-500">*</span>
                  </label>
                  <select 
                    required
                    value={ticketForm.subCategory}
                    onChange={e => setTicketForm(prev => ({ ...prev, subCategory: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Sub-Category</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Refund">Refund</option>
                  </select>
                </div>

                <div className="grid grid-cols-[200px,1fr] items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={ticketForm.shortDescription}
                    onChange={e => setTicketForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Short Description"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-[200px,1fr] items-start gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Long Description <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    required
                    value={ticketForm.longDescription}
                    onChange={e => setTicketForm(prev => ({ ...prev, longDescription: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-[200px,1fr] items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Upload an Image <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support; 