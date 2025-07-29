import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import db from "@/db/db";
import { Resend } from "resend";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    // Pour le développement local, on peut ignorer cette erreur
    if (process.env.NODE_ENV === "development") {
      console.log("Ignoring webhook signature in development");
      event = JSON.parse(body);
    } else {
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        
        // Get orders with product details for email
        const orders = await db.order.findMany({
          where: { 
            // For now, we'll use a simple approach
            // Later we'll add stripeSessionId field
          },
          include: {
            product: true,
            user: true,
          },
          take: 1, // Get the most recent order for this session
        });

        // Send confirmation email for each order
        for (const order of orders) {
          await resend.emails.send({
            from: `Support <${process.env.SENDER_EMAIL}>`,
            to: order.user.email,
            subject: `Confirmation de commande - ${order.product.name}`,
            react: PurchaseReceiptEmail({
              product: order.product,
              order: order,
              downloadVerificationId: crypto.randomUUID(),
            }),
          });
        }

        break;
      }

      case "payment_intent.payment_failed": {
        // Handle failed payments
        console.log("Payment failed:", event.data.object);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
} 