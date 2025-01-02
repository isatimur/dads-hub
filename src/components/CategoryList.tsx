import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CategoryListProps {
  onCategoryChange: (category: string) => void
  selectedCategory?: string
}

const categories = [
  { id: 'all', label: 'Все публикации' },
  { id: 'parenting', label: 'Воспитание' },
  { id: 'relationships', label: 'Отношения' },
  { id: 'work-life', label: 'Работа и жизнь' },
  { id: 'health', label: 'Здоровье' },
  { id: 'activities', label: 'Активности' },
  { id: 'education', label: 'Образование' },
]

const CategoryList: React.FC<CategoryListProps> = ({
  onCategoryChange,
  selectedCategory = 'all'
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            'transition-colors',
            selectedCategory === category.id && 'bg-primary text-primary-foreground'
          )}
        >
          {category.label}
        </Button>
      ))}
    </div>
  )
}

export { CategoryList }
