import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";

const QnaQuestionPage = () => {
  const { questionId } = useParams<{ questionId: string }>();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Вопрос ID: {questionId}</h1>
        <p>Детали вопроса, ответы и форма для нового ответа появятся здесь.</p>
      </div>
    </MainLayout>
  );
};

export default QnaQuestionPage;
