import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { CreateNewThreadDialog } from "./CreateNewThreadDialog";
import { useSession } from "@supabase/auth-helpers-react"; // Added to check session

interface CreateNewThreadButtonProps {
  categoryId: number;
}

export const CreateNewThreadButton = ({ categoryId }: CreateNewThreadButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession(); // Get session

  // Only show button if user is logged in
  if (!session) {
    return null; 
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="mt-4 sm:mt-0 whitespace-nowrap">
        <MessageSquarePlus className="w-4 h-4 mr-2" />
        Создать новую тему
      </Button>
      {isDialogOpen && ( // Ensure dialog is only rendered when needed, or manage open state more globally if preferred
        <CreateNewThreadDialog
          categoryId={categoryId}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};
