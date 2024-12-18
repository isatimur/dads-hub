import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProfilePicture } from "@/components/profile/ProfilePicture";
import { ChildrenManager } from "@/components/profile/ChildrenManager";

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
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [children, setChildren] = useState<Child[]>([]);
  const [parentingGoals, setParentingGoals] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

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
          .select("username, bio, avatar_url, display_name, children, parenting_goals, interests")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUsername(data.username);
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
          setAvatarUrl(data.avatar_url || "");
          setChildren(data.children || []);
          setParentingGoals(data.parenting_goals || []);
          setInterests(data.interests || []);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Error loading profile");
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
          username,
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          children,
          parenting_goals: parentingGoals,
          interests,
        })
        .eq("id", session.user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  if (!session) return null;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="admin">Achievements & Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              
              <ProfilePicture
                url={avatarUrl}
                onUpload={(url) => setAvatarUrl(url)}
                username={username}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Display Name</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <ChildrenManager
                children={children}
                onChange={setChildren}
              />

              <Button 
                onClick={updateProfile} 
                disabled={updating}
                className="w-full"
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <AdminProfile />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;