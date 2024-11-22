import React from 'react';
import { Search, Download, Filter, Calendar } from 'lucide-react';

interface Ticket {
  ticketType: string;
  ticketId: string;
  networkIssueId: string;
  orderId: string;
  category: string;
  participants: {
    backend: string;
    server: string;
  };
  creationDate: string;
  issueCategory: string;
  subCategory: string;
  relayDateTime: string;
  status: 'OPEN' | 'CLOSED';
}

const Support: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
        <button className="flex-shrink-0 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
          RAISE TICKET
        </button>
        
        <div className="flex-1 flex items-center gap-4 min-w-0">
          <div className="relative flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search by Network Issue Id"
              className="w-full px-4 py-2 border rounded-md pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <select className="flex-shrink-0 px-4 py-2 border rounded-md w-48">
            <option value="">Issue category</option>
            {/* Add your categories */}
          </select>
          
          <select className="flex-shrink-0 px-4 py-2 border rounded-md w-48">
            <option value="">Status</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
          
          <input
            type="date"
            className="flex-shrink-0 px-4 py-2 border rounded-md"
            placeholder="From Date"
          />
          
          <input
            type="date"
            className="flex-shrink-0 px-4 py-2 border rounded-md"
            placeholder="To Date"
          />
          
          <button className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-md">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Table with horizontal scroll */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]"> {/* Minimum width to prevent squishing */}
            <div className="bg-orange-400 text-white">
              <div className="grid grid-cols-7 p-4 font-medium">
                <div className="col-span-2">
                  <div>Ticket Type</div>
                  <div>Ticket ID</div>
                  <div>Network Issue ID</div>
                </div>
                <div className="col-span-2">
                  <div>Order ID</div>
                  <div>Category</div>
                </div>
                <div>
                  <div>Network</div>
                  <div>Participants</div>
                </div>
                <div>
                  <div>Issue</div>
                  <div>date & time</div>
                </div>
                <div>
                  <div>Relay</div>
                  <div>date & time</div>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {/* Example ticket row */}
              <div className="grid grid-cols-7 p-4 hover:bg-gray-50">
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                      OPEN
                    </span>
                    <span>ISSUE</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">7aebd114-43e8-4499-8d67-d50d7dd35cd9</div>
                  <div className="text-sm text-gray-600">--</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm">C0001SZACKXK03K42P</div>
                  <div className="text-sm text-gray-600">Fashion</div>
                </div>
                <div className="text-sm text-gray-600">
                  <div>logistics-backend.zionmart.in</div>
                  <div>pramaan.ondc.org/alpha/mock-server</div>
                </div>
                <div className="text-sm text-gray-600">
                  20-11-2024 13:32:06
                </div>
                <div className="text-sm text-gray-600">
                  20-11-2024 13:32:06
                </div>
              </div>
              {/* Add more ticket rows as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support; 