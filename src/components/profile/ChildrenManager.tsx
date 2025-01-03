import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Child {
  name: string;
  age: string;
}

interface ChildrenManagerProps {
  children: Child[];
  onChange: (children: Child[]) => void;
}

export const ChildrenManager = ({ children, onChange }: ChildrenManagerProps) => {
  const [childrenList, setChildrenList] = useState<Child[]>(children);

  const addChild = () => {
    const newChildren = [...childrenList, { name: "", age: "" }];
    setChildrenList(newChildren);
    onChange(newChildren);
  };

  const removeChild = (index: number) => {
    const newChildren = childrenList.filter((_, i) => i !== index);
    setChildrenList(newChildren);
    onChange(newChildren);
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const newChildren = childrenList.map((child, i) => {
      if (i === index) {
        return { ...child, [field]: value };
      }
      return child;
    });
    setChildrenList(newChildren);
    onChange(newChildren);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Children</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChild}
                className="glass-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить ребенка
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Добавить информацию о ваших детях</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-4">
        {childrenList.map((child, index) => (
          <div key={index} className="flex gap-4 items-start animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex-1">
              <Label>Имя</Label>
              <Input
                value={child.name}
                onChange={(e) => updateChild(index, "name", e.target.value)}
                placeholder="Имя ребенка"
                className="glass-input mt-1"
              />
            </div>
            <div className="flex-1">
              <Label>Возраст</Label>
              <Input
                type="number"
                value={child.age}
                onChange={(e) => updateChild(index, "age", e.target.value)}
                placeholder="Возраст"
                min="0"
                max="18"
                className="glass-input mt-1"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-7 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeChild(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Удалить ребенка</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
};