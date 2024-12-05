import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "./StatsCard";
import { BadgesList } from "./BadgesList";
import { RolesList } from "./RolesList";
import { QuestsList } from "./QuestsList";

export const AdminProfile = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles(roles(*)), user_badges(badges(*))")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: quests, isLoading: loadingQuests } = useQuery({
    queryKey: ["quests", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quests")
        .select(`
          *,
          user_quests!inner(
            progress,
            completed_at
          )
        `)
        .eq("user_quests.user_id", session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (loadingProfile || loadingQuests) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Points"
          value={profile?.points || 0}
          description="Total points earned"
        />
        <StatsCard
          title="Badges"
          value={profile?.user_badges?.length || 0}
          description="Badges earned"
        />
        <StatsCard
          title="Roles"
          value={profile?.user_roles?.length || 0}
          description="Community roles"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BadgesList badges={profile?.user_badges || []} />
        <RolesList roles={profile?.user_roles || []} />
      </div>

      <QuestsList quests={quests || []} />
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  </div>
);