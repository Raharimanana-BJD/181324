"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { client } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  slug: z.string().min(1, "Slug requis"),
});

type FormData = z.infer<typeof formSchema>;

export default function OrganizationForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      await client.organization.create({
        name: values.name,
        slug: values.slug,
        fetchOptions: {
          onSuccess: async () => {
            toast.success("Organisation créée avec succès", {
              description: "Vos informations ont bien été enregistrées.",
            });
            onSuccess?.();
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
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Informations Générales</CardTitle>
          <CardDescription>
            Mettez à jour les détails de votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom de l&apos;organisation</Label>
            <Input
              id="name"
              placeholder="Mon organisation"
              {...form.register("name")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug">Identifiant (slug)</Label>
            <Input id="slug" placeholder="mon-org" {...form.register("slug")} />
          </div>

          <div className="col-span-2">
            <Button type="submit" variant="reverse" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
