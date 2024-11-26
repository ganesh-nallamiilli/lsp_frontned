import React from 'react';
import {
  Package,
  Clock,
  RotateCcw,
  DollarSign,
  TrendingUp,
  Users,
  Truck,
  AlertCircle,
  IndianRupee,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import KPICard from '../components/dashboard/KPICard';

const data = [
  { name: 'Jan', orders: 4000, revenue: 2400 },
  { name: 'Feb', orders: 3000, revenue: 1398 },
  { name: 'Mar', orders: 2000, revenue: 9800 },
  { name: 'Apr', orders: 2780, revenue: 3908 },
  { name: 'May', orders: 1890, revenue: 4800 },
  { name: 'Jun', orders: 2390, revenue: 3800 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex space-x-3">
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Orders"
          value="1,234"
          change={12}
          icon={Package}
          color="bg-blue-500"
        />
        <KPICard
          title="Average Delivery Time"
          value="2.3 days"
          change={-8}
          icon={Clock}
          color="bg-green-500"
        />
        <KPICard
          title="RTO Rate"
          value="4.2%"
          change={-2}
          icon={RotateCcw}
          color="bg-yellow-500"
        />
        <KPICard
          title="Revenue"
          value="₹52,389"
          change={15}
          icon={IndianRupee}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Shipping Status</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Pickup Pending</div>
              <div className="text-lg font-semibold">64</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Searching For Agent</div>
              <div className="text-lg font-semibold">10</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Agent Assigned</div>
              <div className="text-lg font-semibold">22</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <Package className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Order Picked Up</div>
              <div className="text-lg font-semibold">7</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
              <Truck className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Out For Delivery</div>
              <div className="text-lg font-semibold">2</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Order Delivered</div>
              <div className="text-lg font-semibold">199</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Order Trends</h2>
            <div className="flex space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              <Package className="w-6 h-6 text-indigo-600 mr-3" />
              <span className="font-medium">Create Order</span>
            </button>
            <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              <Truck className="w-6 h-6 text-green-600 mr-3" />
              <span className="font-medium">Track Shipment</span>
            </button>
            <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              <Users className="w-6 h-6 text-blue-600 mr-3" />
              <span className="font-medium">Add Customer</span>
            </button>
            <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <span className="font-medium">Report Issue</span>
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default Dashboard;