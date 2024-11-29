import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PenSquare } from "lucide-react";
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

export const CreatePostDialog = () => {
  const [open, setOpen] = useState(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden md:flex items-center space-x-2">
          <PenSquare className="w-4 h-4" />
          <span>Create Post</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
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
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your post content..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="newborns">Newborns</SelectItem>
                      <SelectItem value="toddlers">Toddlers</SelectItem>
                      <SelectItem value="school-age">School Age</SelectItem>
                      <SelectItem value="teenagers">Teenagers</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="self-care">Self Care</SelectItem>
                      <SelectItem value="co-parenting">Co-Parenting</SelectItem>
                      <SelectItem value="activities">Activities</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Post</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};