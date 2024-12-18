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
  return (
    <>
      <CardHeader>
        <CardTitle>Almost done!</CardTitle>
        <CardDescription>Select your parenting goals and interests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Parenting Goals</Label>
          <div className="flex flex-wrap gap-2">
            {["Education", "Health", "Social Skills", "Creativity"].map((goal) => (
              <Button
                key={goal}
                variant={goals.includes(goal) ? "default" : "outline"}
                onClick={() =>
                  onGoalsChange(
                    goals.includes(goal)
                      ? goals.filter((g) => g !== goal)
                      : [...goals, goal]
                  )
                }
                className="h-8"
              >
                {goal}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2">
            {["Sports", "Arts", "Music", "Science", "Nature", "Technology"].map(
              (interest) => (
                <Button
                  key={interest}
                  variant={interests.includes(interest) ? "default" : "outline"}
                  onClick={() =>
                    onInterestsChange(
                      interests.includes(interest)
                        ? interests.filter((i) => i !== interest)
                        : [...interests, interest]
                    )
                  }
                  className="h-8"
                >
                  {interest}
                </Button>
              )
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={loading || !goals.length || !interests.length}
          className="flex-1"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete
        </Button>
      </CardFooter>
    </>
  );
};