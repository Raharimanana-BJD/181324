// components/header.tsx
("use client");

import Link from "next/link";
import { Package2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CartSidebar from "@/components/cart-sidebar";
import { currentUser } from "@/lib/type";

export default function Header() {
  const isAdminOrSubadmin =
    currentUser.role === "admin" || currentUser.role === "subadmin";
  const isAdmin = currentUser.role === "admin";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="sr-only">AgriConnect</span>
          <span className="hidden sm:inline">AgriConnect</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-foreground transition-colors hover:text-primary"
          >
            Produits
          </Link>
          {isAdminOrSubadmin && (
            <Link
              href="/dashboard"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {isAdminOrSubadmin && (
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex bg-transparent"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          )}
          <CartSidebar />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border w-8 h-8"
              >
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                  />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Menu utilisateur</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {currentUser.name} ({currentUser.role})
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Mon Compte</DropdownMenuItem>
              <DropdownMenuItem>Mes Commandes</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
