"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { client } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GoogleAuthButton } from "@/components/auth/google-button";
import PasswordInput from "@/components/auth/password-input";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    await client.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          reset();
        },
        onError: (ctx) => {
          // toast.error(ctx.error.message);
          toast("Error", {
            description: ctx.error.message,
          });
        },
      }
    );

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>Login to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                showPasswordToggle
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
                variant="default"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mr-2 h-4 w-4" />
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
          <Separator className="my-3" />
          <GoogleAuthButton buttonText="Continue with Google" action="login" />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="underline underline-offset-4">
              Register
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
