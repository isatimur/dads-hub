import { Heart, Reply, Edit2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface CommentActionsProps {
  hasReacted: boolean;
  reactionCount: number;
  onReaction: () => void;
  onReply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showModifyActions?: boolean;
}

export const CommentActions = ({
  hasReacted,
  reactionCount,
  onReaction,
  onReply,
  onEdit,
  onDelete,
  showModifyActions,
}: CommentActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className={`${hasReacted ? 'text-primary' : ''} hover:bg-primary/10`}
        onClick={onReaction}
      >
        <Heart className={`w-4 h-4 mr-1 ${hasReacted ? 'fill-current' : ''}`} />
        {reactionCount}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReply}
        className="hover:bg-primary/10 text-primary font-medium transition-all duration-200 hover:scale-105"
      >
        <Reply className="w-4 h-4 mr-1" />
        Reply
      </Button>
      {showModifyActions && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="hover:bg-primary/10"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="hover:bg-destructive/10 text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </>
      )}
    </div>
  );
};