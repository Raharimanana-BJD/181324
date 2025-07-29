"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    // Clear cart on successful payment
    if (success === "true") {
      localStorage.removeItem("cart");
    }
  }, [success]);

  if (success === "true") {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Paiement réussi !</CardTitle>
            <CardDescription>
              Votre commande a été traitée avec succès. Vous recevrez un email de confirmation dans quelques minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/">
                Continuer les achats
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (canceled === "true") {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-yellow-600">Paiement annulé</CardTitle>
            <CardDescription>
              Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/">
                Retourner au panier
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <XCircle className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle>Page non trouvée</CardTitle>
          <CardDescription>
            Cette page n'existe pas ou vous n'avez pas les permissions nécessaires.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild className="w-full">
            <Link href="/">
              Retour à l'accueil
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
