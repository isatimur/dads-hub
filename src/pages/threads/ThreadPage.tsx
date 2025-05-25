import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";

const ThreadPage = () => {
  const { threadId } = useParams<{ threadId: string }>();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Тема: {threadId}</h1>
        <p>Содержимое темы и форма ответа появятся здесь.</p>
      </div>
    </MainLayout>
  );
};

export default ThreadPage;
