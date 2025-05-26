import { useState, useEffect } from "react"; // Added useEffect
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription, // Added for context
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateNewThreadDialogProps {
  categoryId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateNewThreadDialog = ({ categoryId, isOpen, onClose }: CreateNewThreadDialogProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens/closes or categoryId changes (though categoryId change mid-dialog is unlikely)
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setContent("");
      setIsAnonymous(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Необходимо войти в систему, чтобы создать тему.");
      return;
    }
    if (title.trim() === "" || content.trim() === "") {
      toast.error("Заголовок и содержание не могут быть пустыми.");
      return;
    }
    setIsLoading(true);

    try {
      // 1. Create the thread
      const { data: threadData, error: threadError } = await supabase
        .from("forum_threads")
        .insert({
          category_id: categoryId,
          user_id: session.user.id,
          title: title.trim(),
          is_anonymous: isAnonymous,
          // updated_at will be set by database trigger on new post
        })
        .select("id") // Select only the ID, or more if needed immediately
        .single();

      if (threadError || !threadData) {
        console.error("Thread creation error:", threadError);
        throw threadError || new Error("Не удалось создать тему. Ошибка данных.");
      }

      // 2. Create the initial post for the thread
      const { error: postError } = await supabase
        .from("forum_posts")
        .insert({
          thread_id: threadData.id,
          user_id: session.user.id,
          content: content.trim(),
          is_anonymous: isAnonymous, // Anonymous status of post matches thread's initial anonymous status
        });

      if (postError) {
        console.error("Post creation error:", postError);
        // Attempt to delete the orphaned thread if the initial post fails
        await supabase.from("forum_threads").delete().eq("id", threadData.id);
        throw postError;
      }

      toast.success("Тема успешно создана!");
      onClose(); // Close dialog
      navigate(`/threads/${threadData.id}`); // Navigate to the new thread
    } catch (error: any) {
      console.error("Error creating new thread:", error);
      toast.error(`Ошибка создания темы: ${error.message || "Неизвестная ошибка"}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Prevent rendering if not open, to ensure state reset via useEffect works cleanly
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Создать новую тему</DialogTitle>
          <DialogDescription>
            Заполните информацию ниже, чтобы начать новое обсуждение.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="thread-title" className="pb-1.5 block">Заголовок темы</Label>
            <Input id="thread-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Введите заголовок..." />
          </div>
          <div>
            <Label htmlFor="thread-content" className="pb-1.5 block">Ваше сообщение</Label>
            <Textarea id="thread-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Начните обсуждение..." rows={6} />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="thread-anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(Boolean(checked))} />
            <Label htmlFor="thread-anonymous">Опубликовать анонимно</Label>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Создать тему
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
