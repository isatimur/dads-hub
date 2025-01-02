import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PenSquare, Lightbulb } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен").max(100),
  content: z.string().min(1, "Содержание обязательно"),
  category_id: z.string().min(1, "Выберите категорию"),
});

type FormValues = z.infer<typeof formSchema>;

const contentPrompts = {
  "emotional-intelligence": "Поделитесь опытом помощи ребенку в работе с эмоциями...",
  "quality-time": "Опишите значимое событие/занятие, которое укрепило вашу связь...",
  "personal-growth": "Какой родительский вызов помог вам вырасти...",
  "work-life-balance": "Как вы совмещаете работу и присутствие в жизни ребенка...",
  "child-development": "Поделитесь наблюдениями о важном этапе развития...",
  "family-traditions": "Расскажите о значимой традиции, которую вы начали...",
  "health-wellness": "Какие стратегии помогают поддерживать здоровье семьи...",
  "digital-parenting": "Как вы подходите к использованию технологий и экранному времени...",
  "financial-planning": "Поделитесь советами по обеспечению будущего семьи..."
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export const CreatePostDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const session = useSession();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category_id: "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        toast.error("Не удалось загрузить категории");
        return;
      }

      if (data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!session?.user?.id) {
      toast.error("Для создания поста необходимо войти в систему");
      return;
    }

    try {
      const { error } = await supabase
        .from("posts")
        .insert({
          title: values.title,
          content: values.content,
          category_id: values.category_id,
          author_id: session.user.id,
        });

      if (error) throw error;

      toast.success("Пост успешно создан!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Не удалось создать пост");
      console.error("Ошибка при создании поста:", error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categories.find(cat => cat.id === categoryId)?.slug || "");
    form.setValue("category_id", categoryId);

    // Reset content field with new placeholder
    form.setValue("content", "");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden md:flex items-center space-x-2">
          <PenSquare className="w-4 h-4" />
          <span>Поделиться опытом</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Поделитесь своим опытом отцовства
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <Select onValueChange={(value) => handleCategoryChange(value)} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Дайте вашему посту ясный, привлекательный заголовок"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Поделитесь историей</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={contentPrompts[selectedCategory as keyof typeof contentPrompts] || "Поделитесь своим опытом..."}
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Поделиться с сообществом</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};