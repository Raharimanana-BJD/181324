// components/product-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Product, currentUser } from "@/lib/type";
import { useCart } from "@/app/context/cart-context";
import { cn } from "@/lib/utils";
import { PlusCircle, Edit, EyeOff } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isAdminOrSubadmin =
    currentUser.role === "admin" || currentUser.role === "subadmin";
  const canEdit = isAdminOrSubadmin && product.producerId === currentUser.id;
  const canAdminEdit = currentUser.role === "admin";

  const handleAddToCart = () => {
    addItem(product.id, 1);
  };

  return (
    <Card
      className={cn("w-full max-w-sm", {
        "opacity-60 grayscale": !product.estActif || !product.estValide,
        "border-red-500":
          !product.estActif || (!product.estValide && isAdminOrSubadmin), // Highlight for admins/subadmins
      })}
    >
      <Link href={`/products/${product.id}`} className="relative block">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {(!product.estActif || !product.estValide) && isAdminOrSubadmin && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <EyeOff className="h-3 w-3" />
            {!product.estActif && !product.estValide
              ? "Inactif & Non validé"
              : !product.estActif
              ? "Inactif"
              : "Non validé"}
          </div>
        )}
      </Link>
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {product.price.toFixed(2)} €
          </span>
          <span className="text-sm text-muted-foreground">
            Stock: {product.stock}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {product.estActif && product.estValide && product.stock > 0 ? (
          <Button onClick={handleAddToCart} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter au panier
          </Button>
        ) : (
          <Button disabled className="w-full">
            {product.stock === 0 ? "Rupture de stock" : "Non disponible"}
          </Button>
        )}
        {(canEdit || canAdminEdit) && (
          <Button variant="outline" className="w-full bg-transparent">
            <Edit className="mr-2 h-4 w-4" />
            Modifier le produit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
