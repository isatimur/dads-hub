import { createContext, useContext, useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Organization } from "@/types/organization";
import { toast } from "sonner";

interface OrganizationContextType {
  currentOrganization: Organization | null;
  isLoading: boolean;
  error: Error | null;
}

const OrganizationContext = createContext<OrganizationContextType>({
  currentOrganization: null,
  isLoading: true,
  error: null,
});

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching organization for user:", session.user.id);
        
        const { data: memberData, error: memberError } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", session.user.id)
          .single();

        if (memberError) throw memberError;

        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", memberData.organization_id)
          .single();

        if (orgError) throw orgError;

        console.log("Fetched organization:", orgData);
        setCurrentOrganization(orgData);
      } catch (err) {
        console.error("Error fetching organization:", err);
        setError(err as Error);
        toast.error("Failed to load organization data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [session, supabase]);

  return (
    <OrganizationContext.Provider value={{ currentOrganization, isLoading, error }}>
      {children}
    </OrganizationContext.Provider>
  );
};