import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/components/layout/MainLayout";

const Profile = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

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
          .select("username, bio, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUsername(data.username);
          setBio(data.bio || "");
          setAvatarUrl(data.avatar_url || "");
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
          bio,
          avatar_url: avatarUrl,
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
              
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback>{username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <Input
                  placeholder="Avatar URL"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
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
