import React from 'react';
import { CreditCard, Users, Package, ArrowUpRight, Download, Filter, Plus } from 'lucide-react';

const mockSubscriptions = [
  {
    id: 'SUB-2024-001',
    plan: 'Enterprise',
    customer: 'Acme Corp',
    status: 'active',
    startDate: '2024-01-15',
    nextBilling: '2024-04-15',
    amount: 499.99,
    features: ['Unlimited Orders', '24/7 Support', 'API Access'],
  },
  {
    id: 'SUB-2024-002',
    plan: 'Professional',
    customer: 'Tech Solutions Inc',
    status: 'trial',
    startDate: '2024-03-01',
    nextBilling: '2024-04-01',
    amount: 299.99,
    features: ['100 Orders/month', 'Business Hours Support', 'Basic Analytics'],
  },
];

const Subscriptions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage subscription plans and subscribers
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">234</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">MRR</p>
              <p className="text-2xl font-bold text-gray-900">$45,289</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Trials</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Churn Rate</p>
              <p className="text-2xl font-bold text-gray-900">2.4%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-center p-6 border-2 border-indigo-100 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic</h3>
            <p className="text-3xl font-bold text-indigo-600 mb-4">$99<span className="text-sm text-gray-500">/mo</span></p>
            <ul className="text-sm text-gray-600 space-y-3 mb-6">
              <li>50 Orders/month</li>
              <li>Email Support</li>
              <li>Basic Analytics</li>
              <li>2 Team Members</li>
            </ul>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Select Plan
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-center p-6 border-2 border-indigo-500 rounded-xl relative">
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm">Popular</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional</h3>
            <p className="text-3xl font-bold text-indigo-600 mb-4">$299<span className="text-sm text-gray-500">/mo</span></p>
            <ul className="text-sm text-gray-600 space-y-3 mb-6">
              <li>200 Orders/month</li>
              <li>Priority Support</li>
              <li>Advanced Analytics</li>
              <li>5 Team Members</li>
            </ul>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Select Plan
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-center p-6 border-2 border-indigo-100 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
            <p className="text-3xl font-bold text-indigo-600 mb-4">$499<span className="text-sm text-gray-500">/mo</span></p>
            <ul className="text-sm text-gray-600 space-y-3 mb-6">
              <li>Unlimited Orders</li>
              <li>24/7 Support</li>
              <li>Custom Analytics</li>
              <li>Unlimited Team Members</li>
            </ul>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Active Subscriptions</h3>
            <div className="flex space-x-4">
              <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm">
                <option>All Plans</option>
                <option>Basic</option>
                <option>Professional</option>
                <option>Enterprise</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Billing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{subscription.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{subscription.plan}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscription.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscription.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.nextBilling}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${subscription.amount}
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

export default Subscriptions;