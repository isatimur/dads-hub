import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        throw new Error("Вы должны выбрать изображение для загрузки.");
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
      toast.success("Фото профиля обновлено успешно");
    } catch (error) {
      toast.error("Ошибка загрузки фото профиля");
      console.error("Ошибка загрузки фото профиля:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Avatar className="h-24 w-24 ring-2 ring-primary/20 transition-all hover:ring-4">
              <AvatarImage src={url || undefined} className="object-cover" />
              <AvatarFallback className="text-lg bg-primary/5">
                {username?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>Нажмите на кнопку, чтобы обновить ваше фото профиля</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative glass-button"
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Загрузить фото
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
        <p className="text-xs text-muted-foreground">
          Рекомендуется: квадратное изображение, минимум 400x400px
        </p>
      </div>
    </div>
  );
};