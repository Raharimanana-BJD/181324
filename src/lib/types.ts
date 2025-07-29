import { type Product } from "@/lib/type";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
}

export interface CreateCheckoutSessionData {
  items: CartItem[];
  customerEmail: string;
  customerName: string;
}

export interface OrderWithProduct {
  id: string;
  pricePaidInCents: number;
  createdAt: Date;
  quantity: number;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  product: {
    id: string;
    name: string;
    imagePath: string;
    description: string;
  };
} 