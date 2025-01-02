import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export const NotificationsMenu = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const supabase = useSupabaseClient();
  const session = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [session?.user?.id]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender:profiles(*), post:posts(*)')
      .eq('recipient_id', session?.user?.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    setNotifications(data || []);
  };

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${session?.user?.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return;
    }

    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const getNotificationContent = (notification: any) => {
    switch (notification.type) {
      case "comment":
        return `${notification.sender?.username || 'Кто-то'} прокомментировал ваш пост "${notification.post?.title || 'пост'}"`;
      case "mention":
        return `${notification.sender?.username || 'Кто-то'} упомянул вас в комментарии`;
      default:
        return notification.content;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-background border-border shadow-lg">
        <DropdownMenuLabel>Уведомления</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            Нет новых уведомлений
          </div>
        ) : (
          notifications.map((notification: any) => (
            <DropdownMenuItem
              key={notification.id}
              className="p-4 cursor-pointer hover:bg-muted"
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm">
                  {getNotificationContent(notification)}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(notification.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};