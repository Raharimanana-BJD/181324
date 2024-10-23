import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "../lib/formatters";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type ProductCardProps = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
};

export function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative p-4">
        <Image
          src={imagePath}
          alt={name}
          width={300}
          height={200}
          className="w-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-bold">
            ${formatCurrency(priceInCents / 100)}
          </span>
          <Button size="sm" asChild>
            <Link href={`/products/${id}/purchase`}>Buy</Link>
          </Button>
        </div>
      </CardContent>
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
