import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface CommentEditorProps {
  content: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const CommentEditor = ({
  content,
  onChange,
  onSave,
  onCancel,
}: CommentEditorProps) => {
  return (
    <div className="space-y-3 animate-fade-in">
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] transition-all duration-300 
          focus:ring-2 focus:ring-primary/50 hover:border-primary/50
          focus:scale-[1.01] rounded-xl"
        placeholder="Edit your comment..."
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={onSave}
          className="bg-primary hover:bg-primary/90 transition-all duration-300 
            group hover:scale-105 active:scale-95 rounded-xl shadow-sm"
        >
          <Check className="w-4 h-4 mr-2 transition-transform duration-300 
            group-hover:scale-110 group-hover:rotate-12" />
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          className="group hover:bg-destructive/10 hover:text-destructive 
            transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl"
        >
          <X className="w-4 h-4 mr-2 transition-transform duration-300 
            group-hover:rotate-90 group-hover:scale-110" />
          Cancel
        </Button>
      </div>
    </div>
  );
};