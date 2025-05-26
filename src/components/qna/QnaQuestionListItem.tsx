import { Link } from "react-router-dom";
import type { QnaQuestion } from "@/types/qna";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MessageSquare, UserCircle } from "lucide-react"; // Icons

interface QnaQuestionListItemProps {
  question: QnaQuestion;
}

export const QnaQuestionListItem = ({ question }: QnaQuestionListItemProps) => {
  const authorName = question.is_anonymous 
    ? "Аноним" 
    : question.profiles?.display_name || "Неизвестный автор";
  
  const lastActivity = question.updated_at 
    ? formatDistanceToNow(new Date(question.updated_at), { addSuffix: true, locale: ru })
    : (question.created_at ? formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: ru }) : 'N/A');
  
  // Placeholder for actual answer_count, which should come from the backend if possible
  const answerCount = question.answer_count !== undefined ? question.answer_count : 0;

  return (
    <div className="p-5 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
      <Link to={`/qna/${question.id}`} className="block mb-1">
        <h3 className="text-lg font-semibold text-primary dark:text-primary-400 hover:underline">
          {question.title}
        </h3>
      </Link>
      {question.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {question.description}
        </p>
      )}
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-3">
        <span className="flex items-center">
          <UserCircle className="w-3.5 h-3.5 mr-1" /> Автор: <span className="font-medium ml-1">{authorName}</span>
        </span>
        <span>•</span>
        <span>Активность: <span className="font-medium">{lastActivity}</span></span>
        {question.answer_count !== undefined && (
             <>
                <span>•</span>
                <span className="flex items-center">
                    <MessageSquare className="w-3.5 h-3.5 mr-1" /> Ответов: <span className="font-medium ml-1">{answerCount}</span>
                </span>
             </>
        )}
      </div>
    </div>
  );
};
