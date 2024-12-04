import { PostCard } from "@/components/PostCard";

interface PostListProps {
  posts: any[];
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

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 animate-fade-in">
        <p className="text-lg mb-4">No posts found in this category yet.</p>
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
          author={post.author?.username || 'Anonymous'}
          category={post.category?.name || 'Uncategorized'}
          votes={post.votes}
          comments={post.comments || []}
          timeAgo={new Date(post.created_at).toLocaleDateString()}
        />
      ))}
    </div>
  );
};