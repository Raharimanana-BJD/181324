"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/google-icon";
import { client } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GoogleAuthButtonProps {
  action: "login" | "signup";
  redirectTo?: string;
  buttonText?: string;
}

export const GoogleAuthButton = ({
  action = "login",
  redirectTo = "/dashboard",
  buttonText = "Continue with Google",
}: GoogleAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(false);
    await client.signIn.social({
      provider: "google",
      callbackURL: redirectTo,
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          toast(
            action === "login"
              ? "Logged in successfully"
              : "Signed up successfully",
            {
              description:
                action === "login"
                  ? "You have been logged in successfully."
                  : "Your account has been created successfully.",
            }
          );
        },
        onError: () => {
          toast.error(
            action === "login" ? "Error logging in" : "Error signing up",
            {
              description: `Could not ${action} with Google. Please try again.`,
            }
          );
        },
      },
    });
    setIsLoading(false);
  };

  return (
    <Button
      variant="reverse"
      className="w-full cursor-pointer flex items-center justify-center gap-2 bg-secondary-background"
      onClick={handleGoogleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader className="animate-spin mr-2 h-4 w-4" />
          Loading...
        </>
      ) : (
        <>
          <GoogleIcon className="w-4 h-4" />
          <span>{buttonText}</span>
        </>
      )}
    </Button>
  );
};
