import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import type { ForumCategory, ForumThread } from "@/types/forum";
import { ForumThreadListItem } from "@/components/forums/ForumThreadListItem";
import { CreateNewThreadButton } from "@/components/forums/CreateNewThreadButton"; // We'll create this next
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { Loader2, MessageSquarePlus } from "lucide-react"; // MessageSquarePlus for new thread icon

interface CategoryPageData {
  category: ForumCategory | null;
  threads: ForumThread[];
}

const fetchCategoryPageData = async (categorySlug: string): Promise<CategoryPageData> => {
  // 1. Fetch the category by slug
  const { data: categoryData, error: categoryError } = await supabase
    .from("forum_categories")
    .select("*")
    .eq("slug", categorySlug)
    .single();

  if (categoryError || !categoryData) {
    console.error("Error fetching category:", categoryError);
    throw new Error(categoryError?.message || "Category not found");
  }

  // 2. Fetch threads for this category
  // For post_count, a view 'threads_with_post_count' would be ideal:
  // SELECT t.*, p.display_name as author_display_name, COALESCE(pc.post_count, 0) as post_count
  // FROM forum_threads t
  // LEFT JOIN profiles p ON t.user_id = p.id
  // LEFT JOIN (SELECT thread_id, COUNT(*) as post_count FROM forum_posts GROUP BY thread_id) pc ON t.id = pc.thread_id
  // For now, we'll fetch threads and join profiles. Post count is deferred or handled by a simpler approximation if needed.
  const { data: threadsData, error: threadsError } = await supabase
    .from("forum_threads")
    .select("*, profiles(display_name)") // Fetches all columns from forum_threads and display_name from related profiles
    .eq("category_id", categoryData.id)
    .order("updated_at", { ascending: false });

  if (threadsError) {
    console.error("Error fetching threads:", threadsError);
    throw new Error(threadsError.message);
  }

  return { category: categoryData, threads: threadsData || [] };
};

const ForumCategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const { 
    data: pageData, 
    isLoading, 
    error, 
    isError 
  } = useQuery<CategoryPageData, Error>(
    ['forumCategory', categorySlug], 
    () => {
      if (!categorySlug) throw new Error("Category slug is required");
      return fetchCategoryPageData(categorySlug);
    },
    { enabled: !!categorySlug } // Only run query if categorySlug is available
  );

  const category = pageData?.category;
  const threads = pageData?.threads || [];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Загрузка данных категории...</p>
          </div>
        )}

        {isError && (
           <div className="text-center py-10 px-4">
            <p className="text-lg text-red-600 dark:text-red-400">
              Не удалось загрузить данные категории.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error?.message === "Category not found" 
                ? "Категория не найдена." 
                : "Пожалуйста, попробуйте еще раз позже."}
            </p>
            <Link to="/forums" className="mt-4 inline-block text-primary hover:underline">
              Вернуться к списку форумов
            </Link>
          </div>
        )}

        {category && !isLoading && !isError && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b dark:border-gray-700">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{category.name}</h1>
                {category.description && (
                  <p className="text-muted-foreground mt-1">{category.description}</p>
                )}
              </div>
              {/* We will create CreateNewThreadButton component next */}
              <CreateNewThreadButton categoryId={category.id} />
            </div>

            {threads.length > 0 ? (
              <div className="space-y-0 bg-white dark:bg-gray-800 rounded-lg shadow">
                {threads.map((thread) => (
                  <ForumThreadListItem key={thread.id} thread={thread} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">В этой категории еще нет тем.</p>
                <p className="text-muted-foreground">Будьте первым, кто создаст тему!</p>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ForumCategoryPage;
