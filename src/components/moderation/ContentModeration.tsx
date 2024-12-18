import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Shield, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContentModerationProps {
  contentId: string;
  contentType: "post" | "comment";
  authorId: string;
}

export const ContentModeration = ({ contentId, contentType, authorId }: ContentModerationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const { data: userRoles } = useQuery({
    queryKey: ["userRoles", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("roles(name)")
        .eq("user_id", session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: moderationStatus, refetch } = useQuery({
    queryKey: ["moderation", contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_moderation")
        .select("*")
        .eq("content_id", contentId)
        .maybeSingle();

      // Only throw if it's not a "no rows returned" error
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const isAdmin = userRoles?.some((role: any) => role.roles.name === "admin");
  const isAuthor = session?.user?.id === authorId;

  const handleModeration = async (status: string, reason?: string) => {
    if (!session || !isAdmin) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("content_moderation")
        .upsert({
          content_id: contentId,
          content_type: contentType,
          status,
          moderator_id: session.user.id,
          reason,
        }, {
          onConflict: "content_id",
        });

      if (error) throw error;

      toast.success(`Content ${status} successfully`);
      refetch();
    } catch (error) {
      console.error("Moderation error:", error);
      toast.error("Failed to moderate content");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatus = () => {
    if (!moderationStatus) {
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Pending review</span>
        </div>
      );
    }

    switch (moderationStatus.status) {
      case "approved":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Approved</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-4 h-4" />
            <span>Rejected</span>
            {moderationStatus.reason && (
              <span className="text-sm text-gray-500">
                - {moderationStatus.reason}
              </span>
            )}
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Pending review</span>
          </div>
        );
    }
  };

  if (!isAdmin && !isAuthor) return null;

  return (
    <div className="mt-2 space-y-2">
      {isAdmin && !moderationStatus?.status && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => handleModeration("approved")}
            disabled={isLoading}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleModeration("rejected", "Violates community guidelines")}
            disabled={isLoading}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
      {(isAdmin || isAuthor) && (
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-primary" />
          {renderStatus()}
        </div>
      )}
    </div>
  );
};