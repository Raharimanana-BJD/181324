"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/formatters";
import { Product } from "@prisma/client";
import { JSONContent } from "@tiptap/react";
import { File } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { addProduct, updateProduct } from "../../_actions/products";
import { Textarea } from "@/components/ui/textarea";
// import { TipTapEditor } from "./editor";

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );

  // const [json, setJson] = useState<JSONContent | null>(
  //   product?.description ? JSON.parse(product.description) : null
  // );
  return (
    <div className="p-11">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            // onSubmit={(e) => {
            //   e.preventDefault();
            //   const formData = new FormData(e.currentTarget);
            //   formData.set("description", JSON.stringify(json));
            //   action(formData);
            // }}

            action={action}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="col-span-2 md:col-span-1">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={product?.name || ""}
                  className="w-full"
                />
                {error.name && (
                  <div className="text-destructive text-sm">{error.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceInCents">Price</Label>
                <Input
                  type="number"
                  id="priceInCents"
                  name="priceInCents"
                  required
                  value={priceInCents}
                  onChange={(e) =>
                    setPriceInCents(Number(e.target.value) || undefined)
                  }
                  className="w-full"
                />
                <div className="text-muted-foreground text-sm">
                  {formatCurrency((priceInCents || 0) / 100)}
                </div>
                {error.priceInCents && (
                  <div className="text-destructive text-sm">
                    {error.priceInCents}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {/* <Input
                  name="description"
                  type="hidden"
                  value={JSON.stringify(json)}
                /> */}
                <Label htmlFor="description">Description</Label>
                {/* <TipTapEditor json={json} setJson={setJson} /> */}

                <Textarea
                  id="description"
                  name="description"
                  required
                  defaultValue={product?.description}
                  className="w-full min-h-[150px]"
                />
                {error.description && (
                  <div className="text-destructive text-sm">
                    {error.description}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input
                  type="file"
                  id="file"
                  name="file"
                  required={product == null}
                  className="w-full"
                />
                {product != null && (
                  <div className="inline-flex gap-2 items-center">
                    <File size={42} />
                    <span className="text-muted-foreground text-sm">
                      {product.filePath}
                    </span>
                  </div>
                )}
                {error.file && (
                  <div className="text-destructive text-sm">{error.file}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  required={product == null}
                  className="w-full"
                />
                {product != null && (
                  <div className="mt-2 border flex items-center justify-center rounded-md overflow-hidden h-70 p-8">
                    <Image
                      src={product.imagePath}
                      alt="Product Image"
                      width={200}
                      height={200}
                      className="h-40 w-40 object-cover"
                    />
                  </div>
                )}
                {error.image && (
                  <div className="text-destructive text-sm">{error.image}</div>
                )}
              </div>
            </div>
            <div className="pt-6 col-span-2">
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
