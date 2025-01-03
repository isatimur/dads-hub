import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NotificationsMenu = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const supabase = useSupabaseClient();

    const fetchNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from("notifications")
                .select(`
          id,
          message,
          created_at,
          read,
          type,
          sender:sender_id (
            username,
            avatar_url
          )
        `)
                .order("created_at", { ascending: false })
                .limit(10);

            if (error) throw error;

            setNotifications(data || []);
            setUnreadCount(data?.filter(n => !n.read).length || 0);
        } catch (error) {
            console.error("Ошибка загрузки уведомлений:", error);
            toast.error("Не удалось загрузить уведомления");
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const { error } = await supabase
                .from("notifications")
                .update({ read: true })
                .eq("id", notificationId);

            if (error) throw error;

            setNotifications(notifications.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Ошибка при обновлении уведомления:", error);
            toast.error("Не удалось отметить уведомление как прочитанное");
        }
    };

    useEffect(() => {
        fetchNotifications();

        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications'
                },
                () => {
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        Нет новых уведомлений
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            className={`p-4 ${!notification.read ? 'bg-primary/5' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="flex items-start gap-3">
                                {notification.sender?.avatar_url && (
                                    <img
                                        src={notification.sender.avatar_url}
                                        alt=""
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="text-sm">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(notification.created_at).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}; 