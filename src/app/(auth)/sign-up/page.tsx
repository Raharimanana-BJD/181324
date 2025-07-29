"use client";

// import { unstable_ViewTransition as ViewTransition } from "react";
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
import { useRouter } from "next/navigation";
import { GoogleAuthButton } from "@/components/auth/google-button";
import { Separator } from "@/components/ui/separator";
import PasswordInput from "@/components/auth/password-input";

const formSchema = z
  .object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
    passwordConfirmation: z.string().min(6, "Min 6 characters"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await client.signUp.email({
        email: values.email,
        name: `${values.firstName} ${values.lastName}`,
        password: values.password,
        // callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: async () => {
            toast.success("Account created", {
              description:
                "Your account has been created. Check your email for confirmation.",
            });
            router.push("/dashboard");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // <ViewTransition enter="slide-in">
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Max"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Rovinson"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
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
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              showPasswordToggle
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <PasswordInput
              id="passwordConfirmation"
              type="password"
              placeholder="••••••••"
              {...register("passwordConfirmation")}
              showPasswordToggle
            />
            {errors.passwordConfirmation && (
              <p className="text-sm text-red-500">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2 h-4 w-4 cursor-pointer" />
                  Loading...
                </>
              ) : (
                "Create an account"
              )}
            </Button>
          </div>
        </form>
        <Separator className="my-3" />
        <GoogleAuthButton buttonText="Continue with Google" action="signup" />
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/sign-in" className="underline underline-offset-4">
            Login
          </a>
        </div>
      </CardContent>
    </Card>
    // </ViewTransition>
  );
}
