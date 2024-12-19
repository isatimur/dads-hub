import { supabase } from "@/integrations/supabase/client";
import { sendCommentNotification } from "@/utils/notifications";
import { toast } from "sonner";

export const handleCommentNotification = async (
  authorId: string,
  postTitle: string,
  commentContent: string,
  senderName: string
) => {
  try {
    const { data: author, error } = await supabase
      .from("profiles")
      .select("email, username")
      .eq("id", authorId)
      .single();

    if (error) throw error;

    if (author?.email) {
      await sendCommentNotification(author.email, {
        recipientName: author.username,
        senderName,
        postTitle,
        commentContent,
      });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    toast.error("Failed to send notification");
  }
};