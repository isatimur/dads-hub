import { MainLayout } from "@/components/layout/MainLayout";

const QnaIndexPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Вопросы и Ответы</h1>
        <p>Список вопросов появится здесь.</p>
        {/* Button to ask question and list of questions will be implemented here */}
      </div>
    </MainLayout>
  );
};

export default QnaIndexPage;
