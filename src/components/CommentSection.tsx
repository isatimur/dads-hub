import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Comment } from "./Comment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquare, Send, Sparkles, MessageCircle } from "lucide-react";

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
  const [isTyping, setIsTyping] = useState(false);
  const session = useSession();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to comment", {
        icon: <MessageCircle className="w-4 h-4 text-destructive animate-bounce" />,
      });
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty", {
        icon: <MessageCircle className="w-4 h-4 text-destructive animate-bounce" />,
      });
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

      toast.success(
        replyingTo ? "Reply added successfully!" : "Comment added successfully!", 
        {
          icon: <Sparkles className="w-4 h-4 text-primary animate-pulse" />,
          className: "animate-fade-in",
        }
      );
      setNewComment("");
      setReplyingTo(null);
      setIsTyping(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      toast.error("Failed to add comment", {
        icon: <MessageCircle className="w-4 h-4 text-destructive animate-bounce" />,
      });
      console.error("Error adding comment:", error);
    }
  };

  const handleReply = (parentId: string) => {
    if (!session) {
      toast.error("Please sign in to reply", {
        icon: <MessageCircle className="w-4 h-4 text-destructive animate-bounce" />,
      });
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
    <div className="space-y-4 mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 group hover:bg-primary/5 p-2 rounded-lg transition-all duration-300">
        <MessageSquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300 animate-bounce-subtle" />
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
          {replyingTo ? "Write a Reply" : "Leave a Comment"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <Textarea
            placeholder={
              replyingTo
                ? "Write your thoughtful reply here..."
                : "Share your thoughts with the community..."
            }
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            className={`min-h-[100px] pr-12 transition-all duration-300 
              ${isTyping ? 'ring-2 ring-primary/50 shadow-lg shadow-primary/10 scale-[1.01]' : 'hover:border-primary/50'}
              focus:ring-2 focus:ring-primary/50 focus:border-transparent focus:scale-[1.01]
              placeholder:text-muted-foreground/70 resize-none rounded-xl`}
          />
          <Button
            type="submit"
            size="icon"
            className={`absolute bottom-3 right-3 bg-primary hover:bg-primary/90 
              transition-all duration-300 transform rounded-full
              ${isTyping ? 'scale-100 opacity-100 rotate-0 shadow-lg' : 'scale-95 opacity-0 rotate-45'}
              group-hover:scale-100 group-hover:opacity-100 group-hover:rotate-0`}
          >
            <Send className="w-4 h-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
        {replyingTo && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setReplyingTo(null)}
            className="transition-all duration-300 hover:bg-destructive/10 hover:text-destructive 
              hover:scale-105 active:scale-95 group rounded-xl shadow-sm"
          >
            Cancel Reply
            <span className="ml-1 transition-transform duration-300 group-hover:rotate-90">×</span>
          </Button>
        )}
      </form>

      <div className="space-y-6 mt-8">
        {Object.values(threadedComments).map((thread: any) => (
          <div 
            key={thread.id} 
            className="space-y-4 animate-fade-up hover:bg-primary/5 p-4 rounded-xl 
              transition-all duration-300 hover:shadow-lg hover:shadow-primary/5
              hover:scale-[1.01] group"
          >
            <Comment
              {...thread}
              onReply={handleReply}
              postId={postId}
              isReplyingTo={replyingTo === thread.id}
            />
            {thread.replies.length > 0 && (
              <div className="ml-8 space-y-4 border-l-2 border-primary/20 pl-4 
                animate-fade-in hover:border-primary/40 transition-colors duration-300
                group-hover:border-primary">
                {thread.replies.map((reply: CommentType) => (
                  <Comment
                    key={reply.id}
                    {...reply}
                    onReply={handleReply}
                    postId={postId}
                    parentId={thread.id}
                    isReplyingTo={replyingTo === reply.id}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};