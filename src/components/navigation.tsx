"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Sun, Moon, ShoppingCart, X, User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { ModeToggle } from "./theme-provider";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface NavigationLinks {
  id: number;
  name: string;
  href: string;
}

export const Navigation = () => {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const linksdata = [
    {
      id: 1,
      name: "Home",
      href: "/",
    },
    {
      id: 2,
      name: "Products",
      href: "/products",
    },
    {
      id: 3,
      Link,
      name: "My Orders",
      href: "/orders",
    },
    {
      id: 4,
      Link,
      name: "Contact Us",
      href: "/contact",
    },
  ];

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-nowrap flex-shrink-0"
            >
              <Image
                src="/00000000000000000000000.png"
                alt="Logo"
                width={32}
                height={32}
              />
              <span className="text-lg font-bold text-foreground hidden sm:block">
                MM3-DIGITAL
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {linksdata.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={cn(
                      "text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium",
                      pathname === link.href && "underline underline-offset-2"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden min-h-screen h-full relative">
          <div className="absolute left-1/2 top-16 -translate-x-1/2 flex flex-col items-center px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {linksdata.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-2xl font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
