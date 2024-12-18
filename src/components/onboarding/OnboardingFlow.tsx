import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ChildrenStep } from "./steps/ChildrenStep";
import { GoalsStep } from "./steps/GoalsStep";

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
          <WelcomeStep
            displayName={displayName}
            onDisplayNameChange={setDisplayName}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <ChildrenStep
            children={children}
            onChildrenChange={setChildren}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <GoalsStep
            goals={goals}
            interests={interests}
            onGoalsChange={setGoals}
            onInterestsChange={setInterests}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            loading={loading}
          />
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