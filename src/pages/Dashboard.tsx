import React, { useEffect } from 'react';
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
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchShippingDetails,
  fetchDashboardCounts,
  fetchRTODetails,
  fetchWalletDetails,
  fetchUserProfile,
} from '../store/slices/dashboardSlice';

const data = [
  { name: 'Jan', orders: 4000, revenue: 2400 },
  { name: 'Feb', orders: 3000, revenue: 1398 },
  { name: 'Mar', orders: 2000, revenue: 9800 },
  { name: 'Apr', orders: 2780, revenue: 3908 },
  { name: 'May', orders: 1890, revenue: 4800 },
  { name: 'Jun', orders: 2390, revenue: 3800 },
];

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    shippingDetails, 
    dashboardCounts, 
    rtoDetails,
    walletDetails,
    userProfile 
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchShippingDetails());
    dispatch(fetchDashboardCounts());
    dispatch(fetchRTODetails());
    dispatch(fetchWalletDetails());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div id="dashboard-container" className="space-y-6">
      <div id="dashboard-container-flex-justify-between-items-center" className="flex justify-between items-center">
        <h1 id="dashboard-container-flex-justify-between-items-center-h1" className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        
      </div>

      <div id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div" className="bg-white p-4 rounded-xl shadow-sm">
          <div id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-flex-justify-between-items-center" className="flex justify-between items-center">
            <div>
              <p id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-flex-justify-between-items-center-div-p" className="text-gray-600">Total Orders Amount</p>
              <h3 id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-flex-justify-between-items-center-div-h3" className="text-2xl font-bold">
                ₹{dashboardCounts?.total_orders_amount || '0.00'}
              </h3>
            </div>
            <div id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-flex-justify-between-items-center-div-text-teal-500" className="text-teal-500">
              <TrendingUp id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-flex-justify-between-items-center-div-text-teal-500-trending-up" className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-2" className="bg-white p-4 rounded-xl shadow-sm">
          <div id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-2-flex-justify-between-items-center" className="flex justify-between items-center">
            <div>
              <p id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-2-flex-justify-between-items-center-div-p" className="text-gray-600">All Users Wallet Amount</p>
              <h3 id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-2-flex-justify-between-items-center-div-h3" className="text-2xl font-bold">
                ₹{walletDetails?.total_available || '0.00'}
              </h3>
            </div>
            <div id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-2-flex-justify-between-items-center-div-text-teal-500" className="text-teal-500">
              <TrendingUp id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-2-flex-justify-between-items-center-div-text-teal-500-trending-up" className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-3" className="bg-white p-4 rounded-xl shadow-sm">
          <div id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-3-flex-justify-between-items-center" className="flex justify-between items-center">
            <div>
              <p id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-3-flex-justify-between-items-center-div-p" className="text-gray-600">Total Platform Commission</p>
              <h3 id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-3-flex-justify-between-items-center-div-h3" className="text-2xl font-bold">
                ₹{dashboardCounts?.total_platform_charge || '0.00'}
              </h3>
            </div>
            <div id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-3-flex-justify-between-items-center-div-text-teal-500" className="text-teal-500">
              <TrendingUp id="dashboard-container-grid-grid-cols-1-md-grid-cols-3-gap-6-div-3-flex-justify-between-items-center-div-text-teal-500-trending-up" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div id="dashboard-container-grid-grid-cols-2-md-grid-cols-3-gap-4" className="bg-white p-6 rounded-xl shadow-sm">
          <div id="dashboard-container-grid-grid-cols-2-md-grid-cols-3-gap-4-grid-grid-cols-2-md-grid-cols-3-gap-4" className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div id="dashboard-container-grid-grid-cols-2-md-grid-cols-3-gap-4-grid-grid-cols-2-md-grid-cols-3-gap-4-div" className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div id="dashboard-container-grid-grid-cols-2-md-grid-cols-3-gap-4-grid-grid-cols-2-md-grid-cols-3-gap-4-div-bg-yellow-100-p-3-rounded-lg" className="bg-yellow-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="font-semibold">{dashboardCounts?.order_details?.created || 0}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="font-semibold">{dashboardCounts?.order_details?.accepted || 0}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="bg-purple-100 p-3 rounded-lg">
              <RotateCcw className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="font-semibold">{dashboardCounts?.order_details?.InProgress || 0}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="font-semibold">{dashboardCounts?.order_details?.completed || 0}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="font-semibold">{dashboardCounts?.order_details?.cancelled || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Shipping Status</h2>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Pickup Pending</div>
              <div className="text-lg font-semibold">{shippingDetails?.pending || 0}</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Searching For Agent</div>
              <div className="text-lg font-semibold">{shippingDetails?.searching_for_agent || 0}</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Agent Assigned</div>
              <div className="text-lg font-semibold">{shippingDetails?.agent_assigned || 0}</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <Package className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Order Picked Up</div>
              <div className="text-lg font-semibold">{shippingDetails?.order_picked_up || 0}</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
              <Truck className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Out For Delivery</div>
              <div className="text-lg font-semibold">{shippingDetails?.out_for_delivery || 0}</div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Order Delivered</div>
              <div className="text-lg font-semibold">{shippingDetails?.order_delivered || 0}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-lg font-medium">Total RTO's</h2>
              <span className="text-2xl font-bold">
                {dashboardCounts?.total_rtos || 0}
              </span>
            </div>
            <div className="bg-orange-50 p-2 rounded-lg">
              <RotateCcw className="w-6 h-6 text-orange-400" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Initialized</p>
                <p className="font-semibold">{rtoDetails?.rto_initiated || 0}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Disposed</p>
                <p className="font-semibold">{rtoDetails?.rto_disposed || 0}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-red-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="font-semibold">{rtoDetails?.rto_delivered || 0}</p>
              </div>
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