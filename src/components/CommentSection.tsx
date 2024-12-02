import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Comment } from "./Comment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

interface CommentType {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string;
    id: string;
  };
  parent_id: string | null;
  reactions: any[];
}

interface CommentSectionProps {
  postId: string;
  comments: CommentType[];
}

export const CommentSection = ({ postId, comments = [] }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
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
          parent_id: replyingTo,
        });

      if (error) throw error;

      toast.success(replyingTo ? "Reply added successfully!" : "Comment added successfully!");
      setNewComment("");
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Error adding comment:", error);
    }
  };

  const handleReply = (parentId: string) => {
    if (!session) {
      toast.error("Please sign in to reply");
      return;
    }
    setReplyingTo(parentId);
  };

  // Organize comments into threads
  const threadedComments = comments.reduce((acc: any, comment) => {
    if (!comment.parent_id) {
      acc[comment.id] = {
        ...comment,
        replies: [],
      };
    } else if (acc[comment.parent_id]) {
      acc[comment.parent_id].replies.push(comment);
    }
    return acc;
  }, {});

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">
          {replyingTo ? "Write a Reply" : "Leave a Comment"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder={
            replyingTo
              ? "Write your reply here..."
              : "Share your thoughts..."
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex space-x-2">
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            {replyingTo ? "Post Reply" : "Post Comment"}
          </Button>
          {replyingTo && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setReplyingTo(null)}
            >
              Cancel Reply
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-6 mt-8">
        {Object.values(threadedComments).map((thread: any) => (
          <div key={thread.id} className="space-y-4">
            <Comment
              {...thread}
              onReply={handleReply}
              postId={postId}
            />
            <div className="ml-8 space-y-4 border-l-2 border-primary/20 pl-4">
              {thread.replies.map((reply: CommentType) => (
                <Comment
                  key={reply.id}
                  {...reply}
                  onReply={handleReply}
                  postId={postId}
                  parentId={thread.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};