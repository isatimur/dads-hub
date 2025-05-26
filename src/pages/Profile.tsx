import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProfilePicture } from "@/components/profile/ProfilePicture";
import { ChildrenManager } from "@/components/profile/ChildrenManager";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Child {
  name: string;
  age: string;
}

const Profile = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(session?.user?.user_metadata?.avatar_url || "");
  const [children, setChildren] = useState<Child[]>([]);
  const [parentingGoals, setParentingGoals] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user?.user_metadata?.avatar_url) {
      setAvatarUrl(session.user.user_metadata.avatar_url);
    }
  }, [session?.user?.user_metadata?.avatar_url]);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    const getProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("display_name, bio, children, parenting_goals, interests")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (data) {
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
          setChildren(data.children || []);
          setParentingGoals(data.parenting_goals || []);
          setInterests(data.interests || []);
        }
      } catch (error) {
        console.error("Ошибка получения профиля:", error);
        toast.error("Ошибка загрузки профиля");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [session, supabase, navigate]);

  const updateProfile = async () => {
    if (!session) return;
    
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          bio,
          children,
          parenting_goals: parentingGoals,
          interests,
        })
        .eq("id", session.user.id);

      if (error) throw error;
      toast.success("Профиль обновлен успешно");
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      toast.error("Ошибка обновления профиля");
    } finally {
      setUpdating(false);
    }
  };

  if (!session) return null;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground animate-pulse">Загрузка вашего профиля...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 glass-card">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10">
              Настройки профиля
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-primary/10">
              <Shield className="w-4 h-4 mr-2" />
              Достижения и роли
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="animate-fade-up">
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Настройки профиля</h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="text-xs text-muted-foreground">
                        Последнее обновление: {new Date().toLocaleDateString()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Информация о профиле последнее обновление</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <ProfilePicture
                url={avatarUrl}
                onUpload={(url) => setAvatarUrl(url)}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Имя для отображения</label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display Name"
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Биография</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Расскажите о себе..."
                  rows={4}
                  className="glass-input resize-none"
                />
              </div>

              <ChildrenManager
                children={children}
                onChange={setChildren}
              />

              <Button 
                onClick={updateProfile} 
                disabled={updating}
                className="w-full glass-button"
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updating ? "Сохранение изменений..." : "Сохранить изменения"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="animate-fade-up">
            <AdminProfile />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;