import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";

const ForumCategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Категория: {categorySlug}</h1>
        <p>Список тем в этой категории появится здесь.</p>
      </div>
    </MainLayout>
  );
};

export default ForumCategoryPage;
