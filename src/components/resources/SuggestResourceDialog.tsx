import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import type { ResourceCategory } from "@/types/resource";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SuggestResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const fetchResourceCategories = async (): Promise<ResourceCategory[]> => {
  const { data, error } = await supabase.from("resource_categories").select("*").order("name");
  if (error) throw new Error(error.message);
  return data || [];
};

export const SuggestResourceDialog = ({ isOpen, onClose }: SuggestResourceDialogProps) => {
  const session = useSession();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>(""); // Store as string for Select component
  const [type, setType] = useState(""); // e.g., article, video, book
  const [isLoading, setIsLoading] = useState(false);

  const { data: categories, isLoading: isLoadingCategories } = useQuery<ResourceCategory[], Error>(
    ['resourceCategories'],
    fetchResourceCategories
  );
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setUrl("");
      setDescription("");
      setCategoryId("");
      setType("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Необходимо войти, чтобы предложить ресурс.");
      return;
    }
    if (!title || !categoryId || !type) {
      toast.error("Пожалуйста, заполните Заголовок, Категорию и Тип.");
      return;
    }
    setIsLoading(true);

    try {
      const { error } = await supabase.from("resources").insert({
        title: title.trim(),
        url: url.trim() || null,
        description: description.trim() || null,
        category_id: parseInt(categoryId), // Ensure categoryId is an int
        type: type.trim(),
        submitted_by_user_id: session.user.id,
        status: 'pending', // Default status for suggestions
      });

      if (error) throw error;

      toast.success("Ресурс предложен! Спасибо. Он появится после проверки модератором.");
      onClose();
    } catch (error: any) {
      console.error("Error suggesting resource:", error);
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
          <DialogTitle>Предложить новый ресурс</DialogTitle>
          <DialogDescription>Поделитесь полезным материалом с сообществом. Все предложения проходят модерацию.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="res-title">Заголовок*</Label>
            <Input id="res-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название ресурса" />
          </div>
          <div>
            <Label htmlFor="res-url">URL (ссылка)</Label>
            <Input id="res-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          </div>
          <div>
            <Label htmlFor="res-description">Краткое описание</Label>
            <Textarea id="res-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="О чем этот ресурс?" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="res-category">Категория*</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger id="res-category">
                  <SelectValue placeholder={isLoadingCategories ? "Загрузка..." : "Выберите категорию"} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="res-type">Тип ресурса*</Label>
              <Input id="res-type" value={type} onChange={(e) => setType(e.target.value)} placeholder="Напр: Статья, Видео, Книга" />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild><Button type="button" variant="outline" onClick={onClose}>Отмена</Button></DialogClose>
            <Button type="submit" disabled={isLoading || isLoadingCategories}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Предложить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
