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
    content: string;
    created_at: string;
    author: {
      username: string;
    };
  }[];
}

const fetchPosts = async (category?: string) => {
  if (category && category !== "all") {
    // First get the category ID
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();

    if (categoryData) {
      // Then use the category ID to filter posts
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles(username),
          category:categories(name),
          comments(
            id,
            content,
            created_at,
            author:profiles(username)
          )
        `)
        .eq("category_id", categoryData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    }
  }

  // If no category or category is "all", fetch all posts
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles(username),
      category:categories(name),
      comments(
        id,
        content,
        created_at,
        author:profiles(username)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Post[];
};

export const usePosts = (category?: string) => {
  return useQuery({
    queryKey: ["posts", category],
    queryFn: () => fetchPosts(category),
  });
};