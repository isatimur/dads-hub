import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  votes: number;
  comments: number;
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
      toast.error("Please sign in to vote");
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
      toast.success(hasVoted ? "Vote removed" : "Post upvoted!");
    } catch (error) {
      toast.error("Failed to update vote");
    }
  };

  const handleSave = () => {
    if (!session) {
      toast.error("Please sign in to save posts");
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Post removed from saved items" : "Post saved for later");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: content,
        url: window.location.href,
      });
      toast.success("Post shared successfully!");
    } catch (error) {
      toast.info("Copied link to clipboard!");
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleComment = () => {
    if (!session) {
      toast.error("Please sign in to comment");
      return;
    }
    toast.info("Coming soon: Comments section!");
  };

  // Format content with proper line breaks
  const formattedContent = content.split('\n').map((line, i) => (
    <p key={i} className="mb-2">{line}</p>
  ));

  return (
    <Card className="w-full mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-up">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {category}
          </span>
          <span className="text-sm text-gray-500">{timeAgo}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
        <div className="prose prose-sm max-w-none text-gray-600 mb-4">
          {formattedContent}
        </div>
        
        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`space-x-2 ${hasVoted ? 'text-primary' : ''}`}
              onClick={handleVote}
            >
              <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
              <span>{votes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="space-x-2"
              onClick={handleComment}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{comments}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={isSaved ? 'text-primary' : ''}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Posted by <span className="font-medium text-gray-900">{author}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};