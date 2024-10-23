"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductHeader({
  title,
  description,
  button,
  url,
}: {
  title?: string;
  description?: string;
  button?: boolean;
  url?: string;
}) {
  const route = useRouter();
  return (
    <CardHeader>
      <CardContent className="flex items-start justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p>{description}</p>
        </div>
        {button == true ? (
          <Button size="lg" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <Link
              href={`${url}`}
              className="sr-only sm:not-sr-only sm:whitespace-nowrap"
            >
              Add Product
            </Link>
          </Button>
        ) : (
          ""
        )}
      </CardContent>
    </CardHeader>
  );
}
