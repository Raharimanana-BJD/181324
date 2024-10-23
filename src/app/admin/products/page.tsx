import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ProductTable from "./_components/product-table";
import ProductHeader from "./_components/productHeader";

export default function page() {
  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b flex justify-between pr-4 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All products</BreadcrumbPage>
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
                button={true}
                url="/admin/products/new"
                title="Products"
                description=" Manage your products and view their sales performance."
              />
              <CardContent>
                {/* TABLE */}
                <ProductTable />
                {/* FIN TABLE */}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
