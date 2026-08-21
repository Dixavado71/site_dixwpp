import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'payment' | 'stock' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationBellProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onViewAll?: () => void;
}

export function NotificationBell({ 
  notifications = [], 
  onMarkAsRead,
  onViewAll 
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'message':
        return '💬';
      case 'payment':
        return '💰';
      case 'stock':
        return '⚠️';
      case 'system':
        return 'ℹ️';
    }
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead?.(id);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-bg-secondary rounded-lg transition-colors"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5 text-gray-300" />
        
        {unreadCount > 0 && (
          <Badge 
            variant="danger" 
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <Card className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto z-50 border border-border bg-bg-primary shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-bg-primary">
              <h3 className="font-semibold">Notificações</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => notifications.forEach(n => !n.read && onMarkAsRead?.(n.id))}
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-bg-secondary cursor-pointer transition-colors ${
                      !notification.read ? 'bg-bg-secondary/50' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        onMarkAsRead?.(notification.id);
                      }
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium truncate ${
                            !notification.read ? 'text-accent-primary' : 'text-gray-300'
                          }`}>
                            {notification.title}
                          </p>
                          
                          {!notification.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="text-xs text-gray-500 hover:text-accent-primary flex-shrink-0"
                            >
                              Marcar como lida
                            </button>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    onViewAll?.();
                    setIsOpen(false);
                  }}
                >
                  Ver todas as notificações
                </Button>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
