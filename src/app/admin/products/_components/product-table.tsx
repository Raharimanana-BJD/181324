import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./ProductActions";

export default async function ProductTable() {
  const product = await db.product.findMany({
    select: {
      id: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      filePath: true,
      imagePath: true,
      createdAt: true,
      name: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="border rounded-md">
      <div className="h-[calc(100vh-310px)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Total Sales
              </TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  <p className="text-sm text-muted-foreground">
                    No products found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              product.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.imagePath.replace(/^public/, "")}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.isAvailableForPurchase ? (
                      <Badge variant="default">True</Badge>
                    ) : (
                      <Badge variant="destructive">False</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(product.priceInCents / 100)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatNumber(product._count.orders)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(product.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <ActiveToggleDropdownItem
                          id={product.id}
                          isAvailableForPurchase={
                            product.isAvailableForPurchase
                          }
                        />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/download`}>
                            Download
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteDropdownItem
                          id={product.id}
                          disabled={product._count.orders > 0}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
