import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BadgeCheck, Crown, Milestone, Shield, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const iconMap: Record<string, React.ComponentType> = {
  award: Award,
  "badge-check": BadgeCheck,
  crown: Crown,
  milestone: Milestone,
  shield: Shield,
  star: Star,
};

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
          <CardDescription>
            Your achievements and progress in the community
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Your earned achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                {profile?.user_badges?.map(({ badges: badge }: any) => {
                  const Icon = iconMap[badge.icon as keyof typeof iconMap];
                  return (
                    <div key={badge.id} className="flex items-center gap-4">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                      <div>
                        <p className="font-medium">{badge.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Your community roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                {profile?.user_roles?.map(({ roles: role }: any) => (
                  <div key={role.id} className="flex items-center gap-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Quests</CardTitle>
          <CardDescription>Your ongoing challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quests?.map((quest: any) => {
              const requirements = quest.requirements;
              const progress = quest.user_quests[0].progress;
              const isCompleted = quest.user_quests[0].completed_at;
              
              // Calculate progress percentage
              const totalSteps = Object.keys(requirements).length;
              const completedSteps = Object.keys(progress).filter(
                (key) => progress[key] === true
              ).length;
              const progressPercentage = (completedSteps / totalSteps) * 100;

              return (
                <div key={quest.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{quest.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {quest.description}
                      </p>
                    </div>
                    <Badge variant={isCompleted ? "default" : "secondary"}>
                      {isCompleted ? "Completed" : `${quest.points} points`}
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatsCard = ({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) => (
  <div className="rounded-lg border p-4">
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  </div>
);