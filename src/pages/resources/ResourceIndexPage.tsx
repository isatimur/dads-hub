import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import type { Resource, ResourceCategory } from "@/types/resource";
import { ResourceListItem } from "@/components/resources/ResourceListItem";
import { SuggestResourceButton } from "@/components/resources/SuggestResourceButton";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertTriangle, FilterX, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Added import for Label


const fetchResourceData = async (): Promise<{ resources: Resource[], categories: ResourceCategory[] }> => {
  // Fetch approved resources, joining category name
  const { data: resources, error: resourcesError } = await supabase
    .from("resources")
    .select("*, resource_categories(id, name)") // Select all from resources, and id, name from joined category
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (resourcesError) {
    console.error("Error fetching resources:", resourcesError);
    throw new Error(resourcesError.message);
  }

  // Fetch all categories for filtering
  const { data: categories, error: categoriesError } = await supabase
    .from("resource_categories")
    .select("*")
    .order("name", { ascending: true });

  if (categoriesError) {
    console.error("Error fetching resource categories:", categoriesError);
    throw new Error(categoriesError.message);
  }
  
  return { resources: resources || [], categories: categories || [] };
};


const ResourceIndexPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // Store as string for Select

  const { 
    data: pageData, 
    isLoading, 
    error, 
    isError 
  } = useQuery<{ resources: Resource[], categories: ResourceCategory[] }, Error>(
    ['allResourcesAndCategories'],
    fetchResourceData
  );

  const resources = pageData?.resources || [];
  const categories = pageData?.categories || [];

  const filteredResources = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === "all") {
      return resources;
    }
    return resources.filter(resource => resource.resource_categories?.id === parseInt(selectedCategoryId));
  }, [resources, selectedCategoryId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Загрузка ресурсов...</p>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-600">Ошибка загрузки ресурсов</h2>
          <p className="text-muted-foreground mb-6">{error?.message}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">Библиотека Ресурсов</h1>
          <SuggestResourceButton />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
             <Label htmlFor="category-filter" className="text-md font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Фильтр по категории:</Label>
            <Select
              value={selectedCategoryId || "all"}
              onValueChange={(value) => setSelectedCategoryId(value === "all" ? null : value)}
            >
              <SelectTrigger id="category-filter" className="w-full sm:w-[280px] glass-input">
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategoryId && (
                 <Button variant="ghost" onClick={() => setSelectedCategoryId(null)} className="text-sm text-primary hover:text-primary-dark">
                    <FilterX className="w-4 h-4 mr-2" />
                    Сбросить фильтр
                </Button>
            )}
          </div>
        )}

        {/* Resources List */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceListItem key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <List className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-2">
              {selectedCategoryId && selectedCategoryId !== "all" 
                ? "В этой категории пока нет одобренных ресурсов." 
                : "Одобренные ресурсы еще не добавлены."}
            </p>
            <p className="text-sm text-muted-foreground">
                {selectedCategoryId && selectedCategoryId !== "all" 
                ? "Попробуйте выбрать другую категорию или предложите свой ресурс."
                : "Проверьте позже или предложите свой полезный материал!"}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ResourceIndexPage;
