import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CommentHeader } from "./comment/CommentHeader";
import { CommentActions } from "./comment/CommentActions";
import { CommentEditor } from "./comment/CommentEditor";
import { ContentModeration } from "./moderation/ContentModeration";
import { handleCommentNotification } from "./comment/NotificationHandler";

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
  isReplyingTo?: boolean;
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
  isReplyingTo,
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
      toast.success("Комментарий обновлен успешно!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      toast.error("Не удалось обновить комментарий");
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

      toast.success("Комментарий удален успешно!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      toast.error("Не удалось удалить комментарий");
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
          .upsert({
            comment_id: id,
            user_id: session.user.id,
            type: "LIKE",
          }, {
            onConflict: 'comment_id,user_id,type'
          });

        if (error) {
          if (error.code === '23505') {
            // Duplicate reaction, ignore
            return;
          }
          throw error;
        }
        setHasReacted(true);
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(hasReacted ? "Реакция удалена" : "Реакция добавлена!");
    } catch (error) {
      console.error("Ошибка реакции:", error);
      toast.error("Не удалось обновить реакцию");
    }
  };

  const handleReply = async () => {
    if (!session) {
      toast.error("Пожалуйста, войдите в систему, чтобы ответить");
      return;
    }

    try {
      // Get post title for notification
      const { data: post } = await supabase
        .from("posts")
        .select("title")
        .eq("id", postId)
        .single();

      if (post?.title) {
        await handleCommentNotification(
          author.id,
          post.title,
          content,
          session.user?.email || "Пользователь"
        );
      }

      onReply(id);
    } catch (error) {
      console.error("Ошибка обработки ответа:", error);
      // Still allow the reply even if notification fails
      onReply(id);
    }
  };

  return (
    <Card 
      className={`p-4 transition-all duration-300 hover:shadow-md
        ${parentId ? "border-l-4 border-primary/20 bg-primary/5 hover:border-primary/40" : ""} 
        ${isReplyingTo ? "ring-2 ring-primary/50 bg-primary/5 scale-[1.02]" : ""} 
        hover:scale-[1.01] group rounded-xl`}
    >
      <CommentHeader author={author} created_at={created_at} />

      {isEditing ? (
        <CommentEditor
          content={editedContent}
          onChange={setEditedContent}
          onSave={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap group-hover:text-gray-900 transition-colors duration-300">
            {content}
          </p>
          <CommentActions
            hasReacted={hasReacted}
            reactionCount={reactions?.length || 0}
            onReaction={handleReaction}
            onReply={handleReply}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
            showModifyActions={session?.user?.id === author?.id}
          />
          <ContentModeration
            contentId={id}
            contentType="comment"
            authorId={author?.id}
          />
        </>
      )}
    </Card>
  );
};
