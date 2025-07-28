"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import Image from "next/image";

import { Product } from "@prisma/client";
import { addProduct, updateProduct } from "../../_actions/products";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";

type Category = {
  id: string;
  name: string;
};

export function ProductForm({
  product,
  categories,
}: {
  product?: Product | null;
  categories: Category[];
}) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );

  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const units = ["PIECE", "KG", "GRAM", "LITER", "ML", "BUNCH"];

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={action}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Colonne gauche */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={product?.name ?? ""}
                  required
                />
                {error.name && (
                  <p className="text-sm text-destructive mt-1">{error.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="priceInCents">Price</Label>
                <Input
                  id="priceInCents"
                  name="priceInCents"
                  type="number"
                  value={priceInCents}
                  onChange={(e) =>
                    setPriceInCents(Number(e.target.value) || undefined)
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency((priceInCents || 0) / 100)}
                </p>
                {error.priceInCents && (
                  <p className="text-sm text-destructive mt-1">
                    {error.priceInCents}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={product?.description ?? ""}
                  required
                />
                {error.description && (
                  <p className="text-sm text-destructive mt-1">
                    {error.description}
                  </p>
                )}
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  defaultValue={product?.stock}
                  required
                />
                {error.stock && (
                  <p className="text-sm text-destructive mt-1">{error.stock}</p>
                )}
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select name="unit" required defaultValue={product?.unit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error.unit && (
                  <p className="text-sm text-destructive mt-1">{error.unit}</p>
                )}
              </div>

              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  name="categoryId"
                  required
                  defaultValue={product?.categoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error.categoryId && (
                  <p className="text-sm text-destructive mt-1">
                    {error.categoryId}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!product}
                />
                {(product?.imagePath || previewUrl) && (
                  <div className="mt-4 border rounded-md overflow-hidden flex justify-center items-center p-4">
                    <Image
                      src={previewUrl ?? product!.imagePath}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="h-40 w-40 object-cover"
                    />
                  </div>
                )}
                {error.image && (
                  <p className="text-sm text-destructive mt-1">{error.image}</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="col-span-1 md:col-span-2 pt-4">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving..." : "Save Product"}
    </Button>
  );
}
