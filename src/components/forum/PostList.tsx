import { PostCard } from "@/components/PostCard";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  category: {
    name: string;
  };
  created_at: string;
  votes?: number;
  comments?: any[];
  slug: string;
}

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
}

export const PostList = ({ posts, isLoading }: PostListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p className="text-lg mb-4">Пока нет постов в этой категории.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          author={post.author || { username: 'Аноним' }}
          category={post.category || { name: 'Без категории' }}
          votes={post.votes || 0}
          comments={post.comments || []}
          timeAgo={new Date(post.created_at).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
          slug={post.slug}
        />
      ))}
    </div>
  );
};