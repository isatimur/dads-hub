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
      if (!session?.user?.id) return [];
      
      console.log("Fetching notifications for user:", session.user.id);
      
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          *,
          sender:profiles(username),
          post:posts(title)
        `)
        .eq("recipient_id", session.user.id)
        .eq("read", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Notifications fetch error:", error);
        throw error;
      }
      
      console.log("Fetched notifications:", data);
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("recipient_id", session?.user?.id);

      if (error) throw error;
      refetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const getNotificationContent = (notification: any) => {
    switch (notification.type) {
      case "comment":
        return `${notification.sender?.username || 'Someone'} commented on your post "${notification.post?.title || 'a post'}"`;
      case "mention":
        return `${notification.sender?.username || 'Someone'} mentioned you in a comment`;
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
              className="p-4 cursor-pointer hover:bg-muted"
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