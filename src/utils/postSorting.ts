export type SortOption = "new" | "hot" | "top";

export const sortPosts = (posts: any[], sortBy: SortOption) => {
  return [...posts].sort((a, b) => {
    switch (sortBy) {
      case "new":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "hot":
        const aHotScore = a.votes * (1 / Math.pow((Date.now() - new Date(a.created_at).getTime()) / 3600000 + 2, 1.5));
        const bHotScore = b.votes * (1 / Math.pow((Date.now() - new Date(b.created_at).getTime()) / 3600000 + 2, 1.5));
        return bHotScore - aHotScore;
      case "top":
        return (b.votes || 0) - (a.votes || 0);
      default:
        return 0;
    }
  });
};