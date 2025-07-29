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
import { formatCurrency } from "@/lib/formatters";
import { PlusCircle, Edit, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/app/context/cart-context";
import type { Unit } from "@/lib/type"; // adjust path if needed

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    priceInCents: number;
    description: string;
    imagePath: string;
    stock: number;
    isAvailableForPurchase: boolean;
    unit: Unit; // <-- change from string to Unit
    createdAt: string;
    updatedAt: string;
    categoryId: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  // Vérification de sécurité
  if (!product) {
    return <ProductCardSkeleton />;
  }

  const handleAddToCart = () => {
    addItem({ ...product, unit: product.unit as Unit }, 1);
  };

  return (
    <Card
      className={cn("w-full max-w-sm", {
        "opacity-60 grayscale":
          !product.isAvailableForPurchase || product.stock <= 0,
        "border-red-500": !product.isAvailableForPurchase,
      })}
    >
      <Link href={`/products/${product.id}`} className="relative block">
        <Image
          src={product.imagePath || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {!product.isAvailableForPurchase && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <EyeOff className="h-3 w-3" />
            Non disponible
          </div>
        )}
      </Link>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(product.priceInCents / 100)}
          </span>
          <span className="text-sm text-muted-foreground">
            Stock: {product.stock} {product.unit.toLowerCase()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {product.isAvailableForPurchase && product.stock > 0 ? (
          <Button onClick={handleAddToCart} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter au panier
          </Button>
        ) : (
          <Button disabled className="w-full">
            {product.stock === 0 ? "Rupture de stock" : "Non disponible"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled size="lg"></Button>
      </CardFooter>
    </Card>
  );
}
