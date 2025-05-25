import type { Resource } from "@/types/resource";
import { LinkIcon, BookOpen, Video, ExternalLink } from "lucide-react"; // Example icons

interface ResourceListItemProps {
  resource: Resource;
}

const ResourceTypeIcon = ({ type }: { type?: string | null }) => {
  switch (type?.toLowerCase()) {
    case 'article':
    case 'website':
      return <LinkIcon className="w-5 h-5 text-gray-500" />;
    case 'book':
      return <BookOpen className="w-5 h-5 text-gray-500" />;
    case 'video':
      return <Video className="w-5 h-5 text-gray-500" />;
    default:
      return <LinkIcon className="w-5 h-5 text-gray-500" />;
  }
};

export const ResourceListItem = ({ resource }: ResourceListItemProps) => {
  return (
    <div className="p-5 border rounded-lg shadow hover:shadow-md transition-shadow duration-200 ease-in-out bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 pt-1">
          <ResourceTypeIcon type={resource.type} />
        </div>
        <div className="flex-1">
          <a 
            href={resource.url || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-lg font-semibold ${resource.url ? 'text-primary dark:text-primary-400 hover:underline' : 'text-gray-700 dark:text-gray-300'}`}
          >
            {resource.title}
            {resource.url && <ExternalLink className="inline-block w-4 h-4 ml-1.5 mb-1 text-gray-400" />}
          </a>
          {resource.resource_categories && (
            <span className="ml-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
              {resource.resource_categories.name}
            </span>
          )}
          {resource.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
          )}
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            Тип: <span className="font-medium">{resource.type || "Не указан"}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
