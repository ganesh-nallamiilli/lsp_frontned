import React, { useState } from 'react';
import {
  Bell,
  Package,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
} from 'lucide-react';
import NotificationCard from '../components/notifications/NotificationCard';
import NotificationFilters from '../components/notifications/NotificationFilters';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Order Received',
    message: 'Order #ORD-2024-001 has been placed successfully.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
  },
  {
    id: '2',
    title: 'Payment Failed',
    message: 'Payment for order #ORD-2024-002 was declined.',
    type: 'error',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    isRead: false,
  },
  {
    id: '3',
    title: 'System Maintenance',
    message: 'Scheduled maintenance in 2 hours. Service might be interrupted.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: true,
  },
  {
    id: '4',
    title: 'New Feature Available',
    message: 'Check out our new analytics dashboard!',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
  },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const getIconForType = (type: string) => {
    const icons = {
      info: Info,
      success: CheckCircle,
      warning: AlertCircle,
      error: XCircle,
    };
    return icons[type as keyof typeof icons];
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const filteredNotifications = notifications
    .filter(notif => {
      if (filter === 'unread') return !notif.isRead;
      if (filter === 'read') return notif.isRead;
      return true;
    })
    .filter(notif => {
      if (typeFilter !== 'all') return notif.type === typeFilter;
      return true;
    })
    .filter(notif =>
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay updated with your latest activities
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
            {unreadCount} unread
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <NotificationFilters
            onSearch={setSearchQuery}
            onFilterChange={setFilter}
            onTypeChange={setTypeFilter}
          />

          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You're all caught up! Check back later for new updates.
                </p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <NotificationCard
                  key={notification.id}
                  {...notification}
                  icon={getIconForType(notification.type)}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;