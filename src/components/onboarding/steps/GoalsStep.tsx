import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface GoalsStepProps {
  goals: string[];
  interests: string[];
  onGoalsChange: (goals: string[]) => void;
  onInterestsChange: (interests: string[]) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

export const GoalsStep = ({
  goals,
  interests,
  onGoalsChange,
  onInterestsChange,
  onBack,
  onSubmit,
  loading,
}: GoalsStepProps) => {
  const parentingGoals = {
    "Education": "Образование",
    "Health": "Здоровье",
    "Social Skills": "Социальные навыки",
    "Creativity": "Творчество"
  };

  const parentingInterests = {
    "Sports": "Спорт",
    "Arts": "Искусство",
    "Music": "Музыка",
    "Science": "Наука",
    "Nature": "Природа",
    "Technology": "Технологии"
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Почти готово!</CardTitle>
        <CardDescription>Выберите ваши цели и интересы в воспитании</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Цели воспитания</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(parentingGoals).map(([key, value]) => (
              <Button
                key={key}
                variant={goals.includes(key) ? "default" : "outline"}
                onClick={() =>
                  onGoalsChange(
                    goals.includes(key)
                      ? goals.filter((g) => g !== key)
                      : [...goals, key]
                  )
                }
                className="h-8"
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Интересы</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(parentingInterests).map(([key, value]) => (
              <Button
                key={key}
                variant={interests.includes(key) ? "default" : "outline"}
                onClick={() =>
                  onInterestsChange(
                    interests.includes(key)
                      ? interests.filter((i) => i !== key)
                      : [...interests, key]
                  )
                }
                className="h-8"
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button
          onClick={onSubmit}
          disabled={loading || !goals.length || !interests.length}
          className="flex-1"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Завершить
        </Button>
      </CardFooter>
    </>
  );
};