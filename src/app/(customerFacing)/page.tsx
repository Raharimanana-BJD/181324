import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { ProductCardRecent } from "@/components/ProductCardRecent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { constants } from "@/constants/constants";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const getMostPopularProducts = cache(
  () =>
    db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 4,
    }),
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

const getNewestProducts = cache(
  () =>
    db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ["/", "getNewestProducts"]
);

export default function HomePage() {
  return (
    <main className="space-y-12">
      <HeroSection />
      <ProductGridSection
        title="Popular Products"
        productsFetcher={getMostPopularProducts}
      />
      <ProductGridSection
        title="Recent Products"
        productsFetcher={getNewestProducts}
        className="bg-muted/50"
        gridCols="lg:grid-cols-3"
        ProductCardComponent={ProductCardRecent}
      />
      <TestimonialSection />
      <NewsletterSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            {constants.herosdata.title}
          </h1>
          <p className="text-lg sm:text-xl mb-8">
            {constants.herosdata.description}
          </p>
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-background/90"
          >
            {constants.herosdata.CTA}
          </Button>
        </div>
      </div>
      <div
        className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
        }}
      />
    </section>
  );
}

type ProductGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
  className?: string;
  gridCols?: string;
  ProductCardComponent?: React.ComponentType<Product>;
};

function ProductGridSection({
  title,
  productsFetcher,
  className = "",
  gridCols = "lg:grid-cols-4",
  ProductCardComponent = ProductCard,
}: ProductGridSectionProps) {
  return (
    <section className={`py-16 w-full ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-3xl font-bold mb-8">{title}</h2>
          <Button variant="outline" asChild>
            <Link href="/products" className="space-x-2">
              <span>View All</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
          <Suspense
            fallback={
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            }
          >
            <ProductSuspense
              productsFetcher={productsFetcher}
              ProductCardComponent={ProductCardComponent}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function ProductSuspense({
  productsFetcher,
  ProductCardComponent,
}: {
  productsFetcher: () => Promise<Product[]>;
  ProductCardComponent: React.ComponentType<Product>;
}) {
  const products = await productsFetcher();
  return products.map((product) => (
    <ProductCardComponent key={product.id} {...product} />
  ));
}

function TestimonialSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((testimonial) => (
            <Card key={testimonial} className="bg-muted">
              <CardContent className="p-6">
                <p className="mb-4 italic">
                  Grâce à MM3-Digital, j&apos;ai pu obtenir Adobe Illustrator à
                  un prix très compétitif. Le logiciel fonctionne parfaitement
                  et m&apos;aide beaucoup dans mes projets créatifs. Super
                  service client, je recommande !
                </p>
                <div className="flex items-center">
                  <Avatar className="mr-4">
                    <AvatarImage
                      src={`https://i.pravatar.cc/50?img=${testimonial}`}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Customer Name</p>
                    <p className="text-sm text-muted-foreground">
                      Verified Buyer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="mb-8">
            Stay updated with our latest products and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-primary-foreground text-primary"
            />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
