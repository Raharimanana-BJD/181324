import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu copy";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import ProductHeader from "../products/_components/productHeader";
import { DeleteDropDownItem } from "./_components/UserActions";

function getUsers() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { pricePaidInCents: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default function UsersPage() {
  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b flex justify-between pr-4 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Customers</BreadcrumbPage>
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
                title="Customers"
                description="View their your customers."
              />
              <CardContent>
                {/* TABLE */}
                <UsersTable />
                {/* FIN TABLE */}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

async function UsersTable() {
  const users = await getUsers();

  return (
    <div className="border rounded-md">
      <div className="h-[calc(100vh-310px)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  <p className="text-sm text-muted-foreground">
                    No customers found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{formatNumber(user.orders.length)}</TableCell>
                  <TableCell>
                    {formatCurrency(
                      user.orders.reduce(
                        (sum, o) => o.pricePaidInCents + sum,
                        0
                      ) / 100
                    )}
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
                        <DeleteDropDownItem id={user.id} />
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
