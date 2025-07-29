import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import db from "@/db/db";
import { Resend } from "resend";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { items, customerEmail, customerName } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    // Create or get user
    let user = await db.user.findUnique({
      where: { email: customerEmail },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: customerEmail,
          name: customerName,
        },
      });
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: [`${process.env.NEXT_PUBLIC_SERVER_URL}${item.product.imagePath}`],
        },
        unit_amount: item.product.priceInCents,
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/orders?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/orders?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        userId: user.id,
        customerName,
      },
    });

    // Create orders in database
    const orders = await Promise.all(
      items.map(async (item: any) => {
        return await db.order.create({
          data: {
            userId: user!.id,
            productId: item.product.id,
            pricePaidInCents: item.product.priceInCents * item.quantity,
            quantity: item.quantity,
            stripeSessionId: session.id,
          },
        });
      })
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
} 