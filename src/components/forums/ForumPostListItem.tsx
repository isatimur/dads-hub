import type { ForumPost } from "@/types/forum";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
// Avatar components can be imported if a visual avatar is desired. For now, text-based.
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ForumPostListItemProps {
  post: ForumPost;
}

export const ForumPostListItem = ({ post }: ForumPostListItemProps) => {
  const authorName = post.is_anonymous 
    ? "Аноним" 
    : post.profiles?.display_name || "Неизвестный автор";
  
  const postDate = post.created_at 
    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ru })
    : "недавно";

  // Placeholder for avatar logic if we add it:
  // const initial = authorName.charAt(0).toUpperCase() || "?";

  return (
    <div className="flex space-x-3 p-4 border-b dark:border-gray-700 last:border-b-0">
      {/* 
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={post.profiles?.avatar_url} alt={authorName} /> 
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{authorName}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{postDate}</span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300">
          {post.content}
        </div>
        {/* TODO: Add reply button, edit/delete for own posts, report button etc. */}
      </div>
    </div>
  );
};
