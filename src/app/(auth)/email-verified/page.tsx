import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function EmailVerifiedPage() {
  return (
    <div className="max-w-md w-full p-8 text-center">
      <div className="flex items-center justify-center mb-4 text-main space-x-2 ">
        <CheckCircle />
        <h1 className="text-2xl font-bold">Email vérifié</h1>
      </div>
      <p className="mb-6">Votre adresse email a été confirmée avec succès.</p>
      <div className="flex flex-col gap-3">
        <Button asChild variant="default">
          <Link href="/dashboard">Accéder au tableau de bord</Link>
        </Button>

        <Button asChild variant="default" className="bg-secondary-background">
          <Link href="/sign-in">Se reconnecter</Link>
        </Button>
      </div>
    </div>
  );
}
