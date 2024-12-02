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
    <div className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex space-x-2">
        <Button size="sm" onClick={onSave}>
          <Check className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};