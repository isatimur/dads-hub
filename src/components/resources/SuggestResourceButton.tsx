import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SuggestResourceDialog } from "./SuggestResourceDialog"; // To be created
import { useSession } from "@supabase/auth-helpers-react";

export const SuggestResourceButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession();

  if (!session) { // Only show if logged in
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <PlusCircle className="w-4 h-4 mr-2" />
        Предложить ресурс
      </Button>
      {isDialogOpen && (
        <SuggestResourceDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};
