"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { client } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
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
  name: z.string(),
  image: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface SettingsFormProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name ?? "",
      image: user.image ?? "",
    },
  });

  const watchImage = form.watch("image");

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      await client.updateUser({
        name: values.name,
        image: values.image,
        fetchOptions: {
          onSuccess: async () => {
            toast.success("Compte mis à jour", {
              description: "Vos informations ont bien été enregistrées.",
            });
            router.refresh(); // recharge les données si utilisées ailleurs
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
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" {...form.register("name")} />
          </div>

          <div className="col-span-2 grid gap-2">
            <Label htmlFor="image">Avatar (URL)</Label>
            <Input id="image" {...form.register("image")} />
            {watchImage && (
              <Image
                src={watchImage}
                alt="Aperçu"
                width={80}
                height={80}
                className="rounded-full border mt-2"
              />
            )}
          </div>

          <div className="col-span-2">
            <Button type="submit" variant="reverse" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
