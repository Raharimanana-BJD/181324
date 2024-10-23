import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
