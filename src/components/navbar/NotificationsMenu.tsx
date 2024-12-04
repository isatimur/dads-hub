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

export const NotificationsMenu = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          *,
          sender:profiles!notifications_sender_id_fkey(username),
          post:posts(title)
        `)
        .eq("read", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session,
  });

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) {
      toast.error("Failed to mark notification as read");
    } else {
      refetchNotifications();
    }
  };

  const getNotificationContent = (notification: any) => {
    switch (notification.type) {
      case "comment":
        return `${notification.sender.username} commented on your post "${notification.post.title}"`;
      case "mention":
        return `${notification.sender.username} mentioned you in a comment`;
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
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            No new notifications
          </div>
        ) : (
          notifications.map((notification: any) => (
            <DropdownMenuItem
              key={notification.id}
              className="p-4 cursor-pointer"
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm">
                  {getNotificationContent(notification)}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(notification.created_at).toLocaleDateString()}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};