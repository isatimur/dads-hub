import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestsListProps {
  quests: Array<{
    id: string;
    title: string;
    description: string;
    requirements: Record<string, any>;
    points: number;
    user_quests: Array<{
      progress: Record<string, boolean>;
      completed_at: string | null;
    }>;
  }>;
}

export const QuestsList = ({ quests }: QuestsListProps) => (
  <Card className="hover:shadow-md transition-shadow duration-200">
    <CardHeader>
      <CardTitle className="text-xl text-primary">Активные квесты</CardTitle>
      <CardDescription>Ваши текущие задания</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {quests.map((quest) => {
          const requirements = quest.requirements;
          const progress = quest.user_quests[0].progress;
          const isCompleted = quest.user_quests[0].completed_at;

          const totalSteps = Object.keys(requirements).length;
          const completedSteps = Object.keys(progress).filter(
            (key) => progress[key] === true
          ).length;
          const progressPercentage = (completedSteps / totalSteps) * 100;

          return (
            <div key={quest.id} className="space-y-2 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                    {quest.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {quest.description}
                  </p>
                </div>
                <Badge variant={isCompleted ? "default" : "secondary"}>
                  {isCompleted ? "Завершено" : `${quest.points} баллов`}
                </Badge>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2 transition-all duration-500 ease-in-out"
              />
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);