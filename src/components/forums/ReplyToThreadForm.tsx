import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom"; // For login link

interface ReplyToThreadFormProps {
  threadId: number;
  onReplySuccess: () => void; // Callback to refresh posts
}

export const ReplyToThreadForm = ({ threadId, onReplySuccess }: ReplyToThreadFormProps) => {
  const session = useSession();
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Нужно войти в систему, чтобы ответить.");
      return;
    }
    if (content.trim() === "") {
      toast.error("Сообщение не может быть пустым.");
      return;
    }
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("forum_posts")
        .insert({
          thread_id: threadId,
          user_id: session.user.id,
          content: content.trim(),
          is_anonymous: isAnonymous,
        });

      if (error) throw error;

      toast.success("Ответ успешно добавлен!");
      setContent("");
      setIsAnonymous(false);
      onReplySuccess(); // Trigger refetch or update in parent
    } catch (error: any) {
      console.error("Error posting reply:", error);
      toast.error(`Ошибка отправки ответа: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!session) {
    return (
      <div className="mt-6 p-4 border-t dark:border-gray-700 text-center">
        <p className="text-muted-foreground text-sm">
          Пожалуйста, <Link to={`/auth?redirect=/threads/${threadId}`} className="text-primary hover:underline font-semibold">войдите в систему</Link> или <Link to={`/auth?redirect=/threads/${threadId}`} className="text-primary hover:underline font-semibold">зарегистрируйтесь</Link>, чтобы оставить ответ.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
      <Label htmlFor="reply-content" className="block text-md font-semibold mb-2 text-gray-800 dark:text-white">Ваш ответ:</Label>
      <Textarea
        id="reply-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Напишите ваш ответ..."
        rows={5}
        className="mb-3 bg-white dark:bg-gray-700"
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2 mb-3 sm:mb-0">
          <Checkbox id="reply-anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(Boolean(checked))} />
          <Label htmlFor="reply-anonymous" className="text-sm">Ответить анонимно</Label>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Отправить ответ
        </Button>
      </div>
    </form>
  );
};
