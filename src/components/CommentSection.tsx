import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string;
  };
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export const CommentSection = ({ postId, comments }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const session = useSession();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          content: newComment.trim(),
          post_id: postId,
          author_id: session.user.id,
        });

      if (error) throw error;

      toast.success("Comment added successfully!");
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" className="w-full">
          Post Comment
        </Button>
      </form>

      <div className="space-y-4 mt-6">
        {comments?.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium">
                {comment.author?.username || "Anonymous"}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};