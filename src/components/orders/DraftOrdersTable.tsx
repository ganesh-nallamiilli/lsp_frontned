import React from 'react';
import { Order } from '../../types/orders';
import { ChevronRight } from 'lucide-react';

interface DraftOrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onShipNow: (order: Order) => void;
  selectedOrders: string[];
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOrder: (orderId: string) => void;
}

const DraftOrdersTable: React.FC<DraftOrdersTableProps> = ({
  orders,
  onEdit,
  onShipNow,
  selectedOrders,
  onSelectAll,
  onSelectOrder,
}) => {
  console.log("orders >>>>>>>>>>.",orders)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                checked={selectedOrders.length === orders.length && orders.length > 0}
                onChange={onSelectAll}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Retail Order ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ready to Ship
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => onSelectOrder(order.id)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {order.draft_order.orderDetails.retail_order_id}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {order.draft_order.orderDetails.retail_order_category.label}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                ₹{order.draft_order.orderDetails.retail_order_amount}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {order.draft_order.order_items.length} items
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.draft_order.ready_to_ship 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.draft_order.readytoShip ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(order)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  {order.draft_order.readytoShip && (
                    <>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => onShipNow(order)}
                        className="text-green-600 hover:text-green-800 flex items-center"
                      >
                        Ship Now
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No draft orders found
        </div>
      )}
    </div>
  );
};

export default DraftOrdersTable; 