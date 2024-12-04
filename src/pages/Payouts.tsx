import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPayouts } from '../store/slices/payoutSlice';
import { Pagination } from '../components/ui/Pagination';
import { Spinner } from '../components/ui/spinner';

const Payouts: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, pagination } = useAppSelector((state) => state.payouts);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPayouts({ page: currentPage, perPage: 10 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payouts</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((payout) => (
              <tr key={payout.network_transaction_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payout.network_transaction_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payout.order_create_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payout.order_created_time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{payout.merchant_payable_amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payout.payment_status === 'PAID' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payout.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.total_pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Payouts;