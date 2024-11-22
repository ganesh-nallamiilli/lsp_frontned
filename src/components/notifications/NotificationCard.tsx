import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon: LucideIcon;
  timestamp: Date;
  isRead: boolean;
  onMarkAsRead: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  message,
  type,
  icon: Icon,
  timestamp,
  isRead,
  onMarkAsRead,
}) => {
  const typeStyles = {
    info: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    error: 'bg-red-50 text-red-700',
  };

  return (
    <div
      className={`p-4 rounded-lg mb-3 transition-colors ${
        isRead ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-full ${typeStyles[type]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{title}</h4>
              <p className="text-sm text-gray-500 mt-1">{message}</p>
            </div>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </span>
          </div>
          {!isRead && (
            <button
              onClick={() => onMarkAsRead(id)}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;