import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Child {
  name: string;
  age: number;
}

interface ChildrenStepProps {
  children: Child[];
  onChildrenChange: (children: Child[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ChildrenStep = ({
  children,
  onChildrenChange,
  onNext,
  onBack,
}: ChildrenStepProps) => {
  const handleChildChange = (index: number, field: keyof Child, value: string) => {
    const newChildren = [...children];
    if (field === "age") {
      newChildren[index][field] = parseInt(value) || 0;
    } else {
      newChildren[index][field] = value;
    }
    onChildrenChange(newChildren);
  };

  const handleAddChild = () => {
    onChildrenChange([...children, { name: "", age: 0 }]);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Tell us about your children</CardTitle>
        <CardDescription>This helps us personalize your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children.map((child, index) => (
          <div key={index} className="space-y-2">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor={`childName${index}`}>Name</Label>
                <Input
                  id={`childName${index}`}
                  value={child.name}
                  onChange={(e) => handleChildChange(index, "name", e.target.value)}
                  placeholder="Child's name"
                />
              </div>
              <div className="w-24">
                <Label htmlFor={`childAge${index}`}>Age</Label>
                <Input
                  id={`childAge${index}`}
                  type="number"
                  min="0"
                  value={child.age || ""}
                  onChange={(e) => handleChildChange(index, "age", e.target.value)}
                  placeholder="Age"
                />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={handleAddChild} className="w-full">
          Add Another Child
        </Button>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!children.some((child) => child.name && child.age > 0)}
          className="flex-1"
        >
          Next
        </Button>
      </CardFooter>
    </>
  );
};