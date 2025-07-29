"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/context/cart-context";
import { toast } from "sonner";
import { Loader2, CreditCard } from "lucide-react";

interface CheckoutButtonProps {
  customerEmail: string;
  customerName: string;
}

export default function CheckoutButton({ customerEmail, customerName }: CheckoutButtonProps) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    if (!customerEmail || !customerName) {
      toast.error("Veuillez remplir vos informations");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          customerEmail,
          customerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création de la session de paiement");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || cartItems.length === 0}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Traitement...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Payer {getCartTotal() / 100}€
        </>
      )}
    </Button>
  );
} 