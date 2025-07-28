// components/cart-sidebar.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, XCircle } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import Image from "next/image";

export default function CartSidebar() {
  const {
    cartItems,
    removeItem,
    updateQuantity,
    getCartTotal,
    getCartProduct,
    clearCart,
  } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
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
          <ScrollArea className="flex-1 py-4">
            <div className="grid gap-4 pr-4">
              {cartItems.map((item) => {
                const product = getCartProduct(item.productId);
                if (!product) return null;
                return (
                  <div key={item.productId} className="flex items-center gap-4">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                    <div className="grid flex-1 gap-0.5">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {product.price.toFixed(2)} € x {item.quantity}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
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
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={item.quantity >= product.stock}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <XCircle className="h-5 w-5" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
        <Separator className="mt-auto" />
        <div className="grid gap-4 p-4">
          <div className="flex items-center justify-between font-semibold">
            <span>Total:</span>
            <span>{getCartTotal().toFixed(2)} €</span>
          </div>
          <Button className="w-full" disabled={cartItems.length === 0}>
            Passer la commande
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={clearCart}
            disabled={cartItems.length === 0}
          >
            Vider le panier
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
