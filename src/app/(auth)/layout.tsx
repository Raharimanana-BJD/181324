import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Button asChild variant="default" className="absolute top-2 left-4">
        <Link href={"/"}>
          <Home />
        </Link>
      </Button>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
