import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RolesListProps {
  roles: Array<{
    roles: {
      id: string;
      name: string;
      description: string;
    };
  }>;
}

export const RolesList = ({ roles }: RolesListProps) => (
  <Card className="hover:shadow-md transition-shadow duration-200">
    <CardHeader>
      <CardTitle className="text-xl text-primary">Roles</CardTitle>
      <CardDescription>Your community roles</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-4">
          {roles.map(({ roles: role }) => (
            <div key={role.id} className="flex items-center gap-4 group">
              <div className="p-2 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-200">
                <Shield className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{role.name}</p>
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
);