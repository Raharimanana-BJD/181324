// lib/data.ts

export type UserRole = "CLIENT" | "ADMIN";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export type Unit = "PIECE" | "KG" | "GRAM" | "LITER" | "ML" | "BUNCH";

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  stock: number;
  unit: Unit;
  imagePath: string;
  isAvailableForPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category?: Category;
  orders?: Order[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface Order {
  id: string;
  pricePaidInCents: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  productId: string;
  userId: string;
  product?: Product;
  user?: User;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
