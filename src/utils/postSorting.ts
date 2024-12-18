export type SortOption = "hot" | "new" | "top";

export const sortPosts = (posts: any[], sortBy: SortOption) => {
  const now = new Date();

  switch (sortBy) {
    case "hot":
      // Sort by a combination of recency and votes
      return [...posts].sort((a, b) => {
        const aAge = (now.getTime() - new Date(a.created_at).getTime()) / 3600000; // hours
        const bAge = (now.getTime() - new Date(b.created_at).getTime()) / 3600000;
        const aScore = (a.votes || 0) / Math.pow(aAge + 2, 1.5);
        const bScore = (b.votes || 0) / Math.pow(bAge + 2, 1.5);
        return bScore - aScore;
      });
    case "new":
      return [...posts].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case "top":
      return [...posts].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    default:
      return posts;
  }
};