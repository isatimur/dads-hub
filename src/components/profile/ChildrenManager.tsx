import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

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
        <Label>Children</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addChild}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Child
        </Button>
      </div>
      
      <div className="space-y-4">
        {childrenList.map((child, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <Label>Name</Label>
              <Input
                value={child.name}
                onChange={(e) => updateChild(index, "name", e.target.value)}
                placeholder="Child's name"
              />
            </div>
            <div className="flex-1">
              <Label>Age</Label>
              <Input
                type="number"
                value={child.age}
                onChange={(e) => updateChild(index, "age", e.target.value)}
                placeholder="Age"
                min="0"
                max="18"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-6"
              onClick={() => removeChild(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};