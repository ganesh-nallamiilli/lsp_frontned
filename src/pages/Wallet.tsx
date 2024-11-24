import React from 'react';
import { Wallet as WalletIcon, Plus, ArrowDownLeft, ArrowUpRight, CreditCard, History } from 'lucide-react';

const transactionHistory = [
  {
    id: 1,
    type: 'credit',
    amount: 500,
    description: 'Wallet Recharge',
    date: '2024-03-15',
    status: 'completed',
  },
  {
    id: 2,
    type: 'debit',
    amount: 150,
    description: 'Order Payment #ORD-2024-001',
    date: '2024-03-14',
    status: 'completed',
  },
  // Add more transactions as needed
];

const Wallet: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Money
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <WalletIcon className="h-8 w-8" />
              <h2 className="text-xl font-semibold">Wallet Balance</h2>
            </div>
            <div className="mb-6">
              <p className="text-4xl font-bold">₹2,458.50</p>
              <p className="text-sm opacity-80">Available Balance</p>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30">
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Add Money
              </button>
              <button className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <CreditCard className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="font-medium">Link New Card</span>
            </button>
            <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <History className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="font-medium">Transaction History</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactionHistory.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'credit'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        )}
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;