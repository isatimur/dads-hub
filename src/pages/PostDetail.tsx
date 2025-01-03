import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PostCard } from "@/components/PostCard";
import { useSession } from "@supabase/auth-helpers-react";

export const PostDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const session = useSession();
    const queryClient = useQueryClient();

    // Main post query
    const { data: post, isLoading } = useQuery({
        queryKey: ["post", slug],
        queryFn: async () => {
            try {
                const { data, error } = await supabase
                    .from("posts")
                    .select(`
                        id,
                        title,
                        content,
                        created_at,
                        slug,
                        votes,
                        profiles!posts_author_id_fkey (
                            id,
                            username,
                            avatar_url
                        ),
                        categories (
                            id,
                            name
                        ),
                        comments (
                            id,
                            content,
                            created_at,
                            profiles (
                                id,
                                username,
                                avatar_url
                            )
                        )
                    `)
                    .eq("slug", slug)
                    .single();

                if (error) throw error;
                if (!data) throw new Error("Пост не найден");

                return {
                    ...data,
                    author: data.profiles || { username: 'Аноним', avatar_url: null },
                    category: data.categories?.[0] || { name: 'Без категории' }
                };
            } catch (err) {
                console.error("Ошибка загрузки поста:", err);
                toast.error("Не удалось загрузить пост");
                navigate("/");
                return null;
            }
        },
        retry: false
    });

    // Vote mutation using content_moderation table
    const voteMutation = useMutation({
        mutationFn: async (type: 'up' | 'down') => {
            if (!session?.user) {
                throw new Error("Необходима авторизация");
            }

            const { data: existingVote, error: checkError } = await supabase
                .from("content_moderation")
                .select("action_type")
                .eq("content_id", post?.id)
                .eq("user_id", session.user.id)
                .eq("content_type", 'post')
                .single();

            if (checkError && checkError.code !== "PGRST116") {
                throw checkError;
            }

            if (existingVote) {
                // Remove vote if same type
                if (existingVote.action_type === type) {
                    const { error } = await supabase
                        .from("content_moderation")
                        .delete()
                        .eq("content_id", post?.id)
                        .eq("user_id", session.user.id)
                        .eq("content_type", 'post');

                    if (error) throw error;
                    return "removed";
                }

                // Update vote type
                const { error } = await supabase
                    .from("content_moderation")
                    .update({ action_type: type })
                    .eq("content_id", post?.id)
                    .eq("user_id", session.user.id)
                    .eq("content_type", 'post');

                if (error) throw error;
                return "updated";
            }

            // Create new vote
            const { error } = await supabase
                .from("content_moderation")
                .insert({
                    content_id: post?.id,
                    user_id: session.user.id,
                    content_type: 'post',
                    action_type: type
                });

            if (error) throw error;
            return "added";
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["post", slug] });
            const messages = {
                added: "Голос учтен",
                updated: "Голос изменен",
                removed: "Голос отменен"
            };
            toast.success(messages[result]);
        },
        onError: (error) => {
            if (error.message === "Необходима авторизация") {
                toast.error("Войдите, чтобы голосовать");
            } else {
                toast.error("Не удалось проголосовать");
            }
        }
    });

    // Report mutation using content_reports table
    const reportMutation = useMutation({
        mutationFn: async (reason: string) => {
            if (!session?.user) {
                throw new Error("Необходима авторизация");
            }

            const { error } = await supabase
                .from("content_reports")
                .insert({
                    content_id: post?.id,
                    reporter_id: session.user.id,
                    content_type: 'post',
                    reason: reason,
                    status: 'pending'
                });

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Жалоба отправлена");
        },
        onError: (error) => {
            if (error.message === "Необходима авторизация") {
                toast.error("Войдите, чтобы отправить жалобу");
            } else {
                toast.error("Не удалось отправить жалобу");
            }
        }
    });

    // Loading state
    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

    // Not found state
    if (!post) {
        return (
            <MainLayout>
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Пост не найден</h1>
                    <p className="text-gray-600 mb-6">
                        Возможно, пост был удален или перемещен
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="text-primary hover:underline"
                    >
                        Вернуться на главную
                    </button>
                </div>
            </MainLayout>
        );
    }

    const metaDescription = post.content.slice(0, 155) + "...";

    return (
        <MainLayout>
            <Helmet defaultTitle="Отец Молодец" titleTemplate="%s | Отец Молодец">
                <title>{post.title}</title>
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={post.created_at} />
                <meta property="article:author" content={post.author.username} />
                <meta property="article:section" content={post.category.name} />
            </Helmet>

            <div className="max-w-3xl mx-auto py-8">
                <PostCard
                    {...post}
                    category={post.category.name}
                    onVote={(type) => voteMutation.mutateAsync(type)}
                    onReport={(reason) => reportMutation.mutateAsync(reason)}
                />
            </div>
        </MainLayout>
    );
};