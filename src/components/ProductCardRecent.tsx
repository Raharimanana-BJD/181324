import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  imagePath: string;
};
export const ProductCardRecent = ({
  id,
  name,
  description,
  imagePath,
}: ProductCardProps) => {
  return (
    <Card className="flex overflow-hidden">
      <Image
        src={imagePath}
        alt={name}
        width={150}
        height={150}
        className="object-cover"
      />
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <Badge>New</Badge>
      </CardContent>
    </Card>
  );
};
