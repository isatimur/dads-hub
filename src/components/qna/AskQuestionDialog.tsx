import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom"; // To navigate to the new question
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query"; // To invalidate queries

interface AskQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskQuestionDialog = ({ isOpen, onClose }: AskQuestionDialogProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setIsAnonymous(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Необходимо войти, чтобы задать вопрос.");
      return;
    }
    if (title.trim() === "") {
      toast.error("Заголовок вопроса не может быть пустым.");
      return;
    }
    setIsLoading(true);

    try {
      const { data: questionData, error } = await supabase
        .from("qna_questions")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          user_id: session.user.id,
          is_anonymous: isAnonymous,
          // updated_at will be set to created_at by default in DB
        })
        .select("id") // Select ID to navigate
        .single();

      if (error || !questionData) throw error || new Error("Не удалось создать вопрос.");

      toast.success("Вопрос успешно опубликован!");
      queryClient.invalidateQueries({ queryKey: ['qnaQuestions'] }); // Invalidate list on QnaIndexPage
      onClose();
      navigate(`/qna/${questionData.id}`); // Navigate to the new question page
    } catch (error: any) {
      console.error("Error asking question:", error);
      toast.error(`Ошибка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Задать новый вопрос</DialogTitle>
          <DialogDescription>Сформулируйте ваш вопрос. Постарайтесь быть как можно конкретнее.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="qna-title">Заголовок вопроса*</Label>
            <Input id="qna-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Как справиться с истериками у трехлетки?" />
          </div>
          <div>
            <Label htmlFor="qna-description">Подробности вопроса (необязательно)</Label>
            <Textarea id="qna-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Опишите ситуацию подробнее..." rows={5} />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="qna-anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(Boolean(checked))} />
            <Label htmlFor="qna-anonymous">Опубликовать анонимно</Label>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild><Button type="button" variant="outline" onClick={onClose}>Отмена</Button></DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Опубликовать вопрос
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
