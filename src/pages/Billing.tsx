import React, { useEffect } from 'react';
import { FileText, Download, Filter, Calendar, DollarSign, CreditCard, Plus, IndianRupee } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBillingData } from '../store/slices/billingSlice';

const Billing: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: billingData, loading, error } = useAppSelector((state) => state.billing);

  useEffect(() => {
    dispatch(fetchBillingData());
  }, [dispatch]);

  return (
    <div id='billing-main' className="space-y-6">
      <div id="billing-header" className="flex justify-between items-center">
        <div>
          <h1 id="billing-title" className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p id="billing-description" className="mt-1 text-sm text-gray-500">
            Manage your billing information and view invoices
          </p>
        </div>
        <div className="flex space-x-3">
          <button id="billing-filter-button" className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button id="billing-download-button" className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Download All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div id="billing-content" className="p-6">
          <div id="billing-recent-invoices" className="flex justify-between items-center mb-6">
            <h3 id="billing-recent-invoices-title" className="text-lg font-semibold">Recent Invoices</h3>
            <div id="billing-recent-invoices-filter" className="flex space-x-4">
              <select id="billing-recent-invoices-filter-select" className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
          </div>

          <div id="billing-table-container" className="overflow-x-auto max-w-full">
            <div id="billing-table" className="inline-block min-w-full align-middle">
              <table id="billing-table" className="min-w-full">
                <thead id="billing-table-header">
                  <tr id="billing-table-header-row" className="border-b border-gray-200">
                    <th id="billing-table-header-network-transaction-id" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Network Transaction ID
                    </th>
                    <th id="billing-table-header-bill-create-date-time" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill Create Date & Time
                    </th>
                    <th id="billing-table-header-order-create-date-time" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Create Date & Time
                    </th>
                    <th id="billing-table-header-payment-reference-id" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Reference Id
                    </th>
                    <th id="billing-table-header-order-amount" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Amount
                    </th>
                    <th id="billing-table-header-payment-status" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th id="billing-table-header-refund-amount" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Refund Amount
                    </th>
                    <th id="billing-table-header-refund-status" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Refund Status
                    </th>
                    <th id="billing-table-header-refund-reference-id" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Refund Reference Id
                    </th>
                    <th id="billing-table-header-cancellation-fee" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cancellation Fee
                    </th>
                    <th id="billing-table-header-fulfillment-state" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fulfillment State
                    </th>
                    <th id="billing-table-header-cancellation-reason" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cancellation Reason
                    </th>
                    <th id="billing-table-header-cancelled-by" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cancelled By
                    </th>
                    <th id="billing-table-header-cancelled-date-time" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cancelled Date & Time
                    </th>
                    <th id="billing-table-header-actions" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody id="billing-table-body" className="divide-y divide-gray-200">
                  {billingData.map((invoice) => (
                    <tr key={invoice._id} id="billing-table-row" className="hover:bg-gray-50">
                      <td id="billing-table-row-network-transaction-id" className="px-6 py-4 whitespace-nowrap">
                        <div id="billing-table-row-network-transaction-id-content" className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <span id="billing-table-row-network-transaction-id-content-text" className="font-medium text-gray-900">
                            {invoice.network_transaction_id}
                          </span>
                        </div>
                      </td>
                      <td id="billing-table-row-bill-create-date-time" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.createdAt).toLocaleString()}
                      </td>
                      <td id="billing-table-row-order-create-date-time" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.order_created_date).toLocaleString()}
                      </td>
                      <td id="billing-table-row-payment-reference-id" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.payment_reference_id}
                      </td>
                      <td id="billing-table-row-order-amount" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{invoice.total_amount}
                      </td>
                      <td id="billing-table-row-payment-status" className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.payment_status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {invoice.payment_status}
                        </span>
                      </td>
                      <td id="billing-table-row-refund-amount" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.refund_amount || '-'}
                      </td>
                      <td id="billing-table-row-refund-status" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.refund_status || '-'}
                      </td>
                      <td id="billing-table-row-refund-reference-id" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.refund_reference_id || '-'}
                      </td>
                      <td id="billing-table-row-cancellation-fee" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.cancellation_fee || '-'}
                      </td>
                      <td id="billing-table-row-fulfillment-state" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.fulfillment_state || '-'}
                      </td>
                      <td id="billing-table-row-cancellation-reason" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.cancellation_reason || '-'}
                      </td>
                      <td id="billing-table-row-cancelled-by" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.cancelled_by || '-'}
                      </td>
                      <td id="billing-table-row-cancelled-date-time" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.cancelled_date ? new Date(invoice.cancelled_date).toLocaleString() : '-'}
                      </td>
                      <td id="billing-table-row-actions" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button id="billing-table-row-actions-view" className="text-indigo-600 hover:text-indigo-900">
                          View
                        </button>
                        <span id="billing-table-row-actions-separator" className="mx-2">|</span>
                        <button id="billing-table-row-actions-download" className="text-indigo-600 hover:text-indigo-900">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Billing;