"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, XCircle } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import CheckoutButton from "./checkout-button";

export default function CartSidebar() {
  const { cartItems, removeItem, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative bg-transparent"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {cartItems.length}
            </span>
          )}
          <span className="sr-only">Voir le panier</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Votre Panier</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Votre panier est vide.
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 py-4">
              <div className="grid gap-4 pr-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <Image
                      src={item.product.imagePath || "/placeholder.svg"}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                    <div className="grid flex-1 gap-0.5">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.product.priceInCents / 100)} x {item.quantity}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <XCircle className="h-5 w-5" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className="grid gap-4 p-4">
              <div className="flex items-center justify-between font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(getCartTotal() / 100)}</span>
              </div>
              
              {/* Customer Information Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nom complet</Label>
                  <Input
                    id="customerName"
                    placeholder="Votre nom complet"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="votre@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <CheckoutButton 
                customerEmail={customerEmail}
                customerName={customerName}
              />
              
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={clearCart}
                disabled={cartItems.length === 0}
              >
                Vider le panier
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
