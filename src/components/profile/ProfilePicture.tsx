import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfilePictureProps {
  url: string | null;
  onUpload: (url: string) => void;
  username: string;
}

export const ProfilePicture = ({ url, onUpload, username }: ProfilePictureProps) => {
  const session = useSession();
  const [uploading, setUploading] = useState(false);

  const uploadProfilePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${session?.user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(filePath);

      onUpload(data.publicUrl);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Error uploading profile picture");
      console.error("Error uploading profile picture:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={url || undefined} />
        <AvatarFallback>{username?.charAt(0)?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative"
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Upload Picture
            </>
          )}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={uploadProfilePicture}
            disabled={uploading}
          />
        </Button>
      </div>
    </div>
  );
};