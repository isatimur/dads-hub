import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, BadgeCheck, Crown, Milestone, Shield, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const iconMap = {
  award: Award,
  "badge-check": BadgeCheck,
  crown: Crown,
  milestone: Milestone,
  shield: Shield,
  star: Star,
} as const;

interface BadgesListProps {
  badges: Array<{
    badges: {
      id: string;
      name: string;
      description: string;
      icon: keyof typeof iconMap;
    };
  }>;
}

export const BadgesList = ({ badges }: BadgesListProps) => (
  <Card className="hover:shadow-md transition-shadow duration-200">
    <CardHeader>
      <CardTitle className="text-xl text-primary">Badges</CardTitle>
      <CardDescription>Your earned achievements</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-4">
          {badges.map(({ badges: badge }) => {
            const Icon = iconMap[badge.icon];
            return (
              <div key={badge.id} className="flex items-center gap-4 group">
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                  {Icon && <Icon className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{badge.name}</p>
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
);