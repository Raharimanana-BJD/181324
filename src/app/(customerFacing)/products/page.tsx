import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Filter, Search } from "lucide-react";
import { JSX, Suspense } from "react";

const getProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: "asc" },
    include: {
      category: true
    }
  });
}, ["/products", "getProducts"]);

export default function ProductsPage() {
  return (
    <main className="space-y-12 min-h-screen">
      <div className="py-16 w-full lg:grid-cols-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Product Search</h1>
            <form className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full sm:w-auto">
                <Filter className="mr-2" size={20} />
                Filter
              </Button>
            </form>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Suspense
              fallback={
                <>
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </>
              }
            >
              <ProductsSuspense />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

async function ProductsSuspense() {
  const products = await getProducts();
  return products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ));
}
