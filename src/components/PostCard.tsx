import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { CommentSection } from "./CommentSection";
import { ContentModeration } from "./moderation/ContentModeration";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  category: string;
  votes: number;
  comments: any[];
  timeAgo: string;
}

export const PostCard = ({
  id,
  title,
  content,
  author,
  category,
  votes: initialVotes,
  comments,
  timeAgo,
}: PostCardProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const session = useSession();

  useEffect(() => {
    const channel = supabase
      .channel('posts_votes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public',
        table: 'posts',
        filter: `id=eq.${id}`
      }, (payload: any) => {
        setVotes(payload.new.votes);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleVote = async () => {
    if (!session) {
      toast.error("Пожалуйста, войдите в систему, чтобы проголосовать");
      return;
    }

    try {
      const newVotes = hasVoted ? votes - 1 : votes + 1;
      const { error } = await supabase
        .from('posts')
        .update({ votes: newVotes })
        .eq('id', id);

      if (error) throw error;

      setHasVoted(!hasVoted);
      toast.success(hasVoted ? "Голос удален" : "Пост проголосован!");
    } catch (error) {
      toast.error("Не удалось обновить голос");
    }
  };

  const handleSave = () => {
    if (!session) {
      toast.error("Пожалуйста, войдите в систему, чтобы сохранить посты");
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Пост удален из сохраненных" : "Пост сохранен для позже");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: content,
        url: window.location.href,
      });
      toast.success("Пост успешно поделен!");
    } catch (error) {
      toast.info("Ссылка скопирована в буфер обмена!");
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleComment = () => {
    if (!session) {
      toast.error("Пожалуйста, войдите в систему, чтобы оставить комментарий");
      return;
    }
    setShowComments(!showComments);
  };

  const truncatedContent = content.length > 300 && !isExpanded
    ? content.slice(0, 300) + "..."
    : content;

  const formattedContent = truncatedContent.split('\n').map((line, i) => (
    <p key={i} className="mb-2">{line}</p>
  ));

  return (
    <Card className="w-full mb-6 overflow-hidden hover:shadow-dad-hover transition-all duration-300 animate-fade-up bg-white/50 backdrop-blur-sm border-primary/10 shadow-dad">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200">
            {category}
          </span>
          <span className="text-sm text-gray-500">{timeAgo}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-gray-900 hover:text-primary transition-colors duration-200 line-clamp-2">
          {title}
        </h3>
        
        <div className="prose prose-sm max-w-none text-gray-600 mb-4 leading-relaxed overflow-hidden">
          {formattedContent}
          {content.length > 300 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-primary hover:text-primary/80"
            >
              {isExpanded ? "Показать меньше" : "Читать больше"}
            </Button>
          )}
        </div>
        
        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`space-x-2 group ${hasVoted ? 'text-primary' : ''}`}
              onClick={handleVote}
            >
              <Heart className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${hasVoted ? 'fill-current animate-heartbeat' : ''}`} />
              <span>{votes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="space-x-2 group"
              onClick={handleComment}
            >
              <MessageSquare className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>{comments?.length || 0}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="group"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={`group ${isSaved ? 'text-primary' : ''}`}
            >
              <Bookmark className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <div className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
            Опубликовано <span className="font-medium text-gray-900">{author.username}</span>
          </div>
        </div>

        <ContentModeration
          contentId={id}
          contentType="post"
          authorId={author.id}
        />

        {showComments && (
          <div className="mt-6 animate-fade-in">
            <CommentSection postId={id} comments={comments} />
          </div>
        )}
      </div>
    </Card>
  );
};