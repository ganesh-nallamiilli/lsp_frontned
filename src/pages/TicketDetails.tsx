import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TicketDetails: React.FC = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-blue-600">🎫</span>
          <span className="text-gray-500">Ticket ID</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Update Network Status</span>
          <span className="px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
            CLOSED
          </span>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-3 bg-white rounded-lg p-6 shadow-sm">
        <div>
          <div className="text-gray-600 text-sm">Creation Date & time</div>
          <div className="mt-1">22-01-2024 11:16:22</div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">Last updated date & time</div>
          <div className="mt-1">22-01-2024 11:28:05</div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">Relay date & time</div>
          <div className="mt-1">23-01-2024 11:16:22</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-4 space-y-6">
          {/* Source Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-purple-600 mb-6">Source information</h2>
            <div className="space-y-4">
              <div>
                <div className="text-gray-600 mb-1">Ticket ID:</div>
                <div>8401963f-ee47-484e-83af-847e747b2f8a</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Order ID:</div>
                <div className="text-blue-600">433ba22d-4f1b-4ae9-b2a1-125dbaa23358</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Network Issue ID:</div>
                <div>--</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Source:</div>
                <div>ONDC Logistics Seller App by WITS</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Short Description:</div>
                <div>fffff</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Long Description:</div>
                <div>hbgftdr</div>
              </div>
            </div>
          </div>

          {/* Issue Category */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-purple-600 mb-4">Issue Category</h2>
            <div>FULFILLMENT</div>
          </div>

          {/* Network Participants */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-purple-600 mb-6">Network Participants</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">🏪</span>
                  Buyer Application Name
                </div>
                <div>logistics-backend.zionmart.in</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">🏬</span>
                  Seller Application Name
                </div>
                <div>ONDC Logistics Seller App by WITS</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">🚚</span>
                  Logistics Provider
                </div>
                <div>ref-logistics-app-preprod.ondc.org</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Chat Section */}
        <div className="col-span-8">
          {/* Issue Type Tabs */}
          <div className="flex gap-2 mb-6">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full">
              On Network Issue
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-full border">
              On Network Logistics Issue
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-full border">
              Internal Issue
            </button>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                👤
              </div>
              <div>
                <div className="font-medium">Buyer (Saira)</div>
                <div className="text-gray-600 mt-1">hbgftdr</div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                👤
              </div>
              <div>
                <div className="font-medium">Admin (lgm Lsp App Admin)</div>
                <div className="text-gray-600 mt-1">hello</div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                👤
              </div>
              <div>
                <div className="font-medium">Admin (lgm Lsp App Admin)</div>
                <div className="text-gray-600 mt-1">50 refund</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails; 