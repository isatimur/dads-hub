import { useState } from "react";
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
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  category_id: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof formSchema>;

const contentPrompts = {
  "emotional-intelligence": "Share your experience with helping your child process emotions...",
  "quality-time": "Describe a meaningful activity that strengthened your bond...",
  "personal-growth": "What's a parenting challenge that helped you grow...",
  "work-life-balance": "How do you manage work responsibilities while staying present...",
  "child-development": "Share insights about a developmental milestone...",
  "family-traditions": "Describe a meaningful tradition you've started...",
  "health-wellness": "What strategies help you maintain family health...",
  "digital-parenting": "How do you approach screen time and technology...",
  "financial-planning": "Share tips for securing your family's future..."
};

export const CreatePostDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
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

  const onSubmit = async (values: FormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a post");
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

      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Error creating post:", error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    form.setValue("category_id", categoryId);
    
    // Reset content field with new placeholder
    form.setValue("content", "");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden md:flex items-center space-x-2">
          <PenSquare className="w-4 h-4" />
          <span>Share Your Experience</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Share Your Parenting Journey
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={(value) => handleCategoryChange(value)} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="emotional-intelligence">Emotional Intelligence</SelectItem>
                      <SelectItem value="quality-time">Quality Time</SelectItem>
                      <SelectItem value="personal-growth">Personal Growth</SelectItem>
                      <SelectItem value="work-life-balance">Work-Life Balance</SelectItem>
                      <SelectItem value="child-development">Child Development</SelectItem>
                      <SelectItem value="family-traditions">Family Traditions</SelectItem>
                      <SelectItem value="health-wellness">Health & Wellness</SelectItem>
                      <SelectItem value="digital-parenting">Digital Parenting</SelectItem>
                      <SelectItem value="financial-planning">Financial Planning</SelectItem>
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Give your post a clear, engaging title" 
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
                  <FormLabel>Share Your Story</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={contentPrompts[selectedCategory as keyof typeof contentPrompts] || "Share your experience..."} 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Share with Community</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};