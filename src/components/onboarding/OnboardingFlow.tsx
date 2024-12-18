import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Child {
  name: string;
  age: number;
}

export const OnboardingFlow = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [children, setChildren] = useState<Child[]>([{ name: "", age: 0 }]);
  const [goals, setGoals] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const handleAddChild = () => {
    setChildren([...children, { name: "", age: 0 }]);
  };

  const handleChildChange = (index: number, field: keyof Child, value: string) => {
    const newChildren = [...children];
    if (field === "age") {
      newChildren[index][field] = parseInt(value) || 0;
    } else {
      newChildren[index][field] = value;
    }
    setChildren(newChildren);
  };

  const handleSubmit = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          children: children.filter(child => child.name && child.age > 0),
          parenting_goals: goals,
          interests,
          onboarding_completed: true,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
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
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setStep(2)}
                disabled={!displayName}
                className="w-full"
              >
                Next
              </Button>
            </CardFooter>
          </>
        );

      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle>Tell us about your children</CardTitle>
              <CardDescription>
                This helps us personalize your experience
              </CardDescription>
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
                        onChange={(e) =>
                          handleChildChange(index, "name", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleChildChange(index, "age", e.target.value)
                        }
                        placeholder="Age"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddChild}
                className="w-full"
              >
                Add Another Child
              </Button>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!children.some((child) => child.name && child.age > 0)}
                className="flex-1"
              >
                Next
              </Button>
            </CardFooter>
          </>
        );

      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Almost done!</CardTitle>
              <CardDescription>
                Select your parenting goals and interests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Parenting Goals</Label>
                <div className="flex flex-wrap gap-2">
                  {["Education", "Health", "Social Skills", "Creativity"].map(
                    (goal) => (
                      <Button
                        key={goal}
                        variant={goals.includes(goal) ? "default" : "outline"}
                        onClick={() =>
                          setGoals(
                            goals.includes(goal)
                              ? goals.filter((g) => g !== goal)
                              : [...goals, goal]
                          )
                        }
                        className="h-8"
                      >
                        {goal}
                      </Button>
                    )
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Sports",
                    "Arts",
                    "Music",
                    "Science",
                    "Nature",
                    "Technology",
                  ].map((interest) => (
                    <Button
                      key={interest}
                      variant={interests.includes(interest) ? "default" : "outline"}
                      onClick={() =>
                        setInterests(
                          interests.includes(interest)
                            ? interests.filter((i) => i !== interest)
                            : [...interests, interest]
                        )
                      }
                      className="h-8"
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !goals.length || !interests.length}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete
              </Button>
            </CardFooter>
          </>
        );
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">{renderStep()}</Card>
    </div>
  );
};