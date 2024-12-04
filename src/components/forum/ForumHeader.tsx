import { CreatePostDialog } from "@/components/CreatePostDialog";

export const ForumHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8 animate-fade-up">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to DadSpace</h1>
        <p className="text-xl text-gray-600">
          A community for conscious fathers supporting each other.
        </p>
      </div>
      <CreatePostDialog />
    </div>
  );
};