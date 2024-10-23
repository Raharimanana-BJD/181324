"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("");
  const route = useRouter();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md w-full">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <ShoppingCart className="w-full h-full text-primary animate-float" />
          <Search className="absolute bottom-0 right-0 w-12 h-12 text-secondary animate-bounce" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-secondary mb-8">
          We couldn&apos;t find the page you&apos;re looking for. It might have
          been removed, renamed, or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button className="w-full sm:w-auto" onClick={(e) => route.push("/")}>
            Go to Homepage
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={(e) => route.push("/products")}
          >
            Browse Products
          </Button>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>
    </div>
  );
}
