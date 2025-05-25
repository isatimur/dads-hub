import { Link } from "react-router-dom";
import type { ForumThread } from "@/types/forum";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ForumThreadListItemProps {
  thread: ForumThread;
}

export const ForumThreadListItem = ({ thread }: ForumThreadListItemProps) => {
  const authorName = thread.is_anonymous 
    ? "Аноним" 
    : thread.profiles?.display_name || "Неизвестный автор";
  
  const lastActivity = thread.updated_at 
    ? formatDistanceToNow(new Date(thread.updated_at), { addSuffix: true, locale: ru })
    : 'N/A';

  // A simple way to estimate post_count if not directly provided:
  // This is just a placeholder idea, actual post_count should come from backend if needed.
  // For now, we will rely on the optional post_count from the type.

  return (
    <div className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
      <Link to={`/threads/${thread.id}`} className="block">
        <h3 className="text-lg font-semibold text-primary dark:text-primary-400 mb-1">{thread.title}</h3>
      </Link>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
        <span>Автор: <span className="font-medium">{authorName}</span></span>
        <span>•</span>
        <span>Последняя активность: <span className="font-medium">{lastActivity}</span></span>
        {thread.post_count !== undefined && thread.post_count > 0 && (
          <>
            <span>•</span>
            <span>Ответов: <span className="font-medium">{thread.post_count}</span></span>
          </>
        )}
      </div>
    </div>
  );
};
