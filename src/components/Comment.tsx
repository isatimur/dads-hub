import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, Reply, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CommentProps {
  id: string;
  content: string;
  author: {
    username: string;
    id: string;
  };
  created_at: string;
  onReply: (parentId: string) => void;
  postId: string;
  parentId?: string;
  reactions: any[];
}

export const Comment = ({
  id,
  content,
  author,
  created_at,
  onReply,
  postId,
  parentId,
  reactions,
}: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [hasReacted, setHasReacted] = useState(false);
  const session = useSession();
  const queryClient = useQueryClient();

  const handleEdit = async () => {
    if (!session) return;
    
    try {
      const { error } = await supabase
        .from("comments")
        .update({ content: editedContent })
        .eq("id", id);

      if (error) throw error;

      setIsEditing(false);
      toast.success("Comment updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async () => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Comment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const handleReaction = async () => {
    if (!session) {
      toast.error("Please sign in to react to comments");
      return;
    }

    try {
      if (hasReacted) {
        const { error } = await supabase
          .from("comment_reactions")
          .delete()
          .eq("comment_id", id)
          .eq("user_id", session.user.id)
          .eq("type", "LIKE");

        if (error) throw error;
        setHasReacted(false);
      } else {
        const { error } = await supabase
          .from("comment_reactions")
          .insert({
            comment_id: id,
            user_id: session.user.id,
            type: "LIKE",
          });

        if (error) throw error;
        setHasReacted(true);
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(hasReacted ? "Reaction removed" : "Reaction added!");
    } catch (error) {
      toast.error("Failed to update reaction");
    }
  };

  return (
    <Card className={`p-4 ${parentId ? "border-l-4 border-primary/20" : ""}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">{author?.username || "Anonymous"}</span>
        <span className="text-sm text-gray-500">
          {new Date(created_at).toLocaleDateString()}
        </span>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleEdit}>
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-700 mb-4">{content}</p>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`${hasReacted ? "text-primary" : ""}`}
              onClick={handleReaction}
            >
              <Heart
                className={`w-4 h-4 mr-1 ${hasReacted ? "fill-current" : ""}`}
              />
              {reactions?.length || 0}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(id)}
              className="hover:bg-primary/10"
            >
              <Reply className="w-4 h-4 mr-1" />
              Reply
            </Button>
            {session?.user?.id === author?.id && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </Card>
  );
};