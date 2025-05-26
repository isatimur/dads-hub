import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import type { ForumThread, ForumPost } from "@/types/forum"; // Assuming ForumPost includes profiles
import { ForumPostListItem } from "@/components/forums/ForumPostListItem";
import { ReplyToThreadForm } from "@/components/forums/ReplyToThreadForm";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Added useQueryClient
import { useParams, Link } from "react-router-dom";
import { Loader2, AlertTriangle, MessageCircle } from "lucide-react"; // Icons
import { format } from 'date-fns'; // For formatting dates
import { ru } from 'date-fns/locale';

interface ThreadPageData {
  thread: ForumThread | null;
  posts: ForumPost[];
}

const fetchThreadPageData = async (threadId: string): Promise<ThreadPageData> => {
  if (!threadId || isNaN(parseInt(threadId))) {
    throw new Error("Invalid thread ID");
  }

  // 1. Fetch the thread details, including author's display name
  const { data: threadData, error: threadError } = await supabase
    .from("forum_threads")
    .select("*, profiles(display_name)")
    .eq("id", parseInt(threadId))
    .single();

  if (threadError || !threadData) {
    console.error("Error fetching thread:", threadError);
    throw new Error(threadError?.message || "Thread not found");
  }

  // 2. Fetch posts for this thread, including author's display name for each post
  const { data: postsData, error: postsError } = await supabase
    .from("forum_posts")
    .select("*, profiles(display_name)")
    .eq("thread_id", threadData.id)
    .order("created_at", { ascending: true });

  if (postsError) {
    console.error("Error fetching posts:", postsError);
    throw new Error(postsError.message);
  }

  return { thread: threadData, posts: postsData || [] };
};

const ThreadPage = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const queryClient = useQueryClient(); // For invalidating queries

  const queryKey = ['thread', threadId];

  const { 
    data: pageData, 
    isLoading, 
    error, 
    isError 
  } = useQuery<ThreadPageData, Error>(
    queryKey, 
    () => {
      if (!threadId) throw new Error("Thread ID is required");
      return fetchThreadPageData(threadId);
    },
    { enabled: !!threadId }
  );

  const thread = pageData?.thread;
  const posts = pageData?.posts || [];

  const handleReplySuccess = () => {
    // Invalidate the current thread query to refetch posts
    queryClient.invalidateQueries(queryKey);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <div className="text-center space-y-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Загрузка темы...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Ошибка загрузки темы
          </h2>
          <p className="text-muted-foreground mb-6">
            {error?.message === "Thread not found" || error?.message?.includes("JSON object requested") 
              ? "Тема не найдена или удалена." 
              : `Не удалось загрузить данные темы. ${error?.message || ""}`}
          </p>
          <Link to="/forums" className="text-primary hover:underline font-medium">
            &larr; Вернуться к списку форумов
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  if (!thread) { // Should be caught by isError, but as a fallback
     return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Тема не найдена</h2>
          <Link to="/forums" className="text-primary hover:underline font-medium">
            &larr; Вернуться к списку форумов
          </Link>
        </div>
      </MainLayout>
    );
  }

  const threadAuthorName = thread.is_anonymous ? "Аноним" : thread.profiles?.display_name || "Неизвестный автор";
  const threadDate = format(new Date(thread.created_at), "d MMMM yyyy 'в' HH:mm", { locale: ru });

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Thread Header */}
        <div className="mb-6 pb-4 border-b dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{thread.title}</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-x-2">
            <span>Автор: <span className="font-semibold">{threadAuthorName}</span></span>
            <span>•</span>
            <span>Создана: <span className="font-semibold">{threadDate}</span></span>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
          {posts.length > 0 ? (
            posts.map((post) => (
              <ForumPostListItem key={post.id} post={post} />
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <MessageCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p>В этой теме еще нет ответов.</p>
              <p className="text-sm">Будьте первым, кто оставит свой комментарий!</p>
            </div>
          )}
        </div>

        {/* Reply Form */}
        <ReplyToThreadForm threadId={thread.id} onReplySuccess={handleReplySuccess} />
      </div>
    </MainLayout>
  );
};

export default ThreadPage;
