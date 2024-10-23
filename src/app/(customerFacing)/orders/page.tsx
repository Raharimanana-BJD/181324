"use client";

import { emailOrderHistory } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { Mail } from "lucide-react";

export default function MyOrdersPage() {
  const [data, action] = useFormState(emailOrderHistory, {});

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <form action={action} className="w-full max-w-md">
        <Card className="border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              My Orders
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and we'll send you your order history and
              download links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  className="pl-10 w-full"
                />
              </div>
            </div>
            {data.error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {data.error}
              </div>
            )}
          </CardContent>
          <CardFooter>
            {data.message ? (
              <p className="text-sm text-primary bg-primary/10 p-2 rounded w-full text-center">
                {data.message}
              </p>
            ) : (
              <SubmitButton />
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" size="lg" disabled={pending} type="submit">
      {pending ? "Sending..." : "Send Order History"}
    </Button>
  );
}
