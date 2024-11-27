import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface Post {
  id: string;
  title: string;
  content: string;
  votes: number;
  created_at: string;
  author: {
    username: string;
  };
  category: {
    name: string;
  };
  comments: {
    id: string;
  }[];
}

const fetchPosts = async (category?: string) => {
  let query = supabase
    .from("posts")
    .select(`
      *,
      author:profiles(username),
      category:categories(name),
      comments(id)
    `)
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category.slug", category);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Post[];
};

export const usePosts = (category?: string) => {
  return useQuery({
    queryKey: ["posts", category],
    queryFn: () => fetchPosts(category),
  });
};