"use client";

import { userOrderExists } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

type Product = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
};

type CheckoutFormProps = {
  product: Product;
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

async function fetchRelatedProducts(): Promise<Product[]> {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      imagePath: true,
      description: true,
    },
    orderBy: { name: "asc" },
  });
  return products;
}

export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ProductImage product={product} />
        <ProductDetails product={product} clientSecret={clientSecret} />
      </div>
      <Separator className="my-12" />
    </div>
  );
}

function ProductImage({ product }: { product: Product }) {
  return (
    <div className="relative aspect-square">
      <Image
        src={product.imagePath}
        alt={product.name}
        fill
        className="rounded-lg object-cover w-full h-full"
      />
    </div>
  );
}

function ProductDetails({ product, clientSecret }: CheckoutFormProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-secondary">{product.description}</p>
      <div className="text-3xl font-bold">
        {formatCurrency(product.priceInCents / 100)}
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
    </div>
  );
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    const orderExists = await userOrderExists(email, productId);

    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product. Try downloading it from the My Orders page"
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
