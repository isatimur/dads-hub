import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react"; // Or use PlusCircle, MessageSquarePlus
import { AskQuestionDialog } from "./AskQuestionDialog";
import { useSession } from "@supabase/auth-helpers-react";

export const AskQuestionButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession();

  if (!session) { // Only show if logged in for asking
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <HelpCircle className="w-4 h-4 mr-2" />
        Задать вопрос
      </Button>
      {isDialogOpen && (
        <AskQuestionDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};
