import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

type Product = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
};

async function fetchRelatedProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");

  if (!response.ok) {
    const textContent = await response.text();
    console.error("API Response:", textContent);
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${textContent}`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("Failed to parse response as JSON");
  }

  if (!Array.isArray(data)) {
    console.error("Unexpected response format:", data);
    throw new Error("Unexpected response format");
  }

  return data;
}

export const RelatedProducts = () => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await fetchRelatedProducts();
        setRelatedProducts(products);
      } catch (err) {
        console.error("Error in loadProducts:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (isLoading) {
    return <div>Loading related products...</div>;
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Error loading related products
        </h2>
        <p className="text-red-500">{error}</p>
        <p>
          Please try refreshing the page or contact support if the problem
          persists.
        </p>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return <div>No related products found.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative">
          <Image
            src={product.imagePath}
            alt={product.name}
            height={192}
            width={300}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        </div>
        <h3 className="font-semibold mb-2">{product.name}</h3>
        <p className="text-sm text-secondary mb-2">
          {product.description.substring(0, 50)}...
        </p>
        <div className="flex justify-between items-center">
          <span className="font-bold">
            {formatCurrency(product.priceInCents / 100)}
          </span>
          <Button variant="outline" size="sm">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
