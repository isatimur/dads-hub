import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Crown, Check } from "lucide-react";
import { toast } from "sonner";

export const ProUpgradeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      if (!session) {
        toast.error('Please sign in to upgrade');
        navigate('/auth');
        return;
      }

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        toast.error('Please sign in to upgrade');
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${currentSession?.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Failed to start checkout process');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default"
          className="bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 transition-all duration-300 group"
        >
          <Crown className="w-4 h-4 mr-2 group-hover:animate-bounce-subtle" />
          Upgrade to Pro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            DadSpace Pro Benefits
          </DialogTitle>
          <DialogDescription>
            Unlock premium features and support our community
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            {[
              "Unlimited posts and comments",
              "Priority support",
              "Exclusive badges",
              "Ad-free experience",
              "Early access to new features"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="text-2xl font-bold text-center">
              $9.99<span className="text-sm font-normal text-gray-500">/month</span>
            </div>
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Processing...
                </span>
              ) : (
                "Upgrade Now"
              )}
            </Button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Cancel anytime. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};