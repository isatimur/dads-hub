import { useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, AlertTriangle } from "lucide-react";
import { sendModerationNotification } from "@/utils/notifications";

interface ContentModerationProps {
  contentId: string;
  contentType: "post" | "comment";
  authorId: string;
}

export const ContentModeration = ({ contentId, contentType, authorId }: ContentModerationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  const { data: moderationStatus } = useQuery({
    queryKey: ["content_moderation", contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_moderation")
        .select("*")
        .eq("content_id", contentId)
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      if (error) throw error;
      return data;
    },
  });

  const handleModeration = async (status: string, reason?: string) => {
    if (!session) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("content_moderation")
        .upsert({ // Changed from update to upsert since we might need to create a new record
          content_id: contentId,
          content_type: contentType,
          status,
          reason,
          moderator_id: session.user.id
        });

      if (error) throw error;

      // Get author's email and username
      const { data: author, error: authorError } = await supabase
        .from("profiles")
        .select("email, username")
        .eq("id", authorId)
        .single();

      if (authorError) throw authorError;

      if (author?.email) {
        await sendModerationNotification(author.email, {
          recipientName: author.username,
          senderName: session.user?.email || "Moderator",
          moderationStatus: status,
          moderationReason: reason,
        });
      }

      toast.success("Moderation status updated");
      queryClient.invalidateQueries({ queryKey: ["content_moderation"] });
    } catch (error) {
      console.error("Error updating moderation status:", error);
      toast.error("Failed to update moderation status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReport = async () => {
    if (!session) {
      toast.error("Please sign in to report content");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("content_reports")
        .insert({
          content_id: contentId,
          content_type: contentType,
          reporter_id: session.user.id,
          status: "pending",
        });

      if (error) throw error;
      toast.success("Content reported successfully");
    } catch (error) {
      console.error("Error reporting content:", error);
      toast.error("Failed to report content");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex items-center space-x-2 mt-4">
      {session.user?.user_metadata?.role === "moderator" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleModeration("approved")}
            disabled={isLoading}
            className="text-green-600 hover:text-green-700"
          >
            <Shield className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleModeration("flagged", "Content violates community guidelines")}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Flag
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReport}
        disabled={isLoading}
        className="text-gray-600 hover:text-gray-700"
      >
        <AlertTriangle className="w-4 h-4 mr-1" />
        Report
      </Button>
    </div>
  );
};