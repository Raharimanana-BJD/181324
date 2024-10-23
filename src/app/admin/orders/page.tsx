import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import { PageHeader } from "../_components/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { DeleteDropDownItem } from "./_components/OrderActions";
import { Card, CardContent } from "@/components/ui/card";
import ProductHeader from "../products/_components/productHeader";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default function OrdersPage() {
  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b flex justify-between pr-4 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Order</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Card className="rounded-lg border-none">
        <CardContent className="p-6">
          <div className="flex flex-col justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
            <Card className="w-full">
              <ProductHeader
                title="Sales"
                description="View their your sales."
              />
              <CardContent>
                {/* TABLE */}
                <OrdersTable />
                {/* FIN TABLE */}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

async function OrdersTable() {
  const orders = await getOrders();

  return (
    <div className="border rounded-md">
      <div className="h-[calc(100vh-310px)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Price Paid</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  <p className="text-sm text-muted-foreground">
                    No sales found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.product.name}
                  </TableCell>
                  <TableCell>{order.user.email}</TableCell>
                  <TableCell>
                    {formatCurrency(order.pricePaidInCents / 100)}
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
                        <DeleteDropDownItem id={order.id} />
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
