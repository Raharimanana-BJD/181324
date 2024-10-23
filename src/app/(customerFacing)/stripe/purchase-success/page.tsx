import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import { ArrowLeft, CheckCircle, Download, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );
  if (paymentIntent.metadata.productId == null) return notFound();

  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });
  if (product == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 my-8">
      <div className="bg-background rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          {isSuccess ? (
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 bg-green-500 rounded-full opacity-25 animate-ping"></div>
              <CheckCircle className="relative w-full h-full text-green-500 animate-bounce" />
            </div>
          ) : (
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-25 animate-ping"></div>
              <RefreshCw className="relative w-full h-full text-red-500 animate-spin" />
            </div>
          )}
          <h1 className="text-3xl font-bold mb-2">
            {isSuccess ? "Purchase Successful!" : "Purchase Error"}
          </h1>
          <p className="text-muted-foreground">
            {isSuccess
              ? "Thank you for your purchase. Your order has been confirmed."
              : "There was an issue processing your purchase. Please try again."}
          </p>
        </div>

        <Card className="flex overflow-hidden">
          <Image
            src={product.imagePath}
            alt={product.name}
            width={150}
            height={150}
            className="object-cover"
          />
          <CardContent className="p-4 flex-1">
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {product.description}
            </p>
            <div className="text-lg">
              {formatCurrency(product.priceInCents / 100)}
            </div>
            <Button className="mt-4" size="lg" asChild>
              {isSuccess ? (
                <a
                  href={`/products/download/${await createDownloadVerification(
                    product.id
                  )}`}
                >
                  <Download className="size-4 mr-2" />
                  Download
                </a>
              ) : (
                <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-xl font-semibold mb-4">Order Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Order Number:</p>
              <p className="font-medium">{paymentIntent.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date:</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Amount:</p>
              <p className="font-medium">
                {formatCurrency(paymentIntent.amount / 100)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Status:</p>
              <p
                className={`font-medium ${
                  isSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {paymentIntent.status.charAt(0).toUpperCase() +
                  paymentIntent.status.slice(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline">
            <Link href="/products" className="flex items-center justify-center">
              <ArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id;
}
