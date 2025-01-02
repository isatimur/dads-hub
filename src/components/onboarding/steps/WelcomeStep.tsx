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

interface WelcomeStepProps {
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  onNext: () => void;
}

export const WelcomeStep = ({
  displayName,
  onDisplayNameChange,
  onNext,
}: WelcomeStepProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Добро пожаловать в Отец Молодец!</CardTitle>
        <CardDescription>Давайте начнем с вашего имени</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Как к вам обращаться?</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder="Ваше имя"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} disabled={!displayName} className="w-full">
          Далее
        </Button>
      </CardFooter>
    </>
  );
};