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
        <CardTitle>Welcome to DadSpace!</CardTitle>
        <CardDescription>Let's start with your name</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">What should we call you?</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder="Display Name"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} disabled={!displayName} className="w-full">
          Next
        </Button>
      </CardFooter>
    </>
  );
};