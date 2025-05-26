import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import type { ForumCategory } from "@/types/forum";
import { ForumCategoryListItem } from "@/components/forums/ForumCategoryListItem"; // New import
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react"; // For loading state

const fetchForumCategories = async (): Promise<ForumCategory[]> => {
  const { data, error } = await supabase
    .from("forum_categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching forum categories:", error);
    throw new Error(error.message);
  }
  return data || [];
};

const ForumIndexPage = () => {
  const { data: categories, isLoading, error, isError } = useQuery<ForumCategory[], Error>({
    queryKey: ["forumCategories"],
    queryFn: fetchForumCategories,
  });

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Форумы</h1>
          {/* Placeholder for a "Create Category" button for admins later */}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Загрузка категорий...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
            <p className="text-lg text-red-600 dark:text-red-400">
              Не удалось загрузить категории форума. Пожалуйста, попробуйте еще раз позже.
            </p>
            {error && <p className="text-sm text-muted-foreground mt-2">{error.message}</p>}
          </div>
        )}

        {categories && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <ForumCategoryListItem key={category.id} category={category} />
            ))}
          </div>
        )}

        {categories && categories.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Категории еще не созданы.</p>
            {/* TODO: Link to admin panel or info for admins on how to create categories */}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ForumIndexPage;
